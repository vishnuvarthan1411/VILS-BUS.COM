// chatbot.js - Intelligent branded Assistant for VILS BUS.COM
import express from 'express';
import store from '../models/store.js';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const text = message.trim().toLowerCase();
    let reply = "";
    let suggestions = [];
    let quickData = null;

    // Check for PNR query
    const pnrMatch = text.match(/vils[-\s]?(\d{6})/i);
    if (pnrMatch || text.includes('pnr') || text.includes('status')) {
      if (pnrMatch) {
        const foundPnr = `VILS-${pnrMatch[1]}`;
        const booking = store.data.bookings.find(b => b.pnr.toUpperCase() === foundPnr);
        if (booking) {
          reply = `Here are the details for your PNR **${booking.pnr}**:\n\n` +
                  `🚍 **Bus:** ${booking.operatorName} (${booking.busType})\n` +
                  `📍 **Route:** ${booking.fromCity} ➔ ${booking.toCity}\n` +
                  `🗓️ **Date & Time:** ${booking.journeyDate} at ${booking.departureTime}\n` +
                  `💺 **Seats:** ${booking.passengers.map(p => p.seatNo).join(', ')}\n` +
                  `🏷️ **Status:** ${booking.status} | Total Fare: ₹${booking.totalAmount}`;
          quickData = { type: 'booking', booking };
          suggestions = ['Download Ticket', 'Cancellation Policy', 'Book Another Ticket'];
        } else {
          reply = `I searched our records for PNR **${foundPnr}**, but couldn't find an active booking. Please verify the 6-digit number on your confirmation SMS or email.`;
          suggestions = ['Check My Bookings', 'How to find PNR', 'Contact Support'];
        }
      } else {
        reply = `You can check your live ticket status anytime! Please provide your 6-digit PNR number (e.g. *VILS-123456*) or click "My Bookings" in the top navigation bar.`;
        suggestions = ['View My Bookings', 'Help with PNR', 'Talk to Support'];
      }
    }
    // Cancellation & Refund queries
    else if (text.includes('cancel') || text.includes('refund') || text.includes('return money')) {
      reply = `**VILS BUS.COM Cancellation & Refund Policy:**\n\n` +
              `• **> 24 hours before journey:** 90% refund (₹50 nominal fee)\n` +
              `• **12 to 24 hours before journey:** 75% refund\n` +
              `• **4 to 12 hours before journey:** 50% refund\n` +
              `• **Under 4 hours:** Non-refundable\n\n` +
              `To cancel, go to **My Bookings**, select your active trip, and click **Cancel Booking**. Refunds are processed instantly back to your original payment mode!`;
      suggestions = ['View My Bookings', 'Active Offers', 'Customer Support'];
    }
    // Coupon & Discounts
    else if (text.includes('offer') || text.includes('coupon') || text.includes('discount') || text.includes('promo')) {
      const activeOffers = store.data.offers.map(o => `• **${o.code}**: ${o.title} (${o.description})`).join('\n');
      reply = `Here are the hottest verified promo codes on **VILS BUS.COM** today:\n\n${activeOffers}\n\nYou can apply any of these at the checkout page to get instant discounts!`;
      suggestions = ['Copy VILSFIRST', 'Copy VILS20', 'Book Bus Now'];
    }
    // Seat Hold query
    else if (text.includes('hold') || text.includes('lock') || text.includes('reserve')) {
      reply = `**Live Seat Hold System:**\nWhen you click any available seat on VILS BUS.COM, our server temporarily locks that seat for you for **10 minutes** so nobody else can take it while you fill in passenger details and complete checkout!`;
      suggestions = ['Search Buses', 'View Routes', 'Payment Methods'];
    }
    // Safety & Ladies seats
    else if (text.includes('ladies') || text.includes('women') || text.includes('female') || text.includes('safety')) {
      reply = `Your safety is our #1 priority at **VILS BUS.COM**!\n\n` +
              `• Dedicated **Ladies Reserved** pink seats in both lower & upper decks\n` +
              `• Verified bus operators with 24/7 GPS live tracking\n` +
              `• In-bus CCTV and emergency alarm switches\n` +
              `• 24x7 SOS helpline: **+91 1800-VILS-BUS**`;
      suggestions = ['Search Buses', 'Popular Routes', 'Safety Helpline'];
    }
    // Payment queries
    else if (text.includes('pay') || text.includes('payment') || text.includes('upi') || text.includes('card')) {
      reply = `We support all popular payment options:\n` +
              `• **UPI / QR Code** (GPay, PhonePe, Paytm, BHIM)\n` +
              `• **Credit & Debit Cards** (Visa, MasterCard, RuPay)\n` +
              `• **Net Banking** (SBI, HDFC, ICICI, Axis & 50+ banks)\n\n` +
              `*Note: In development sandbox, you can simulate successful or failed mock payments safely.*`;
      suggestions = ['Book Bus Now', 'Active Offers', 'Cancellation Policy'];
    }
    // General / Greetings
    else if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('start')) {
      reply = `Hello! Welcome to **VILS BUS.COM** Support Assistant 🚍\n\n` +
              `How can I help you today? You can ask me about:\n` +
              `• Checking PNR status\n` +
              `• Finding buses & routes\n` +
              `• Active promo codes & discounts\n` +
              `• Cancellation and instant refund process\n` +
              `• Ladies reserved seats & safety features`;
      suggestions = ['Check PNR Status', 'Show Promo Codes', 'Cancellation Policy', 'Book a Bus'];
    }
    // Fallback
    else {
      reply = `Thank you for contacting **VILS BUS.COM**! I can assist you with your bookings, check live PNR status, apply discounts, or explain cancellation policies. How can I help you?`;
      suggestions = ['Check PNR Status', 'Show Active Offers', 'Cancellation Policy', 'Customer Support'];
    }

    res.json({
      success: true,
      reply,
      suggestions,
      quickData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Chatbot service error' });
  }
});

// FAQ list
router.get('/faqs', (req, res) => {
  res.json({
    success: true,
    faqs: store.data.faqs
  });
});

export default router;
