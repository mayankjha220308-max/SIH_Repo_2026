"use client"

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../lib/AuthProvider'

export default function Header() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">SIH Marketplace</Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-sm">Home</Link>
            </li>
            <li>
              <Link href="/" className="text-sm">Marketplace</Link>
            </li>
            {loading ? (
              <li className="text-sm text-gray-500">Loading...</li>
            ) : user ? (
              <>
                <li className="text-sm">Welcome, <strong>{user.name}</strong></li>
                <li>
                  <button
                    onClick={async () => {
                      try { await logout() } catch (e) { console.error(e) }
                      // Optionally reload the page or navigate
                      window.location.href = '/'
                    }}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Login</Link>
                </li>
                <li>
                  <Link href="/register" className="text-sm bg-green-600 text-white px-3 py-1 rounded">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
