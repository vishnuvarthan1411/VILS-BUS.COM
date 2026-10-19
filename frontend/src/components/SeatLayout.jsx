// SeatLayout.jsx - Interactive Upper & Lower Deck Seat Layout with Real-Time Server Hold
import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, AlertCircle, ArrowRight, Check, Disc, MapPin } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function SeatLayout({
  trip,
  onProceedToCheckout,
  onClose
}) {
  const { showToast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holding, setHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null); // seconds remaining
  const [boardingPoint, setBoardingPoint] = useState(trip.boardingPoints[0] || null);
  const [droppingPoint, setDroppingPoint] = useState(trip.droppingPoints[0] || null);
  const [activeDeckTab, setActiveDeckTab] = useState('lower');

  // Load fresh seat layout and check if existing seats were held
  useEffect(() => {
    // Pick initial held seats if any exist for this session
    const heldByMeSeats = trip.seats.filter(s => s.heldByMe).map(s => s.seatNo);
    if (heldByMeSeats.length > 0) {
      setSelectedSeats(heldByMeSeats);
      setHoldTimer(600); // 10 minutes
    }
  }, [trip]);

  // Hold Countdown Timer
  useEffect(() => {
    if (!holdTimer || holdTimer <= 0) return;

    const interval = setInterval(() => {
      setHoldTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSelectedSeats([]);
          showToast('Your seat hold has expired. Please reselect your seats.', 'warning');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [holdTimer, showToast]);

  // Seat Click Handler
  const handleSeatClick = async (seat) => {
    if (seat.status === 'booked') {
      showToast(`Seat ${seat.seatNo} is already booked.`, 'error');
      return;
    }
    if (seat.status === 'held' && !selectedSeats.includes(seat.seatNo)) {
      showToast(`Seat ${seat.seatNo} is temporarily reserved by another passenger.`, 'warning');
      return;
    }

    const isAlreadySelected = selectedSeats.includes(seat.seatNo);
    const newSelected = isAlreadySelected
      ? selectedSeats.filter(s => s !== seat.seatNo)
      : [...selectedSeats, seat.seatNo];

    if (newSelected.length > 6) {
      showToast('Maximum 6 seats can be selected per booking.', 'warning');
      return;
    }

    setHolding(true);
    try {
      if (newSelected.length === 0) {
        // Release all seats
        await api.releaseSeats(trip.id);
        setSelectedSeats([]);
        setHoldTimer(null);
        showToast('Seats released.', 'info');
      } else {
        // Request backend temporary hold for updated seat list
        const res = await api.holdSeats(trip.id, newSelected);
        setSelectedSeats(newSelected);
        setHoldTimer(600); // Start 10-minute hold
        if (!isAlreadySelected) {
          showToast(`Seat ${seat.seatNo} locked for 10 minutes!`, 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Could not hold seat.', 'error');
    } finally {
      setHolding(false);
    }
  };

  // Format seconds to mm:ss
  const formatTimer = (seconds) => {
    if (!seconds) return '10:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Calculate selected total fare
  const totalFare = selectedSeats.reduce((sum, seatNo) => {
    const seatObj = trip.seats.find(s => s.seatNo === seatNo);
    return sum + (seatObj?.price || trip.baseFare);
  }, 0);

  const lowerDeckSeats = trip.seats.filter(s => s.deck === 'lower');
  const upperDeckSeats = trip.seats.filter(s => s.deck === 'upper');
  const hasUpperDeck = upperDeckSeats.length > 0;

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least one seat to continue.', 'error');
      return;
    }
    if (!boardingPoint || !droppingPoint) {
      showToast('Please select both boarding and dropping points.', 'error');
      return;
    }

    onProceedToCheckout({
      trip,
      selectedSeats,
      boardingPoint,
      droppingPoint,
      totalFare,
      holdTimer
    });
  };

  return (
    <div className="bg-slate-50 border-t border-slate-200 p-4 md:p-6 animate-in slide-in-from-top-2 duration-200">
      
      {/* Top Banner & Hold Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h4 className="font-extrabold text-slate-900 text-base">Select Your Seats</h4>
          <p className="text-xs text-slate-500">
            Click on available seats to reserve. Seats are held on the server for 10 minutes.
          </p>
        </div>

        {selectedSeats.length > 0 && holdTimer > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Held for: {formatTimer(holdTimer)}</span>
          </div>
        )}
      </div>

      {/* Seat Status Legend */}
      <div className="flex flex-wrap items-center gap-4 py-3 text-xs border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md border-2 border-slate-300 bg-white"></div>
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-[#d84e55] border-2 border-[#d84e55]"></div>
          <span className="text-slate-900 font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-300 border-2 border-slate-300"></div>
          <span className="text-slate-400">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-pink-100 border-2 border-pink-400"></div>
          <span className="text-pink-700 font-medium">Ladies Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-amber-100 border-2 border-amber-400"></div>
          <span className="text-amber-700 font-medium">Held by Other</span>
        </div>
      </div>

      {/* Main Grid: Left Bus Visualization, Right Boarding/Dropping & Total */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        
        {/* Bus Deck Layout */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Deck Switcher Tabs if Sleeper has Upper Deck */}
          {hasUpperDeck && (
            <div className="flex mb-4 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveDeckTab('lower')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  activeDeckTab === 'lower'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lower Deck ({lowerDeckSeats.filter(s => s.status === 'available').length} free)
              </button>
              <button
                type="button"
                onClick={() => setActiveDeckTab('upper')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  activeDeckTab === 'upper'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Upper Deck ({upperDeckSeats.filter(s => s.status === 'available').length} free)
              </button>
            </div>
          )}

          {/* Bus Interior Mockup */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/50">
            {/* Front of Bus indicator with Steering Wheel */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Disc className="w-5 h-5 text-slate-500" />
                Driver Cabin
              </span>
              <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                {activeDeckTab === 'lower' ? 'LOWER DECK' : 'UPPER DECK'}
              </span>
              <span>Entry Door</span>
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-3 gap-3 justify-items-center py-2">
              {(activeDeckTab === 'lower' ? lowerDeckSeats : upperDeckSeats).map((seat) => {
                const isSelected = selectedSeats.includes(seat.seatNo);
                const isBooked = seat.status === 'booked';
                const isHeldByOther = seat.status === 'held' && !isSelected;
                const isLadies = seat.isLadies && !isBooked;

                let seatClasses = "w-16 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all relative cursor-pointer ";

                if (isSelected) {
                  seatClasses += "bg-[#d84e55] text-white shadow-md shadow-red-500/30 scale-105 border-2 border-[#d84e55]";
                } else if (isBooked) {
                  seatClasses += "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed";
                } else if (isHeldByOther) {
                  seatClasses += "bg-amber-100 text-amber-800 border-2 border-amber-400 cursor-not-allowed";
                } else if (isLadies) {
                  seatClasses += "bg-pink-50 hover:bg-pink-100 text-pink-700 border-2 border-pink-300 hover:border-pink-400";
                } else {
                  seatClasses += "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 hover:border-slate-400";
                }

                return (
                  <button
                    key={seat.seatNo}
                    type="button"
                    disabled={isBooked || (isHeldByOther && !isSelected) || holding}
                    onClick={() => handleSeatClick(seat)}
                    className={seatClasses}
                    title={`${seat.seatNo} • ₹${seat.price || trip.baseFare} • ${seat.type}`}
                  >
                    <span>{seat.seatNo}</span>
                    <span className="text-[9px] font-normal opacity-90">
                      ₹{seat.price || trip.baseFare}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-[#d84e55] flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 mt-4 text-center text-[11px] text-slate-400">
              Rear of Bus
            </div>
          </div>
        </div>

        {/* Right Panel: Boarding/Dropping and Summary */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Boarding Point Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Boarding Point in {trip.fromCity}
            </label>
            <select
              value={boardingPoint?.id || ''}
              onChange={(e) => {
                const found = trip.boardingPoints.find(p => p.id === e.target.value);
                setBoardingPoint(found);
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {trip.boardingPoints.map(bp => (
                <option key={bp.id} value={bp.id}>
                  {bp.name} ({bp.time}) - {bp.landmark}
                </option>
              ))}
            </select>
          </div>

          {/* Dropping Point Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Dropping Point in {trip.toCity}
            </label>
            <select
              value={droppingPoint?.id || ''}
              onChange={(e) => {
                const found = trip.droppingPoints.find(p => p.id === e.target.value);
                setDroppingPoint(found);
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {trip.droppingPoints.map(dp => (
                <option key={dp.id} value={dp.id}>
                  {dp.name} ({dp.time}) - {dp.landmark}
                </option>
              ))}
            </select>
          </div>

          {/* Selection & Fare Summary */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Selected Seats:</span>
              <span className="font-extrabold text-slate-900">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Base Fare:</span>
              <span className="font-extrabold text-lg text-[#d84e55]">₹{totalFare}</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={selectedSeats.length === 0 || holding}
                onClick={handleContinue}
                className="w-full py-3 bg-[#d84e55] hover:bg-[#b83238] text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Passenger Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
