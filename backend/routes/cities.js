// cities.js - Cities, Autocomplete, and Routes
import express from 'express';
import store from '../models/store.js';

const router = express.Router();

// Get all cities
router.get('/', (req, res) => {
  res.json({
    success: true,
    cities: store.data.cities,
    popularRoutes: store.data.routes
  });
});

// Search cities with autocomplete
router.get('/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, cities: store.data.cities.slice(0, 8) });
  }

  const matched = store.data.cities.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.state.toLowerCase().includes(query) ||
    c.popularPoints.some(p => p.name.toLowerCase().includes(query))
  );

  res.json({
    success: true,
    cities: matched
  });
});

export default router;
