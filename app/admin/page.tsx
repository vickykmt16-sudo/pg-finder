"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { supabase } from "@/lib/supabase"; // 👉 SUPABASE IMPORT KAREIN

// ICONS PACK
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
  Bell: () => <svg className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>,
  Menu: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>,
  Close: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>,
};

export default function AdminDashboard() {
  const { user } = useUser(); 
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [approvedListings, setApprovedListings] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [editingPG, setEditingPG] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80");

  // 👉 DYNAMIC RATING FROM SUPABASE CLOUD
  const getDynamicRating = (pgId: number) => {
    const currentReviews = allReviews.filter((rev: any) => rev.pg_id === pgId);
    if (currentReviews.length === 0) return "New 🆕";
    const sum = currentReviews.reduce((total: number, r: any) => total + parseFloat(r.rating), 0);
    return `⭐ ${(sum / currentReviews.length).toFixed(1)}`;
  };

  // 👉 FETCH ALL DATA DIRECTLY FROM SUPABASE CLOUD
  const fetchCloudData = async () => {
    // 1. Fetch Properties
    const { data: properties } = await supabase
      .from('pg_properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (properties) {
      setPendingListings(properties.filter(pg => pg.status === "Pending"));
      setApprovedListings(properties.filter(pg => pg.status === "Approved"));
    }

    // 2. Fetch Reviews for Ratings
    const { data: reviews } = await supabase.from('pg_reviews').select('*');
    if (reviews) setAllReviews(reviews);
  };

  useEffect(() => {
    // Initial fetch from cloud
    fetchCloudData();

    // User tracking (Keeping this local as it's not a DB table yet)
    const storedUsers = JSON.parse(localStorage.getItem('realAppUsers') || "[]");
    if (user) {
      const userExists = storedUsers.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress);
      if (!userExists) {
        const newUser = {
          id: user.id, name: user.fullName || "User", email: user.primaryEmailAddress?.emailAddress || "No Email",
          role: user.unsafeMetadata?.role || "Student",
          joined: new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })
        };
        storedUsers.push(newUser);
        localStorage.setItem('realAppUsers', JSON.stringify(storedUsers));
      }
    }
    setRealUsers(storedUsers);

    // Hero Image Config
    const storedHero = localStorage.getItem('heroImage');
    if (storedHero) setHeroImage(storedHero);
  }, [user]);

  const allListings = [
    ...pendingListings.map(p => ({...p, isPending: true})), 
    ...approvedListings.map(a => ({...a, isPending: false}))
  ];

  const pendingCount = pendingListings.length;
  const totalPGs = approvedListings.length;

  const filteredListings = allListings.filter(pg => 
    (pg.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pg.owner_name || pg.owner || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pg.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 👉 APPROVE PROPERTY TO SUPABASE
  const handleApprove = async (id: number) => {
    const { error } = await supabase
      .from('pg_properties')
      .update({ status: "Approved", isFeatured: true })
      .eq('id', id);

    if (error) {
      alert("❌ Error Approving: " + error.message);
    } else {
      alert("✅ Property Approved and is now Live!");
      fetchCloudData(); // Refresh list from cloud
    }
  };

  // 👉 REJECT/DELETE PROPERTY FROM SUPABASE
  const handleRejectOrDelete = async (id: number) => {
    if(confirm("⚠️ Are you sure you want to completely REMOVE this property? It will be deleted from the cloud database permanently.")) {
      const { error } = await supabase
        .from('pg_properties')
        .delete()
        .eq('id', id);

      if (error) {
        alert("❌ Error Deleting: " + error.message);
      } else {
        alert("🗑️ Property completely removed from Cloud.");
        fetchCloudData(); // Refresh list from cloud
      }
    }
  };

  // 👉 UPDATE FEATURED STATUS IN SUPABASE
  const handleSetFeatured = async (id: number, featuredStatus: boolean) => {
    const { error } = await supabase
      .from('pg_properties')
      .update({ isFeatured: featuredStatus })
      .eq('id', id);
      
    if (!error) fetchCloudData();
  };

  // 👉 UPDATE EDITED PROPERTY IN SUPABASE
  const handleEditSave = async () => {
    const { error } = await supabase
      .from('pg_properties')
      .update({
        name: editingPG.name,
        price: editingPG.price,
        type: editingPG.type,
        location: editingPG.location,
        owner_name: editingPG.owner_name,
        phone: editingPG.phone,
        status: "Approved" // Edited PG is automatically approved
      })
      .eq('id', editingPG.id);

    if (error) {
      alert("❌ Error Updating: " + error.message);
    } else {
      setEditingPG(null);
      alert("✅ Property Updated Successfully in Cloud!");
      fetchCloudData();
    }
  };

  const handleHeroImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000; 
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          try {
            setHeroImage(compressedBase64);
            localStorage.setItem('heroImage', compressedBase64);
            alert("🖼️ Home Page Image Updated Successfully!");
          } catch (error) {
            alert("❌ Error: Image parser fail.");
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const getTabClass = (menuName: string) => {
    return `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
      activeMenu === menuName ? 'bg-[#252525] text-yellow-400 border-l-2 border-yellow-400' : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
    }`;
  };

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#121212] text-gray-300 font-sans overflow-hidden">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 w-[260px] bg-[#161616] border-r border-[#262626] flex flex-col justify-between z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div>
          <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#262626]">
            <Link href="/profile" className="text-xl font-black text-white tracking-wide hover:text-gray-200 transition-colors">
              PG <span className="text-yellow-400">Finder</span>
            </Link>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}><Icons.Close /></button>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Management</p>
              <button onClick={() => handleMenuChange("dashboard")} className={getTabClass("dashboard")}>
                <Icons.Home /> All Properties 
                {pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">{pendingCount} New</span>}
              </button>
              <button onClick={() => handleMenuChange("users")} className={getTabClass("users")}><Icons.Users /> Users</button>
            </div>
            <div>
              <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Configuration</p>
              <button onClick={() => handleMenuChange("settings")} className={getTabClass("settings")}>
                <Icons.Settings /> Settings
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-[#262626]">
          <Link href="/profile" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-[#262626] hover:bg-[#1E1E1E] text-gray-300 text-sm font-medium transition-all">
            Exit to Profile
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className="h-[72px] bg-[#161616] border-b border-[#262626] flex items-center justify-between px-4 md:px-8 shrink-0">
          
          <div className="flex items-center gap-3 w-full max-w-md">
            <button className="md:hidden p-2 rounded-lg bg-[#1E1E1E] border border-[#333] text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Icons.Menu />
            </button>
            
            {activeMenu === "dashboard" && (
              <div className="hidden sm:flex items-center bg-[#1E1E1E] border border-[#333] rounded-lg px-4 py-2 w-full focus-within:border-gray-500 transition-colors">
                <Icons.Search />
                <input type="text" placeholder="Search PG, Owner..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm text-white ml-3 w-full" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6 ml-4">
            <Link href="/profile" className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-bold text-gray-300 hover:text-yellow-400 bg-[#1E1E1E] px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-[#333] transition-colors">
              ← Back to Profile
            </Link>

            <div className="hidden sm:block"><Icons.Bell /></div>
            <div className="flex items-center gap-3 sm:border-l border-[#333] sm:pl-6">
              <img src={user?.imageUrl || "https://ui-avatars.com/api/?name=Admin&background=random"} alt="Admin" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-[#333]" />
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.firstName || "Admin"}</p>
                <p className="text-[11px] text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          
          {activeMenu === "dashboard" && (
            <>
              <div className="flex justify-between items-end mb-6 md:mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">PG Management</h2>
                  <p className="text-gray-400 text-xs md:text-sm">Manage all pending and live properties from central pool.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-4 md:p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-400 flex items-center justify-center text-black shrink-0"><Icons.Home /></div>
                    <div><p className="text-gray-400 text-[10px] md:text-sm">Live PGs</p><p className="text-xl md:text-2xl font-bold text-white">{totalPGs}</p></div>
                  </div>
                </div>
                <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-4 md:p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shrink-0"><Icons.Clock /></div>
                    <div><p className="text-gray-400 text-[10px] md:text-sm">Action Required</p><p className="text-xl md:text-2xl font-bold text-white">{pendingCount}</p></div>
                  </div>
                </div>
                <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-4 md:p-5 shadow-sm hidden sm:block">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0"><Icons.Users /></div>
                    <div><p className="text-gray-400 text-[10px] md:text-sm">Total Users</p><p className="text-xl md:text-2xl font-bold text-white">{realUsers.length}</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl shadow-sm mb-10">
                <div className="p-4 md:p-6 border-b border-[#262626]">
                  <h3 className="text-base md:text-lg font-bold text-white whitespace-nowrap">All Properties Directory</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="border-b border-[#262626] bg-[#161616]">
                        <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider pl-6">PG Name</th>
                        <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                        <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Real Rating</th>
                        <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Approval Status</th>
                        <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Home Display</th>
                        <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {filteredListings.length === 0 ? (
                        <tr><td colSpan={6} className="p-12 text-center text-gray-500 font-bold">{searchQuery ? "No matches found." : "No properties available yet. Waiting for owners to submit!"}</td></tr>
                      ) : (
                        filteredListings.map((pg) => (
                          <tr key={pg.id} className={`hover:bg-[#1E1E1E] transition-colors ${pg.isPending ? "bg-red-500/5" : ""}`}>
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-4">
                                <img src={pg.image || pg.image_url} alt={pg.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-[#333] shrink-0" />
                                <div>
                                  <p className="font-bold text-white text-xs md:text-sm">{pg.name}</p>
                                  <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{pg.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-gray-200 text-xs md:text-sm">{pg.owner_name || pg.owner}</p>
                              <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{pg.phone}</p>
                            </td>
                            
                            <td className="p-4 text-center font-bold text-yellow-400 text-xs md:text-sm">
                              {getDynamicRating(pg.id)}
                            </td>
                            
                            <td className="p-4 text-center">
                              {pg.isPending ? (
                                <div className="flex justify-center gap-2">
                                  <button onClick={() => handleApprove(pg.id)} className="bg-green-500 hover:bg-green-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Approve</button>
                                  <button onClick={() => handleRejectOrDelete(pg.id)} className="bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Reject</button>
                                </div>
                              ) : (
                                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold inline-block">
                                  Approved ✅
                                </span>
                              )}
                            </td>

                            <td className="p-4 text-center">
                              {pg.isPending ? (
                                <span className="text-gray-600 text-xs italic">Unapproved</span>
                              ) : (
                                <div className="inline-flex bg-[#161616] border border-[#333] rounded-xl p-1 shadow-inner">
                                  <button onClick={() => handleSetFeatured(pg.id, true)} className={`px-2 md:px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold transition-all ${pg.isFeatured !== false ? 'bg-yellow-400 text-black' : 'text-gray-500'}`}>⭐ On Home</button>
                                  <button onClick={() => handleSetFeatured(pg.id, false)} className={`px-2 md:px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold transition-all ${pg.isFeatured === false ? 'bg-[#333] text-white' : 'text-gray-500'}`}>🚫 Hidden</button>
                                </div>
                              )}
                            </td>

                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => setEditingPG(pg)} className="p-2 bg-[#252525] border border-[#333] hover:border-blue-500 rounded-lg text-gray-400 hover:text-blue-400 transition-colors">✏️</button>
                                <button onClick={() => handleRejectOrDelete(pg.id)} className="p-2 bg-[#252525] border border-[#333] hover:border-red-500 rounded-lg text-gray-400 hover:text-red-400 transition-colors">🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB: USERS */}
          {activeMenu === "users" && (
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[#262626]"><h3 className="text-lg font-bold text-white">Registered Users</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#262626] bg-[#161616]">
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase pl-6">Name</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase">Email</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase">Role</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {realUsers.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">No users found. Please log in first!</td></tr>
                    ) : (
                      realUsers.map((u, index) => (
                        <tr key={index} className="hover:bg-[#1E1E1E]">
                          <td className="p-4 pl-6 font-bold text-white text-sm">{u.name}</td>
                          <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-[#252525] border border-[#333] text-gray-300 rounded-full text-xs font-bold">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 text-sm">{u.joined}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeMenu === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Website Settings</h2>
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl overflow-hidden p-4 md:p-8">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Home Page Hero Image</h3>
                <p className="text-gray-400 text-xs md:text-sm mb-6">Change the main image that appears on the home page header.</p>
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="w-full lg:w-1/2">
                    <img src={heroImage} alt="Current Hero" className="w-full h-48 md:h-64 object-cover rounded-xl border border-[#333]" />
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col justify-center h-48 md:h-64">
                    <label className="w-full h-full border-2 border-dashed border-gray-700 hover:border-yellow-400 bg-[#111] rounded-xl flex flex-col items-center justify-center cursor-pointer">
                       <span className="text-3xl md:text-4xl mb-3">🖼️</span>
                       <span className="text-white font-bold text-sm md:text-base">Upload New Image</span>
                       <span className="text-[10px] md:text-xs text-gray-500 mt-2 text-center px-4">Auto-compressed to save space</span>
                       <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpdate} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* EDIT MODAL POPUP */}
      {editingPG && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-700 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Edit Property</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">PG Name</label>
                <input type="text" value={editingPG.name} onChange={e => setEditingPG({...editingPG, name: e.target.value})} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">Price</label>
                  <input type="text" value={editingPG.price} onChange={e => setEditingPG({...editingPG, price: e.target.value})} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">Type</label>
                  <select value={editingPG.type} onChange={e => setEditingPG({...editingPG, type: e.target.value})} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1">
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Location (Address)</label>
                <input type="text" value={editingPG.location} onChange={e => setEditingPG({...editingPG, location: e.target.value})} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">Owner Name</label>
                  <input type="text" value={editingPG.owner_name || editingPG.owner} onChange={e => setEditingPG({...editingPG, owner_name: e.target.value})} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">Phone Number</label>
                  <input type="text" value={editingPG.phone} onChange={e => setEditingPG({...editingPG, phone: e.target.value})} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <button onClick={() => setEditingPG(null)} className="w-full py-3 rounded-xl font-bold border border-gray-700 text-gray-400">Cancel</button>
              <button onClick={handleEditSave} className="w-full py-3 rounded-xl font-bold bg-yellow-400 text-black">Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}