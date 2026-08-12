'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  loginWithEmail, 
  loginWithGoogle, 
  setupRecaptcha, 
  sendPhoneOTP, 
  verifyPhoneOTP 
} from '@/lib/firebase-auth'
import { RecaptchaVerifier } from 'firebase/auth'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'

// Common country codes
const COUNTRY_CODES: { code: string; country: string; flag: string; emoji: string }[] = [
  { code: '+1', country: 'US/CA', flag: 'US', emoji: '🇺🇸' },
  { code: '+44', country: 'UK', flag: 'GB', emoji: '🇬🇧' },
  { code: '+91', country: 'IN', flag: 'IN', emoji: '🇮🇳' },
  { code: '+61', country: 'AU', flag: 'AU', emoji: '🇦🇺' },
  { code: '+49', country: 'DE', flag: 'DE', emoji: '🇩🇪' },
  { code: '+33', country: 'FR', flag: 'FR', emoji: '🇫🇷' },
  { code: '+81', country: 'JP', flag: 'JP', emoji: '🇯🇵' },
  { code: '+86', country: 'CN', flag: 'CN', emoji: '🇨🇳' },
  { code: '+55', country: 'BR', flag: 'BR', emoji: '🇧🇷' },
  { code: '+52', country: 'MX', flag: 'MX', emoji: '🇲🇽' },
  { code: '+39', country: 'IT', flag: 'IT', emoji: '🇮🇹' },
  { code: '+34', country: 'ES', flag: 'ES', emoji: '🇪🇸' },
  { code: '+7', country: 'RU', flag: 'RU', emoji: '🇷🇺' },
  { code: '+82', country: 'KR', flag: 'KR', emoji: '🇰🇷' },
  { code: '+31', country: 'NL', flag: 'NL', emoji: '🇳🇱' },
  { code: '+46', country: 'SE', flag: 'SE', emoji: '🇸🇪' },
  { code: '+41', country: 'CH', flag: 'CH', emoji: '🇨🇭' },
  { code: '+65', country: 'SG', flag: 'SG', emoji: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: 'AE', emoji: '🇦🇪' },
  { code: '+966', country: 'SA', flag: 'SA', emoji: '🇸🇦' },
]

interface LoginScreenProps {
  onSwitchToRegister: () => void
  onLoginSuccess: (uid: string, isNewUser?: boolean) => void
}

export function LoginScreen({ onSwitchToRegister, onLoginSuccess }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'google'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countrySelectorOpen, setCountrySelectorOpen] = useState(false)
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  // Initialize recaptcha on mount
  useEffect(() => {
    if (activeTab === 'phone' && !recaptchaVerifierRef.current) {
      setupRecaptcha('recaptcha-container').then(verifier => {
        recaptchaVerifierRef.current = verifier
      }).catch(() => {
        setError('Failed to initialize phone verification. Please refresh the page.')
      })
    }
  }, [activeTab])

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await loginWithEmail(email, password)
      setIsLoading(false)
      
      if (result.success && result.uid) {
        onLoginSuccess(result.uid)
      } else {
        setError(result.error || 'Login failed.')
      }
    } catch {
      setIsLoading(false)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await loginWithGoogle()
      setIsLoading(false)
      
      if (result.success && result.uid) {
        onLoginSuccess(result.uid, result.isNewUser)
      } else {
        setError(result.error || 'Google sign-in failed.')
      }
    } catch {
      setIsLoading(false)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter phone number.')
      return
    }

    // Format phone number with selected country code
    const formattedPhone = countryCode + phone.trim()

    setIsLoading(true)
    setError('')

    try {
      if (!recaptchaVerifierRef.current) {
        const verifier = await setupRecaptcha('recaptcha-container')
        recaptchaVerifierRef.current = verifier
      }

      const result = await sendPhoneOTP(formattedPhone, recaptchaVerifierRef.current)
      setIsLoading(false)
      
      if (result.success) {
        setOtpSent(true)
      } else {
        setError(result.error || 'Failed to send OTP.')
      }
    } catch {
      setIsLoading(false)
      setError('Failed to send OTP. Please try again.')
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP.')
      return
    }

    setIsLoading(true)
    setError('')

    const result = await verifyPhoneOTP(otp)
    setIsLoading(false)
    
    if (result.success && result.uid) {
      onLoginSuccess(result.uid, result.isNewUser)
    } else {
      setError(result.error || 'Invalid OTP.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="border-2 border-border rounded-2xl animate-glow p-5 sm:p-8 bg-background/50 backdrop-blur-sm">
        <h2 className="text-center text-primary text-2xl font-bold mb-6 italic">Welcome Back</h2>
        
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          {(['email', 'phone', 'google'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setError('')
                setOtpSent(false)
              }}
              className={`flex-1 py-2 px-3 rounded-lg border-[1.5px] transition-all text-sm font-medium italic capitalize ${
                activeTab === tab
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-muted-foreground/30 bg-transparent text-muted-foreground hover:border-primary/50'
              }`}
            >
              {tab === 'email' ? 'Email' : tab === 'phone' ? 'Phone' : 'Google'}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm italic">
            {error}
          </div>
        )}

        {/* Email Login */}
        {activeTab === 'email' && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
              className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
            />
            <button
              onClick={handleEmailLogin}
              disabled={isLoading}
              className="w-full py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic uppercase transition-all hover:from-primary/30 hover:to-primary/20 hover:animate-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}

        {/* Phone Login */}
        {activeTab === 'phone' && (
          <div className="flex flex-col gap-4">
            {!otpSent ? (
              <>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
                  <Popover open={countrySelectorOpen} onOpenChange={setCountrySelectorOpen}>
                    <PopoverTrigger asChild>
                      <button
                        role="combobox"
                        aria-expanded={countrySelectorOpen}
                        className="px-4 py-3 border-[1.5px] border-primary/50 text-foreground rounded-lg bg-primary/20 italic text-sm font-medium focus:outline-none focus:border-secondary flex items-center justify-between w-full sm:w-[130px] hover:bg-primary/30 transition-colors shadow-[0_0_10px_rgba(79,195,255,0.1)]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg leading-none">{COUNTRY_CODES.find(c => c.code === countryCode)?.emoji}</span>
                          <span className="tracking-wide">{countryCode}</span>
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 border-primary/50 bg-background/80 backdrop-blur-md shadow-[0_0_15px_rgba(79,195,255,0.2)]">
                      <Command className="bg-transparent border-none">
                        <CommandInput placeholder="Search code/country..." className="text-sm italic" />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {COUNTRY_CODES.map((c) => (
                              <CommandItem
                                key={c.code + c.country}
                                value={`${c.code} ${c.country} ${c.flag}`}
                                onSelect={() => {
                                  setCountryCode(c.code)
                                  setCountrySelectorOpen(false)
                                }}
                                className="text-sm cursor-pointer aria-selected:bg-primary/20"
                              >
                                <span className="mr-2">{c.emoji}</span>
                                {c.code} {c.country}
                                {countryCode === c.code && (
                                  <Check className="ml-auto h-4 w-4 text-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Phone Number"
                    maxLength={15}
                    className="w-full sm:flex-1 px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
                  />
                </div>
                <p className="text-muted-foreground text-xs italic">
                  Note: Phone auth requires Firebase Blaze plan to be enabled.
                </p>
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic uppercase transition-all hover:from-primary/30 hover:to-primary/20 hover:animate-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm italic text-center">
                  OTP sent to {countryCode}{phone}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm text-center tracking-widest transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50 placeholder:tracking-normal"
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic uppercase transition-all hover:from-primary/30 hover:to-primary/20 hover:animate-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  onClick={() => {
                    setOtpSent(false)
                    setOtp('')
                  }}
                  className="text-muted-foreground text-sm italic hover:text-primary transition-colors"
                >
                  Change phone number
                </button>
              </>
            )}
          </div>
        )}

        {/* Google Login */}
        {activeTab === 'google' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic transition-all hover:from-primary/30 hover:to-primary/20 hover:animate-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            <p className="text-muted-foreground text-xs italic text-center">
              Sign in with your Google account for quick access
            </p>
          </div>
        )}

        {/* Switch to Register */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm italic">
            {"Don't have an account? "}
            <button
              onClick={onSwitchToRegister}
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              Register
            </button>
          </p>
        </div>

        {/* Global Recaptcha Container for Phone Auth */}
        <div id="recaptcha-container" ref={recaptchaContainerRef} className="mt-4 flex justify-center"></div>
      </div>
    </div>
  )
}
