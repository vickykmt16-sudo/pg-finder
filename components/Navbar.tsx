"use client";

import Link from 'next/link';
import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser(); // 👉 User ki details nikalne ke liye
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 👉 MAIN FIX: Naya user aate hi uska data database (localStorage) mein daal do
  useEffect(() => {
    if (isSignedIn && user) {
      const storedUsers = JSON.parse(localStorage.getItem('realAppUsers') || "[]");
      
      // Check karo ki user pehle se list me hai ya nahi
      const userExists = storedUsers.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress);
      
      if (!userExists) {
        const newUser = {
          id: user.id, 
          name: user.fullName || user.firstName || "New User", 
          email: user.primaryEmailAddress?.emailAddress || "No Email",
          role: user.unsafeMetadata?.role || "Student",
          joined: new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })
        };
        // Naye user ko list me jod do
        storedUsers.push(newUser);
        localStorage.setItem('realAppUsers', JSON.stringify(storedUsers));
      }
    }
  }, [isSignedIn, user]);

  // Agar URL '/admin' hai, toh Navbar mat dikhao (Admin panel overlap fix)
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const getLinkStyle = (path: string) => {
    const baseStyle = "px-6 py-2 text-sm font-bold transition-all duration-300 rounded-full";
    return pathname === path
      ? `${baseStyle} text-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.05)]` 
      : `${baseStyle} text-gray-400 hover:text-white hover:bg-white/5`; 
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-gray-800/60 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between h-20 relative">
          
          {/* Extreme Left: Brand Name */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" className="text-3xl font-black text-white tracking-tighter">
              PG<span className="text-yellow-400">FINDER</span>
            </Link>
          </div>

          {/* Exact Center: Navigation Links (Floating Pill - Hidden on Mobile) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1 p-1.5 bg-[#0a0a0a] border border-gray-800 rounded-full shadow-2xl">
              <Link href="/" className={getLinkStyle('/')}>
                Home
              </Link>
              <Link href="/search" className={getLinkStyle('/search')}>
                All PGs
              </Link>
              <Link href="/about" className={getLinkStyle('/about')}>
                About
              </Link>
            </div>
          </div>

          {/* Extreme Right: Auth Buttons & Hamburger */}
          <div className="flex items-center space-x-3 sm:space-x-4 z-10">
            
            {isSignedIn ? (
              <UserButton 
                 appearance={{
                  variables: { 
                    colorPrimary: '#000000', 
                    colorBackground: '#facc15', 
                    colorText: '#000000', 
                  },
                  elements: {
                    userButtonPopoverCard: { backgroundColor: "#facc15", border: "2px solid #eab308", boxShadow: "0 25px 50px -12px rgba(250, 204, 21, 0.25)", borderRadius: "1rem" }, 
                    userPreviewMainIdentifier: { color: "#000000", fontWeight: "900" }, 
                    userPreviewSecondaryIdentifier: { color: "#000000", fontWeight: "700" }, 
                    userButtonPopoverActionButtonText: { color: "#000000", fontWeight: "800" }, 
                    userButtonPopoverActionButtonIcon: { color: "#000000" }, 
                    userButtonPopoverActionButton: "hover:bg-black/10",
                    userButtonPopoverActionButton__manageAccount: { display: "none" }, 
                    userButtonPopoverFooter: { display: "none" }, 
                    avatarBox: { 
                      width: "2.75rem",
                      height: "2.75rem",
                      border: "2px solid #facc15", 
                      boxShadow: "0 0 15px rgba(250,204,21,0.3)" 
                    },
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Profile"
                    labelIcon={<span style={{ color: "#000000", fontSize: "1.125rem", fontWeight: "900" }}>👤</span>}
                    href="/profile"
                  />
                </UserButton.MenuItems>
              </UserButton>

            ) : (
              <>
                <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                  Log in
                </Link>
                
                <Link href="/signup" className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:-translate-y-0.5 tracking-wide whitespace-nowrap">
                  Sign Up
                </Link>
              </>
            )}

            {/* MOBILE HAMBURGER MENU BUTTON */}
            <button 
              className="md:hidden flex items-center justify-center p-2 text-gray-300 hover:text-yellow-400 transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-2 p-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl">
              
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`p-3 rounded-xl text-center text-sm font-bold transition-colors ${pathname === '/' ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-300 hover:bg-white/5'}`}>
                Home
              </Link>
              <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className={`p-3 rounded-xl text-center text-sm font-bold transition-colors ${pathname === '/search' ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-300 hover:bg-white/5'}`}>
                All PGs
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`p-3 rounded-xl text-center text-sm font-bold transition-colors ${pathname === '/about' ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-300 hover:bg-white/5'}`}>
                About
              </Link>
              
              {!isSignedIn && (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="sm:hidden p-3 rounded-xl text-center text-sm font-bold text-gray-300 hover:bg-white/5 border-t border-gray-800 mt-2">
                  Log in
                </Link>
              )}

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}