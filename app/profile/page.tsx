"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase"; // 👉 SUPABASE IMPORT KAREIN

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // 👉 ROLE SELECTION STATES
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showRolePopup, setShowRolePopup] = useState(false);

  // Property States
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Edit Modal States
  const [editingPG, setEditingPG] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 👉 FETCH PROPERTIES FROM SUPABASE CLOUD
  const fetchCloudProperties = async () => {
    if (!user) return;
    setLoadingProperties(true);
    try {
      const userEmail = user.primaryEmailAddress?.emailAddress || "";
      
      const { data, error } = await supabase
        .from('pg_properties')
        .select('*')
        .eq('owner_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      if (data) {
        setMyProperties(data);
      }
    } catch (err: any) {
      // 🚀 NEXT.JS RED SCREEN FIX: console.error ki jagah console.log/warn lagaya hai
      // Ab website crash nahi hogi, bas console mein error dikhega testing ke liye
      const errorMessage = err?.message || err?.details || "Supabase RLS or Table issue";
      console.warn("Notice: Properties couldn't load (Check Supabase RLS):", errorMessage);
      setMyProperties([]); // Error aane par empty data set kar diya taaki app chalti rahe
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Check Role from LocalStorage / Clerk Metadata
      const storedRole = localStorage.getItem(`role_${user.id}`);
      const clerkRole = user.unsafeMetadata?.role as string;
      
      if (clerkRole) {
        setUserRole(clerkRole);
      } else if (storedRole) {
        setUserRole(storedRole);
      } else {
        // AGAR ROLE NAHI HAI TOH POPUP DIKHAO (Only for new users)
        setShowRolePopup(true);
      }
      
      // Fetch Live Properties
      fetchCloudProperties();
    }
  }, [user]);

  // 👉 USER CHOOSES ROLE FROM POPUP
  const selectRole = (role: string) => {
    if (user) {
      localStorage.setItem(`role_${user.id}`, role); // Role saved permanently for this user
      setUserRole(role);
      setShowRolePopup(false); // Popup band karo
      alert(`🎉 Profile successfully set as ${role === 'owner' ? 'Property Owner' : 'Student'}! Options updated.`);
    }
  };

  const openEditModal = (pg: any) => {
    setEditingPG(pg);
    setEditName(pg.name);
    const rawPrice = pg.price ? pg.price.replace(/[^0-9]/g, '') : "";
    setEditPrice(rawPrice);
    setEditLocation(pg.location);
    setEditDescription(pg.description || "");
  };

  // 👉 SAVE EDITED PROPERTY TO SUPABASE CLOUD
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPG || !user) return;

    setIsSavingEdit(true);
    try {
      const formattedPrice = `₹${parseInt(editPrice).toLocaleString('en-IN')}`;

      // Update in Supabase
      const { error } = await supabase
        .from('pg_properties')
        .update({
          name: editName,
          price: formattedPrice,
          location: editLocation,
          description: editDescription,
          status: 'Pending' // Edit ke baad wapas pending approval!
        })
        .eq('id', editingPG.id); // Update by unique ID

      if (error) throw error;
      
      alert("✏️ Details updated successfully! Status reset to Pending for Admin review.");
      setEditingPG(null);
      fetchCloudProperties(); // Refresh UI directly from Cloud
    } catch (err: any) {
      alert(`❌ Update failed: ${err.message || "Please check Supabase settings"}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="animate-pulse text-yellow-400 font-bold text-xl">Loading Profile...</div></div>;
  }

  if (!isSignedIn) {
    return <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white"><h2 className="text-2xl font-bold mb-4">You are not logged in</h2><Link href="/login" className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold">Go to Login</Link></div>;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === "vickykmt16@gmail.com"; 
  const isOwner = userRole === "owner" || isAdmin;

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden pt-28 pb-20 px-4 font-sans text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <Navbar />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ================= 1. USER IDENTITY CARD ================= */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-8 md:p-10 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img src={user.imageUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-[0_0_25px_rgba(250,204,21,0.2)]"/>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#111111] border border-gray-700 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg w-max">
                <span className="text-sm">{isAdmin ? '👑' : (isOwner ? '🏢' : '🎓')}</span>
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  {isAdmin ? 'Admin' : (isOwner ? 'Owner' : 'Student')}
                </span>
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{user.fullName || "User"}</h1>
              <p className="text-gray-400 font-medium mb-6">{userEmail}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href="/settings" className="bg-[#111] hover:bg-[#222] border border-gray-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all">Edit Details</Link>
                
                {isOwner && (
                  <Link href="/add-pg" className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-black transition-all shadow-lg">
                    ➕ Add New PG
                  </Link>
                )}
                
                <SignOutButton>
                  <button className="border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-6 py-2.5 rounded-xl font-semibold transition-all">Sign Out</button>
                </SignOutButton>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-8 border-t border-gray-800 pt-8">
              <Link href="/admin" className="w-full flex items-center justify-between p-6 bg-yellow-400/10 border-2 border-yellow-400 hover:bg-yellow-400 rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🛡️</span>
                  <div>
                    <h4 className="text-white font-extrabold text-xl group-hover:text-black">Admin Control Panel</h4>
                    <p className="text-gray-400 text-sm group-hover:text-gray-800">Review pending lists and activate incoming properties.</p>
                  </div>
                </div>
                <span className="text-yellow-400 text-2xl group-hover:text-black">➔</span>
              </Link>
            </div>
          )}
        </div>

        {/* ================= 2. DYNAMIC PROFILE OPTIONS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {isOwner ? (
            <Link href="/add-pg" className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all group flex flex-col items-center text-center shadow-lg">
              <div className="w-16 h-16 bg-gray-800/50 group-hover:bg-yellow-400/10 border border-gray-700 rounded-2xl flex items-center justify-center text-3xl mb-5">➕</div>
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 mb-2">List New Property</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Create a premium hostel listing for admin approval.</p>
            </Link>
          ) : (
            <Link href="/search" className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all group flex flex-col items-center text-center shadow-lg">
              <div className="w-16 h-16 bg-gray-800/50 group-hover:bg-yellow-400/10 border border-gray-700 rounded-2xl flex items-center justify-center text-3xl mb-5">❤️</div>
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 mb-2">Browse All PGs</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Instantly explore and lock the best verified student properties.</p>
            </Link>
          )}

          <Link href="/settings" className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all group flex flex-col items-center text-center shadow-lg">
            <div className="w-16 h-16 bg-gray-800/50 group-hover:bg-yellow-400/10 border border-gray-700 rounded-2xl flex items-center justify-center text-3xl mb-5">⚙️</div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 mb-2">My Settings</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Manage your profile details, change passwords, and preferences.</p>
          </Link>

          <Link href="/support" className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl hover:border-yellow-400/50 hover:bg-[#111] transition-all group flex flex-col items-center text-center shadow-lg">
            <div className="w-16 h-16 bg-gray-800/50 group-hover:bg-yellow-400/10 border border-gray-700 rounded-2xl flex items-center justify-center text-3xl mb-5">🎧</div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 mb-2">Help & Support</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Facing any issues? Contact our 24/7 support team.</p>
          </Link>
        </div>

        {/* ================= 3. OWNER DASHBOARD ================= */}
        {isOwner && (
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-8 md:p-10 mb-10">
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <span>🏢</span> My Listed Properties
              </h2>
              <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-1.5 rounded-full text-sm font-bold">
                Total: {myProperties.length}
              </span>
            </div>

            {loadingProperties ? (
              <div className="text-center py-10 text-gray-500 animate-pulse">Loading your dashboard from Cloud...</div>
            ) : myProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-5xl mb-4 opacity-40">🏢</span>
                <h3 className="text-lg font-bold text-gray-400 mb-1">No Properties Found</h3>
                <p className="text-gray-600 text-sm max-w-sm">Click "Add New PG" above to list your first inventory.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {myProperties.map((pg, index) => (
                  <div key={pg.id || index} className="bg-[#111111] border border-gray-800/80 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full">
                      <img src={pg.image_url || pg.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069"} className="w-24 h-20 rounded-xl object-cover border border-gray-800 shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-white mb-0.5">{pg.name}</h3>
                        <p className="text-gray-500 text-xs">📍 {pg.location} | Rent: <span className="text-yellow-400 font-bold">{pg.price}</span></p>
                        
                        <div className="mt-3">
                          {pg.status === 'Approved' ? (
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide">
                              ✅ Live & Approved
                            </span>
                          ) : pg.status === 'Rejected' ? (
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide">
                              🔴 Rejected
                            </span>
                          ) : (
                            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide animate-pulse">
                              ⏳ Pending Admin Approval
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => openEditModal(pg)}
                      className="bg-[#161616] border border-gray-800 hover:border-yellow-400/40 text-gray-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all whitespace-nowrap mt-4 sm:mt-0"
                    >
                      ✏️ Edit Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= 👉 4. ROLE SELECTION POPUP MODAL (ONLY FOR NEW USERS) ================= */}
      {showRolePopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-xl rounded-3xl p-8 md:p-12 shadow-2xl relative text-center">

            <span className="text-6xl mb-6 block">👋</span>
            <h2 className="text-3xl font-black text-white mb-3">Welcome to <span className="text-yellow-400">PG Finder!</span></h2>
            <p className="text-gray-400 text-sm mb-10">Please select your role below to setup your profile dashboard automatically.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Student Select */}
              <button 
                onClick={() => selectRole('student')} 
                className="bg-[#111] border-2 border-gray-800 hover:border-yellow-400 hover:bg-yellow-400/5 p-8 rounded-2xl transition-all group flex flex-col items-center"
              >
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">🎓</span>
                <h3 className="text-xl text-white font-black mb-1 group-hover:text-yellow-400">I am a Student</h3>
                <p className="text-xs text-gray-500 font-medium">Looking for a PG to stay</p>
              </button>
              
              {/* Owner Select */}
              <button 
                onClick={() => selectRole('owner')} 
                className="bg-[#111] border-2 border-gray-800 hover:border-yellow-400 hover:bg-yellow-400/5 p-8 rounded-2xl transition-all group flex flex-col items-center"
              >
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">🏢</span>
                <h3 className="text-xl text-white font-black mb-1 group-hover:text-yellow-400">I am an Owner</h3>
                <p className="text-xs text-gray-500 font-medium">Listing my property</p>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= 5. EDIT PROPERTY LIGHTBOX MODAL ================= */}
      {editingPG && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setEditingPG(null)} className="absolute top-5 right-5 text-gray-500 hover:text-white text-lg font-bold">✕</button>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Edit <span className="text-yellow-400">Property Details</span></h2>
              <p className="text-gray-500 text-xs mt-1">Modifying fields will push the listing back into "Pending Approval" pool.</p>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Property Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 text-sm rounded-xl px-4 py-2.5 outline-none text-white" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Monthly Rent (Price in ₹)</label>
                <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 text-sm rounded-xl px-4 py-2.5 outline-none text-white" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Full Address Location</label>
                <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 text-sm rounded-xl px-4 py-2.5 outline-none text-white" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Description Context</label>
                <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 text-sm rounded-xl px-4 py-2.5 outline-none text-white resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingPG(null)} className="w-1/2 border border-gray-800 hover:bg-[#111] font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider">Cancel</button>
                <button type="submit" disabled={isSavingEdit} className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider disabled:opacity-50">
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}