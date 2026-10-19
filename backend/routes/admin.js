// admin.js - Admin metrics, bookings review, and trip management
import express from 'express';
import store from '../models/store.js';
import { generateSeatLayout } from '../data/seedData.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Admin verification middleware
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

// Get admin stats
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalBookings = store.data.bookings.length;
    const confirmedBookings = store.data.bookings.filter(b => b.status === 'CONFIRMED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTrips = store.data.trips.length;
    const totalUsers = store.data.users.length;
    const activeHolds = store.data.seatHolds.length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        confirmedCount: confirmedBookings.length,
        cancelledCount: totalBookings - confirmedBookings.length,
        totalTrips,
        totalUsers,
        activeHolds
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to compute admin stats' });
  }
});

// Get all bookings for admin
router.get('/bookings', authenticateToken, requireAdmin, (req, res) => {
  try {
    const sorted = [...store.data.bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({
      success: true,
      bookings: sorted
    });
  } catch (error) {
    console.error('Admin bookings error:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// Add new trip
router.post('/trips', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      operatorName,
      busType,
      fromCity,
      toCity,
      departureTime,
      arrivalTime,
      duration,
      baseFare,
      isAC,
      isSleeper
    } = req.body;

    if (!operatorName || !fromCity || !toCity || !baseFare || !departureTime) {
      return res.status(400).json({ error: 'Missing required trip fields' });
    }

    const newId = `TRIP-${Date.now()}`;
    const seats = generateSeatLayout(busType || 'AC Sleeper 2+1', Number(baseFare));

    const newTrip = {
      id: newId,
      busNumber: `KA-01-VB-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorName: operatorName.trim(),
      busType: busType || 'AC Sleeper 2+1',
      isAC: isAC !== undefined ? isAC : true,
      isSleeper: isSleeper !== undefined ? isSleeper : true,
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      departureTime,
      arrivalTime: arrivalTime || '07:00 AM',
      duration: duration || '6h 00m',
      departureSlot: departureTime.includes('AM') ? 'morning' : 'night',
      rating: 4.8,
      ratingsCount: 1,
      badge: 'New Route',
      liveTracking: true,
      baseFare: Number(baseFare),
      boardingPoints: [
        { id: `bp_${newId}_1`, name: `${fromCity} Central`, landmark: 'Main Bus Stand', time: departureTime }
      ],
      droppingPoints: [
        { id: `dp_${newId}_1`, name: `${toCity} Central`, landmark: 'Terminal Gate', time: arrivalTime || '07:00 AM' }
      ],
      amenities: [
        { id: 'wifi', name: 'High Speed Wi-Fi', icon: 'wifi' },
        { id: 'charging', name: 'Charging Point', icon: 'zap' },
        { id: 'water', name: 'Water Bottle', icon: 'droplet' },
        { id: 'blanket', name: 'Clean Blanket & Pillow', icon: 'cloud' }
      ],
      seats,
      totalSeats: seats.length,
      availableSeats: seats.filter(s => s.status === 'available').length,
      cancellationPolicy: [
        { time: 'Before 24 hrs of journey', refund: '90% refund' },
        { time: 'Between 12 to 24 hrs of journey', refund: '75% refund' },
        { time: 'Less than 4 hrs of journey', refund: '0% refund' }
      ]
    };

    store.data.trips.unshift(newTrip);
    store.save();

    res.status(201).json({
      success: true,
      message: 'Trip added successfully',
      trip: newTrip
    });
  } catch (error) {
    console.error('Add trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Delete trip
router.delete('/trips/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const index = store.data.trips.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    store.data.trips.splice(index, 1);
    store.save();

    res.json({
      success: true,
      message: 'Trip removed successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router;
