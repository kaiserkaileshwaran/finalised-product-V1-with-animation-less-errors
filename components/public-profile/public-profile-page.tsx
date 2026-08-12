'use client'

import { useState, useEffect } from 'react'
import { getUserByUsername, verifyPasscodeForUid, subscribeToUserProfile } from '@/lib/firebase-auth'
import { applyThemeSettings, getStoredThemeSettings } from '@/lib/theme'
import { loadDataFromFirebase, subscribeToData } from '@/lib/firebase'
import type { UserProfile } from '@/lib/auth-types'
import type { AppData } from '@/lib/types'
import { PublicProfileView } from './public-profile-view'
import { Shield, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react'

interface PublicProfilePageProps {
  username: string
}

type Stage = 'loading' | 'not-found' | 'passcode' | 'unlocked' | 'error'

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const [stage, setStage] = useState<Stage>('loading')
  const [uid, setUid] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [appData, setAppData] = useState<AppData | null>(null)
  const [passcode, setPasscode] = useState('')
  const [showPasscode, setShowPasscode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isShake, setIsShake] = useState(false)

  // On mount, look up user
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined
    let unsubscribeData: (() => void) | undefined

    async function lookup() {
      try {
        const result = await getUserByUsername(username)
        if (!result) {
          setStage('not-found')
          return
        }
        setUid(result.uid)
        setProfile(result.profile)
        const settings = getStoredThemeSettings(result.profile)
        applyThemeSettings(settings)
        try {
          const { getStoredBreathingSettings, applyBreathingSettings } = await import('@/lib/theme')
          applyBreathingSettings(getStoredBreathingSettings(result.profile))
        } catch (e) {
          // ignore
        }

        unsubscribeProfile?.()
        unsubscribeProfile = subscribeToUserProfile(result.uid, (nextProfile) => {
          setProfile(nextProfile)
          if (nextProfile) {
            applyThemeSettings(getStoredThemeSettings(nextProfile))
          }
        })

        if (!result.profile.passcodeHash) {
          const data = await loadDataFromFirebase(result.uid)
          setAppData(data)
          setStage('unlocked')
        } else {
          setStage('passcode')
        }

        unsubscribeData?.()
        unsubscribeData = subscribeToData(result.uid, (nextData) => {
          setAppData(nextData)
          if (stage !== 'passcode') {
            setStage('unlocked')
          }
        })
      } catch (err) {
        setStage('error')
      }
    }

    lookup()

    return () => {
      unsubscribeProfile?.()
      unsubscribeData?.()
    }
  }, [username])

  const handleShake = () => {
    setIsShake(true)
    setTimeout(() => setIsShake(false), 600)
    setPasscode('')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode || !uid) return
    setIsVerifying(true)
    setError(null)
    const { success } = await verifyPasscodeForUid(uid, passcode)
    setIsVerifying(false)
    if (success) {
      const data = await loadDataFromFirebase(uid)
      setAppData(data)
      setStage('unlocked')
    } else {
      setError('Wrong passcode. Access denied.')
      handleShake()
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="italic text-sm animate-pulse">Looking up @{username}…</span>
        </div>
      </div>
    )
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (stage === 'not-found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4 opacity-70" />
          <h1 className="text-2xl font-bold italic text-foreground mb-2">User not found</h1>
          <p className="text-muted-foreground text-sm italic">
            @{username} doesn't exist on ProcastiView.
          </p>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4 opacity-70" />
          <h1 className="text-2xl font-bold italic text-foreground mb-2">Something went wrong</h1>
          <p className="text-muted-foreground text-sm italic">Please try again later.</p>
        </div>
      </div>
    )
  }

  // ── Passcode gate ──────────────────────────────────────────────────────────
  if (stage === 'passcode') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-500 ${isShake ? 'bg-destructive/10' : 'bg-primary/5'}`} />
        </div>

        <div className={`relative w-full max-w-sm p-8 bg-card/90 backdrop-blur-md border-2 rounded-2xl shadow-[0_0_40px_rgba(79,195,255,0.1)] transition-all duration-300 ${
          isShake ? 'border-destructive shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-shake' : 'border-primary/40'
        }`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${isShake ? 'bg-destructive/20' : 'bg-primary/10'}`}>
              <Shield className={`w-8 h-8 transition-colors ${isShake ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <h1 className="text-xl font-bold italic text-foreground mb-1">
              @{username}'s Records
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This profile is private. Enter the passcode to view.
            </p>
            {profile && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">{profile.name}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setError(null) }}
                autoComplete="off"
                autoFocus
                disabled={isVerifying}
                className={`w-full text-center text-2xl tracking-widest p-4 pr-12 bg-background/80 border-2 rounded-xl focus:outline-none transition-all ${
                  isShake ? 'border-destructive text-destructive' : 'border-primary/40 focus:border-primary text-foreground'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                tabIndex={-1}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || passcode.length < 1}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold italic transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(79,195,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</> : 'View Records'}
            </button>
          </form>

          <p className="text-center text-muted-foreground/50 text-xs italic mt-6">
            ProcastiView · Private Profile
          </p>
        </div>
      </div>
    )
  }

  // ── Unlocked ───────────────────────────────────────────────────────────────
  if (stage === 'unlocked' && profile && appData) {
    return <PublicProfileView profile={profile} appData={appData} username={username} />
  }

  return null
}
