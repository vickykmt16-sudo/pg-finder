import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center py-20 px-4 relative overflow-hidden">
      
      {/* Background Yellow Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Back Button */}
        <div className="w-full max-w-[55rem] mb-6">
          <Link 
            href="/profile" 
            className="inline-flex items-center text-gray-400 hover:text-yellow-400 font-semibold transition-colors"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Clerk ka Default White Component */}
        <div className="shadow-2xl shadow-yellow-500/5 rounded-2xl overflow-hidden flex justify-center">
          {/* Yahan se appearance prop hata diya hai taaki default white aaye */}
          <UserProfile routing="hash" />
        </div>
      </div>
    </main>
  );
}