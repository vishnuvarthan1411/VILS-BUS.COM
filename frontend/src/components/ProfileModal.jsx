// ProfileModal.jsx - User Profile Management Modal
import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Shield, Calendar, Loader2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfileModal() {
  const { user, isProfileModalOpen, closeProfileModal, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({ name, phone });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={closeProfileModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#d84e55] text-white flex items-center justify-center text-xl font-black">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                {user.role === 'admin' ? 'Administrator' : 'Verified Traveler'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed once verified.</p>
          </div>

          {user.createdAt && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={closeProfileModal}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#d84e55] hover:bg-[#b83238] text-white text-sm font-bold rounded-xl shadow-md shadow-red-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
