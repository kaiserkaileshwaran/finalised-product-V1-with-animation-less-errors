'use client'

import { useState, useEffect, useCallback } from 'react'
import { LoginScreen, RegisterScreen, ProfileDashboard, CompleteProfile } from './auth'
import { DailyQuest } from './daily-quest/daily-quest'
import { LandingSequence } from './landing-sequence'
import { ProductTutorial } from './product-tutorial'
import { PasscodeScreen } from './auth/passcode-screen'
import { subscribeToAuth, getUserProfile, subscribeToUserProfile } from '@/lib/firebase-auth'
import type { UserProfile } from '@/lib/auth-types'
import { applyThemeSettings, getStoredThemeSettings, type ThemeSettings } from '@/lib/theme'

type Screen = 'loading' | 'landing' | 'tutorial' | 'login' | 'register' | 'complete-profile' | 'app'

export function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [uid, setUid] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [pendingNewUser, setPendingNewUser] = useState(false)
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false)
  const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false)
  
  const [targetScreen, setTargetScreen] = useState<Screen | null>(null)
  const [authResolved, setAuthResolved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('procastiview-theme-settings')
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as ThemeSettings
      applyThemeSettings(parsed)
    } catch {
      // ignore invalid stored theme data
    }
  }, [])

  // Start auto-theme observer unless user has explicit appTheme set on profile
  useEffect(() => {
    let stopAuto: (() => void) | undefined
    try {
      // Determine preference: profile.appTheme or localStorage
      const preferred = (userProfile as any)?.appTheme || localStorage.getItem('procastiview-app-theme') || 'auto'
      if (preferred === 'auto') {
        const { startAutoThemeObserver } = require('@/lib/theme')
        stopAuto = startAutoThemeObserver((t: any) => {
          // when auto updates, we may want to sync to UI; nothing else required
        })
      } else {
        const { applyAppTheme } = require('@/lib/theme')
        applyAppTheme(preferred)
      }
    } catch (e) {
      // ignore
    }

    return () => stopAuto?.()
  }, [userProfile])

  useEffect(() => {
    if (userProfile) {
      const t = getStoredThemeSettings(userProfile)
      applyThemeSettings(t)
      // apply breathing separately (breathing falls back to theme-based defaults)
      try {
        // dynamic import the breathing helper
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getStoredBreathingSettings, applyBreathingSettings } = require('@/lib/theme')
        applyBreathingSettings(getStoredBreathingSettings(userProfile))
      } catch (e) {
        // ignore; fallback handled by CSS defaults
      }
    }
  }, [userProfile])

  // Subscribe to auth state
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined

    const unsubscribe = subscribeToAuth(async (user) => {
      if (unsubscribeProfile) {
        unsubscribeProfile()
        unsubscribeProfile = undefined
      }

      if (user) {
        setUid(user.uid)
        
        // Check if profile exists
        const profile = await getUserProfile(user.uid)
        
        if (profile) {
          setUserProfile(profile)
          setTargetScreen('app')
        } else {
          // New user needs to complete profile
          setTargetScreen('complete-profile')
        }

        unsubscribeProfile = subscribeToUserProfile(user.uid, (nextProfile) => {
          setUserProfile(nextProfile)
          if (nextProfile) {
            const t = getStoredThemeSettings(nextProfile)
            applyThemeSettings(t)
            try {
              const { getStoredBreathingSettings, applyBreathingSettings } = require('@/lib/theme')
              applyBreathingSettings(getStoredBreathingSettings(nextProfile))
            } catch (e) {
              // ignore
            }
          }
        })
      } else {
        setUid(null)
        setUserProfile(null)
        setTargetScreen('tutorial')
      }
      setAuthResolved(true)
    })

    return () => {
      unsubscribe()
      unsubscribeProfile?.()
    }
  }, [])

  // Transition from loading to landing once auth state is known
  useEffect(() => {
    if (screen === 'loading' && authResolved) {
      setScreen('landing')
    }
  }, [screen, authResolved])

  // Handle landing finish
  const handleLandingFinish = useCallback(() => {
    if (targetScreen) {
      setScreen(targetScreen)
    }
  }, [targetScreen])

  // Handle login success
  const handleLoginSuccess = useCallback(async (userId: string, isNewUser?: boolean) => {
    setUid(userId)
    
    if (isNewUser) {
      setPendingNewUser(true)
      setScreen('complete-profile')
    } else {
      const profile = await getUserProfile(userId)
      if (profile) {
        setUserProfile(profile)
        setScreen('app')
      } else {
        setScreen('complete-profile')
      }
    }
  }, [])

  // Handle registration success
  const handleRegisterSuccess = useCallback(async (userId: string) => {
    setUid(userId)
    const profile = await getUserProfile(userId)
    if (profile) {
      setUserProfile(profile)
      setScreen('app')
    }
  }, [])

  // Handle profile completion
  const handleProfileComplete = useCallback(async () => {
    if (uid) {
      const profile = await getUserProfile(uid)
      if (profile) {
        setUserProfile(profile)
        setScreen('app')
      }
    }
    setPendingNewUser(false)
  }, [uid])

  // Handle logout
  const handleLogout = useCallback(() => {
    setUid(null)
    setUserProfile(null)
    setShowProfile(false)
    setIsPasscodeVerified(false)
    setScreen('login')
  }, [])

  // Handle profile update
  const handleProfileUpdate = useCallback((profile: UserProfile) => {
    setUserProfile(profile)
  }, [])

  // Loading screen
  if (screen === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl italic animate-pulse">Loading...</div>
      </main>
    )
  }

  // Landing sequence
  if (screen === 'landing') {
    return <LandingSequence onFinish={handleLandingFinish} />
  }

  // Product tutorial
  if (screen === 'tutorial') {
    return (
      <ProductTutorial
        onGoToLogin={() => setScreen('login')}
        onGoToRegister={() => setScreen('register')}
      />
    )
  }

  // Login screen
  if (screen === 'login') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <LoginScreen
          onSwitchToRegister={() => setScreen('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>
    )
  }

  // Register screen
  if (screen === 'register') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <RegisterScreen
          onSwitchToLogin={() => setScreen('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </main>
    )
  }

  // Complete profile screen
  if (screen === 'complete-profile' && uid) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <CompleteProfile
          uid={uid}
          onComplete={handleProfileComplete}
        />
      </main>
    )
  }

  // Passcode Security Screen
  if (uid && userProfile && !isPasscodeVerified) {
    return (
      <PasscodeScreen 
        uid={uid} 
        hasPasscode={!!userProfile.passcodeHash} 
        onSuccess={() => {
          setIsPasscodeVerified(true)
          getUserProfile(uid).then(p => { if (p) setUserProfile(p) })
        }} 
      />
    )
  }

  // Main app screen
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* User Avatar Button */}
      {(!isCategoryOverlayOpen) && (
      <button
        onClick={() => setShowProfile(true)}
        className={`fixed top-4 right-4 z-[60] w-12 h-12 flex items-center justify-center transition-transform cursor-pointer drop-shadow-[0_0_12px_rgba(255,80,80,0.2)] ${showProfile ? 'pointer-events-none' : 'hover:scale-110'}`}
        title="View Profile"
      >
        {/* Left Hemisphere */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out origin-center ${showProfile ? '-translate-x-3 opacity-0 rotate-[-15deg]' : 'translate-x-0 opacity-100 rotate-0'}`}
          style={{ clipPath: 'polygon(0 0, 50% 0, 40% 20%, 60% 40%, 45% 60%, 55% 80%, 50% 100%, 0 100%)' }}
        >
          <div 
            className="absolute inset-0 bg-primary/20 backdrop-blur-md mask-heart"
          />
          <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full pointer-events-none stroke-primary stroke-[1.5px] fill-transparent drop-shadow-[0_0_5px_rgba(79,195,255,0.8)]">
             <path d="M16 28 C16 28 3 19.5 3 10.5 C3 6.5 6.5 3 10.5 3 C13.5 3 15 5 16 6.5 C17 5 18.5 3 21.5 3 C25.5 3 29 6.5 29 10.5 C29 19.5 16 28 16 28 Z" />
          </svg>
          <span className="relative z-10 text-red-500 font-bold text-lg pt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ animation: 'text-glow-red 3s infinite ease-in-out' }}>
            {userProfile?.name.charAt(0).toUpperCase() || '?'}
          </span>
        </div>

        {/* Right Hemisphere */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out origin-center ${showProfile ? 'translate-x-3 opacity-0 rotate-[15deg]' : 'translate-x-0 opacity-100 rotate-0'}`}
          style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 55% 80%, 45% 60%, 60% 40%, 40% 20%)' }}
        >
          <div 
            className="absolute inset-0 bg-primary/20 backdrop-blur-md mask-heart"
          />
          <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full pointer-events-none stroke-primary stroke-[1.5px] fill-transparent drop-shadow-[0_0_5px_rgba(79,195,255,0.8)]">
             <path d="M16 28 C16 28 3 19.5 3 10.5 C3 6.5 6.5 3 10.5 3 C13.5 3 15 5 16 6.5 C17 5 18.5 3 21.5 3 C25.5 3 29 6.5 29 10.5 C29 19.5 16 28 16 28 Z" />
          </svg>
          <span className="relative z-10 text-red-500 font-bold text-lg pt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ animation: 'text-glow-red 3s infinite ease-in-out' }}>
            {userProfile?.name.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      </button>
      )}

      {/* Procrastiview App */}
      <DailyQuest userId={uid} onOverlayChange={setIsCategoryOverlayOpen} />

      {/* Profile Modal */}
      {showProfile && userProfile && uid && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <ProfileDashboard
            profile={userProfile}
            uid={uid}
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
            onClose={() => setShowProfile(false)}
          />
        </div>
      )}
    </main>
  )
}
