import './globals.css'
import type { ReactNode } from 'react'
import { AuthProvider } from '../lib/AuthProvider'
import Header from '../components/Header'

export const metadata = {
  title: 'SIH Digital Marketplace',
  description: 'AI-powered marketplace for artisans',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
