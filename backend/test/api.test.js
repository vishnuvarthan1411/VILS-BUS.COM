import { test, describe } from 'node:test';
import assert from 'node:assert';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

describe('VILS BUS.COM Backend API Test Suite', () => {
  test('GET /health returns 200 and healthy database status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.brand, 'VILS BUS.COM');
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.database.status, 'healthy');
    assert.ok(data.database.tripsCount > 0);
  });

  test('GET /cities returns supported Indian cities and popular routes', async () => {
    const res = await fetch(`${BASE_URL}/cities`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.cities));
    assert.ok(data.cities.length >= 10);
    assert.ok(Array.isArray(data.popularRoutes));
  });

  test('GET /trips returns search results for Bangalore to Chennai', async () => {
    const res = await fetch(`${BASE_URL}/trips?from=Bengaluru&to=Chennai`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.trips));
    assert.ok(data.trips.length > 0);
    assert.ok(data.trips[0].seats.length > 0);
  });

  test('GET /offers returns active promotional coupons', async () => {
    const res = await fetch(`${BASE_URL}/offers`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.offers.some(o => o.code === 'VILSFIRST'));
  });

  test('POST /offers/validate applies coupon correctly', async () => {
    const res = await fetch(`${BASE_URL}/offers/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'VILSFIRST', amount: 800 })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.coupon.discount, 150);
  });

  test('POST /auth/login verifies user credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@vilsbus.com', password: 'password123' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    assert.strictEqual(data.user.email, 'demo@vilsbus.com');
  });

  test('POST /chatbot provides automated assistance', async () => {
    const res = await fetch(`${BASE_URL}/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What discounts are available?' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.reply.length > 0);
  });
});
