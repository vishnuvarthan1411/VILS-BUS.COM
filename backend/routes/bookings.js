// bookings.js - Booking creation, mock payment verification, ticket generation, and cancellation
import express from 'express';
import store from '../models/store.js';
import { authenticateToken, optionalAuth } from './auth.js';

const router = express.Router();

// Process booking & mock payment
router.post('/pay', optionalAuth, (req, res) => {
  try {
    const {
      tripId,
      customerName,
      customerEmail,
      customerPhone,
      boardingPoint,
      droppingPoint,
      passengers,
      couponCode,
      discountAmount = 0,
      paymentMethod = 'UPI',
      sessionId,
      simulateFailure = false
    } = req.body;

    // Validate inputs
    if (!tripId) return res.status(400).json({ error: 'Trip ID is required' });
    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: 'Primary contact name, email, and phone are required' });
    }
    if (!boardingPoint || !droppingPoint) {
      return res.status(400).json({ error: 'Boarding and dropping points must be selected' });
    }
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ error: 'At least one passenger detail is required' });
    }

    // Validate passenger fields
    for (const p of passengers) {
      if (!p.seatNo || !p.passengerName || !p.age || !p.gender) {
        return res.status(400).json({
          error: `Please complete all details (Name, Age, Gender) for seat ${p.seatNo || 'selected'}`
        });
      }
    }

    // Check if test failure was simulated
    if (simulateFailure === true) {
      return res.status(402).json({
        error: 'Simulated payment failure: Card/Bank declined transaction. Please retry or choose another payment method.'
      });
    }

    const userId = req.user ? req.user.id : null;
    const paymentId = `MOCK-PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = store.confirmBooking({
      tripId,
      userId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      boardingPoint,
      droppingPoint,
      passengers,
      couponCode,
      discountAmount: Number(discountAmount) || 0,
      paymentMethod,
      paymentId,
      sessionId
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully on VILS BUS.COM!',
      booking
    });
  } catch (error) {
    console.error('Payment confirmation error:', error.message);
    res.status(400).json({ error: error.message || 'Payment processing failed' });
  }
});

// Get user bookings
router.get('/my-bookings', optionalAuth, (req, res) => {
  try {
    const userEmail = req.query.email;
    const userId = req.user ? req.user.id : null;

    let userBookings = [];

    if (userId) {
      userBookings = store.data.bookings.filter(b => b.userId === userId);
    } else if (userEmail) {
      userBookings = store.data.bookings.filter(
        b => b.customerEmail.toLowerCase() === userEmail.trim().toLowerCase()
      );
    } else {
      // If neither, return empty or all bookings for demo if demo requested
      userBookings = [];
    }

    // Sort descending by creation date
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: userBookings.length,
      bookings: userBookings
    });
  } catch (error) {
    console.error('Get my-bookings error:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// PNR lookup
router.get('/pnr/:pnr', (req, res) => {
  try {
    const { pnr } = req.params;
    const cleanPnr = pnr.trim().toUpperCase();

    const booking = store.data.bookings.find(b => b.pnr.toUpperCase() === cleanPnr);
    if (!booking) {
      return res.status(404).json({ error: `No booking found for PNR: ${pnr}` });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('PNR lookup error:', error);
    res.status(500).json({ error: 'Failed to look up PNR' });
  }
});

// Get booking by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const booking = store.data.bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// Cancel booking & issue refund
router.post('/:id/cancel', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const cancelledBooking = store.cancelBooking(id, userId);

    res.json({
      success: true,
      message: `Booking ${cancelledBooking.pnr} cancelled successfully. Refund of ₹${cancelledBooking.refundAmount} initiated to original payment source.`,
      booking: cancelledBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(400).json({ error: error.message || 'Failed to cancel booking' });
  }
});

export default router;
