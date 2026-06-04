"use client";

import Link from "next/link";

// Ye humare dummy reviews hain (Baad mein ye Database se aayenge)
const dummyReviews = [
  {
    id: 1,
    name: "Rahul Verma",
    date: "28 May, 2026",
    rating: 5,
    text: "Ekdum mast PG hai! Khana bahut badhiya milta hai aur WiFi ki speed bhi solid hai. Owner bhaiya bhi bahut helpful hain.",
    avatar: "R"
  },
  {
    id: 2,
    name: "Aman Gupta",
    date: "15 May, 2026",
    rating: 4,
    text: "Rooms ekdum saaf aur clean hain. Bas kabhi kabhi AC mein thodi aawaz aati hai, baaki sab perfect hai.",
    avatar: "A"
  },
  {
    id: 3,
    name: "Sneha Sharma",
    date: "02 May, 2026",
    rating: 5,
    text: "Safety ke hisaab se best hostel hai. Security camera hamesha on rehte hain aur location bhi main market ke paas hai.",
    avatar: "S"
  },
  {
    id: 4,
    name: "Vikas Choudhary",
    date: "20 Apr, 2026",
    rating: 4,
    text: "Rent thoda sa zyada hai but facilities ko dekhte hue worth it hai. Laundry service time par milti hai.",
    avatar: "V"
  }
];

// Chota sa function stars draw karne ke liye
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index} className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
      ★
    </span>
  ));
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden pt-28 pb-20 px-4 font-sans text-white">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Back Button & Title */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-gray-400 hover:text-yellow-400 font-semibold transition-colors mb-4">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Property <span className="text-yellow-400">Reviews</span>
          </h1>
          <p className="text-gray-400 mt-2">See what your tenants are saying about your PG/Hostel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Overall Rating Box */}
          <div className="md:col-span-1 h-fit bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-gray-400 font-semibold mb-2">Overall Rating</h2>
            <div className="text-6xl font-extrabold text-white mb-2">
              4.8
            </div>
            <div className="flex gap-1 mb-3">
              {renderStars(5)}
            </div>
            <p className="text-sm text-gray-400 mb-6">Based on 24 reviews</p>
            
            {/* Review Bars (Design only) */}
            <div className="w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star, i) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 w-3">{star}</span>
                  <span className="text-yellow-400 text-xs">★</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: i === 0 ? '80%' : i === 1 ? '15%' : i === 2 ? '5%' : '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {dummyReviews.map((review) => (
              <div key={review.id} className="bg-[#0a0a0a]/60 backdrop-blur-md border border-gray-800 hover:border-gray-700 transition-colors shadow-lg rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* User Avatar Initials */}
                    <div className="w-12 h-12 rounded-full bg-[#111111] border border-yellow-400/30 flex items-center justify-center text-xl font-bold text-yellow-400">
                      {review.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{review.name}</h3>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}