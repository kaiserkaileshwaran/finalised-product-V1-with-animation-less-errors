"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  auth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  onAuthChange,
  type UserProfile,
  type UserAchievement,
  type UserCertificate,
} from "./firebase"
import type { User as FirebaseUser } from "firebase/auth"

// Extended user type with profile data
export interface User extends UserProfile {
  firebaseUser: FirebaseUser
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    const profile = await getUserProfile(firebaseUser.uid)
    if (profile) {
      setUser({ ...profile, firebaseUser })
    } else {
      // Create default profile if doesn't exist
      const defaultProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "User",
        photoURL: firebaseUser.photoURL || undefined,
        bio: "",
        skills: [],
        completedPaths: [],
        completedLessons: [],
        achievements: [],
        certificates: [],
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        totalXp: 0,
        level: 1,
        subscription: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUser({ ...defaultProfile, firebaseUser })
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserProfile(firebaseUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signInWithEmail(email, password)
      await loadUserProfile(result.user)
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      await loadUserProfile(result.user)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const result = await signUpWithEmail(email, password, name)
      await loadUserProfile(result.user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await signOutUser()
    setUser(null)
  }

  const handleResetPassword = async (email: string) => {
    await resetPassword(email)
  }

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return
    await updateUserProfile(user.uid, updates)
    setUser({ ...user, ...updates })
  }

  const refreshProfile = async () => {
    if (user?.firebaseUser) {
      await loadUserProfile(user.firebaseUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword: handleResetPassword,
        updateProfile: handleUpdateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Re-export types
export type { UserProfile, UserAchievement, UserCertificate }
