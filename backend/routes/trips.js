// trips.js - Trip search, details, and real-time seat hold APIs
import express from 'express';
import store from '../models/store.js';
import { optionalAuth } from './auth.js';

const router = express.Router();

// Search trips
router.get('/', (req, res) => {
  try {
    const {
      from,
      to,
      date,
      busType,
      operator,
      departureSlot, // 'morning', 'afternoon', 'evening', 'night'
      acOnly,
      sleeperOnly,
      minPrice,
      maxPrice,
      sortBy // 'price_asc', 'price_desc', 'departure_asc', 'rating_desc'
    } = req.query;

    store.cleanupExpiredSeatHolds();
    let results = [...store.data.trips];

    // Filter by route
    if (from) {
      results = results.filter(t => t.fromCity.toLowerCase().includes(from.trim().toLowerCase()));
    }
    if (to) {
      results = results.filter(t => t.toCity.toLowerCase().includes(to.trim().toLowerCase()));
    }

    // Filter by AC / Non-AC
    if (acOnly === 'true') {
      results = results.filter(t => t.isAC);
    }

    // Filter by Sleeper
    if (sleeperOnly === 'true') {
      results = results.filter(t => t.isSleeper);
    }

    // Filter by Operator
    if (operator && operator !== 'all') {
      results = results.filter(t => t.operatorName.toLowerCase() === operator.trim().toLowerCase());
    }

    // Filter by Bus Type
    if (busType && busType !== 'all') {
      results = results.filter(t => t.busType.toLowerCase().includes(busType.trim().toLowerCase()));
    }

    // Filter by Departure slot
    if (departureSlot && departureSlot !== 'all') {
      results = results.filter(t => t.departureSlot === departureSlot);
    }

    // Filter by price range
    if (minPrice) {
      results = results.filter(t => t.baseFare >= Number(minPrice));
    }
    if (maxPrice) {
      results = results.filter(t => t.baseFare <= Number(maxPrice));
    }

    // Sort results
    if (sortBy === 'price_asc') {
      results.sort((a, b) => a.baseFare - b.baseFare);
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => b.baseFare - a.baseFare);
    } else if (sortBy === 'rating_desc') {
      results.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: departure time or rating
      results.sort((a, b) => b.rating - a.rating);
    }

    // Extract available filters for UI
    const availableOperators = Array.from(new Set(store.data.trips.map(t => t.operatorName)));
    const busTypes = Array.from(new Set(store.data.trips.map(t => t.busType)));

    res.json({
      success: true,
      count: results.length,
      trips: results.map(t => ({
        ...t,
        travelDate: date || new Date().toISOString().split('T')[0]
      })),
      filterMeta: {
        operators: availableOperators,
        busTypes,
        minFare: Math.min(...store.data.trips.map(t => t.baseFare)),
        maxFare: Math.max(...store.data.trips.map(t => t.baseFare))
      }
    });
  } catch (error) {
    console.error('Trip search error:', error);
    res.status(500).json({ error: 'Failed to search trips' });
  }
});

// Get single trip detail with live seat layout & hold information
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    const trip = store.getTripWithLiveSeats(id, sessionId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Trip detail error:', error);
    res.status(500).json({ error: 'Failed to retrieve trip details' });
  }
});

// Hold seats temporarily (10 minutes)
router.post('/:id/hold-seats', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { seatNumbers, sessionId } = req.body;

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ error: 'At least one seat number is required' });
    }
    if (!sessionId) {
      return res.status(400).json({ error: 'Client session ID is required' });
    }

    const userId = req.user ? req.user.id : null;
    const hold = store.holdSeats({
      tripId: id,
      seatNumbers,
      userId,
      sessionId,
      holdMinutes: 10
    });

    const updatedTrip = store.getTripWithLiveSeats(id, sessionId);

    res.json({
      success: true,
      message: `${seatNumbers.length} seat(s) held for 10 minutes`,
      hold,
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Hold seats error:', error.message);
    res.status(409).json({ error: error.message || 'Failed to hold seats' });
  }
});

// Release held seats
router.post('/:id/release-seats', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId, seatNumbers } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Client session ID is required' });
    }

    const released = store.releaseSeats({
      tripId: id,
      sessionId,
      seatNumbers
    });

    const updatedTrip = store.getTripWithLiveSeats(id, sessionId);

    res.json({
      success: true,
      message: released ? 'Seats released successfully' : 'No active hold found to release',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Release seats error:', error);
    res.status(500).json({ error: 'Failed to release seats' });
  }
});

export default router;
