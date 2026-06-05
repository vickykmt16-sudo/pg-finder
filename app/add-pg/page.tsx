"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

export default function AddPGPage() {
  const { user } = useUser(); 
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 👉 Naya State for Modern Success Toast
  const [showToast, setShowToast] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: "", type: "Boys", price: "", city: "", location: "", 
    ownerName: "", phone: ""
  });
  
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]); 

  // Modern Facility Toggle
  const facilitiesList = ['High-Speed WiFi', 'AC Rooms', 'Meals Included', 'Laundry Service', 'Power Backup', 'RO Water', 'CCTV Security', 'Parking Space'];
  
  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  // Image Upload - Append & Compress Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files);
      
      const remainingSlots = 5 - base64Images.length;
      if (remainingSlots <= 0) {
        alert("You can only upload a maximum of 5 images.");
        return;
      }

      const filesToProcess = newFilesArray.slice(0, remainingSlots);

      const base64Promises = filesToProcess.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 600; 
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.6)); 
            };
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(base64Promises).then(newBase64Strings => {
        setBase64Images(prev => [...prev, ...newBase64Strings]);
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setBase64Images(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Submit to Supabase & Show Toast
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(formData.phone.length !== 10) {
        alert("Phone number must be exactly 10 digits!");
        return;
    }

    setIsSubmitting(true);

    const fullAddress = `${formData.location}, ${formData.city}`;
    const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

    const newPG = {
      name: formData.name,
      location: fullAddress,
      price: `₹${parseInt(formData.price).toLocaleString('en-IN')}`,
      type: formData.type,
      facilities: selectedFacilities.length > 0 ? selectedFacilities : ["Basic Amenities"],
      owner_name: formData.ownerName,
      owner_email: user?.primaryEmailAddress?.emailAddress || "no-email@test.com",
      phone: formData.phone,
      description: `Premium ${formData.type} PG located at ${fullAddress}.`,
      status: "Pending",
      image: base64Images.length > 0 ? base64Images[0] : defaultImage,
      images: base64Images.length > 0 ? base64Images : [defaultImage]
    };

    const { error } = await supabase.from('pg_properties').insert([newPG]);

    if (error) {
      alert("❌ Submission Failed: " + error.message);
      setIsSubmitting(false);
    } else {
      // 👉 Modern Toast logic (alert hata diya)
      setShowToast(true);
      setTimeout(() => {
        router.push("/profile");
      }, 2500); // 2.5 second ke baad automatically profile par bhej dega
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10 text-center md:text-left">
          <Link href="/profile" className="inline-block text-gray-400 hover:text-yellow-400 font-semibold mb-4 transition-colors">
            ← Back to Profile
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            List Your <span className="text-yellow-400">Property</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Fill in the details below to publish your PG/Hostel. It takes only 2 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Details */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2"><span>🏢</span> 1. Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hostel / PG Name</label>
                <input type="text" required placeholder="Enter PG Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Rent (₹)</label>
                <input type="number" required placeholder="Enter Monthly Rent" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors appearance-none">
                  <option value="Boys">Boys Only</option>
                  <option value="Girls">Girls Only</option>
                  <option value="Co-ed">Co-ed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                <input type="text" required placeholder="Enter City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Area / Location</label>
                <input type="text" required placeholder="Enter Area / Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Section 2: Owner Details */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2"><span>👤</span> 2. Owner & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Owner Full Name</label>
                <input type="text" required placeholder="Enter Owner Name" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number (10 Digits)</label>
                <input type="tel" required pattern="[0-9]{10}" maxLength={10} placeholder="Enter Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-[#111] border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white outline-none transition-colors" />
                {formData.phone && formData.phone.length !== 10 && <p className="text-red-500 text-xs mt-1">Must be exactly 10 digits.</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Facilities */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2"><span>✨</span> 3. Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {facilitiesList.map((facility) => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    selectedFacilities.includes(facility) 
                    ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" 
                    : "bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {selectedFacilities.includes(facility) ? "✓ " : "+ "}{facility}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2"><span>📸</span> 4. Property Photos</h2>
            {base64Images.length < 5 && (
              <label className="w-full border-2 border-dashed border-gray-700 hover:border-yellow-400 bg-[#111] rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group text-center mb-6">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🖼️</span>
                <p className="text-gray-300 font-bold mb-1">Click to upload images</p>
                <p className="text-gray-500 text-xs">You can add {5 - base64Images.length} more photo(s)</p>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}

            {base64Images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold text-green-400 mb-4">✅ {base64Images.length}/5 Image(s) Selected:</p>
                <div className="flex flex-wrap gap-4">
                   {base64Images.map((src, index) => (
                     <div key={index} className="relative shrink-0">
                       <img src={src} alt={`Preview ${index}`} className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-gray-700 shadow-md" />
                       <button
                         type="button"
                         onClick={() => removeImage(index)}
                         className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-lg transition-transform hover:scale-110"
                       >
                         ✕
                       </button>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || formData.phone.length !== 10} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {isSubmitting ? "Uploading to Cloud..." : "Submit Property"}
          </button>
        </form>
      </div>

      {/* 👉 Modern Success Toast (Popup) */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-black px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.5)] font-black text-sm md:text-base uppercase tracking-wider animate-bounce z-50 flex items-center gap-3 border-2 border-green-400">
          <span className="text-2xl">✅</span> Property Sent for Review!
        </div>
      )}
    </main>
  );
}