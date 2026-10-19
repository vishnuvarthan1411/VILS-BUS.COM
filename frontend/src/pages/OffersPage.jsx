// OffersPage.jsx - Full Offers and Promotions Catalog
import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Clock, ShieldCheck, Bus, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function OffersPage({ onBookWithOffer }) {
  const { showToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await api.getOffers();
        if (res && res.offers) {
          setOffers(res.offers);
        }
      } catch (err) {
        console.error('Fetch offers error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Code '${code}' copied! Apply at checkout.`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84e55] text-xs font-bold border border-rose-200">
          <Tag className="w-3.5 h-3.5" />
          <span>Verified Promo Codes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Exclusive Bus Discounts & Offers
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Save on your intercity travel with VILS BUS.COM verified discount coupons.
        </p>
      </div>

      {loading && (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-[#d84e55] animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading active promo coupons...</p>
        </div>
      )}

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && offers.map(offer => (
          <div
            key={offer.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Top colored strip */}
            <div 
              className="h-3 w-full"
              style={{ backgroundColor: offer.color || '#d84e55' }}
            ></div>

            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span 
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: offer.color || '#d84e55' }}
                >
                  {offer.badge}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Till {offer.validTill}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-[#d84e55] transition">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs space-y-1">
                <p className="text-slate-600">
                  • Minimum Booking: <strong>₹{offer.minBookingAmount}</strong>
                </p>
                {offer.maxDiscount && (
                  <p className="text-slate-600">
                    • Maximum Discount: <strong>₹{offer.maxDiscount}</strong>
                  </p>
                )}
                <p className="text-slate-600">
                  • Valid on AC Sleeper, Semi-Sleeper, and Express
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                  {offer.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="p-2 text-slate-500 hover:text-[#d84e55] bg-slate-100 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode === offer.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => onBookWithOffer(offer.code)}
                className="px-4 py-2 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
