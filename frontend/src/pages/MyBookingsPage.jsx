// MyBookingsPage.jsx - User Bookings, PNR Search, Ticket Viewing, and Real Server Cancellation with Refund
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Ticket, Search, Bus, Calendar, Clock, MapPin, 
  AlertCircle, CheckCircle2, RotateCcw, Printer, Loader2, ArrowRight 
} from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function MyBookingsPage({ onBookNewTrip, onViewTicket }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'cancelled', 'all'
  const [pnrSearch, setPnrSearch] = useState('');
  const [searchingPnr, setSearchingPnr] = useState(false);

  // Cancellation Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const email = user ? user.email : null;
      const res = await api.getMyBookings(email);
      if (res && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Search by PNR
  const handlePnrSearch = async (e) => {
    e.preventDefault();
    if (!pnrSearch.trim()) {
      fetchBookings();
      return;
    }

    setSearchingPnr(true);
    try {
      const res = await api.getBookingByPnr(pnrSearch);
      if (res && res.booking) {
        setBookings([res.booking]);
        showToast(`Found booking for PNR ${pnrSearch.toUpperCase()}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'No booking found with this PNR', 'error');
    } finally {
      setSearchingPnr(false);
    }
  };

  // Execute Cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);

    try {
      const res = await api.cancelBooking(cancelModalBooking.id);
      showToast(res.message, 'success');
      setCancelModalBooking(null);
      // Refresh list
      fetchBookings();
    } catch (err) {
      showToast(err.message || 'Cancellation failed', 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Filter bookings by tab
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'cancelled') return b.status === 'CANCELLED';
    if (activeTab === 'upcoming') return b.status === 'CONFIRMED';
    return true; // 'all'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & PNR Quick Lookup Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-[#d84e55]" />
            My Bookings & PNR Enquiry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track, download tickets, or cancel your bus reservations
          </p>
        </div>

        {/* Search by PNR Input */}
        <form onSubmit={handlePnrSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={pnrSearch}
              onChange={(e) => setPnrSearch(e.target.value.toUpperCase())}
              placeholder="Search PNR (e.g. VILS-123456)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            disabled={searchingPnr}
            className="px-4 py-2 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
          >
            {searchingPnr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Find'}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-3 transition cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-[#d84e55] text-[#d84e55]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming Bookings ({bookings.filter(b => b.status === 'CONFIRMED').length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 px-3 transition cursor-pointer ${
            activeTab === 'cancelled'
              ? 'border-b-2 border-[#d84e55] text-[#d84e55]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Cancelled & Refunded ({bookings.filter(b => b.status === 'CANCELLED').length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-3 transition cursor-pointer ${
            activeTab === 'all'
              ? 'border-b-2 border-[#d84e55] text-[#d84e55]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Tickets ({bookings.length})
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#d84e55] animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">Loading your bookings...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <Bus className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">
            {activeTab === 'cancelled' ? 'No Cancelled Bookings' : 'No Bookings Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {!isAuthenticated
              ? 'Please log in to see all your saved tickets or enter your 6-digit PNR above.'
              : 'You have no scheduled bus journeys right now. Ready for your next adventure?'}
          </p>

          <div className="pt-2 flex justify-center gap-3">
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Log In
              </button>
            )}
            <button
              type="button"
              onClick={onBookNewTrip}
              className="px-5 py-2.5 bg-[#d84e55] text-white font-bold text-xs rounded-xl hover:bg-[#b83238] shadow-md shadow-red-500/20 transition cursor-pointer"
            >
              Book Bus Tickets
            </button>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {!loading && filteredBookings.map(b => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition p-5 space-y-4"
          >
            {/* Top row: PNR and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">PNR:</span>
                <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {b.pnr}
                </span>
                <span className="text-[11px] text-slate-400">
                  Booked on {new Date(b.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div>
                {b.status === 'CONFIRMED' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CONFIRMED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    CANCELLED & REFUNDED
                  </span>
                )}
              </div>
            </div>

            {/* Route & Timing row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5 space-y-1">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span>{b.fromCity}</span>
                  <span className="text-slate-400">➔</span>
                  <span>{b.toCity}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {b.operatorName} • {b.busType}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{b.journeyDate} at {b.departureTime}</span>
                </div>
              </div>

              <div className="md:col-span-4 space-y-1 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 font-semibold">Boarding:</span> {b.boardingPoint?.name}
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Dropping:</span> {b.droppingPoint?.name}
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Seats:</span>{' '}
                  <strong className="text-slate-900">{b.passengers.map(p => p.seatNo).join(', ')}</strong> ({b.passengers.length} passengers)
                </div>
              </div>

              {/* Price & Actions */}
              <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Fare</span>
                  <span className="text-xl font-black text-slate-900">₹{b.totalAmount}</span>
                  {b.refundAmount && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Refunded: ₹{b.refundAmount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewTicket(b)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Ticket</span>
                  </button>

                  {b.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => setCancelModalBooking(b)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-red-600 p-5 text-white">
              <h3 className="font-extrabold text-base">Cancel Bus Ticket</h3>
              <p className="text-xs text-white/80">
                PNR: {cancelModalBooking.pnr} • {cancelModalBooking.fromCity} ➔ {cancelModalBooking.toCity}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                <span className="font-bold text-red-800 block text-sm">Cancellation & Refund Breakdown</span>
                <div className="flex justify-between text-slate-600">
                  <span>Total Ticket Fare:</span>
                  <span className="font-bold">₹{cancelModalBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Cancellation Fee (15%):</span>
                  <span className="font-bold">- ₹{Math.round(cancelModalBooking.totalAmount * 0.15)}</span>
                </div>
                <div className="pt-2 border-t border-red-200 flex justify-between font-black text-sm text-red-800">
                  <span>Estimated Refund to Original Mode:</span>
                  <span>₹{Math.round(cancelModalBooking.totalAmount * 0.85)}</span>
                </div>
              </div>

              <p className="text-slate-500 text-[11px]">
                Upon cancellation, your seats ({cancelModalBooking.passengers.map(p => p.seatNo).join(', ')}) will be released immediately back into the available pool for other passengers.
              </p>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Keep Ticket
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
