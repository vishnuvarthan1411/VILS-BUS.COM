// HelpPage.jsx - FAQs, Emergency SOS, and Customer Assistance
import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, MessageSquare, 
  Phone, Mail, ShieldAlert, Sparkles, Clock, CheckCircle2 
} from 'lucide-react';
import api from '../services/api.js';

export default function HelpPage({ onOpenChatbot }) {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.getFaqs();
        if (res && res.faqs) {
          setFaqs(res.faqs);
        }
      } catch (e) {
        console.error('Error fetching FAQs:', e);
      }
    }
    loadFaqs();
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>VILS Support Center</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How Can We Help You?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Find answers to frequently asked questions or connect with our support team
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* AI Assistant */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#d84e55] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">24/7 AI Chatbot</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant responses for PNR lookups, cancellations, route details, and discounts.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenChatbot}
            className="w-full py-2.5 bg-[#d84e55] hover:bg-[#b83238] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Start Live Chat
          </button>
        </div>

        {/* Toll-Free Calling */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Toll-Free Helpline</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Available 24 hours a day, 7 days a week for immediate assistance.
            </p>
          </div>
          <a
            href="tel:18008457287"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center shadow-xs transition block"
          >
            1800-VILS-BUS
          </a>
        </div>

        {/* Email Support */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Email Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send us booking disputes or corporate inquiries with response in 2 hours.
            </p>
          </div>
          <a
            href="mailto:support@vilsbus.com"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center transition block"
          >
            support@vilsbus.com
          </a>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#d84e55] bg-red-50 px-2 py-0.5 rounded-md">
                      Q{idx + 1}
                    </span>
                    {faq.question}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
