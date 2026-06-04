"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans text-white pt-24 pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 pt-10">
        <div className="mb-12 border-b border-gray-800 pb-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-[#111] mb-6">
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">Legal Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Privacy <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-gray-500 font-medium">Last updated: June 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>At PG Finder, we collect minimal information required to provide you with the best experience. This includes your name, email address, phone number, and preferences when you create an account or save properties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
            <p>Your data is strictly used to connect you with property owners, improve our search algorithms, and send you important updates regarding your bookings or account security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing</h2>
            <p>We do <span className="text-yellow-400 font-bold">not</span> sell your personal data to third parties. Your contact information is only shared with verified PG owners when you explicitly show interest or request a callback.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Security</h2>
            <p>We use industry-standard encryption to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link href="/" className="text-yellow-400 hover:text-white font-bold transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}