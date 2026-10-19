// HomePage.jsx - VILS BUS.COM modern redBus-inspired Homepage
import React, { useState, useEffect } from 'react';
import { 
  Bus, ArrowLeftRight, Calendar, Search, Tag, ShieldCheck, 
  Clock, MapPin, Sparkles, ChevronRight, Star, Heart, CheckCircle2, Copy 
} from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function HomePage({ onSearch, onSelectOffer }) {
  const { showToast } = useToast();

  const [fromCity, setFromCity] = useState('Bengaluru');
  const [toCity, setToCity] = useState('Chennai');
  const [journeyDate, setJourneyDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [cities, setCities] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  // Load cities & offers on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [citiesRes, offersRes] = await Promise.all([
          api.getCities(),
          api.getOffers()
        ]);
        if (citiesRes.cities) {
          setCities(citiesRes.cities);
          setPopularRoutes(citiesRes.popularRoutes || []);
        }
        if (offersRes.offers) {
          setOffers(offersRes.offers);
        }
      } catch (err) {
        console.error('Initial data load error:', err);
      } finally {
        setLoadingOffers(false);
      }
    }
    loadInitialData();
  }, []);

  // Filter from suggestions
  const handleFromChange = (val) => {
    setFromCity(val);
    if (!val.trim()) {
      setFromSuggestions(cities.slice(0, 6));
    } else {
      setFromSuggestions(
        cities.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 6)
      );
    }
    setShowFromDropdown(true);
  };

  // Filter to suggestions
  const handleToChange = (val) => {
    setToCity(val);
    if (!val.trim()) {
      setToSuggestions(cities.slice(0, 6));
    } else {
      setToSuggestions(
        cities.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 6)
      );
    }
    setShowToDropdown(true);
  };

  // Swap origin and destination
  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    showToast(`Route swapped: ${toCity} ➔ ${temp}`, 'info', 2000);
  };

  // Date buttons (Today / Tomorrow)
  const setQuickDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setJourneyDate(d.toISOString().split('T')[0]);
  };

  // Submit search
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (!fromCity.trim() || !toCity.trim()) {
      showToast('Please enter both Origin and Destination cities.', 'error');
      return;
    }
    if (fromCity.trim().toLowerCase() === toCity.trim().toLowerCase()) {
      showToast('Origin and Destination cities cannot be identical.', 'warning');
      return;
    }

    onSearch({
      from: fromCity.trim(),
      to: toCity.trim(),
      date: journeyDate
    });
  };

  const copyCouponCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Coupon code '${code}' copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-14 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#d84e55] via-[#c62828] to-[#8e0000] text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>India’s Most Trusted Online Bus Booking Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Seamless Bus Journeys Across India with <span className="underline decoration-amber-400 decoration-wavy underline-offset-8">VILS BUS.COM</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-medium">
            Over 25,000+ verified buses, real-time seat lock, 24x7 customer support, and instant confirmed tickets.
          </p>

          {/* Search Card Container */}
          <div className="pt-6 max-w-5xl mx-auto text-slate-800">
            <form 
              onSubmit={handleSubmitSearch}
              className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 border border-slate-100 text-left grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
            >
              
              {/* FROM Input */}
              <div className="md:col-span-4 relative">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Leaving From
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#d84e55] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fromCity}
                    onChange={(e) => handleFromChange(e.target.value)}
                    onFocus={() => {
                      setFromSuggestions(cities.slice(0, 6));
                      setShowFromDropdown(true);
                    }}
                    placeholder="Enter Departure City"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-48 overflow-y-auto">
                    {fromSuggestions.map(c => (
                      <div
                        key={c.id}
                        onMouseDown={() => {
                          setFromCity(c.name);
                          setShowFromDropdown(false);
                        }}
                        className="px-4 py-2 text-xs font-semibold hover:bg-red-50 hover:text-[#d84e55] cursor-pointer flex justify-between items-center"
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{c.state}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#d84e55] flex items-center justify-center transition border border-slate-200 shadow-xs cursor-pointer hover:rotate-180 duration-300"
                  title="Swap Origin and Destination"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* TO Input */}
              <div className="md:col-span-4 relative">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Going To
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={toCity}
                    onChange={(e) => handleToChange(e.target.value)}
                    onFocus={() => {
                      setToSuggestions(cities.slice(0, 6));
                      setShowToDropdown(true);
                    }}
                    placeholder="Enter Destination City"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showToDropdown && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-48 overflow-y-auto">
                    {toSuggestions.map(c => (
                      <div
                        key={c.id}
                        onMouseDown={() => {
                          setToCity(c.name);
                          setShowToDropdown(false);
                        }}
                        className="px-4 py-2 text-xs font-semibold hover:bg-red-50 hover:text-[#d84e55] cursor-pointer flex justify-between items-center"
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{c.state}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DATE Input */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Travel Date
                  </label>
                  <div className="flex gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="text-[#d84e55] hover:underline cursor-pointer"
                    >
                      Today
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="text-[#d84e55] hover:underline cursor-pointer"
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="md:col-span-12 pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#d84e55] hover:bg-[#b83238] text-white text-base font-black rounded-2xl shadow-lg shadow-red-500/30 transition hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-5 h-5 stroke-[2.5]" />
                  <span>Search Buses</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Special Offers Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Trending Offers on VILS BUS.COM</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apply coupon codes at checkout for instant discounts on your travel
            </p>
          </div>
          <button
            onClick={() => onSelectOffer('all')}
            className="text-xs font-bold text-[#d84e55] hover:text-[#b83238] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Offers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map(offer => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: offer.color || '#d84e55' }}
                  >
                    {offer.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Valid till {offer.validTill}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-[#d84e55] transition">
                  {offer.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded border border-dashed border-slate-300">
                  {offer.code}
                </span>
                <button
                  type="button"
                  onClick={() => copyCouponCode(offer.code)}
                  className="text-xs font-bold text-[#d84e55] hover:text-[#b83238] flex items-center gap-1 cursor-pointer"
                  title="Copy coupon code"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Popular Bus Routes</h3>
            <p className="text-xs text-slate-500 mt-1">
              Top booked bus corridors with high frequency and daily departures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((r, idx) => (
            <div
              key={idx}
              onClick={() => onSearch({ from: r.from, to: r.to, date: journeyDate })}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-lg hover:border-red-300 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Route #{idx + 1}</span>
                <span className="text-[11px] bg-red-50 text-[#d84e55] font-bold px-2 py-0.5 rounded-full">
                  {r.busCount} Daily Buses
                </span>
              </div>

              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm group-hover:text-[#d84e55] transition">
                <span>{r.from}</span>
                <span className="text-slate-400">➔</span>
                <span>{r.to}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <span>⏱️ {r.avgDuration}</span>
                <span>From <strong className="text-slate-900 font-extrabold">₹{r.startingPrice}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose VILS BUS.COM */}
      <section className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-slate-900">Why Book with VILS BUS.COM?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Experience the standard in Indian intercity bus travel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-[#d84e55] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">10-Minute Live Seat Hold</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never lose your favorite window or sleeper berth. Our server guarantees a 10-minute hold while you enter passenger details and check out.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-[#d84e55] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Dedicated Women Safety</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exclusive pink-tinted ladies seats. When a female passenger reserves a seat, adjacent seats are automatically locked for women only.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-[#d84e55] flex items-center justify-center font-bold">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Primo & Top-Rated Fleet</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Partnered with only certified operators offering on-time performance, clean linen, CCTV cameras, and live GPS tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
