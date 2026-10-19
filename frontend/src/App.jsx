// App.jsx - Main Application Router and Shell for VILS BUS.COM
import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import Chatbot from './components/Chatbot.jsx';

import HomePage from './pages/HomePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import OffersPage from './pages/OffersPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function MainApp() {
  const [activePage, setActivePage] = useState('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Search parameters state
  const [searchParams, setSearchParams] = useState({
    from: 'Bengaluru',
    to: 'Chennai',
    date: new Date().toISOString().split('T')[0]
  });

  // Active checkout session state
  const [bookingState, setBookingState] = useState(null);

  // Confirmed booking for ticket view
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Listen to custom route search trigger (e.g. from footer or cards)
  useEffect(() => {
    const handleRouteSearchEvent = (e) => {
      if (e.detail) {
        setSearchParams(prev => ({
          ...prev,
          from: e.detail.from,
          to: e.detail.to
        }));
        setActivePage('search');
      }
    };

    window.addEventListener('vils_route_search', handleRouteSearchEvent);
    return () => window.removeEventListener('vils_route_search', handleRouteSearchEvent);
  }, []);

  // Handlers
  const handleStartSearch = ({ from, to, date }) => {
    setSearchParams({ from, to, date });
    setActivePage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (data) => {
    setBookingState(data);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking) => {
    setConfirmedBooking(booking);
    setActivePage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTicket = (booking) => {
    setConfirmedBooking(booking);
    setActivePage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookWithOffer = (code) => {
    setActivePage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onSearch={handleStartSearch}
            onSelectOffer={() => setActivePage('offers')}
          />
        )}

        {activePage === 'search' && (
          <SearchResultsPage
            searchParams={searchParams}
            onUpdateSearchParams={(newParams) => setSearchParams(newParams)}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {activePage === 'checkout' && bookingState && (
          <CheckoutPage
            bookingState={bookingState}
            onBack={() => setActivePage('search')}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {activePage === 'confirmation' && confirmedBooking && (
          <ConfirmationPage
            booking={confirmedBooking}
            onBookAnother={() => setActivePage('home')}
            onViewMyBookings={() => setActivePage('my-bookings')}
          />
        )}

        {activePage === 'my-bookings' && (
          <MyBookingsPage
            onBookNewTrip={() => setActivePage('search')}
            onViewTicket={handleViewTicket}
          />
        )}

        {activePage === 'offers' && (
          <OffersPage
            onBookWithOffer={handleBookWithOffer}
          />
        )}

        {activePage === 'help' && (
          <HelpPage
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Global Modals */}
      <AuthModal />
      <ProfileModal />
      
      {/* 24/7 AI Chatbot Assistant */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenTicket={handleViewTicket}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
