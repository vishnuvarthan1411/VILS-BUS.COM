// Chatbot.jsx - Branded VILS BUS.COM 24/7 Support Assistant
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api.js';

export default function Chatbot({ isOpen, onClose, onOpenTicket }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hello! Welcome to **VILS BUS.COM** Support Assistant.\n\nI can help you check your live PNR status, view active discount coupons, guide you through seat booking, or explain our cancellation & refund policies. How can I assist you today?",
      suggestions: ['Check PNR Status', 'Show Promo Codes', 'Cancellation Policy', 'How does Seat Hold work?']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend = null) => {
    const text = messageToSend || inputText;
    if (!text.trim() || loading) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    if (!messageToSend) setInputText('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(text);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          suggestions: res.suggestions || [],
          quickData: res.quickData || null
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm having a slight trouble reaching the support service right now. Please try again or call our toll-free helpline at **1800-VILS-BUS**.",
          suggestions: ['Retry', 'Toll Free Number']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] animate-in slide-in-from-bottom-6 duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#d84e55] to-[#f87171] p-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wide flex items-center gap-1.5">
              VILS BUS.COM <span className="text-[10px] bg-white/20 font-medium px-1.5 py-0.2 rounded-full">AI Support</span>
            </h3>
            <p className="text-[11px] text-white/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Online & Ready to Help
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition cursor-pointer"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[85%]">
              {m.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-[#d84e55] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  V
                </div>
              )}

              <div
                className={`p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-[#d84e55] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-normal">
                  {m.text}
                </div>

                {/* Quick Booking card if PNR was returned */}
                {m.quickData && m.quickData.type === 'booking' && (
                  <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                    <p className="font-bold text-[#d84e55] text-xs">Booking Verified</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      PNR: <strong>{m.quickData.booking.pnr}</strong>
                    </p>
                    <button
                      onClick={() => onOpenTicket && onOpenTicket(m.quickData.booking)}
                      className="mt-2 text-[11px] font-bold text-white bg-[#d84e55] px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-[#b83238] transition cursor-pointer"
                    >
                      View Ticket <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Suggestions */}
            {m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                {m.suggestions.map((s, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSend(s)}
                    className="text-[11px] bg-white border border-slate-200 text-slate-700 hover:border-red-400 hover:text-[#d84e55] px-2.5 py-1 rounded-full transition shadow-xs cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic ml-8">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d84e55]" />
            <span>VILS Assistant is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question or enter PNR..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="w-8 h-8 rounded-xl bg-[#d84e55] hover:bg-[#b83238] text-white flex items-center justify-center transition disabled:opacity-50 cursor-pointer shrink-0 shadow-xs"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
