"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function TermsConditions() {
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
            Terms & <span className="text-yellow-400">Conditions</span>
          </h1>
          <p className="text-gray-500 font-medium">Last updated: June 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using PG Finder, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and truthful information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Property owners must ensure their listings are genuine and updated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Platform Role</h2>
            <p>PG Finder acts purely as a bridge between tenants and property owners. We do not own, manage, or operate any of the properties listed on the website. All rental agreements are strictly between the tenant and the owner.</p>
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