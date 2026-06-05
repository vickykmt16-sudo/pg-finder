import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Navbar from '../components/Navbar'
import RoleModal from '../components/RoleModal'
import "./globals.css";

export const metadata = {
  title: 'PG Finder Sikar | Boys & Girls PG, Hostel & Rooms',
  description:
    'Find verified Boys PG, Girls PG, Hostels and Rooms in Sikar with photos, pricing and location details.',
  verification: {
    google: 'rMMVU0sfcUhmjU78tDyEEKljKXI34XoIAP7uamGDib4',
  },
  keywords: [
    'PG Finder Sikar',
    'PG in Sikar',
    'Boys PG in Sikar',
    'Girls PG in Sikar',
    'Hostel in Sikar',
    'Rooms in Sikar',
  ],
  // 👇 YE NAYA OPEN GRAPH (Social & Google Image) ADD KIYA HAI 👇
  openGraph: {
    title: 'PG Finder Sikar | Boys & Girls PG, Hostel & Rooms',
    description: 'Find verified Boys PG, Girls PG, Hostels and Rooms in Sikar with photos, pricing and location details.',
    url: 'https://pg-finder-ruddy.vercel.app', // Aapki Vercel wali live link
    siteName: 'PG Finder Sikar',
    images: [
      {
        url: '/og-image.jpg', // Ye image aapke public folder mein honi chahiye
        width: 1200,
        height: 630,
        alt: 'PG Finder Sikar Preview Image',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  // 👇 YE GOOGLE SEARCH MEIN TITLE KE BAGAL WALE CHHOTE ICON KE LIYE HAI 👇
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