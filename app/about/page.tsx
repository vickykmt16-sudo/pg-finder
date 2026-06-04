"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans text-white pt-24 pb-20">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>
      
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 xl:px-24 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 pt-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-[#111] mb-6 shadow-sm">
            <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Changing the way you find <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Your Second Home</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            PG Finder was built with a simple mission: to eliminate the hassle, brokers, and fake photos from the process of finding a safe and comfortable PG or Hostel.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl hover:border-yellow-400/30 transition-colors">
            <span className="text-5xl mb-6 block">🎯</span>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              We want to empower students and working professionals to directly connect with verified property owners. No middleman, no hidden fees, and absolute transparency in every listing.
            </p>
          </div>
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl hover:border-yellow-400/30 transition-colors">
            <span className="text-5xl mb-6 block">👁️</span>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-gray-400 leading-relaxed">
              To become India's most trusted platform for student housing and co-living spaces, ensuring that every individual finds a place that feels just like home.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why We Stand Out</h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center text-4xl mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Verification</h3>
              <p className="text-gray-400 text-sm text-center">Every property goes through a strict quality check before going live.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center text-4xl mb-4">
                💸
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Zero Brokerage</h3>
              <p className="text-gray-400 text-sm text-center">Direct contact with owners means you save thousands on agent fees.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center text-4xl mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Student First</h3>
              <p className="text-gray-400 text-sm text-center">Built for students, by understanding the real challenges of moving to a new city.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-yellow-400 rounded-3xl p-10 md:p-16 text-center shadow-[0_0_50px_rgba(250,204,21,0.2)] text-black relative overflow-hidden group">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to find your perfect stay?</h2>
            <p className="text-black/80 text-lg font-medium mb-8">
              Join thousands of students who have already found their ideal PG through our platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/search" className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
                Start Searching
              </Link>
              <Link href="/support" className="bg-transparent hover:bg-black/10 border-2 border-black text-black px-8 py-4 rounded-xl font-bold text-lg transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}