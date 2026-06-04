import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Navbar from '../components/Navbar'
import RoleModal from '../components/RoleModal' // <-- YE NAYI LINE HAI
import "./globals.css";

export const metadata = {
  title: 'PG Finder',
  description: 'Find your perfect PG',
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
          <RoleModal /> {/* <-- YE POP-UP YAHAN LAGA DIYA */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}