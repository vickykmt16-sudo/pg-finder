import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Navbar from '../components/Navbar'
import RoleModal from '../components/RoleModal'
import "./globals.css";

export const metadata = {
  title: 'PG Finder Sikar | Boys & Girls PG, Hostel & Rooms',
  description: 'Find verified Boys PG, Girls PG, Hostels and Rooms in Sikar with photos, pricing and location details.',
  
  // 👇 GOOGLE KO BATANE KE LIYE KI YAHAN "VERCEL" NAHI, "PG FINDER" LIKHNA HAI
  applicationName: 'PG Finder', 
  
  verification: {
    google: 'rMMVU0sfcUhmjU78tDyEEKljKXI34XoIAP7uamGDib4',
  },
  
  // 👇 ADVANCED SEO KEYWORDS
  keywords: [
    'PG Finder Sikar',
    'PG in Sikar',
    'Boys PG in Sikar',
    'Girls PG in Sikar',
    'Hostel in Sikar',
    'Rooms in Sikar',
    'Best PG near me',
    'Student hostel Sikar',
    'Piprali Road PG',
    'Sikar coaching PG'
  ],
  
  // 👇 OPEN GRAPH (Social Media & Google Cards)
  openGraph: {
    title: 'PG Finder Sikar | Boys & Girls PG, Hostel & Rooms',
    description: 'Find verified Boys PG, Girls PG, Hostels and Rooms in Sikar with photos, pricing and location details.',
    url: 'https://pg-finder-sikar.vercel.app', // 👉 NAYI UPDATED LINK
    siteName: 'PG Finder', // 👉 SITE KA ASLI NAAM
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'PG Finder Sikar Preview Image',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  
  icons: {
    icon: '/favicon.ico', 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#facc15' }
      }}
    >
      <html lang="en">
        <body className="bg-[#050505] text-white">
          <Navbar />
          <RoleModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}