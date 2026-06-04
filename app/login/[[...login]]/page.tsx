import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden p-4 pt-20">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 shadow-2xl shadow-yellow-500/5 rounded-2xl">
        <SignIn 
          appearance={{
            baseTheme: dark,
            elements: {
              card: "bg-[#0a0a0a] border border-gray-800",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "border-gray-700 bg-transparent hover:bg-gray-800",
              socialButtonsBlockButtonText: "text-white font-semibold",
              dividerLine: "bg-gray-800",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-300 font-medium",
              formFieldInput: "bg-[#1a1a1a] border-gray-700 text-white focus:border-yellow-400",
              formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-black font-bold",
              footerActionText: "text-gray-400",
              footerActionLink: "text-yellow-400 hover:text-yellow-500 font-bold"
            }
          }}
        />
      </div>
      
    </main>
  );
}