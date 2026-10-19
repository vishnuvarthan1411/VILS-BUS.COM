# 🚍 VILS BUS.COM — Online Bus Ticket Booking & Reservation Platform

Official repository and documentation for **VILS BUS.COM**, India's premium bus booking platform inspired by the modern redBus experience.

---

## 🌟 Brand Identity & Overview

- **Brand Name:** VILS BUS.COM
- **Primary Color:** `#d84e55` (Crimson Red) & `#ffffff` (Clean White)
- **Tagline:** Fast, Safe & Confirmed Rides Across India
- **Core Architecture:**
  - **Backend:** Node.js, Express, JWT Authentication, File-backed JSON Datastore with atomic synchronization, TTL Seat Hold Engine (10-minute temporary seat reservation).
  - **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Canvas Confetti.

---

## 🚀 Live Services & Ports

- **Frontend Application:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

---

## 🔑 Demo User Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `demo@vilsbus.com` | `password123` | Search, Live Seat Hold, Book, Cancel, My Bookings |
| **Platform Admin** | `admin@vilsbus.com` | `admin123` | Full Admin Dashboard, Revenue KPIs, Schedule Manager |

*(Quick-fill demo buttons are also embedded directly inside the login modal for instant 1-click authentication!)*

---

## 💺 Core Features & Non-Negotiable Button Implementations

### 1. Navigation & Header
- **Home:** Smoothly routes to the homepage search experience.
- **Bus Tickets:** Navigates to the live search page with dynamic filters.
- **Offers:** Opens the verified coupons page with 1-click clipboard copy.
- **Help & FAQ:** Expandable FAQ accordion + toll-free numbers + chatbot trigger.
- **My Bookings:** Shows authenticated user's tickets (or prompts login) + PNR lookup.
- **Admin Dashboard:** Real-time revenue telemetry, booking audits, schedule creation/deletion.
- **24/7 AI Support Assistant:** Floating branded widget with automated PNR queries, cancellation policy guidance, and ticket preview.

### 2. Search & Filter Experience
- **Origin & Destination:** Autocomplete suggestions across 14+ Indian metro hubs with instant city swapping.
- **Date Controls:** Travel date selection with "Today" and "Tomorrow" quick accelerators.
- **Filters:** Morning, Afternoon, Evening, Night departure slots, AC / Non-AC, Sleeper / Seater, Operator selector, Price Range slider.
- **Sorting:** Lowest Price, Highest Price, Operator Rating.
- **Reset Filters:** One-click reset to default search parameters.
- **Trip Details Modal:** Amenities preview (Wi-Fi, Charging, Water, Blanket), boarding points, and cancellation tier schedule.

### 3. Interactive Seat Layout & 10-Min Live Hold
- **Decks:** Lower Deck and Upper Deck switcher tabs.
- **Cabin Orientation:** Driver steering wheel icon indicates direction of travel.
- **Seat States:** Available (white), Selected (crimson red), Already Booked (slate grey), Ladies Reserved (soft pink), Held by Other Passenger (amber).
- **TTL Countdown Timer:** 10:00 countdown with real-time server-side hold locking that prevents double-booking.
- **Boarding & Dropping Selectors:** Real-time pickup and drop point assignment.

### 4. Checkout, Promo Codes & Mock Payment
- **Passenger Form:** Auto-synced with held seats (Full Name, Age, Gender validation).
- **Coupon Validation Engine:** Live server checks for `VILSFIRST` (Flat ₹150 OFF), `VILS20` (20% OFF), `SUPERDEAL` (Flat ₹100 OFF).
- **Fare Breakdown:** Base fare + 5% GST - Coupon Discount = Final Payable.
- **Payment Sandbox:** Interactive modal supporting UPI (QR/VPA), Credit/Debit Cards, NetBanking with explicit **Success** vs **Bank Decline** simulation toggles.

### 5. Confirmation & Ticket Management
- **PNR Generation:** Unique format `VILS-XXXXXX`.
- **Celebration:** Confetti particle trigger upon booking confirmation.
- **Print / PDF Ticket:** Clean `@media print` layout hiding web chrome for physical travel tickets.
- **Email Preview Modal:** Simulated delivery of branded HTML e-ticket.
- **Cancellation & Refund:** 85% simulated instant refund with automatic seat release back to the booking pool.

---

## 🛠️ REST API Reference

### Auth
- `POST /api/auth/register` - Create new passenger account
- `POST /api/auth/login` - Authenticate and issue JWT
- `GET /api/auth/me` - Profile lookup
- `PUT /api/auth/profile` - Update profile details
- `POST /api/auth/logout` - Clear session

### Trips & Live Seat Holds
- `GET /api/trips` - Query trips with route, date, operator, slot, price filters
- `GET /api/trips/:id` - Fetch live seat layout and hold statuses
- `POST /api/trips/:id/hold-seats` - Place 10-minute temporary seat hold
- `POST /api/trips/:id/release-seats` - Manually release held seats

### Offers & Coupons
- `GET /api/offers` - List active offers
- `POST /api/offers/validate` - Validate promo code against fare

### Bookings & Payments
- `POST /api/bookings/pay` - Process mock payment and confirm reservation
- `GET /api/bookings/my-bookings` - Fetch user bookings
- `GET /api/bookings/pnr/:pnr` - PNR lookup
- `POST /api/bookings/:id/cancel` - Cancel ticket and issue refund

### Support Chatbot & Admin
- `POST /api/chatbot` - AI assistant query engine
- `GET /api/chatbot/faqs` - List FAQs
- `GET /api/admin/stats` - Platform KPIs
- `GET /api/admin/bookings` - All platform bookings
- `POST /api/admin/trips` - Add bus schedule
- `DELETE /api/admin/trips/:id` - Delete schedule
