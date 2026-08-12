'use client'

import { useState, useRef, useCallback } from 'react'
import { registerWithEmail, checkUsernameExists } from '@/lib/firebase-auth'

interface RegisterScreenProps {
  onSwitchToLogin: () => void
  onRegisterSuccess: (uid: string) => void
}

export function RegisterScreen({ onSwitchToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Check username availability with debounce
  const handleUsernameChange = useCallback(async (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(sanitized)
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    if (sanitized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    
    // Debounce with proper cleanup
    debounceRef.current = setTimeout(async () => {
      try {
        const exists = await checkUsernameExists(sanitized)
        setUsernameStatus(exists ? 'taken' : 'available')
      } catch {
        setUsernameStatus('idle')
      }
    }, 500)
  }, [])

  const handleRegister = async () => {
    // Validation
    if (!name || !username || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (usernameStatus === 'taken') {
      setError('Username is already taken.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await registerWithEmail(email, password, name, username)
      setIsLoading(false)
      
      if (result.success && result.uid) {
        onRegisterSuccess(result.uid)
      } else {
        setError(result.error || 'Registration failed.')
      }
    } catch {
      setIsLoading(false)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="border-2 border-border rounded-2xl animate-glow p-5 sm:p-8 bg-background/50 backdrop-blur-sm">
        <h2 className="text-center text-primary text-2xl font-bold mb-6 italic">Create Account</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm italic">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-muted-foreground text-xs italic mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-muted-foreground text-xs italic mb-1.5">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="johndoe"
                className={`w-full px-4 py-3 border-[1.5px] rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:animate-glow-subtle placeholder:text-foreground/50 ${
                  usernameStatus === 'available' 
                    ? 'border-secondary' 
                    : usernameStatus === 'taken' 
                    ? 'border-red-500' 
                    : 'border-primary focus:border-secondary'
                }`}
              />
              {usernameStatus !== 'idle' && (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs italic ${
                  usernameStatus === 'checking' 
                    ? 'text-muted-foreground' 
                    : usernameStatus === 'available' 
                    ? 'text-secondary' 
                    : 'text-red-500'
                }`}>
                  {usernameStatus === 'checking' && 'Checking...'}
                  {usernameStatus === 'available' && 'Available'}
                  {usernameStatus === 'taken' && 'Taken'}
                </span>
              )}
            </div>
            <p className="text-muted-foreground/70 text-xs italic mt-1">
              Only lowercase letters, numbers, and underscores
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-muted-foreground text-xs italic mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-muted-foreground text-xs italic mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-muted-foreground text-xs italic mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-sm transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle placeholder:text-foreground/50"
            />
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={isLoading || usernameStatus === 'taken'}
            className="w-full py-3 mt-2 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic uppercase transition-all hover:from-primary/30 hover:to-primary/20 hover:animate-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </div>

        {/* Switch to Login */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm italic">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
