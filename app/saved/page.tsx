"use client";

import Link from "next/link";
import { useState } from "react";

// Dummy Saved PGs Data (Baad mein ye Database se aayega)
const dummySavedPGs = [
  {
    id: 1,
    name: "Sunrise Boys Hostel",
    location: "Malviya Nagar, Jaipur",
    rent: "₹ 5,000",
    type: "Boys Only",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Premium Girls Residence",
    location: "Raja Park, Jaipur",
    rent: "₹ 8,500",
    type: "Girls Only",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Urban Co-ed Living",
    location: "Mansarovar, Jaipur",
    rent: "₹ 6,000",
    type: "Co-ed",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e52409818?auto=format&fit=crop&w=500&q=80"
  }
];

export default function SavedPGsPage() {
  // State banayi taaki 'Remove' button par click karte hi PG list se hat jaye
  const [savedList, setSavedList] = useState(dummySavedPGs);

  // PG hatane ka function
  const handleRemove = (id: number) => {
    const updatedList = savedList.filter(pg => pg.id !== id);
    setSavedList(updatedList);
  };

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden pt-28 pb-20 px-4 font-sans text-white">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Button & Title */}
        <div className="mb-10 text-center md:text-left">
          <Link href="/profile" className="inline-flex items-center text-gray-400 hover:text-yellow-400 font-semibold transition-colors mb-4">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center justify-center md:justify-start gap-3">
            ❤️ Saved <span className="text-yellow-400">PGs</span>
          </h1>
          <p className="text-gray-400 mt-2">Your shortlisted properties. Compare and book your favorite one.</p>
        </div>

        {/* Agar list khali ho jaye toh ye dikhega */}
        {savedList.length === 0 ? (
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-12 text-center">
            <span className="text-6xl block mb-4">🥺</span>
            <h2 className="text-2xl font-bold text-white mb-2">No Saved PGs</h2>
            <p className="text-gray-400 mb-6">You haven't saved any properties yet.</p>
            <Link href="/" className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]">
              Browse PGs
            </Link>
          </div>
        ) : (
          /* Grid for PG Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedList.map((pg) => (
              <div key={pg.id} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:border-yellow-400/50 transition-colors group flex flex-col">
                
                {/* PG Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img 
                    src={pg.image} 
                    alt={pg.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700 flex items-center gap-1 text-sm font-bold">
                    <span className="text-yellow-400">⭐</span> {pg.rating}
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">
                    {pg.type}
                  </div>
                </div>

                {/* PG Details */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{pg.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                    <span>📍</span> {pg.location}
                  </p>
                  
                  <div className="text-2xl font-extrabold text-yellow-400 mb-6 mt-auto">
                    {pg.rent} <span className="text-sm text-gray-500 font-medium">/ month</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleRemove(pg.id)}
                      className="border border-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 text-gray-300 py-2.5 rounded-xl font-semibold transition-all text-sm"
                    >
                      Remove
                    </button>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] text-sm">
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}