"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { UserOut } from './auth'
import * as api from '../lib/auth'

type AuthContextType = {
  user: UserOut | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<UserOut | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    setLoading(true)
    try {
      const u = await api.getCurrentUser()
      setUser(u)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // On mount, try to fetch current user using cookie
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    await api.login(email, password)
    await refreshUser()
  }

  const register = async (name: string, email: string, password: string, role = 'ARTISAN') => {
    await api.register(name, email, password, role)
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
