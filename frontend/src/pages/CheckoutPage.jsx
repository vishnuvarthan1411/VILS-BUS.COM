// CheckoutPage.jsx - Passenger Details, Live Coupon Validation, and Mock Payment Processing
import React, { useState, useEffect } from 'react';
import { 
  Bus, User, ArrowLeft, ShieldCheck, Tag, CheckCircle2, 
  AlertCircle, CreditCard, Smartphone, Building, Loader2, Clock, X 
} from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function CheckoutPage({
  bookingState,
  onBack,
  onBookingSuccess
}) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const { trip, selectedSeats, boardingPoint, droppingPoint, totalFare, holdTimer: initialTimer } = bookingState;

  // Passenger form array matching selected seats
  const [passengers, setPassengers] = useState(() => {
    return selectedSeats.map((seatNo, idx) => ({
      seatNo,
      passengerName: idx === 0 && user?.name ? user.name : '',
      age: '',
      gender: 'male' // 'male', 'female', 'other'
    }));
  });

  // Contact details
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Mock Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING'
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Hold timer countdown
  const [timerSeconds, setTimerSeconds] = useState(initialTimer || 600);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone) setCustomerPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          showToast('Your seat hold has expired. Returning to search results.', 'warning');
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds, onBack, showToast]);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Passenger detail change handler
  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Coupon validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }

    setApplyingCoupon(true);
    try {
      const res = await api.validateCoupon(couponCode, totalFare);
      setAppliedCoupon(res.coupon);
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message || 'Invalid coupon code', 'error');
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Coupon removed.', 'info');
  };

  // Fare calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const gstAmount = Math.round(totalFare * 0.05); // 5% GST
  const finalPayable = Math.max(0, totalFare + gstAmount - discountAmount);

  // Validate passenger details before opening payment
  const handleOpenPayment = () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      showToast('Please provide contact name, email, and mobile number.', 'error');
      return;
    }

    for (const p of passengers) {
      if (!p.passengerName.trim()) {
        showToast(`Please enter name for passenger in Seat ${p.seatNo}`, 'error');
        return;
      }
      if (!p.age || isNaN(p.age) || Number(p.age) <= 0 || Number(p.age) > 120) {
        showToast(`Please enter a valid age for passenger in Seat ${p.seatNo}`, 'error');
        return;
      }
    }

    setPaymentError(null);
    setIsPaymentModalOpen(true);
  };

  // Execute Mock Payment
  const handleExecutePayment = async () => {
    setProcessingPayment(true);
    setPaymentError(null);

    const payload = {
      tripId: trip.id,
      customerName,
      customerEmail,
      customerPhone,
      boardingPoint,
      droppingPoint,
      passengers,
      couponCode: appliedCoupon?.code || null,
      discountAmount,
      paymentMethod,
      simulateFailure
    };

    try {
      const res = await api.payBooking(payload);
      setIsPaymentModalOpen(false);
      showToast('🎉 Payment successful! Ticket confirmed.', 'success');
      onBookingSuccess(res.booking);
    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed. Please retry.');
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button & Hold Timer Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Seat Selection</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-600 animate-spin" />
          <span>Seats Held For: {formatTimer(timerSeconds)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Passenger Forms & Contact (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Journey Overview Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Selected Journey</span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {trip.fromCity} ➔ {trip.toCity}
                </h3>
              </div>
              <span className="text-xs bg-red-50 text-[#d84e55] font-extrabold px-3 py-1 rounded-full">
                {selectedSeats.length} Seat(s): {selectedSeats.join(', ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block font-semibold">Bus Operator:</span>
                <strong className="text-slate-800">{trip.operatorName}</strong> ({trip.busType})
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Boarding Point:</span>
                <strong className="text-slate-800">{boardingPoint.name}</strong> ({boardingPoint.time})
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Dropping Point:</span>
                <strong className="text-slate-800">{droppingPoint.name}</strong> ({droppingPoint.time})
              </div>
            </div>
          </div>

          {/* Passenger Information Cards */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#d84e55]" />
              Passenger Details
            </h4>

            {passengers.map((passenger, index) => (
              <div 
                key={passenger.seatNo}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    Passenger #{index + 1} — Seat {passenger.seatNo}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Seat price: ₹{trip.seats.find(s => s.seatNo === passenger.seatNo)?.price || trip.baseFare}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={passenger.passengerName}
                      onChange={(e) => handlePassengerChange(index, 'passengerName', e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="110"
                      required
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Gender *
                    </label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-base text-slate-900">
              Primary Contact Information
            </h4>
            <p className="text-xs text-slate-500">
              Your ticket, PNR, SMS, and WhatsApp updates will be sent to these details.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Primary contact"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Fare Breakdown & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-500" />
              Apply Promo Code
            </span>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-emerald-800 block">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 font-medium">Saved ₹{appliedCoupon.discount} on this booking</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-red-600 hover:text-red-800 font-bold p-1 cursor-pointer"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VILSFIRST"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  type="submit"
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  {applyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                </button>
              </form>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-400">Available:</span>
              <button
                type="button"
                onClick={() => setCouponCode('VILSFIRST')}
                className="font-mono text-[#d84e55] font-bold hover:underline cursor-pointer"
              >
                VILSFIRST
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setCouponCode('VILS20')}
                className="font-mono text-[#d84e55] font-bold hover:underline cursor-pointer"
              >
                VILS20
              </button>
            </div>
          </div>

          {/* Fare Summary Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Fare Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({selectedSeats.length} seats)</span>
                <span className="font-bold text-slate-800">₹{totalFare}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="font-bold text-slate-800">₹{gstAmount}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900 text-sm">Total Payable</span>
                <span className="font-black text-2xl text-[#d84e55]">₹{finalPayable}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleOpenPayment}
                className="w-full py-3.5 bg-[#d84e55] hover:bg-[#b83238] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-500/25 transition hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Continue to Payment</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Safe 256-bit Encrypted Mock Checkout
            </p>
          </div>

        </div>

      </div>

      {/* Mock Payment Modal Sandbox */}
      {isPaymentModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 text-white relative">
              <button
                onClick={() => !processingPayment && setIsPaymentModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Development Sandbox
                </span>
              </div>

              <h3 className="text-lg font-black">VILS BUS.COM Mock Payment</h3>
              <p className="text-xs text-slate-300">
                Amount Payable: <strong className="text-white text-sm">₹{finalPayable}</strong>
              </p>
            </div>

            {/* Sandbox Notice */}
            <div className="bg-amber-50 p-3 border-b border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Test Mode:</strong> No real money will be debited. You can test both successful and declined transactions below.
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {paymentError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Select Mock Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'CARD', label: 'Debit/Credit', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'NETBANKING', label: 'NetBanking', icon: <Building className="w-4 h-4" /> }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      disabled={processingPayment}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-xs ${
                        paymentMethod === m.id
                          ? 'border-[#d84e55] bg-red-50 text-[#d84e55] font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation outcome toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="block text-[11px] font-bold text-slate-700">Simulate Response Type:</span>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="simOutcome"
                      checked={!simulateFailure}
                      onChange={() => setSimulateFailure(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Success (Issue Ticket)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-red-700">
                    <input
                      type="radio"
                      name="simOutcome"
                      checked={simulateFailure}
                      onChange={() => setSimulateFailure(true)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>Fail (Bank Decline)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={processingPayment}
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processingPayment}
                  onClick={handleExecutePayment}
                  className="flex-1 py-3 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-black rounded-xl shadow-md shadow-red-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with Bank...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay ₹{finalPayable}</span>
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
