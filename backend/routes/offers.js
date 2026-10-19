// offers.js - Offers and Coupon code validation
import express from 'express';
import store from '../models/store.js';

const router = express.Router();

// Get active offers
router.get('/', (req, res) => {
  res.json({
    success: true,
    offers: store.data.offers
  });
});

// Validate coupon code
router.post('/validate', (req, res) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Please enter a coupon code' });
    }

    const cleanCode = code.trim().toUpperCase();
    const offer = store.data.offers.find(o => o.code.toUpperCase() === cleanCode);

    if (!offer) {
      return res.status(404).json({ error: `Coupon code '${cleanCode}' is invalid or expired` });
    }

    const bookingTotal = Number(amount) || 0;
    if (bookingTotal < offer.minBookingAmount) {
      return res.status(400).json({
        error: `Coupon '${cleanCode}' requires a minimum fare of ₹${offer.minBookingAmount}. Current base fare: ₹${bookingTotal}`
      });
    }

    let discount = 0;
    if (offer.discountType === 'flat') {
      discount = offer.discountValue;
    } else if (offer.discountType === 'percent') {
      discount = Math.round((bookingTotal * offer.discountValue) / 100);
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    }

    // Discount cannot exceed fare
    discount = Math.min(discount, bookingTotal);

    res.json({
      success: true,
      message: `Coupon '${offer.code}' applied! You saved ₹${discount}`,
      coupon: {
        code: offer.code,
        title: offer.title,
        discount
      }
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ error: 'Failed to validate coupon code' });
  }
});

export default router;
