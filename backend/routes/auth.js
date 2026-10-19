// auth.js - User authentication routes
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import store from '../models/store.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vils-bus-super-secret-key-2026';

// Middleware to authenticate token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session token' });
    req.user = user;
    next();
  });
}

// Optional auth middleware (attaches user if token present)
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    next();
  });
}

// Register
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = store.data.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    store.data.users.push(newUser);
    store.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = store.data.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to process login' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  const user = store.data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Update profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const user = store.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, phone } = req.body;
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    store.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
