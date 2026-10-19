// api.js - Centralized API Service for VILS BUS.COM
// All API calls go through this single file. Never import fetch('/api') from components directly.

/**
 * Resolve the API base URL.
 *
 * Dev:        VITE_API_BASE_URL is empty → requests go to '/api' → Vite proxy forwards to localhost:5000
 * Production: VITE_API_BASE_URL = 'https://vils-bus-backend.onrender.com'
 *             → requests go to 'https://vils-bus-backend.onrender.com/api'
 */
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || '';
// Strip any trailing slash, then add /api
export const API_BASE = RAW_BASE.replace(/\/$/, '') + '/api';

// ---------------------------------------------------------------------------
// Session ID — persisted in localStorage for seat-hold continuity
// ---------------------------------------------------------------------------
export function getSessionId() {
  let sessionId = localStorage.getItem('vils_session_id');
  if (!sessionId) {
    sessionId =
      'sess_' +
      Math.random().toString(36).substring(2, 15) +
      '_' +
      Date.now();
    localStorage.setItem('vils_session_id', sessionId);
  }
  return sessionId;
}

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('vils_token');
  const sessionId = getSessionId();

  const headers = {
    'Content-Type': 'application/json',
    'x-session-id': sessionId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    const err = new Error(
      'Network error — could not reach the VILS BUS.COM server. Check your connection or try again later.'
    );
    err.status = 0;
    throw err;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data.error || data.message || `Request failed (${response.status})`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Public API surface — one method per backend endpoint
// ---------------------------------------------------------------------------
export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  getMe: () => request('/auth/me'),

  updateProfile: (profileData) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  // ── Cities ────────────────────────────────────────────────────────────────
  getCities: () => request('/cities'),

  searchCities: (query) =>
    request(`/cities/search?q=${encodeURIComponent(query)}`),

  // ── Trips ─────────────────────────────────────────────────────────────────
  searchTrips: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/trips?${query.toString()}`);
  },

  getTripById: (tripId) => request(`/trips/${tripId}`),

  holdSeats: (tripId, seatNumbers) =>
    request(`/trips/${tripId}/hold-seats`, {
      method: 'POST',
      body: JSON.stringify({ seatNumbers, sessionId: getSessionId() }),
    }),

  releaseSeats: (tripId, seatNumbers = null) =>
    request(`/trips/${tripId}/release-seats`, {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId(), seatNumbers }),
    }),

  // ── Offers ────────────────────────────────────────────────────────────────
  getOffers: () => request('/offers'),

  validateCoupon: (code, amount) =>
    request('/offers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    }),

  // ── Bookings ──────────────────────────────────────────────────────────────
  payBooking: (bookingPayload) =>
    request('/bookings/pay', {
      method: 'POST',
      body: JSON.stringify({
        ...bookingPayload,
        sessionId: getSessionId(),
      }),
    }),

  getMyBookings: (email = null) => {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    return request(`/bookings/my-bookings${query}`);
  },

  getBookingByPnr: (pnr) => request(`/bookings/pnr/${pnr}`),

  getBookingById: (id) => request(`/bookings/${id}`),

  cancelBooking: (id) =>
    request(`/bookings/${id}/cancel`, { method: 'POST' }),

  // ── Chatbot & FAQ ─────────────────────────────────────────────────────────
  sendChatMessage: (message) =>
    request('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getFaqs: () => request('/chatbot/faqs'),

  // ── Health ────────────────────────────────────────────────────────────────
  healthCheck: () => request('/health'),

  // ── Admin ─────────────────────────────────────────────────────────────────
  getAdminStats: () => request('/admin/stats'),

  getAdminBookings: () => request('/admin/bookings'),

  createTrip: (tripData) =>
    request('/admin/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    }),

  deleteTrip: (id) => request(`/admin/trips/${id}`, { method: 'DELETE' }),
};

export default api;
