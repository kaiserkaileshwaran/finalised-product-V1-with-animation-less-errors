'use client'

import { useState, useRef, useEffect } from 'react'
import { verifyPasscode, setupPasscode } from '@/lib/firebase-auth'
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react'

interface PasscodeScreenProps {
  uid: string
  onSuccess: () => void
  hasPasscode: boolean
}

export function PasscodeScreen({ uid, onSuccess, hasPasscode }: PasscodeScreenProps) {
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [step, setStep] = useState<'enter' | 'setup' | 'confirm'>(hasPasscode ? 'enter' : 'setup')
  const [error, setError] = useState<string | null>(null)
  const [isShake, setIsShake] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasscode, setShowPasscode] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const handleShake = () => {
    setIsShake(true)
    setTimeout(() => setIsShake(false), 600)
    setPasscode('')
    if (step === 'confirm') setConfirmPasscode('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode || passcode.length < 1) {
      setError('Please enter a passcode')
      handleShake()
      return
    }

    if (step === 'enter') {
      setIsLoading(true)
      const { success } = await verifyPasscode(uid, passcode)
      setIsLoading(false)
      
      if (success) {
        setIsSuccess(true)
        setTimeout(() => { onSuccess() }, 900)
      } else {
        setError('Access denied. Wrong passcode.')
        handleShake()
      }
    } else if (step === 'setup') {
      setConfirmPasscode(passcode)
      setPasscode('')
      setStep('confirm')
      setError(null)
    } else if (step === 'confirm') {
      if (passcode !== confirmPasscode) {
        setError('Passcodes do not match. Try again.')
        setPasscode('')
        setConfirmPasscode('')
        setStep('setup')
        handleShake()
        return
      }

      setIsLoading(true)
      const { success, error: setupError } = await setupPasscode(uid, passcode)
      setIsLoading(false)

      if (success) {
        setIsSuccess(true)
        setTimeout(() => { onSuccess() }, 900)
      } else {
        setError(setupError || 'Failed to setup passcode')
        handleShake()
      }
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-[0_0_30px_rgba(79,195,255,0.4)]">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl text-primary font-bold italic animate-pulse">Welcome Back</h2>
        <p className="text-muted-foreground mt-2 text-sm italic">Unlocking your records…</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-4">
      {/* Animated bg glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-500 ${isShake ? 'bg-destructive/10' : 'bg-primary/5'}`} />
      </div>

      <div className={`relative w-full max-w-sm p-8 bg-card/90 backdrop-blur-md border-2 rounded-2xl shadow-[0_0_40px_rgba(79,195,255,0.1)] transition-all duration-300 ${
        isShake 
          ? 'border-destructive shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-shake' 
          : 'border-primary/40 hover:border-primary/60'
      }`}>
        <div className="text-center mb-8">
          <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            isShake ? 'bg-destructive/20' : 'bg-primary/10'
          }`}>
            <Shield className={`w-7 h-7 transition-colors duration-300 ${isShake ? 'text-destructive' : 'text-primary'}`} />
          </div>
          <h2 className={`text-2xl font-bold italic transition-colors duration-300 ${isShake ? 'text-destructive' : 'text-foreground'}`}>
            {step === 'enter' ? 'Enter Passcode' : step === 'setup' ? 'Create Passcode' : 'Confirm Passcode'}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {step === 'enter' 
              ? 'Enter your ProcastiView passcode to unlock your records.'
              : step === 'setup'
                ? 'Create any passcode — letters, numbers, or symbols.'
                : 'Re-enter your passcode to confirm.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value)
                if (error) setError(null)
              }}
              disabled={isLoading}
              autoComplete="off"
              className={`w-full text-center text-2xl tracking-widest p-4 pr-12 bg-background/80 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                isShake 
                  ? 'border-destructive text-destructive placeholder-destructive/50' 
                  : 'border-primary/40 focus:border-primary text-foreground'
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
            <p className={`text-sm text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200 ${isShake ? 'text-destructive' : 'text-destructive/80'}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || passcode.length < 1}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold italic transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(79,195,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading 
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</>
              : step === 'enter' ? 'Unlock' : 'Continue'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
