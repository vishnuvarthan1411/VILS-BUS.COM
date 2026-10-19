// Navbar.jsx - Branded VILS BUS.COM navigation bar
import React, { useState } from 'react';
import { Bus, User, LogOut, Ticket, HelpCircle, Tag, ShieldCheck, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ activePage, setActivePage, onOpenChatbot }) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, openProfileModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    if (activePage === 'my-bookings' || activePage === 'admin') {
      setActivePage('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#d84e55] to-[#f87171] flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <Bus className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                VILS <span className="text-[#d84e55]">BUS.COM</span>
              </span>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                India
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-wide">
              Fast, Safe & Confirmed Rides
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activePage === 'home'
                ? 'text-[#d84e55] bg-red-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('search')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activePage === 'search'
                ? 'text-[#d84e55] bg-red-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bus className="w-4 h-4" />
            Bus Tickets
          </button>

          <button
            onClick={() => handleNavClick('offers')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
              activePage === 'offers'
                ? 'text-[#d84e55] bg-red-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-500" />
            Offers
            <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
              New
            </span>
          </button>

          <button
            onClick={() => handleNavClick('help')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activePage === 'help'
                ? 'text-[#d84e55] bg-red-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Help & FAQ
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                handleNavClick('my-bookings');
              }
            }}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activePage === 'my-bookings'
                ? 'text-[#d84e55] bg-red-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            My Bookings
          </button>

          {/* Admin link (if admin or demo test) */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'admin'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Ask AI Assistant Button */}
          <button
            onClick={onOpenChatbot}
            className="px-3 py-2 rounded-full text-xs font-semibold bg-rose-50 text-[#d84e55] border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d84e55] animate-pulse" />
            24/7 Support Assistant
          </button>

          {/* Auth Button or User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-sm font-semibold text-slate-800 transition shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-[#d84e55] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                        Administrator
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfileModal();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleNavClick('my-bookings');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Ticket className="w-4 h-4 text-slate-400" />
                    My Bookings
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleNavClick('admin');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#d84e55] hover:bg-[#b83238] shadow-md shadow-red-500/20 transition hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenChatbot}
            className="p-2 text-[#d84e55] bg-red-50 rounded-lg"
            aria-label="Open Assistant"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Bus className="w-4 h-4 text-[#d84e55]" /> Home
          </button>
          <button
            onClick={() => handleNavClick('search')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Bus className="w-4 h-4 text-[#d84e55]" /> Bus Tickets
          </button>
          <button
            onClick={() => handleNavClick('offers')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Tag className="w-4 h-4 text-amber-500" /> Special Offers
          </button>
          <button
            onClick={() => handleNavClick('help')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <HelpCircle className="w-4 h-4 text-blue-500" /> Help & Support
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
              else handleNavClick('my-bookings');
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Ticket className="w-4 h-4 text-emerald-500" /> My Bookings
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2.5"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Admin Dashboard
            </button>
          )}

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800">{user.name} ({user.email})</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openProfileModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 py-2 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="flex-1 py-2 text-center text-sm font-bold text-white bg-[#d84e55] rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
