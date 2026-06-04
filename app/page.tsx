"use client";

import Navbar from '../components/Navbar'; 
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; 
import { supabase } from "@/lib/supabase"; 

export default function Home() {
  const { isSignedIn, user } = useUser();
  const role = user?.unsafeMetadata?.role as string;
  const isStudent = isSignedIn && role === 'student'; 

  const [selectedPG, setSelectedPG] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [savedPGs, setSavedPGs] = useState<number[]>([]);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [givenRating, setGivenRating] = useState(0);

  const [displayPGs, setDisplayPGs] = useState<any[]>([]);
  // 👉 Naya state reviews ko cloud se laakar rakhne ke liye
  const [allSupabaseReviews, setAllSupabaseReviews] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // Hero image state
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80");

  const [searchCity, setSearchCity] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchBudget, setSearchBudget] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  // 👉 DYNAMIC RATING CALCULATOR (UPDATED FOR CLOUD)
  const getDynamicRating = (pgId: number) => {
    // Ab ye localStorage ki jagah state wale reviews use karega
    const currentReviews = allSupabaseReviews.filter((rev: any) => rev.pg_id === pgId);
    if (currentReviews.length === 0) return "New 🆕";
    const sum = currentReviews.reduce((total: number, r: any) => total + parseFloat(r.rating), 0);
    return `⭐ ${(sum / currentReviews.length).toFixed(1)}`;
  };

  useEffect(() => {
    // Keep saved PGs logic (separate feature for now)
    const storedSaved = localStorage.getItem('savedPGs');
    if (storedSaved) {
      setSavedPGs(JSON.parse(storedSaved));
    }

    // 👉 LOAD INITIAL DATA FROM CLOUD (PGs + Reviews)
    const loadInitialData = async () => {
      setLoading(true);
      
      // 1. Fetch PGs
      const { data: pgData } = await supabase
        .from('pg_properties')
        .select('*')
        .eq('status', 'Approved')
        .eq('isFeatured', true);

      if (pgData) setDisplayPGs(pgData);

      // 2. Fetch ALL Reviews
      const { data: reviewData } = await supabase
        .from('pg_reviews')
        .select('*');
      
      if (reviewData) setAllSupabaseReviews(reviewData);

      setLoading(false);
    };
    
    loadInitialData();

    const storedHeroImage = localStorage.getItem('heroImage');
    if (storedHeroImage) {
      setHeroImage(storedHeroImage);
    }
  }, []);

  const toggleSave = (pgId: number) => {
    let updatedSaved;
    let msg = "";
    if (savedPGs.includes(pgId)) {
      updatedSaved = savedPGs.filter(id => id !== pgId);
      msg = "🤍 Removed from Wishlist";
    } else {
      updatedSaved = [...savedPGs, pgId];
      msg = "❤️ PG Saved successfully!";
    }
    setSavedPGs(updatedSaved);
    localStorage.setItem('savedPGs', JSON.stringify(updatedSaved));
    setToast({ visible: true, message: msg });
    setTimeout(() => { setToast({ visible: false, message: "" }); }, 3000); 
  };

  const openPopup = (pg: any) => {
    setSelectedPG(pg);
    setCurrentImageIndex(0); 
  };

  const closePopup = () => {
    setSelectedPG(null);
    setGivenRating(0);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedPG && selectedPG.images) {
      setCurrentImageIndex((prev) => (prev === selectedPG.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (selectedPG && selectedPG.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedPG.images.length - 1 : prev - 1));
    }
  };

  const handleContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // 👉 RATE LOGIC UPDATED FOR CLOUD (Submits to Supabase)
  const handleRate = async (rating: number) => {
    if (!isSignedIn || !isStudent) {
      setToast({ visible: true, message: "❌ Only logged-in students can rate." });
      setTimeout(() => setToast({ visible: false, message: "" }), 3000);
      return;
    }

    setGivenRating(rating);
    
    if (selectedPG) {
      // Supabase me submit karne ka data structure
      const newReview = {
        pg_id: selectedPG.id, // table col name
        student_name: user?.fullName || "Student", // table col name
        rating: rating,
        comment: "Quick Home Rating"
      };

      // Submit to Supabase
      const { error } = await supabase
        .from('pg_reviews')
        .insert([newReview]);

      if (error) {
        console.error("Rating Error:", error);
        setToast({ visible: true, message: `❌ Error submitting rating.` });
      } else {
        setToast({ visible: true, message: `⭐ You rated this PG ${rating} stars!` });
        
        // Optional: State update taaki ratings turant update ho jaye bina refresh ke
        setAllSupabaseReviews(prev => [newReview, ...prev]);
      }
      setTimeout(() => { setToast({ visible: false, message: "" }); }, 3000);
    }
  };

  const handleSearch = async () => {
    if (!searchCity && !searchLocation && !searchBudget) return;

    const { data } = await supabase
      .from('pg_properties')
      .select('*')
      .eq('status', 'Approved');

    if (data) {
      const filtered = data.filter((pg: any) => {
        let match = true;
        if (searchCity) match = match && pg.location?.toLowerCase().includes(searchCity.toLowerCase());
        if (searchLocation) match = match && (pg.name?.toLowerCase().includes(searchLocation.toLowerCase()) || pg.location?.toLowerCase().includes(searchLocation.toLowerCase()));
        if (searchBudget) {
          const pgPrice = parseInt(pg.price.replace(/[^0-9]/g, ''));
          const userBudget = parseInt(searchBudget);
          match = match && pgPrice <= userBudget;
        }
        return match;
      });

      setDisplayPGs(filtered);
      setIsSearched(true);
      document.getElementById('pg-results-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = async () => {
    setSearchCity("");
    setSearchLocation("");
    setSearchBudget("");
    
    const { data } = await supabase
      .from('pg_properties')
      .select('*')
      .eq('status', 'Approved')
      .eq('isFeatured', true);

    if (data) {
      setDisplayPGs(data);
    } else {
      setDisplayPGs([]);
    }
    setIsSearched(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans text-white">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-[40%] right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3"></div>

      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 lg:px-16 xl:px-24 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 w-fit mx-auto lg:mx-0 mb-6 shadow-sm">
              <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">⭐ Premium Living Spaces</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-black text-white leading-[1.05] mb-6 tracking-tight">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
                Perfect PG in Sikar
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover verified PGs and hostels. Search by your preferred city, location, and budget to find your perfect space with zero brokerage.
            </p>

            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-full p-1.5 md:p-2 shadow-2xl flex flex-row items-center w-full max-w-3xl transition-all hover:border-gray-700 mx-auto lg:mx-0">
              <div className="flex-1 flex flex-col px-3 md:px-6 border-r border-gray-800 w-full overflow-hidden text-left">
                <label className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 truncate">City</label>
                <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="Jaipur" className="bg-transparent border-none outline-none text-white text-[10px] md:text-sm w-full placeholder-gray-600 font-medium p-0 truncate" />
              </div>
              <div className="flex-1 flex flex-col px-3 md:px-6 border-r border-gray-800 w-full overflow-hidden text-left">
                <label className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 truncate">Location</label>
                <input type="text" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="Malviya.." className="bg-transparent border-none outline-none text-white text-[10px] md:text-sm w-full placeholder-gray-600 font-medium p-0 truncate" />
              </div>
              <div className="flex-1 flex flex-col px-3 md:px-6 pr-2 w-full overflow-hidden text-left">
                <label className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 truncate">Budget</label>
                <input type="number" value={searchBudget} onChange={(e) => setSearchBudget(e.target.value)} placeholder="₹8000" className="bg-transparent border-none outline-none text-white text-[10px] md:text-sm w-full placeholder-gray-600 font-medium p-0 truncate" />
              </div>
              <button 
                onClick={isSearched ? clearSearch : handleSearch}
                className={`w-10 h-10 md:w-auto md:h-14 rounded-full flex items-center justify-center gap-2 transition-all flex-shrink-0 font-bold md:px-8 ${
                  isSearched 
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                    : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                }`}
              >
                {isSearched ? (
                  <>
                    <span className="block md:hidden text-lg">✕</span>
                    <span className="hidden md:block">Clear Filter</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5 font-bold block md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <svg className="w-5 h-5 font-bold hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span className="hidden md:block">Search</span>
                  </>
                )}
              </button>
            </div>

          </div>

          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[650px] flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
            <div className="relative w-full max-w-[550px] h-full lg:h-[550px] rounded-[30px] overflow-hidden border border-[#262626] shadow-2xl z-10 group">
              <img src={heroImage} alt="Premium PG Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
            </div>
            <div className="absolute bottom-6 sm:bottom-10 -left-2 sm:-left-4 lg:-left-12 bg-[#0a0a0a]/90 backdrop-blur-xl border border-gray-800 p-3 sm:p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-xl sm:text-2xl">🛡️</div>
              <div><p className="text-white font-bold text-xs sm:text-sm">100% Verified</p><p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Safe & Secure</p></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-yellow-500/10 rounded-[40px] -z-10 rotate-3"></div>
          </div>
        </div>
      </div>

      {/* ================= WHY CHOOSE US ================= */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-16 xl:px-24 py-20 border-t border-[#1a1a1a] bg-[#050505]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-[#111] mb-4">
            <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">Our Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Why Choose <span className="text-yellow-400">PG Finder?</span></h2>
          <p className="text-gray-400 text-lg">We make finding your perfect home easy, secure, and completely free of hidden charges.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all duration-300 group shadow-lg">
            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">100% Verified PGs</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Every property on our platform goes through a strict physical verification process.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all duration-300 group shadow-lg">
            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💸</div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">Zero Brokerage</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Connect directly with property owners and avoid paying unnecessary middleman fees.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all duration-300 group shadow-lg">
            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">Smart Search</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Use our advanced filters to find PGs by budget, AC/Non-AC, food availability, and exact location.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all duration-300 group shadow-lg">
            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🎧</div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">24/7 Support</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Got an issue with your booking or the owner? Our dedicated support team is available round the clock.</p>
          </div>
        </div>
      </div>

      {/* ================= FEATURED PGs SECTION ================= */}
      <div id="pg-results-section" className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-16 xl:px-24 py-24 border-t border-[#1a1a1a] bg-[#050505]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-[#111] mb-4">
              <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">
                {isSearched ? "Search Results" : "Top Rated"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-2">
              {isSearched ? `Found ${displayPGs.length} ` : "Featured "}<span className="text-yellow-400">Properties</span>
            </h2>
            <p className="text-gray-400 text-lg">
              {isSearched ? "Based on your search filters." : "Handpicked properties with the best ratings and amenities."}
            </p>
          </div>
          {!isSearched && (
            <Link href="/search" className="px-6 py-3 bg-[#111] border border-gray-700 hover:border-yellow-400 text-white hover:text-yellow-400 rounded-xl font-bold transition-all whitespace-nowrap">
              View All Properties ➔
            </Link>
          )}
        </div>

        {displayPGs.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-16 text-center">
            <span className="text-6xl mb-4 block">🧐</span>
            <h3 className="text-2xl font-bold text-white mb-2">No Properties Found</h3>
            <p className="text-gray-400 mb-6">No properties are currently featured on the Home page.</p>
            <button onClick={clearSearch} className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold transition-colors">
              Clear Search & Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                // Simple loading placeholder
                [1,2,3].map(i => (
                    <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl h-96 animate-pulse"></div>
                ))
            ) : (
                displayPGs.map((pg) => (
                    <div key={pg.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl overflow-hidden group hover:border-yellow-400/50 transition-all duration-300 flex flex-col">
                      <div className="relative h-60 w-full overflow-hidden">
                        <img src={pg.image || pg.image_url || pg.images?.[0]} alt={pg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        
                        {/* 👉 DYNAMIC REAL RATING */}
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-1.5 text-sm font-black text-yellow-400 shadow-lg">
                          {getDynamicRating(pg.id)}
                        </div>
                        
                        <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg">
                          {pg.type}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold border border-gray-700">
                          1/{pg.images ? pg.images.length : 1} 📷
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{pg.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 flex items-center gap-1.5">
                          <span className="text-lg">📍</span> {pg.location}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {pg.facilities?.map((facility: string, index: number) => (
                            <span key={index} className="bg-[#111] border border-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300">
                              {facility}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-800/80">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-0.5 uppercase tracking-wider">Starting at</p>
                            <p className="text-2xl font-black text-yellow-400">{pg.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => toggleSave(pg.id)} title={savedPGs.includes(pg.id) ? "Remove from Wishlist" : "Add to Wishlist"} className={`flex items-center justify-center w-11 h-11 border rounded-xl transition-all text-xl ${savedPGs.includes(pg.id) ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-400 hover:border-red-400 hover:text-red-400 bg-[#111]'}`}>
                              {savedPGs.includes(pg.id) ? '❤️' : '🤍'}
                            </button>
                            <button onClick={() => openPopup(pg)} className="bg-white hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
            )}
          </div>
        )}
      </div>

      {/* ================= REGISTER NOW (CTA) SECTION ================= */}
      {!isSignedIn && (
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-20 pb-32 border-t border-[#1a1a1a] bg-[#050505]">
          <div className="relative rounded-[2rem] md:rounded-[3rem] p-[1px] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-600/30 group-hover:from-yellow-400/60 group-hover:to-yellow-600/60 transition-all duration-700 rounded-[2rem] md:rounded-[3rem]"></div>
            <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 md:p-20 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-500/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none group-hover:bg-yellow-400/20 transition-all duration-700 translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-orange-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-all duration-700 -translate-x-1/4 translate-y-1/4"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="max-w-3xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 mb-4 md:mb-6 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span className="text-yellow-400 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">Join The Elite Community</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-white mb-4 md:mb-6 tracking-tighter leading-[1.1]">Elevate your <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">Living Experience.</span></h2>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">Unlock exclusive access to premium PGs, zero-brokerage deals, and a seamless booking experience. Your perfect space is just one click away.</p>
                </div>
                
                {/* 👉 FIXED CTA BUTTON FOR MOBILE */}
                <div className="flex flex-col items-center flex-shrink-0 mt-4 lg:mt-0 w-full md:w-auto">
                  <div className="relative group/btn w-full md:w-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-40 group-hover/btn:opacity-70 transition duration-500"></div>
                    <Link href="/signup" className="relative flex items-center justify-center gap-2 md:gap-3 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3.5 md:px-10 md:py-5 rounded-full font-black text-base md:text-xl transition-all hover:-translate-y-1 whitespace-nowrap w-full md:w-auto">
                      <span>Create Free Account</span>
                      <svg className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-1 md:group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                  </div>
                  <p className="text-gray-500 text-[10px] md:text-sm mt-3 md:mt-5 font-semibold uppercase tracking-widest text-center">Takes only 30 seconds</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PG DETAILS MODAL (POPUP) ================= */}
      {selectedPG && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm bg-black/80 transition-opacity">
          <div className="absolute inset-0" onClick={closePopup}></div>
          <div className="relative bg-[#111111] border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button onClick={closePopup} className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            <div className="w-full md:w-1/2 h-64 md:h-auto relative flex-shrink-0 group">
              <img src={selectedPG.images?.[currentImageIndex] || selectedPG.image_url || selectedPG.image} alt={`${selectedPG.name} - image`} className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none transition-opacity duration-300" />
              <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-bold text-xs uppercase shadow-lg">{selectedPG.type} Allowed</div>
              {selectedPG.images && selectedPG.images.length > 0 && (
                <div className="absolute top-4 right-16 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-bold text-xs uppercase shadow-lg border border-gray-700">{currentImageIndex + 1} / {selectedPG.images.length}</div>
              )}
              {selectedPG.images && selectedPG.images.length > 1 && (
                <><button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-yellow-400 hover:text-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm border border-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg></button><button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-yellow-400 hover:text-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm border border-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7-7"></path></svg></button></>
              )}
              {selectedPG.images && selectedPG.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{selectedPG.images.map((_: any, idx: number) => (<button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-yellow-400 w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`} />))}</div>
              )}
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#222] border border-gray-700 text-yellow-400 px-2 py-1 rounded text-xs font-bold">{getDynamicRating(selectedPG.id)} Rated</span>
                  <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">✅ Verified</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{selectedPG.name}</h2><p className="text-gray-400 text-sm mb-6 flex items-center gap-2">📍 {selectedPG.location}</p>
                <div className="mb-6"><h4 className="text-white font-bold mb-3 border-b border-gray-800 pb-2">Amenities Provided</h4><div className="flex flex-wrap gap-2">{selectedPG.facilities?.map((fac: string, i: number) => (<span key={i} className="bg-[#1a1a1a] border border-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-300">{fac}</span>))}</div></div>
                <div className="mb-8"><h4 className="text-white font-bold mb-2">About Property</h4><p className="text-gray-400 text-sm leading-relaxed">{selectedPG.description || "Premium PG offering all basic amenities."}</p></div>
              </div>
              <div>
                <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-2xl mb-4"><div className="flex justify-between items-center mb-4"><div><p className="text-xs text-gray-500 font-semibold uppercase">Monthly Rent</p><p className="text-2xl font-black text-yellow-400">{selectedPG.price}</p></div><div className="text-right"><p className="text-xs text-gray-500 font-semibold uppercase">Owner</p><p className="text-white font-bold text-sm">{selectedPG.owner_name || selectedPG.owner}</p></div></div><div className="flex"><button onClick={() => handleContact(selectedPG.phone)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">📞 Call Owner</button></div></div>
                <div className="pt-4 border-t border-gray-800"><h4 className="text-white font-bold mb-2 text-sm">Rate this PG</h4>{isStudent ? (<div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)} onClick={() => handleRate(star)} className={`text-2xl transition-colors ${star <= (hoveredStar || givenRating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</button>))}<span className="text-xs text-gray-400 ml-2">(Click to rate)</span></div>) : (<p className="text-xs text-gray-400 bg-gray-800/50 p-2.5 rounded-lg border border-gray-800 inline-block">🎓 Only logged-in students can rate properties.</p>)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.visible && (
        <div className="fixed bottom-10 right-10 z-[200] bg-[#111111] border border-gray-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce"><span className="font-bold">{toast.message}</span></div>
      )}

      {/* ================= PREMIUM FOOTER SECTION ================= */}
      <footer className="relative z-10 w-full bg-[#050505] pt-20 pb-10 border-t border-gray-800/50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-4 pr-0 lg:pr-8">
              <Link href="/" className="text-3xl font-black text-white tracking-tighter inline-block mb-6">PG<span className="text-yellow-400">FINDER</span></Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">India's most trusted platform to find premium, verified, and zero-brokerage PGs and Hostels. Your perfect second home is just a click away.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-400 transition-all duration-300"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-400 transition-all duration-300"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-400 transition-all duration-300"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
              </div>
            </div>
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link href="/search" className="text-gray-400 hover:text-yellow-400 hover:translate-x-1 inline-block transition-all text-sm font-medium">All Properties</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-yellow-400 hover:translate-x-1 inline-block transition-all text-sm font-medium">About Us</Link></li>
                <li><Link href="/add-pg" className="text-gray-400 hover:text-yellow-400 hover:translate-x-1 inline-block transition-all text-sm font-medium">List Your Property</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="text-gray-400 hover:text-yellow-400 hover:translate-x-1 inline-block transition-all text-sm font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-yellow-400 hover:translate-x-1 inline-block transition-all text-sm font-medium">Terms & Conditions</Link></li>
                <li><Link href="/brokerage" className="text-gray-400 hover:text-yellow-400 hover:translate-x-1 inline-block transition-all text-sm font-medium">Brokerage Guidelines</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-3">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Have Questions?</h4>
              <ul className="space-y-5">
                <li><a href="tel:+917229880063" className="flex items-center gap-4 group"><div className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div><div><p className="text-gray-500 text-xs font-semibold mb-0.5 uppercase tracking-wider">Call Us</p><p className="text-gray-300 group-hover:text-yellow-400 transition-colors text-sm font-medium">+91 7229880063</p></div></a></li>
                <li><a href="mailto:vickykmt16@gmail.com" className="flex items-center gap-4 group"><div className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"></path></svg></div><div><p className="text-gray-500 text-xs font-semibold mb-0.5 uppercase tracking-wider">Email Support</p><p className="text-gray-300 group-hover:text-yellow-400 transition-colors text-sm font-medium">vickykmt16@gmail.com</p></div></a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"><p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} PG Finder. All rights reserved.</p><p className="text-gray-500 text-sm font-medium flex items-center justify-center gap-1.5">Made with <span className="text-red-500 animate-pulse text-lg">❤</span> in India</p></div>
        </div>
      </footer>
    </main>
  );
}