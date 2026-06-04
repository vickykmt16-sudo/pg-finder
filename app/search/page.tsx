"use client";

import Navbar from '@/components/Navbar'; 
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; 

export default function SearchPage() {
  const { isSignedIn, user } = useUser();
  const role = user?.unsafeMetadata?.role as string;
  const isStudent = isSignedIn && role === 'student'; 

  const [selectedPG, setSelectedPG] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [savedPGs, setSavedPGs] = useState<number[]>([]);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [givenRating, setGivenRating] = useState(0);

  // 👉 SYSTEM STATES
  const [displayPGs, setDisplayPGs] = useState<any[]>([]);
  const [allApprovedPGs, setAllApprovedPGs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search States
  const [searchCity, setSearchCity] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchBudget, setSearchBudget] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  // 👉 DYNAMIC RATING CALCULATOR
  const getDynamicRating = (pgId: number) => {
    const allReviews = JSON.parse(localStorage.getItem('pgReviews') || "[]");
    const currentReviews = allReviews.filter((rev: any) => rev.pgId === pgId);
    if (currentReviews.length === 0) return "New 🆕";
    const sum = currentReviews.reduce((total: number, r: any) => total + parseFloat(r.rating), 0);
    return `⭐ ${(sum / currentReviews.length).toFixed(1)}`;
  };

  // 👉 LOAD FROM CENTRAL SYSTEM ('pg_properties')
  useEffect(() => {
    setLoading(true);
    const storedSaved = localStorage.getItem('savedPGs');
    if (storedSaved) {
      setSavedPGs(JSON.parse(storedSaved));
    }

    const allProperties = JSON.parse(localStorage.getItem('pg_properties') || "[]");
    // Yahan hum saare APPROVED PGs filter karke nikalenge
    const liveProperties = allProperties.filter((pg: any) => pg.status === "Approved");
    
    setAllApprovedPGs(liveProperties);
    setDisplayPGs(liveProperties);
    setLoading(false);
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

  // 👉 SAVING RATING IN SYSTEM TO MAKE IT DYNAMIC
  const handleRate = (rating: number) => {
    setGivenRating(rating);
    if (!selectedPG) return;

    const existingReviews = JSON.parse(localStorage.getItem('pgReviews') || "[]");
    const newReview = {
      pgId: selectedPG.id,
      studentName: user?.fullName || "Student",
      rating: rating,
      comment: "Quick Rating"
    };
    
    localStorage.setItem('pgReviews', JSON.stringify([newReview, ...existingReviews]));

    setToast({ visible: true, message: `⭐ You rated this PG ${rating} stars! Score updated.` });
    setTimeout(() => { setToast({ visible: false, message: "" }); }, 3000);
  };

  const handleSearch = () => {
    if (!searchCity && !searchLocation && !searchBudget) return;

    const filtered = allApprovedPGs.filter((pg: any) => {
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
  };

  const clearSearch = () => {
    setSearchCity("");
    setSearchLocation("");
    setSearchBudget("");
    setDisplayPGs(allApprovedPGs); 
    setIsSearched(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans text-white pb-20">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      
      <Navbar />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-32">
        
        {/* HEADER SECTION */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            Explore <span className="text-yellow-400">All Properties</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto md:mx-0">
            Browse through our complete list of verified PGs and Hostels. Use the filters below to find exactly what you are looking for.
          </p>
        </div>


        {/* 👉 FIXED SEARCH BAR FOR MOBILE (Single Horizontal Line - Same as Home Page) */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-full p-1.5 md:p-2 shadow-2xl flex flex-row items-center w-full mb-12 transition-all hover:border-gray-700">
          <div className="flex-1 flex flex-col px-3 md:px-6 border-r border-gray-800 w-full overflow-hidden text-left">
            <label className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 truncate">City</label>
            <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="Jaipur" className="bg-transparent border-none outline-none text-white text-[10px] md:text-sm w-full placeholder-gray-600 font-medium p-0 truncate" />
          </div>
          <div className="flex-1 flex flex-col px-3 md:px-6 border-r border-gray-800 w-full overflow-hidden text-left">
            <label className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 truncate">Location / Name</label>
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

        {/* RESULTS SECTION */}
        {loading ? (
          <div className="text-center py-20 text-yellow-400 font-bold animate-pulse">Loading Live Properties...</div>
        ) : displayPGs.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-10 md:p-16 text-center">
            <span className="text-5xl md:text-6xl mb-4 block">🧐</span>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Properties Found</h3>
            <p className="text-gray-400 mb-6 text-sm md:text-base">We couldn't find any PGs right now. Wait for admin approvals or clear filters.</p>
            {isSearched && (
              <button onClick={clearSearch} className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold">Clear Search</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayPGs.map((pg) => (
              <div key={pg.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl overflow-hidden flex flex-col hover:border-yellow-400/50 transition-colors">
                <div className="relative h-56 w-full">
                  <img src={pg.image || pg.image_url || pg.images?.[0]} alt={pg.name} className="w-full h-full object-cover" />
                  
                  {/* REAL DYNAMIC RATING */}
                  <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 rounded-lg border border-gray-700 flex gap-1.5 text-xs font-black text-yellow-400">
                    {getDynamicRating(pg.id)}
                  </div>

                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">{pg.type}</div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">{pg.name}</h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-4">📍 {pg.location}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pg.facilities?.slice(0, 3).map((fac: string, i: number) => (
                      <span key={i} className="bg-[#111] border border-gray-800 px-2 py-1 rounded-md text-[10px] text-gray-300">{fac}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800/80">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Starting at</p>
                      <p className="text-xl font-black text-yellow-400">{pg.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleSave(pg.id)} className={`flex items-center justify-center w-10 h-10 border rounded-xl transition-all text-lg ${savedPGs.includes(pg.id) ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-400 hover:border-red-400 hover:text-red-400 bg-[#111]'}`}>
                        {savedPGs.includes(pg.id) ? '❤️' : '🤍'}
                      </button>
                      <button onClick={() => openPopup(pg)} className="bg-white hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-xs transition-colors">Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL POPUP */}
      {selectedPG && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-[#111] border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col md:flex-row">
            <button onClick={closePopup} className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center z-20 transition-colors">X</button>
            <div className="w-full md:w-1/2 h-64 md:h-auto">
               <img src={selectedPG.images?.[currentImageIndex] || selectedPG.image || selectedPG.image_url} className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
               <div className="flex items-center gap-3 mb-2">
                 <h2 className="text-2xl md:text-3xl font-black text-white">{selectedPG.name}</h2>
                 <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-sm font-bold">{getDynamicRating(selectedPG.id)}</span>
               </div>
               <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">📍 {selectedPG.location}</p>
               
               <div className="mb-6 flex-grow">
                 <h4 className="text-white font-bold mb-2">Amenities</h4>
                 <div className="flex flex-wrap gap-2">
                    {selectedPG.facilities?.map((fac: string, i: number) => (
                      <span key={i} className="bg-[#1a1a1a] border border-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300">{fac}</span>
                    ))}
                 </div>
               </div>

               {/* Quick Rate System */}
               <div className="mb-6 border-t border-gray-800 pt-4">
                 <h4 className="text-gray-400 text-xs font-bold uppercase mb-2">Rate this Property</h4>
                 <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button 
                       key={star}
                       onMouseEnter={() => setHoveredStar(star)}
                       onMouseLeave={() => setHoveredStar(0)}
                       onClick={() => handleRate(star)}
                       className={`text-2xl transition-transform hover:scale-110 ${star <= (hoveredStar || givenRating) ? 'text-yellow-400' : 'text-gray-600'}`}
                     >
                       ★
                     </button>
                   ))}
                 </div>
               </div>

               <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-2xl mb-4">
                 <div className="flex justify-between items-center mb-4">
                   <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase">Monthly Rent</p>
                     <p className="text-2xl font-black text-yellow-400">{selectedPG.price}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500 font-semibold uppercase">Owner</p>
                     <p className="text-white font-bold text-sm">{selectedPG.owner_name || selectedPG.owner}</p>
                   </div>
                 </div>
                 <button onClick={() => handleContact(selectedPG.phone)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-xl font-bold transition-colors">📞 Call Owner</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.visible && (
        <div className="fixed bottom-10 right-10 z-[200] bg-[#111111] border border-gray-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce"><span className="font-bold">{toast.message}</span></div>
      )}
    </main>
  );
}