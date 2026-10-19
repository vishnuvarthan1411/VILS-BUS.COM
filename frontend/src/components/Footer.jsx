// Footer.jsx - Branded VILS BUS.COM footer component
import React from 'react';
import { Bus, ShieldCheck, Clock, Headphones, Award, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleRouteClick = (from, to) => {
    setActivePage('search');
    window.dispatchEvent(new CustomEvent('vils_route_search', { detail: { from, to } }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#d84e55] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Safe & Confirmed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time inventory and instant PNR generation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#d84e55] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">10-Min Live Seat Hold</h4>
              <p className="text-xs text-slate-400 mt-0.5">Guaranteed lock while you enter passenger details</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#d84e55] flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">24x7 Customer Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated AI assistant and toll-free helpline</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#d84e55] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Best Price Guaranteed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Zero booking fee and verified partner coupons</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-slate-800 text-sm">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#d84e55] flex items-center justify-center text-white font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                VILS <span className="text-[#d84e55]">BUS.COM</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              VILS BUS.COM is India's next-generation bus ticketing platform. Book AC Sleepers, Volvo multi-axle buses, and express interstate coaches with real-time seat tracking and verified passenger reviews.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-1">Customer Helpline:</span>
              <span className="text-sm font-bold text-red-400 font-mono">1800-VILS-BUS (1800-845-7287)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActivePage('home'); window.scrollTo(0,0); }} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('search'); window.scrollTo(0,0); }} className="hover:text-white transition">
                  Book Bus Tickets
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('offers'); window.scrollTo(0,0); }} className="hover:text-white transition">
                  Special Offers & Coupons
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('my-bookings'); window.scrollTo(0,0); }} className="hover:text-white transition">
                  My Bookings
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('help'); window.scrollTo(0,0); }} className="hover:text-white transition">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Popular Routes</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleRouteClick('Bengaluru', 'Chennai')} className="hover:text-white transition text-left">
                  Bengaluru ➔ Chennai
                </button>
              </li>
              <li>
                <button onClick={() => handleRouteClick('Bengaluru', 'Hyderabad')} className="hover:text-white transition text-left">
                  Bengaluru ➔ Hyderabad
                </button>
              </li>
              <li>
                <button onClick={() => handleRouteClick('Mumbai', 'Pune')} className="hover:text-white transition text-left">
                  Mumbai ➔ Pune
                </button>
              </li>
              <li>
                <button onClick={() => handleRouteClick('Delhi', 'Jaipur')} className="hover:text-white transition text-left">
                  Delhi ➔ Jaipur
                </button>
              </li>
              <li>
                <button onClick={() => handleRouteClick('Bengaluru', 'Coimbatore')} className="hover:text-white transition text-left">
                  Bengaluru ➔ Coimbatore
                </button>
              </li>
            </ul>
          </div>

          {/* Top Operators */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Top Bus Operators</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>VILS Express Platinum</li>
              <li>IntrCity SmartBus</li>
              <li>Orange Tours and Travels</li>
              <li>SRS Travels</li>
              <li>VRL Logistics</li>
              <li>KPN Travels</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Security */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 <strong className="text-white">VILS BUS.COM</strong>. All Rights Reserved. Built with precision and care.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded">256-bit SSL Secure</span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded">Mock Payment Sandbox</span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded">ISO 27001 Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
