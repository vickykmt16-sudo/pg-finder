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