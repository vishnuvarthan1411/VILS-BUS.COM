// ConfirmationPage.jsx - Confirmed Booking, Print Ticket, and Email Template Preview
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, Printer, Mail, Bus, MapPin, Calendar, 
  Clock, ShieldCheck, Download, ArrowRight, QrCode, Phone, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext.jsx';

export default function ConfirmationPage({
  booking,
  onBookAnother,
  onViewMyBookings
}) {
  const { showToast } = useToast();
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    showToast(`E-ticket copy sent to ${booking.customerEmail}`, 'success');
    setShowEmailModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Success Celebration Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-10 h-10 text-emerald-200" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
              Booking Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">Ready for your journey!</h2>
            <p className="text-xs text-white/90 mt-1">
              PNR has been generated and sent to <strong className="underline">{booking.customerEmail}</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="px-4 py-2.5 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-xl text-xs font-black border border-white/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>View Email Preview</span>
          </button>
        </div>
      </div>

      {/* Main Printable Ticket View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:shadow-none print:border-none">
        
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-[#d84e55]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d84e55] flex items-center justify-center text-white">
              <Bus className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight">
                VILS <span className="text-[#d84e55]">BUS.COM</span>
              </span>
              <p className="text-xs text-slate-400">Electronic Bus Travel Ticket (e-Ticket)</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">PNR Number</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-wider">
              {booking.pnr}
            </span>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Journey Path */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Departure</span>
              <h3 className="text-xl font-black text-slate-900">{booking.fromCity}</h3>
              <p className="text-xs font-bold text-slate-700">{booking.departureTime}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {booking.boardingPoint?.name} ({booking.boardingPoint?.landmark})
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400">{booking.duration}</span>
              <div className="w-24 sm:w-36 h-0.5 bg-slate-300 relative my-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d84e55] absolute -top-1 left-1/2 -translate-x-1/2"></div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Confirmed Booking</span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase">Arrival</span>
              <h3 className="text-xl font-black text-slate-900">{booking.toCity}</h3>
              <p className="text-xs font-bold text-slate-700">{booking.arrivalTime}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {booking.droppingPoint?.name} ({booking.droppingPoint?.landmark})
              </p>
            </div>
          </div>

          {/* Bus and Date Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold">Bus Operator</span>
              <strong className="text-slate-800 text-sm">{booking.operatorName}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold">Bus Type</span>
              <strong className="text-slate-800 text-sm">{booking.busType}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold">Journey Date</span>
              <strong className="text-slate-800 text-sm">{booking.journeyDate}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold">Bus Number</span>
              <strong className="text-slate-800 text-sm font-mono">{booking.busNumber || 'KA-01-VB-2026'}</strong>
            </div>
          </div>

          {/* Passenger Table */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-2">Passenger Information</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Passenger Name</th>
                    <th className="p-3">Seat Number</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{p.passengerName}</td>
                      <td className="p-3 font-mono font-bold text-[#d84e55]">{p.seatNo}</td>
                      <td className="p-3">{p.age} yrs</td>
                      <td className="p-3 capitalize">{p.gender}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          CONFIRMED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Fare Receipt */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Payment Details</span>
              <p className="text-slate-800 font-bold">
                Method: {booking.paymentMethod} • ID: <span className="font-mono">{booking.paymentId}</span>
              </p>
              <p className="text-slate-500">
                Booked by {booking.customerName} ({booking.customerPhone})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-slate-400 block font-semibold">Total Amount Paid</span>
              <span className="text-2xl font-black text-[#d84e55]">₹{booking.totalAmount}</span>
              {booking.discountAmount > 0 && (
                <span className="text-[11px] text-emerald-600 block font-bold">
                  (Includes ₹{booking.discountAmount} promo discount)
                </span>
              )}
            </div>
          </div>

          {/* Important Instructions */}
          <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-4">
            <p className="font-bold text-slate-700">Important Travel Guidelines:</p>
            <p>1. Please carry a valid Govt ID (Aadhaar / Driving License / Voter ID) during boarding.</p>
            <p>2. Please report to the boarding point at least 15 minutes before scheduled departure.</p>
            <p>3. 24x7 VILS BUS Helpline: <strong>1800-VILS-BUS</strong> or chat with our automated AI assistant.</p>
          </div>

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 no-print">
        <button
          type="button"
          onClick={onBookAnother}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Book Another Ticket
        </button>

        <button
          type="button"
          onClick={onViewMyBookings}
          className="w-full sm:w-auto px-6 py-3 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Go to My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Email Template Preview Modal */}
      {showEmailModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#d84e55]" />
                Customer Ticket Email Preview
              </span>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Email Body Simulation */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs bg-slate-50 font-sans">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-900">
                    VILS <span className="text-[#d84e55]">BUS.COM</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">e-Ticket Delivery</span>
                </div>

                <p className="text-slate-700">
                  Dear <strong>{booking.customerName}</strong>,
                </p>
                <p className="text-slate-600">
                  Your ticket with PNR <strong className="text-red-600">{booking.pnr}</strong> has been confirmed. Below are your travel details:
                </p>

                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                  <p><strong>Operator:</strong> {booking.operatorName} ({booking.busType})</p>
                  <p><strong>Route:</strong> {booking.fromCity} ➔ {booking.toCity}</p>
                  <p><strong>Departure:</strong> {booking.departureTime} on {booking.journeyDate}</p>
                  <p><strong>Boarding:</strong> {booking.boardingPoint?.name}</p>
                  <p><strong>Seats:</strong> {booking.passengers.map(p => p.seatNo).join(', ')}</p>
                  <p><strong>Total Fare:</strong> ₹{booking.totalAmount}</p>
                </div>

                <p className="text-[11px] text-slate-400">
                  Have a pleasant journey with VILS BUS.COM!
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendEmail}
                className="px-4 py-2 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Resend to {booking.customerEmail}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
