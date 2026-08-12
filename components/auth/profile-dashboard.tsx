'use client'

import { useState, useEffect } from 'react'
import { logout, upgradeToPaid, updateUserProfile, checkUsernameExists, setUserPassword, setupPasscode } from '@/lib/firebase-auth'
import type { UserProfile } from '@/lib/auth-types'
import { Eye, EyeOff, Share2, Copy, Check, Palette, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { applyThemeSettings, getStoredThemeSettings, getStoredBreathingSettings, applyBreathingSettings, type ThemeSettings, type ThemeMode, type GradientDirection } from '@/lib/theme'
import { updateUserThemeSettings } from '@/lib/firebase-auth'

interface ProfileDashboardProps {
  profile: UserProfile
  uid: string
  onLogout: () => void
  onProfileUpdate: (profile: UserProfile) => void
  onClose: () => void
}

export function ProfileDashboard({ profile, uid, onLogout, onProfileUpdate, onClose }: ProfileDashboardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editUsername, setEditUsername] = useState(profile.user_name)
  const [editPhone, setEditPhone] = useState(profile.phone_number || '')
  const [editPassword, setEditPassword] = useState('')
  const [editPasscode, setEditPasscode] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameTakenStatus, setUsernameTakenStatus] = useState<'idle'|'checking'|'taken'|'available'>('idle')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasscode, setShowPasscode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('solid')
  const [solidColor, setSolidColor] = useState('#4fc3ff')
  const [gradientStart, setGradientStart] = useState('#4fc3ff')
  const [gradientEnd, setGradientEnd] = useState('#8b5cf6')
  const [gradientDirection, setGradientDirection] = useState<GradientDirection>('to-br')
  const [showThemeOptions, setShowThemeOptions] = useState(true)

  // Breathing UI state
  const [breathMode, setBreathMode] = useState<ThemeMode>('solid')
  const [breathSolid, setBreathSolid] = useState('#4fc3ff')
  const [breathGradientStart, setBreathGradientStart] = useState('#4fc3ff')
  const [breathGradientEnd, setBreathGradientEnd] = useState('#8b5cf6')
  const [breathGradientDirection, setBreathGradientDirection] = useState<GradientDirection>('to-br')
  const [showBreathOptions, setShowBreathOptions] = useState(true)

  const applyThemePreset = (mode: ThemeMode, preset?: string, secondaryPreset?: string, direction?: GradientDirection) => {
    const root = document.documentElement
    const nextSettings: ThemeSettings = {
      themeMode: mode,
      solidColor: preset || solidColor,
      gradientStart: mode === 'gradient' ? (preset || gradientStart) : gradientStart,
      gradientEnd: mode === 'gradient' ? (secondaryPreset || gradientEnd) : gradientEnd,
      gradientDirection: direction || gradientDirection,
    }

    applyThemeSettings(nextSettings, root)
    setTheme('custom')
    localStorage.setItem('procastiview-theme-settings', JSON.stringify(nextSettings))
    void updateUserThemeSettings(uid, nextSettings)
  }
  
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('procastiview-theme-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ThemeSettings
        setThemeMode(parsed.themeMode || 'solid')
        setSolidColor(parsed.solidColor || '#4fc3ff')
        setGradientStart(parsed.gradientStart || '#4fc3ff')
        setGradientEnd(parsed.gradientEnd || '#8b5cf6')
        setGradientDirection(parsed.gradientDirection || 'to-br')
        applyThemeSettings(parsed)
        return
      } catch {
        // ignore invalid storage
      }
    }

    const stored = getStoredThemeSettings(profile)
    setThemeMode(stored.themeMode)
    setSolidColor(stored.solidColor)
    setGradientStart(stored.gradientStart)
    setGradientEnd(stored.gradientEnd)
    setGradientDirection(stored.gradientDirection)
    applyThemeSettings(stored)
    // initialize breathing from profile (if present)
    try {
      const storedBreath = getStoredBreathingSettings(profile)
      setBreathMode(storedBreath.breathMode)
      setBreathSolid(storedBreath.breathSolid)
      setBreathGradientStart(storedBreath.breathGradientStart)
      setBreathGradientEnd(storedBreath.breathGradientEnd)
      setBreathGradientDirection(storedBreath.breathGradientDirection)
      applyBreathingSettings(storedBreath)
    } catch (e) {
      // ignore
    }
  }, [profile.user_name])

  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted, onClose])

  const handleThemeSelection = (mode: ThemeMode, preset: string, secondaryPreset?: string, direction?: GradientDirection) => {
    const nextSettings: ThemeSettings = {
      themeMode: mode,
      solidColor: mode === 'solid' ? preset : solidColor,
      gradientStart: mode === 'gradient' ? preset : gradientStart,
      gradientEnd: mode === 'gradient' ? (secondaryPreset || gradientEnd) : gradientEnd,
      gradientDirection: direction || gradientDirection,
    }

    setThemeMode(mode)
    setSolidColor(nextSettings.solidColor)
    setGradientStart(nextSettings.gradientStart)
    setGradientEnd(nextSettings.gradientEnd)
    if (direction) {
      setGradientDirection(direction)
    }
    applyThemePreset(mode, preset, secondaryPreset, direction)
  }

  // Debounced Username Check
  useEffect(() => {
    if (!isEditing || editUsername === profile.user_name) {
      setUsernameTakenStatus('idle')
      return
    }

    if (editUsername.length < 3) {
      setUsernameTakenStatus('idle')
      return
    }

    setUsernameTakenStatus('checking')
    setIsCheckingUsername(true)
    
    const timeoutId = setTimeout(async () => {
      const exists = await checkUsernameExists(editUsername)
      setIsCheckingUsername(false)
      if (exists) {
        setUsernameTakenStatus('taken')
      } else {
        setUsernameTakenStatus('available')
      }
    }, 600) // 600ms debounce

    return () => clearTimeout(timeoutId)
  }, [editUsername, isEditing, profile.user_name])

  const handleSaveProfile = async () => {
    setEditError('')
    if (!editName.trim() || !editUsername.trim()) {
      setEditError('Name and username cannot be empty.')
      return
    }
    
    if (editUsername.length < 3) {
      setEditError('Username must be at least 3 characters.')
      return
    }

    if (editPasscode.trim() && editPasscode.trim().length < 1) {
      setEditError('Passcode cannot be empty.')
      return
    }

    setIsSaving(true)
    const result = await updateUserProfile(uid, profile.user_name, editUsername, editName.trim(), editPhone.trim())
    
    if (result.success && editPassword.trim()) {
      const passResult = await setUserPassword(editPassword.trim())
      if (!passResult.success) {
        setIsSaving(false)
        setEditError(passResult.error || 'Failed to update password.')
        return
      }
    }
    
    if (result.success && editPasscode.trim()) {
      const passcodeResult = await setupPasscode(uid, editPasscode.trim())
      if (!passcodeResult.success) {
        setIsSaving(false)
        setEditError(passcodeResult.error || 'Failed to update passcode.')
        return
      }
    }

    setIsSaving(false)

    if (result.success) {
      onProfileUpdate({ ...profile, name: editName.trim(), user_name: editUsername.toLowerCase(), phone_number: editPhone.trim() })
      setIsEditing(false)
      setEditPassword('')
      setEditPasscode('')
    } else {
      setEditError(result.error || 'Failed to update profile.')
    }
  }

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  const handleUpgrade = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update to paid in Firestore
    const result = await upgradeToPaid(uid)
    
    if (result.success) {
      setPaymentSuccess(true)
      onProfileUpdate({ ...profile, model: 'paid' })
      
      // Close modal after showing success
      setTimeout(() => {
        setShowPaymentModal(false)
        setPaymentSuccess(false)
      }, 2000)
    }
    
    setIsProcessing(false)
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
        <div className="border-2 border-border rounded-2xl animate-glow p-5 sm:p-8 bg-background/50 backdrop-blur-sm max-h-[92dvh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-primary text-2xl font-bold italic">Profile</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-primary transition-colors text-xl"
            >
              ×
            </button>
          </div>

          {/* Avatar Base */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 flex items-center justify-center drop-shadow-lg">
              <div 
                className="absolute inset-0 bg-primary/20 backdrop-blur-md mask-heart"
              />
              <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full pointer-events-none stroke-primary stroke-[1.5px] fill-transparent drop-shadow-[0_0_8px_rgba(79,195,255,0.6)]">
                 <path d="M16 28 C16 28 3 19.5 3 10.5 C3 6.5 6.5 3 10.5 3 C13.5 3 15 5 16 6.5 C17 5 18.5 3 21.5 3 C25.5 3 29 6.5 29 10.5 C29 19.5 16 28 16 28 Z" />
              </svg>
              <span className="relative z-10 text-primary font-bold text-4xl pt-2" style={{ animation: 'text-glow-red 3s infinite ease-in-out' }}>
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Profile Info Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
            {isEditing && editError && (
              <div className="xl:col-span-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm italic">
                {editError}
              </div>
            )}
            
            {/* Column 1 */}
            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-5">
              <div className="flex flex-col border-b border-border/50 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground text-sm italic sm:w-1/3">Username</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editUsername} 
                      onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className={`w-full sm:flex-1 px-3 py-1.5 border-[1.5px] rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none text-right transition-colors ${
                        usernameTakenStatus === 'taken' ? 'border-red-500 focus:border-red-500' : 'border-primary focus:border-secondary'
                      }`}
                    />
                  ) : (
                    <span className="text-foreground font-medium truncate">@{profile.user_name}</span>
                  )}
                </div>
                
                {isEditing && editUsername !== profile.user_name && editUsername.length >= 3 && (
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs italic ${
                      usernameTakenStatus === 'checking' ? 'text-primary animate-pulse' :
                      usernameTakenStatus === 'taken' ? 'text-red-400 font-bold' :
                      usernameTakenStatus === 'available' ? 'text-secondary' : 'opacity-0'
                    }`}>
                      {usernameTakenStatus === 'checking' && 'Checking availability...'}
                      {usernameTakenStatus === 'taken' && 'Username already taken'}
                      {usernameTakenStatus === 'available' && 'Username available!'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground text-sm italic sm:w-1/3">Name</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-1.5 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-secondary text-right"
                  />
                ) : (
                  <span className="text-foreground font-medium truncate">{profile.name}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground text-sm italic sm:w-1/3">Email</span>
                <span className="text-foreground font-medium text-sm truncate text-right flex-1">{profile.email}</span>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-5">
              <div className="flex flex-col border-b border-border/50 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground text-sm italic sm:w-1/3">Phone</span>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={editPhone} 
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full sm:flex-1 px-3 py-1.5 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-secondary text-right"
                    />
                  ) : (
                    <span className="text-foreground font-medium truncate text-right flex-1">{profile.phone_number || 'Not provided'}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col border-b border-border/50 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground text-sm italic sm:w-1/3">Password</span>
                  {isEditing ? (
                    <div className="relative flex-1">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={editPassword} 
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-3 py-1.5 pr-9 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-secondary text-right"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs font-medium truncate">•••••••• (Hidden)</span>
                  )}
                </div>
                {isEditing && (
                  <span className="text-[10px] text-muted-foreground italic text-right mt-1">Leave empty to keep current</span>
                )}
              </div>

              <div className="flex flex-col border-b border-border/50 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground text-sm italic sm:w-1/3">Passcode</span>
                  {isEditing ? (
                    <div className="relative flex-1">
                      <input 
                        type={showPasscode ? 'text' : 'password'}
                        value={editPasscode} 
                        onChange={(e) => setEditPasscode(e.target.value)}
                        placeholder="Any characters, any length"
                        className="w-full px-3 py-1.5 pr-9 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-secondary text-right"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(v => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        tabIndex={-1}
                      >
                        {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs font-medium truncate">•••• (Hidden)</span>
                  )}
                </div>
                {isEditing && (
                  <span className="text-[10px] text-muted-foreground italic text-right mt-1">Leave empty to keep current</span>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border/50 bg-background/20 px-2 rounded-md">
                <span className="text-muted-foreground text-sm italic">Current Plan</span>
                <span className={`font-bold text-sm uppercase px-3 py-1 rounded-full ${
                  profile.model === 'paid' 
                    ? 'bg-secondary/20 text-secondary border border-secondary/50' 
                    : 'bg-muted-foreground/20 text-muted-foreground border border-muted-foreground/50'
                }`}>
                  {profile.model}
                </span>
              </div>
              
              {/* App Theme Section (Blog-derived only) */}
              {mounted && (
                <div className="flex flex-col border-b border-border/50 py-3 gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <span className="text-primary text-sm font-bold italic">App Theme</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{(profile as any)?.appTheme || 'auto'}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'auto', label: 'Auto' },
                      { value: 'sunrise', label: 'Sunrise' },
                      { value: 'day', label: 'Day' },
                      { value: 'sunset', label: 'Sunset' },
                      { value: 'night', label: 'Night' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          // persist to Firestore
                          const appTheme = opt.value as any
                          void updateUserThemeSettings(uid, { appTheme })
                          // apply immediately
                          try {
                            const { applyAppTheme, startAutoThemeObserver } = require('@/lib/theme')
                            if (appTheme === 'auto') {
                              // start observer which will set classes
                              startAutoThemeObserver()
                              localStorage.setItem('procastiview-app-theme', 'auto')
                            } else {
                              applyAppTheme(appTheme)
                              localStorage.setItem('procastiview-app-theme', appTheme)
                            }
                          } catch (e) {
                            // ignore
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          ((profile as any)?.appTheme || localStorage.getItem('procastiview-app-theme') || 'auto') === opt.value
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/40 bg-background/30 text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Breathing Settings Section */}
              {mounted && (
                <div className="flex flex-col border-b border-border/50 py-3 gap-3">
                  <button
                    onClick={() => setShowBreathOptions(v => !v)}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-primary text-sm font-bold italic">Breathing Theme</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {breathMode === 'gradient' ? 'Gradient' : 'Solid'}
                    </span>
                  </button>

                  {showBreathOptions && (
                    <div className="space-y-3 rounded-xl border border-primary/10 bg-background/40 p-3">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Solid</div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: '#4fc3ff', label: 'Ocean' },
                            { value: '#34d399', label: 'Emerald' },
                            { value: '#f43f5e', label: 'Rose' },
                            { value: '#a855f7', label: 'Violet' },
                            { value: '#f59e0b', label: 'Amber' },
                            { value: '#0f172a', label: 'Midnight' }
                          ].map(option => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setBreathMode('solid')
                                setBreathSolid(option.value)
                                const next = { breathMode: 'solid' as ThemeMode, breathSolid: option.value, breathGradientStart, breathGradientEnd, breathGradientDirection }
                                applyBreathingSettings(next as any)
                                void updateUserThemeSettings(uid, next as any)
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-[1.5px] text-xs font-bold italic transition-all ${
                                breathMode === 'solid' && breathSolid === option.value
                                  ? 'border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(79,195,255,0.3)]'
                                  : 'border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50'
                              }`}
                            >
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: option.value }} />
                              {option.label}
                            </button>
                          ))}

                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="color"
                              value={breathSolid}
                              onChange={(e) => {
                                const v = e.target.value
                                setBreathMode('solid')
                                setBreathSolid(v)
                                const next = { breathMode: 'solid' as ThemeMode, breathSolid: v, breathGradientStart, breathGradientEnd, breathGradientDirection }
                                applyBreathingSettings(next as any)
                                localStorage.setItem('procastiview-breathing-settings', JSON.stringify(next))
                                void updateUserThemeSettings(uid, next as any)
                              }}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="text-xs font-mono text-muted-foreground">{breathSolid.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Gradient</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="color"
                            value={breathGradientStart}
                            onChange={(e) => {
                              const nextStart = e.target.value
                              setBreathMode('gradient')
                              setBreathGradientStart(nextStart)
                            }}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                          />
                          <span className="text-xs text-muted-foreground">to</span>
                          <input
                            type="color"
                            value={breathGradientEnd}
                            onChange={(e) => {
                              const nextEnd = e.target.value
                              setBreathMode('gradient')
                              setBreathGradientEnd(nextEnd)
                            }}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                          />
                          <select
                            value={breathGradientDirection}
                            onChange={(e) => setBreathGradientDirection(e.target.value as GradientDirection)}
                            className="rounded-lg border border-border/60 bg-background/50 px-2 py-1.5 text-xs text-muted-foreground"
                          >
                            <option value="to-r">Left → Right</option>
                            <option value="to-l">Right → Left</option>
                            <option value="to-t">Bottom → Top</option>
                            <option value="to-b">Top → Bottom</option>
                            <option value="to-tr">Bottom Left → Top Right</option>
                            <option value="to-br">Top Left → Bottom Right</option>
                            <option value="to-tl">Bottom Right → Top Left</option>
                            <option value="to-bl">Top Right → Bottom Left</option>
                            <option value="radial">Center Out</option>
                            <option value="conic">Conic Sweep</option>
                          </select>
                          <button
                            onClick={() => {
                              const next = {
                                breathMode: 'gradient' as ThemeMode,
                                breathSolid,
                                breathGradientStart,
                                breathGradientEnd,
                                breathGradientDirection
                              }
                              setBreathMode('gradient')
                              applyBreathingSettings(next as any)
                              localStorage.setItem('procastiview-breathing-settings', JSON.stringify(next))
                              void updateUserThemeSettings(uid, next as any)
                            }}
                            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold italic text-primary"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Public Share Profile Section */}
              <div className="flex flex-col border-b border-border/50 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-bold italic">Share Public Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background/50 border-[1.5px] border-primary/30 rounded-lg px-3 py-2 overflow-hidden">
                    <span className="text-muted-foreground text-xs italic whitespace-nowrap overflow-hidden text-ellipsis block w-full select-all">
                      {typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/${profile.user_name}` : `https://procastiview.com/${profile.user_name}`}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/${profile.user_name}`)
                        setCopiedLink(true)
                        setTimeout(() => setCopiedLink(false), 2000)
                      }
                    }}
                    className="p-2 bg-primary/10 border-[1.5px] border-primary/50 text-primary rounded-lg hover:bg-primary/20 transition-all flex-shrink-0"
                    title="Copy Profile Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground italic mt-1.5">
                  Anyone with this link and your passcode can view your stats.
                </span>
              </div>
            </div>
          </div>
          
          {/* Context Footer Data */}
          {profile.created_at && (
            <div className="mt-4 text-center text-muted-foreground/60 text-xs italic">
              Member Since:{' '}
              {typeof profile.created_at === 'number' 
                ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : profile.created_at?.seconds 
                  ? new Date(profile.created_at.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Unknown'
              }
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            {isEditing ? (
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditName(profile.name)
                    setEditUsername(profile.user_name)
                    setEditPhone(profile.phone_number || '')
                    setEditPassword('')
                    setEditPasscode('')
                    setEditError('')
                  }}
                  disabled={isSaving}
                  className="flex-1 py-3 border-[1.5px] border-muted-foreground/50 rounded-lg text-muted-foreground font-medium text-sm italic transition-all hover:bg-muted-foreground/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || isCheckingUsername || usernameTakenStatus === 'taken'}
                  className="flex-1 py-3 border-[1.5px] border-secondary rounded-lg bg-secondary/20 text-secondary font-bold text-sm italic transition-all hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 border-[1.5px] border-primary/50 rounded-lg bg-primary/10 text-primary font-bold text-sm italic transition-all hover:bg-primary/20"
              >
                Edit Profile
              </button>
            )}

            {/* Upgrade Button (only for free users) */}
            {!isEditing && profile.model === 'free' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3 border-[1.5px] border-secondary rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary font-bold text-sm italic transition-all hover:from-secondary/30 hover:to-secondary/20 hover:shadow-[0_0_15px_rgba(124,255,154,0.4)]"
              >
                Upgrade to Paid ($3/month)
              </button>
            )}

            {/* Logout Button */}
            {!isEditing && (
              <button
                onClick={handleLogout}
                className="w-full py-3 border-[1.5px] border-red-500/50 rounded-lg bg-red-500/10 text-red-400 font-bold text-sm italic transition-all hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm border-2 border-border rounded-2xl animate-glow p-6 bg-background animate-fade-in">
            {!paymentSuccess ? (
              <>
                <h3 className="text-primary text-xl font-bold italic mb-4 text-center">
                  Upgrade to Paid
                </h3>
                
                <div className="bg-primary/10 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-primary">$3</span>
                    <span className="text-muted-foreground text-sm italic">/month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground italic">
                    <li className="flex items-center gap-2">
                      <span className="text-secondary">✓</span> Unlimited categories
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-secondary">✓</span> Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-secondary">✓</span> Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-secondary">✓</span> Cloud backup
                    </li>
                  </ul>
                </div>

                {/* Mock Card Input */}
                <div className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="Card Number"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full px-4 py-2.5 border-[1.5px] border-primary/50 rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-primary"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/25"
                      className="flex-1 px-4 py-2.5 border-[1.5px] border-primary/50 rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      defaultValue="123"
                      className="w-20 px-4 py-2.5 border-[1.5px] border-primary/50 rounded-lg bg-primary/10 text-foreground italic text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 border-[1.5px] border-muted-foreground/50 rounded-lg text-muted-foreground font-medium text-sm italic transition-all hover:bg-muted-foreground/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 border-[1.5px] border-secondary rounded-lg bg-secondary/20 text-secondary font-bold text-sm italic transition-all hover:bg-secondary/30 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Pay $3'}
                  </button>
                </div>

                <p className="text-muted-foreground/60 text-xs italic text-center mt-4">
                  This is a demo. No real payment will be processed.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary text-3xl">✓</span>
                </div>
                <h3 className="text-secondary text-xl font-bold italic mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground text-sm italic">
                  Welcome to Procrastiview Paid!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
