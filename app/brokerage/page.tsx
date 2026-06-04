"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function BrokerageGuidelines() {
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
            Brokerage <span className="text-yellow-400">Guidelines</span>
          </h1>
          <p className="text-gray-500 font-medium">Last updated: June 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <section>
            <div className="bg-yellow-400/10 border border-yellow-400/20 p-6 rounded-2xl mb-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Zero Brokerage Policy</h3>
              <p className="text-gray-300 text-sm">PG Finder is strictly a ZERO BROKERAGE platform. We do not charge tenants any commission or brokerage fee for finding a property.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. For Tenants</h2>
            <p>If any owner or individual posing as an owner demands a "brokerage fee," "visiting charge," or "registration fee" before showing the property, please decline and report the listing immediately via our Support page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. For Brokers/Agents</h2>
            <p>Brokers and real estate agents are strictly prohibited from listing properties on PG Finder. If we detect a listing managed by a broker asking for commission, the account will be permanently banned without notice.</p>
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