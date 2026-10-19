// SearchResultsPage.jsx - Search Results with Filters, Sorting, and Seat Layout Integration
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bus, Filter, ArrowUpDown, Clock, Star, Shield, MapPin, 
  Wifi, Zap, Droplet, Cloud, RotateCcw, AlertCircle, ChevronDown, 
  ChevronUp, X, Check, Loader2, Sparkles 
} from 'lucide-react';
import api from '../services/api.js';
import SeatLayout from '../components/SeatLayout.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function SearchResultsPage({
  searchParams,
  onUpdateSearchParams,
  onProceedToCheckout
}) {
  const { showToast } = useToast();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedBusType, setSelectedBusType] = useState('all');
  const [departureSlot, setDepartureSlot] = useState('all');
  const [acOnly, setAcOnly] = useState(false);
  const [sleeperOnly, setSleeperOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('rating_desc');

  // Metadata from backend
  const [filterMeta, setFilterMeta] = useState({
    operators: [],
    busTypes: [],
    minFare: 300,
    maxFare: 2000
  });

  // Active expanded trip for seat selection or details
  const [activeTripSeatId, setActiveTripSeatId] = useState(null);
  const [detailsModalTrip, setDetailsModalTrip] = useState(null);

  // Edit search bar states
  const [fromCity, setFromCity] = useState(searchParams.from || 'Bengaluru');
  const [toCity, setToCity] = useState(searchParams.to || 'Chennai');
  const [date, setDate] = useState(searchParams.date || new Date().toISOString().split('T')[0]);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date,
        operator: selectedOperator !== 'all' ? selectedOperator : undefined,
        busType: selectedBusType !== 'all' ? selectedBusType : undefined,
        departureSlot: departureSlot !== 'all' ? departureSlot : undefined,
        acOnly: acOnly ? 'true' : undefined,
        sleeperOnly: sleeperOnly ? 'true' : undefined,
        maxPrice: maxPrice || undefined,
        sortBy
      };

      const res = await api.searchTrips(params);
      if (res && res.trips) {
        setTrips(res.trips);
        if (res.filterMeta) {
          setFilterMeta(res.filterMeta);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch buses. Please try again.');
      showToast('Error loading search results', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchParams, selectedOperator, selectedBusType, departureSlot, acOnly, sleeperOnly, maxPrice, sortBy, showToast]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Handle Edit Search submit
  const handleEditSearch = (e) => {
    e.preventDefault();
    if (!fromCity.trim() || !toCity.trim()) {
      showToast('Please enter departure and destination cities.', 'error');
      return;
    }
    onUpdateSearchParams({ from: fromCity, to: toCity, date });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedOperator('all');
    setSelectedBusType('all');
    setDepartureSlot('all');
    setAcOnly(false);
    setSleeperOnly(false);
    setMaxPrice(2000);
    setSortBy('rating_desc');
    showToast('Filters reset to default.', 'info');
  };

  const getAmenityIcon = (id) => {
    switch (id) {
      case 'wifi': return <Wifi className="w-3.5 h-3.5" />;
      case 'charging': return <Zap className="w-3.5 h-3.5" />;
      case 'water': return <Droplet className="w-3.5 h-3.5" />;
      case 'blanket': return <Cloud className="w-3.5 h-3.5" />;
      default: return <Shield className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search Modifier Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleEditSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">From</label>
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">To</label>
            <input
              type="text"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full py-2 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-extrabold rounded-xl transition shadow-xs cursor-pointer"
            >
              Update Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Layout: Filters Sidebar (Left 3 cols), Trips Listing (Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#d84e55]" />
                Filters
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#d84e55] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Departure Time Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">Departure Time</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'morning', label: 'Morning', desc: '6 AM - 12 PM' },
                  { id: 'afternoon', label: 'Afternoon', desc: '12 PM - 5 PM' },
                  { id: 'evening', label: 'Evening', desc: '5 PM - 8 PM' },
                  { id: 'night', label: 'Night', desc: '8 PM - 6 AM' }
                ].map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDepartureSlot(departureSlot === slot.id ? 'all' : slot.id)}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                      departureSlot === slot.id
                        ? 'border-[#d84e55] bg-red-50 text-[#d84e55] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">{slot.label}</p>
                    <p className="text-[10px] text-slate-400">{slot.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Preferences Toggles */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 mb-2">Preferences</label>
              
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acOnly}
                  onChange={(e) => setAcOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-400"
                />
                <span>Air Conditioned (A/C)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sleeperOnly}
                  onChange={(e) => setSleeperOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-400"
                />
                <span>Sleeper Berths</span>
              </label>
            </div>

            {/* Operator Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">Bus Operator</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="all">All Bus Operators</option>
                {filterMeta.operators.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800">Max Price</span>
                <span className="font-extrabold text-[#d84e55]">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d84e55] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹400</span>
                <span>₹2000</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Trips Results Section */}
        <main className="lg:col-span-9 space-y-4">
          
          {/* Header Bar: Count and Sort Dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {searchParams.from} to {searchParams.to}
              </h2>
              <p className="text-xs text-slate-500">
                {loading ? 'Searching available buses...' : `${trips.length} Buses Available for booking`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Loader2 className="w-8 h-8 text-[#d84e55] animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">Fetching live bus inventory from operators...</p>
            </div>
          )}

          {/* Error State with Retry Button */}
          {error && !loading && (
            <div className="p-8 text-center bg-white rounded-2xl border border-red-200 space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">{error}</p>
              <button
                type="button"
                onClick={fetchTrips}
                className="px-4 py-2 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && trips.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Bus className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Buses Found For This Route / Filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing some filters to see all available buses.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Trip Cards */}
          {!loading && !error && trips.map(trip => {
            const isSeatOpen = activeTripSeatId === trip.id;
            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
              >
                {/* Trip Card Main Row */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Operator & Bus Model */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900">{trip.operatorName}</h3>
                        {trip.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {trip.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{trip.busType}</p>
                      
                      {/* Amenities Icons */}
                      <div className="flex items-center gap-2 pt-1 text-slate-400">
                        {trip.amenities?.slice(0, 4).map(am => (
                          <span key={am.id} title={am.name} className="hover:text-slate-700 transition">
                            {getAmenityIcon(am.id)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Departure, Duration, Arrival */}
                    <div className="md:col-span-5 flex items-center justify-between text-center px-2">
                      <div className="text-left">
                        <span className="text-base font-black text-slate-900 block">{trip.departureTime}</span>
                        <span className="text-xs text-slate-500 font-semibold">{trip.fromCity}</span>
                      </div>

                      <div className="flex flex-col items-center px-3">
                        <span className="text-[11px] text-slate-400 font-medium">{trip.duration}</span>
                        <div className="w-20 sm:w-28 h-0.5 bg-slate-200 relative my-1">
                          <div className="w-2 h-2 rounded-full bg-[#d84e55] absolute -top-0.8 left-1/2 -translate-x-1/2"></div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">On-Time Guarantee</span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 block">{trip.arrivalTime}</span>
                        <span className="text-xs text-slate-500 font-semibold">{trip.toCity}</span>
                      </div>
                    </div>

                    {/* Rating, Price & CTA */}
                    <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-xs">
                          <Star className="w-3 h-3 fill-white" />
                          <span>{trip.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">({trip.ratingsCount})</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Starts from</span>
                        <span className="text-xl font-black text-slate-900">₹{trip.baseFare}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          type="button"
                          onClick={() => setDetailsModalTrip(trip)}
                          className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1.5 cursor-pointer"
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTripSeatId(isSeatOpen ? null : trip.id)}
                          className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            isSeatOpen
                              ? 'bg-slate-800 text-white'
                              : 'bg-[#d84e55] hover:bg-[#b83238] text-white shadow-xs'
                          }`}
                        >
                          <span>{isSeatOpen ? 'Hide Seats' : 'View Seats'}</span>
                          {isSeatOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Seat availability ticker */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold">
                      💺 <strong className="text-slate-800">{trip.availableSeats}</strong> seats available out of {trip.totalSeats}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Free Water & Charging Port
                    </span>
                  </div>
                </div>

                {/* Expandable Seat Layout Section */}
                {isSeatOpen && (
                  <SeatLayout
                    trip={trip}
                    onProceedToCheckout={onProceedToCheckout}
                    onClose={() => setActiveTripSeatId(null)}
                  />
                )}
              </div>
            );
          })}

        </main>

      </div>

      {/* Trip Details Modal */}
      {detailsModalTrip && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{detailsModalTrip.operatorName}</h3>
                <p className="text-xs text-slate-300">{detailsModalTrip.busType}</p>
              </div>
              <button
                onClick={() => setDetailsModalTrip(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Amenities Included</h4>
                <div className="grid grid-cols-2 gap-2">
                  {detailsModalTrip.amenities.map(am => (
                    <div key={am.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {getAmenityIcon(am.id)}
                      <span className="font-medium text-slate-700">{am.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Boarding Points</h4>
                <div className="space-y-1.5">
                  {detailsModalTrip.boardingPoints.map(bp => (
                    <div key={bp.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="font-bold text-slate-800">{bp.name} ({bp.time})</span>
                      <span className="text-slate-500">{bp.landmark}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Cancellation & Refund Policy</h4>
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {detailsModalTrip.cancellationPolicy.map((cp, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-200 last:border-none">
                      <span className="text-slate-600">{cp.time}</span>
                      <span className="font-bold text-slate-900">{cp.refund}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setDetailsModalTrip(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
