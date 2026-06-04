"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function RoleModal() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  if (!isLoaded || !isSignedIn || user?.unsafeMetadata?.role) {
    return null;
  }

  const selectRole = async (selectedRole: string) => {
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: { role: selectedRole },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating role:", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      
      <div className="bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(250,204,21,0.1)] rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
        
        <h2 className="text-3xl font-extrabold text-white mb-2">Welcome to PG Finder! 🎉</h2>
        <p className="text-gray-400 mb-8 text-sm">Please select your role to continue</p>
        
        {loading ? (
          <div className="py-10 text-yellow-400 font-bold animate-pulse">
            Setting up your account...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Student Button */}
            <button 
              onClick={() => selectRole("student")}
              className="group flex items-center p-4 border-2 border-gray-800 rounded-2xl hover:border-yellow-400 hover:bg-[#111111] transition-all duration-300"
            >
              <div className="text-4xl bg-gray-800/50 p-3 rounded-xl group-hover:scale-110 transition-transform">🎓</div>
              <div className="text-left ml-4">
                <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">Student</h3>
                <p className="text-gray-500 text-xs">Looking for a PG</p>
              </div>
            </button>

            {/* Hostel Owner Button */}
            <button 
              onClick={() => selectRole("owner")}
              className="group flex items-center p-4 border-2 border-gray-800 rounded-2xl hover:border-yellow-400 hover:bg-[#111111] transition-all duration-300"
            >
              <div className="text-4xl bg-gray-800/50 p-3 rounded-xl group-hover:scale-110 transition-transform">🏢</div>
              <div className="text-left ml-4">
                <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">Hostel Owner</h3>
                <p className="text-gray-500 text-xs">List your PG/Hostel</p>
              </div>
            </button>

          </div>
        )}
      </div>
    </div>
  );
}