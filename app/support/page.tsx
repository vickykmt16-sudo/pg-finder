"use client";

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan asali backend API call aayegi future mein
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans text-white">
      
      {/* Background Yellow Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* Navigation Bar */}
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-20">
        
        {/* 👉 YAHAN LAGA HAI BACK BUTTON KA JUGAD */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors font-semibold text-sm bg-[#111] px-5 py-2.5 rounded-xl border border-gray-800 hover:border-yellow-400/50 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Profile
          </Link>
        </div>
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-[#111] mb-4 shadow-sm">
            <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">24/7 Availability</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Help You?</span>
          </h1>
          <p className="text-lg text-gray-400">
            Have a question, need help with a booking, or facing an issue with a PG owner? Our support team is here for you.
          </p>
        </div>

        {/* Support Grid (Left: Form, Right: Contact Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT SIDE: Contact Form */}
          <div className="lg:col-span-2 bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            
            {isSubmitted ? (
              <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-10 animate-in fade-in duration-500">
                <span className="text-6xl mb-4 block">✅</span>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-center px-6">We have received your query. Our support team will get back to you within 2-4 hours.</p>
              </div>
            ) : null}

            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    className="bg-[#111] border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder-gray-600"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="bg-[#111] border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g. Issue with owner / Refund query" 
                  className="bg-[#111] border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder-gray-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe your issue in detail..." 
                  className="bg-[#111] border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder-gray-600 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: Contact Details */}
          <div className="space-y-6">
            
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 hover:border-yellow-400/30 transition-colors group">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📞
              </div>
              <h4 className="text-white font-bold text-lg mb-1">Call Us</h4>
              <p className="text-gray-400 text-sm mb-3">Mon-Sat from 9am to 6pm.</p>
              <a href="tel:+919876543210" className="text-yellow-400 font-bold text-xl hover:underline">
                +91 98765 43210
              </a>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 hover:border-yellow-400/30 transition-colors group">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ✉️
              </div>
              <h4 className="text-white font-bold text-lg mb-1">Email Us</h4>
              <p className="text-gray-400 text-sm mb-3">We'll respond within 24 hours.</p>
              <a href="mailto:support@pgfinder.com" className="text-yellow-400 font-bold hover:underline">
                support@pgfinder.com
              </a>
            </div>

            <div className="bg-yellow-400 rounded-3xl p-8 text-black shadow-[0_0_30px_rgba(250,204,21,0.15)] relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-black text-2xl mb-2">Need Quick Help?</h4>
                <p className="text-black/80 font-medium mb-6 text-sm">Read our frequently asked questions for immediate answers.</p>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors">
                  Visit FAQ Page
                </button>
              </div>
              <div className="absolute -bottom-6 -right-6 text-8xl opacity-10 group-hover:scale-110 transition-transform">
                🤔
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}