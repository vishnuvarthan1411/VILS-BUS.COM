// AuthModal.jsx - Accessible Login & Registration Modal with quick demo fills
import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Bus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(formData);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    setFormData({
      name: 'Vishnu Vils',
      email: 'demo@vilsbus.com',
      phone: '+91 91234 56789',
      password: 'password123'
    });
    setErrorMsg('');
  };

  const fillDemoAdmin = () => {
    setFormData({
      name: 'Admin VILS BUS',
      email: 'admin@vilsbus.com',
      phone: '+91 98765 43210',
      password: 'admin123'
    });
    setErrorMsg('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#d84e55] to-[#f87171] p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white text-[#d84e55] flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-wide">VILS BUS.COM</span>
          </div>

          <h2 id="auth-modal-title" className="text-xl font-black text-white">
            {authModalMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {authModalMode === 'login'
              ? 'Access your bookings, saved passengers & discounts'
              : 'Join millions of travelers booking tickets easily'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-sm font-bold">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-white text-[#d84e55] border-b-2 border-[#d84e55]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-white text-[#d84e55] border-b-2 border-[#d84e55]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#d84e55] hover:bg-[#b83238] text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/25 transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{authModalMode === 'login' ? 'Log In' : 'Create Free Account'}</span>
            )}
          </button>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 text-center mb-2">
              ⚡ Quick Fill Demo Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition text-center cursor-pointer"
              >
                Demo Passenger
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition text-center cursor-pointer"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
