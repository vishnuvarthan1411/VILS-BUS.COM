// AdminDashboard.jsx - Admin Platform Statistics, Bookings Audit, and Trip Management
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, DollarSign, Ticket, Bus, Users, Plus, 
  Trash2, Search, CheckCircle2, AlertCircle, Clock, X, Loader2 
} from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Trip Modal State
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [tripForm, setTripForm] = useState({
    operatorName: 'VILS Express Platinum',
    busType: 'AC Sleeper 2+1 (Multi-Axle)',
    fromCity: 'Bengaluru',
    toCity: 'Hyderabad',
    departureTime: '10:00 PM',
    arrivalTime: '06:30 AM',
    duration: '8h 30m',
    baseFare: 1150,
    isAC: true,
    isSleeper: true
  });
  const [submittingTrip, setSubmittingTrip] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, tripsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminBookings(),
        api.searchTrips({})
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (bookingsRes.bookings) setBookings(bookingsRes.bookings);
      if (tripsRes.trips) setTrips(tripsRes.trips);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast(err.message || 'Admin authentication required', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Handle Add Trip Submit
  const handleAddTrip = async (e) => {
    e.preventDefault();
    setSubmittingTrip(true);
    try {
      await api.createTrip(tripForm);
      showToast('Trip schedule added successfully!', 'success');
      setShowAddTripModal(false);
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to add trip', 'error');
    } finally {
      setSubmittingTrip(false);
    }
  };

  // Handle Delete Trip
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip schedule?')) return;
    try {
      await api.deleteTrip(tripId);
      showToast('Trip deleted successfully', 'info');
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to delete trip', 'error');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.toCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700">
            Operations & Control
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            VILS BUS.COM Admin Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time telemetry, fleet revenue analytics, and route schedule manager
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddTripModal(true)}
          className="px-4 py-2.5 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-black rounded-xl shadow-lg shadow-red-500/25 transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bus Schedule</span>
        </button>
      </div>

      {loading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#d84e55] animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">Gathering telemetry metrics...</p>
        </div>
      )}

      {/* KPI Stats Cards */}
      {!loading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400">Total Ticket Revenue</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block">100% verified settlement</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400">Total Bookings</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{stats.totalBookings}</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#d84e55] flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block">
              {stats.confirmedCount} Confirmed • {stats.cancelledCount} Cancelled
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400">Active Bus Schedules</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{trips.length}</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-blue-600 font-bold block">Daily Intercity Routes</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400">Active Seat Holds</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{stats.activeHolds}</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-amber-700 font-bold block">10-Min Live TTL Locks</span>
          </div>

        </div>
      )}

      {/* Bookings Audit Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Recent Passenger Bookings</h3>
            <p className="text-xs text-slate-500">Audit tickets, customer details, and payment statuses</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PNR or name..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px]">
              <tr>
                <th className="p-3">PNR</th>
                <th className="p-3">Passenger / Contact</th>
                <th className="p-3">Route</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-[#d84e55]">{b.pnr}</td>
                  <td className="p-3">
                    <strong className="block text-slate-900">{b.customerName}</strong>
                    <span className="text-[11px] text-slate-400">{b.customerEmail}</span>
                  </td>
                  <td className="p-3 font-semibold">{b.fromCity} ➔ {b.toCity}</td>
                  <td className="p-3 text-slate-600">{b.journeyDate} • {b.departureTime}</td>
                  <td className="p-3 font-bold">{b.passengers.map(p => p.seatNo).join(', ')}</td>
                  <td className="p-3 font-black text-slate-900">₹{b.totalAmount}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    No bookings found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trip Schedules Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Configured Bus Schedules ({trips.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.slice(0, 9).map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{t.operatorName}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteTrip(t.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                  title="Delete schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <span>{t.fromCity}</span> ➔ <span>{t.toCity}</span>
              </div>

              <div className="text-slate-500 text-[11px]">
                {t.busType} • Dep: {t.departureTime}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="font-mono text-slate-400">{t.busNumber}</span>
                <span className="font-extrabold text-sm text-[#d84e55]">₹{t.baseFare}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Trip Modal */}
      {showAddTripModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <h3 className="font-black text-base">Add New Bus Route Schedule</h3>
              <button onClick={() => setShowAddTripModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrip} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Operator Name *</label>
                <input
                  type="text"
                  required
                  value={tripForm.operatorName}
                  onChange={(e) => setTripForm({ ...tripForm, operatorName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From City *</label>
                  <input
                    type="text"
                    required
                    value={tripForm.fromCity}
                    onChange={(e) => setTripForm({ ...tripForm, fromCity: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To City *</label>
                  <input
                    type="text"
                    required
                    value={tripForm.toCity}
                    onChange={(e) => setTripForm({ ...tripForm, toCity: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure *</label>
                  <input
                    type="text"
                    required
                    value={tripForm.departureTime}
                    onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })}
                    placeholder="10:00 PM"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={tripForm.duration}
                    onChange={(e) => setTripForm({ ...tripForm, duration: e.target.value })}
                    placeholder="6h 30m"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    value={tripForm.baseFare}
                    onChange={(e) => setTripForm({ ...tripForm, baseFare: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTripModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTrip}
                  className="flex-1 py-2.5 bg-[#d84e55] hover:bg-[#b83238] text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-60"
                >
                  {submittingTrip ? 'Creating Schedule...' : 'Save & Publish Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
