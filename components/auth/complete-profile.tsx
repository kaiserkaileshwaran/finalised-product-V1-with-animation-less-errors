'use client'

import { useState } from 'react'
import { completeRegistration, checkUsernameExists, getCurrentUser } from '@/lib/firebase-auth'

interface CompleteProfileProps {
  uid: string
  onComplete: () => void
}

export function CompleteProfile({ uid, onComplete }: CompleteProfileProps) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  const currentUser = getCurrentUser()
  const email = currentUser?.email || currentUser?.phoneNumber || ''

  const handleUsernameChange = async (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(sanitized)
    
    if (sanitized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    
    setTimeout(async () => {
      const exists = await checkUsernameExists(sanitized)
      setUsernameStatus(exists ? 'taken' : 'available')
    }, 500)
  }

  const handleComplete = async () => {
    if (!name || !username) {
      setError('Please fill in all fields.')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    if (usernameStatus === 'taken') {
      setError('Username is already taken.')
      return
    }

    setIsLoading(true)
    setError('')

    const result = await completeRegistration(uid, name, username, email)
    
    setIsLoading(false)
    
    if (result.success) {
      onComplete()
    } else {
      setError(result.error || 'Failed to complete profile.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-border rounded-2xl animate-glow p-8 bg-background/50 backdrop-blur-sm">
        <h2 className="text-center text-primary text-2xl font-bold mb-2 italic">Complete Your Profile</h2>
        <p className="text-center text-muted-foreground text-sm italic mb-6">
          Just a few more details to get started
        </p>

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
          </div>

          {/* Email Display */}
          {email && (
            <div>
              <label className="block text-muted-foreground text-xs italic mb-1.5">Email / Phone</label>
              <div className="px-4 py-3 border-[1.5px] border-primary/30 rounded-lg bg-primary/5 text-muted-foreground italic text-sm">
                {email}
              </div>
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={isLoading || usernameStatus === 'taken'}
            className="w-full py-3 mt-2 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic uppercase transition-all hover:from-primary/30 hover:to-primary/20 hover:animate-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </div>
  )
}
