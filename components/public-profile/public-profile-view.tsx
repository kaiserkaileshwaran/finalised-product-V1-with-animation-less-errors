'use client'

import { useEffect, useState } from 'react'
import type { UserProfile } from '@/lib/auth-types'
import type { AppData } from '@/lib/types'
import { ProgressView } from '@/components/daily-quest/progress-view'
import { StreakCalendar } from '@/components/daily-quest/streak-calendar'
import { TrendingUp, Calendar, User } from 'lucide-react'
import { applyThemeSettings, getStoredThemeSettings } from '@/lib/theme'

interface PublicProfileViewProps {
  profile: UserProfile
  appData: AppData
  username: string
}

export function PublicProfileView({ profile, appData, username }: PublicProfileViewProps) {
  const [showProgress, setShowProgress] = useState(false)
  const [showStreak, setShowStreak] = useState(false)

  useEffect(() => {
    const settings = getStoredThemeSettings(profile)
    applyThemeSettings(settings)
  }, [profile])

  const categoryCount = Object.keys(appData.categories).length
  const completedCount = Object.values(appData.categories).filter(c => c.completed).length

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl bg-primary/5" />
      </div>

      <div className="relative w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(79,195,255,0.15)]">
            <span className="text-primary font-bold text-3xl italic">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold italic text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">@{username}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium italic">
            <User className="w-3 h-3" />
            ProcastiView Profile
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur text-center">
            <div className="text-3xl font-bold text-primary font-mono">{categoryCount}</div>
            <div className="text-muted-foreground text-xs mt-1">Total Categories</div>
          </div>
          <div className="p-4 rounded-2xl border border-secondary/20 bg-card/60 backdrop-blur text-center">
            <div className="text-3xl font-bold text-secondary font-mono">{completedCount}</div>
            <div className="text-muted-foreground text-xs mt-1">Completed</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowProgress(true)}
            className="w-full py-4 rounded-xl border-[1.5px] border-primary bg-primary/10 text-primary font-bold italic flex items-center justify-center gap-3 transition-all hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(79,195,255,0.2)]"
          >
            <TrendingUp className="w-5 h-5" />
            View Progress & Logs
          </button>
          <button
            onClick={() => setShowStreak(true)}
            className="w-full py-4 rounded-xl border-[1.5px] border-primary/50 bg-primary/5 text-primary/80 font-bold italic flex items-center justify-center gap-3 transition-all hover:bg-primary/15 hover:border-primary"
          >
            <Calendar className="w-5 h-5" />
            View Streak Calendar
          </button>
        </div>

        <p className="text-center text-muted-foreground/40 text-xs italic mt-8">
          Read-only view · Powered by ProcastiView
        </p>
      </div>

      {/* Read-only Progress Modal */}
      <ProgressView
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        categories={appData.categories}
        initialCategoryId={null}
      />

      {/* Read-only Streak Modal */}
      <StreakCalendar
        isOpen={showStreak}
        onClose={() => setShowStreak(false)}
        categories={appData.categories}
      />
    </div>
  )
}
