import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Navbar from '../components/Navbar'
import RoleModal from '../components/RoleModal'
import "./globals.css";

export const metadata = {
  title: 'PG Finder',
  description: 'Find your perfect PG',
  verification: {
    google: 'rMMVU0sfcUhmjU78tDyEEKljKXI34XoIAP7uamGDib4',
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