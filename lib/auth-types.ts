export interface UserProfile {
  user_name: string
  name: string
  email: string
  phone_number?: string
  model: 'free' | 'paid'
  created_at: number | { seconds: number; nanoseconds: number } | null
  passcodeHash?: string
  themeMode?: 'solid' | 'gradient'
  solidColor?: string
  gradientStart?: string
  gradientEnd?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-br' | 'to-tl' | 'to-bl' | 'radial' | 'conic'
  // Breathing-specific theme (visual-only, separate from global app theme)
  breathMode?: 'solid' | 'gradient'
  breathSolid?: string
  breathGradientStart?: string
  breathGradientEnd?: string
  breathGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-br' | 'to-tl' | 'to-bl' | 'radial' | 'conic'
  // App theme preference (uses Blog session names)
  appTheme?: 'auto' | 'sunrise' | 'day' | 'sunset' | 'night'
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserProfile | null
  uid: string | null
}
