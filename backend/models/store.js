// store.js - Concurrency-safe data store with TTL Seat Hold Manager
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { CITIES, POPULAR_ROUTES, OFFERS, FAQS, generateInitialTrips, getInitialUsers } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.DB_FILE_PATH 
  ? path.resolve(process.env.DB_FILE_PATH) 
  : path.join(__dirname, '..', 'data', 'db.json');

class DataStore {
  constructor() {
    this.data = {
      users: [],
      cities: [],
      routes: [],
      trips: [],
      offers: [],
      faqs: [],
      seatHolds: [], // { id, tripId, seatNumbers, userId, sessionId, expiresAt }
      bookings: []
    };
    this.init();
    // Run TTL cleanup for expired seat holds every 10 seconds
    setInterval(() => this.cleanupExpiredSeatHolds(), 10000);
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('📦 Loaded existing database with', this.data.trips?.length || 0, 'trips.');
      } catch (e) {
        console.error('Error reading db.json, re-seeding...', e);
        this.seed();
      }
    } else {
      this.seed();
    }
  }

  seed() {
    console.log('🌱 Seeding VILS BUS.COM database...');
    this.data = {
      users: getInitialUsers(),
      cities: CITIES,
      routes: POPULAR_ROUTES,
      trips: generateInitialTrips(),
      offers: OFFERS,
      faqs: FAQS,
      seatHolds: [],
      bookings: []
    };
    this.save();
  }

  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database:', e);
    }
  }

  // === Seat Hold TTL Logic ===
  cleanupExpiredSeatHolds() {
    const now = Date.now();
    let changed = false;

    // Filter holds that haven't expired
    const activeHolds = [];
    const expiredHolds = [];

    for (const hold of this.data.seatHolds) {
      if (new Date(hold.expiresAt).getTime() > now) {
        activeHolds.push(hold);
      } else {
        expiredHolds.push(hold);
        changed = true;
      }
    }

    if (changed) {
      this.data.seatHolds = activeHolds;
      // Mark trip seats as available again
      for (const expired of expiredHolds) {
        const trip = this.data.trips.find(t => t.id === expired.tripId);
        if (trip) {
          for (const s of trip.seats) {
            if (expired.seatNumbers.includes(s.seatNo) && s.status === 'held') {
              s.status = 'available';
            }
          }
          trip.availableSeats = trip.seats.filter(s => s.status === 'available').length;
        }
      }
      this.save();
      console.log(`⏰ Cleaned up ${expiredHolds.length} expired seat holds.`);
    }
  }

  // Check seat statuses including live holds
  getTripWithLiveSeats(tripId, currentSessionId = null) {
    this.cleanupExpiredSeatHolds();
    const trip = this.data.trips.find(t => t.id === tripId);
    if (!trip) return null;

    // Deep clone trip
    const tripCopy = JSON.parse(JSON.stringify(trip));
    const now = Date.now();

    // Map active holds
    const tripHolds = this.data.seatHolds.filter(
      h => h.tripId === tripId && new Date(h.expiresAt).getTime() > now
    );

    for (const seat of tripCopy.seats) {
      const activeHold = tripHolds.find(h => h.seatNumbers.includes(seat.seatNo));
      if (activeHold) {
        seat.status = 'held';
        seat.heldByMe = currentSessionId && activeHold.sessionId === currentSessionId;
        seat.holdExpiresAt = activeHold.expiresAt;
      } else if (seat.status === 'held') {
        seat.status = 'available';
      }
    }

    tripCopy.availableSeats = tripCopy.seats.filter(s => s.status === 'available').length;
    return tripCopy;
  }

  // Create temporary seat hold (default 10 minutes)
  holdSeats({ tripId, seatNumbers, userId = null, sessionId, holdMinutes = 10 }) {
    this.cleanupExpiredSeatHolds();
    const trip = this.data.trips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');

    const now = Date.now();
    const expiresAt = new Date(now + holdMinutes * 60 * 1000).toISOString();

    // Release any previous holds for this session on this trip
    this.releaseSeats({ tripId, sessionId });

    // Validate if any requested seat is already booked or held by someone else
    for (const seatNo of seatNumbers) {
      const seat = trip.seats.find(s => s.seatNo === seatNo);
      if (!seat) throw new Error(`Seat ${seatNo} does not exist`);
      if (seat.status === 'booked') throw new Error(`Seat ${seatNo} is already booked`);

      const existingHold = this.data.seatHolds.find(
        h => h.tripId === tripId && h.seatNumbers.includes(seatNo) && new Date(h.expiresAt).getTime() > now
      );
      if (existingHold && existingHold.sessionId !== sessionId) {
        throw new Error(`Seat ${seatNo} is currently held by another passenger. Please select another seat.`);
      }
    }

    // Register new hold
    const holdRecord = {
      id: uuidv4(),
      tripId,
      seatNumbers,
      userId,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    this.data.seatHolds.push(holdRecord);

    // Update seat statuses in trip
    for (const s of trip.seats) {
      if (seatNumbers.includes(s.seatNo)) {
        s.status = 'held';
      }
    }
    trip.availableSeats = trip.seats.filter(s => s.status === 'available').length;

    this.save();
    return holdRecord;
  }

  // Release seats for session
  releaseSeats({ tripId, sessionId, seatNumbers = null }) {
    let released = false;
    const trip = this.data.trips.find(t => t.id === tripId);

    this.data.seatHolds = this.data.seatHolds.filter(h => {
      if (h.tripId === tripId && h.sessionId === sessionId) {
        if (!seatNumbers || seatNumbers.some(sn => h.seatNumbers.includes(sn))) {
          released = true;
          if (trip) {
            for (const s of trip.seats) {
              if (h.seatNumbers.includes(s.seatNo) && s.status === 'held') {
                s.status = 'available';
              }
            }
          }
          return false;
        }
      }
      return true;
    });

    if (trip) {
      trip.availableSeats = trip.seats.filter(s => s.status === 'available').length;
    }

    if (released) {
      this.save();
    }
    return released;
  }

  // Confirm booking & convert seats to permanently booked
  confirmBooking({
    tripId,
    userId,
    customerName,
    customerEmail,
    customerPhone,
    boardingPoint,
    droppingPoint,
    passengers, // array of { seatNo, passengerName, age, gender }
    couponCode = null,
    discountAmount = 0,
    paymentMethod = 'UPI',
    paymentId = null,
    sessionId
  }) {
    this.cleanupExpiredSeatHolds();
    const trip = this.data.trips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');

    const seatNumbers = passengers.map(p => p.seatNo);

    // Verify seats availability or hold ownership
    for (const seatNo of seatNumbers) {
      const seat = trip.seats.find(s => s.seatNo === seatNo);
      if (!seat) throw new Error(`Seat ${seatNo} does not exist`);
      if (seat.status === 'booked') throw new Error(`Seat ${seatNo} is already booked`);
    }

    // Calculate fare
    let baseFare = 0;
    for (const p of passengers) {
      const seat = trip.seats.find(s => s.seatNo === p.seatNo);
      baseFare += seat.price || trip.baseFare;
    }

    const gstAmount = Math.round(baseFare * 0.05); // 5% GST
    const finalAmount = Math.max(0, baseFare + gstAmount - discountAmount);

    // Generate unique PNR (e.g., VILS-849201)
    const pnr = `VILS-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = {
      id: uuidv4(),
      pnr,
      userId: userId || null,
      customerName,
      customerEmail,
      customerPhone,
      tripId,
      busNumber: trip.busNumber,
      operatorName: trip.operatorName,
      busType: trip.busType,
      fromCity: trip.fromCity,
      toCity: trip.toCity,
      journeyDate: trip.journeyDate || new Date().toISOString().split('T')[0],
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      duration: trip.duration,
      boardingPoint,
      droppingPoint,
      passengers,
      baseFare,
      gstAmount,
      discountAmount,
      totalAmount: finalAmount,
      couponCode,
      paymentStatus: 'CONFIRMED',
      paymentMethod,
      paymentId: paymentId || `PAY-MOCK-${Date.now()}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    // Mark seats as permanently booked
    for (const s of trip.seats) {
      if (seatNumbers.includes(s.seatNo)) {
        s.status = 'booked';
      }
    }
    trip.availableSeats = trip.seats.filter(s => s.status === 'available').length;

    // Release any holds
    this.releaseSeats({ tripId, sessionId });

    this.data.bookings.push(booking);
    this.save();

    return booking;
  }

  // Cancel booking with refund calculation
  cancelBooking(bookingId, userId = null) {
    const booking = this.data.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    if (userId && booking.userId && booking.userId !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }
    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    // Calculate refund based on standard policy (simulated 85% refund)
    const refundPercentage = 85;
    const refundAmount = Math.round((booking.totalAmount * refundPercentage) / 100);

    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    booking.refundAmount = refundAmount;
    booking.refundPercentage = refundPercentage;
    booking.cancelledAt = new Date().toISOString();

    // Release the seats in the trip
    const trip = this.data.trips.find(t => t.id === booking.tripId);
    if (trip) {
      const seatNos = booking.passengers.map(p => p.seatNo);
      for (const s of trip.seats) {
        if (seatNos.includes(s.seatNo) && s.status === 'booked') {
          s.status = 'available';
        }
      }
      trip.availableSeats = trip.seats.filter(s => s.status === 'available').length;
    }

    this.save();
    return booking;
  }
}

export const store = new DataStore();
export default store;
