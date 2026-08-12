export type ThemeMode = 'solid' | 'gradient'
export type GradientDirection = 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-br' | 'to-tl' | 'to-bl' | 'radial' | 'conic'

export interface ThemeSettings {
  themeMode: ThemeMode
  solidColor: string
  gradientStart: string
  gradientEnd: string
  gradientDirection: GradientDirection
}

export interface BreathingSettings {
  breathMode: ThemeMode
  breathSolid: string
  breathGradientStart: string
  breathGradientEnd: string
  breathGradientDirection: GradientDirection
}

const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  themeMode: 'solid',
  solidColor: '#4fc3ff',
  gradientStart: '#4fc3ff',
  gradientEnd: '#8b5cf6',
  gradientDirection: 'to-br',
}

function normalizeHex(color: string): string {
  const value = color.trim()
  if (!value) return DEFAULT_THEME_SETTINGS.solidColor
  if (value.startsWith('#')) return value
  return value
}

function hexToRgb(hex: string) {
  const clean = normalizeHex(hex).replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const int = Number.parseInt(full, 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const toLinear = (value: number) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export function getReadableTextColor(hex: string): string {
  return getLuminance(hex) > 0.56 ? '#0f172a' : '#f8fafc'
}

export function getStoredThemeSettings(profile: { themeMode?: ThemeMode; solidColor?: string; gradientStart?: string; gradientEnd?: string; gradientDirection?: GradientDirection } | null | undefined): ThemeSettings {
  return {
    themeMode: profile?.themeMode === 'gradient' ? 'gradient' : 'solid',
    solidColor: normalizeHex(profile?.solidColor || DEFAULT_THEME_SETTINGS.solidColor),
    gradientStart: normalizeHex(profile?.gradientStart || DEFAULT_THEME_SETTINGS.gradientStart),
    gradientEnd: normalizeHex(profile?.gradientEnd || DEFAULT_THEME_SETTINGS.gradientEnd),
    gradientDirection: profile?.gradientDirection || DEFAULT_THEME_SETTINGS.gradientDirection,
  }
}

export function getStoredBreathingSettings(profile: { breathMode?: ThemeMode; breathSolid?: string; breathGradientStart?: string; breathGradientEnd?: string; breathGradientDirection?: GradientDirection } | null | undefined): BreathingSettings {
  return {
    breathMode: profile?.breathMode === 'gradient' ? 'gradient' : 'solid',
    breathSolid: normalizeHex(profile?.breathSolid || DEFAULT_THEME_SETTINGS.solidColor),
    breathGradientStart: normalizeHex(profile?.breathGradientStart || DEFAULT_THEME_SETTINGS.gradientStart),
    breathGradientEnd: normalizeHex(profile?.breathGradientEnd || DEFAULT_THEME_SETTINGS.gradientEnd),
    breathGradientDirection: profile?.breathGradientDirection || DEFAULT_THEME_SETTINGS.gradientDirection,
  }
}

function buildBackgroundImage(settings: ThemeSettings): string {
  const start = normalizeHex(settings.gradientStart)
  const end = normalizeHex(settings.gradientEnd)
  switch (settings.gradientDirection) {
    case 'to-r':
      return `linear-gradient(to right, ${start}, ${end})`
    case 'to-l':
      return `linear-gradient(to left, ${start}, ${end})`
    case 'to-t':
      return `linear-gradient(to top, ${start}, ${end})`
    case 'to-b':
      return `linear-gradient(to bottom, ${start}, ${end})`
    case 'to-tr':
      return `linear-gradient(to top right, ${start}, ${end})`
    case 'to-tl':
      return `linear-gradient(to top left, ${start}, ${end})`
    case 'to-br':
      return `linear-gradient(to bottom right, ${start}, ${end})`
    case 'to-bl':
      return `linear-gradient(to bottom left, ${start}, ${end})`
    case 'radial':
      return `radial-gradient(circle at center, ${start}, ${end})`
    case 'conic':
      return `conic-gradient(from 45deg, ${start}, ${end}, ${start})`
    default:
      return `linear-gradient(to bottom right, ${start}, ${end})`
  }
}

export function applyThemeSettings(settings: ThemeSettings, root: HTMLElement = document.documentElement) {
  const solidColor = normalizeHex(settings.solidColor)
  const gradientStart = normalizeHex(settings.gradientStart)
  const gradientEnd = normalizeHex(settings.gradientEnd)
  const primaryColor = settings.themeMode === 'solid' ? solidColor : `color-mix(in srgb, ${gradientStart} 70%, ${gradientEnd})`
  const secondaryColor = settings.themeMode === 'solid' ? `color-mix(in srgb, ${solidColor} 60%, #ffffff)` : gradientEnd
  const primaryForeground = getReadableTextColor(settings.themeMode === 'solid' ? solidColor : gradientStart)
  const secondaryForeground = getReadableTextColor(settings.themeMode === 'solid' ? solidColor : gradientEnd)

  if (settings.themeMode === 'solid') {
    root.style.setProperty('--color-background', `color-mix(in srgb, ${solidColor} 8%, #05070b)`) 
    root.style.setProperty('--color-foreground', `color-mix(in srgb, ${solidColor} 18%, #ffffff)`) 
    root.style.setProperty('--color-card', `color-mix(in srgb, ${solidColor} 12%, #111827)`) 
    root.style.setProperty('--color-primary', solidColor)
    root.style.setProperty('--color-secondary', `color-mix(in srgb, ${solidColor} 60%, #ffffff)`) 
    root.style.setProperty('--color-muted', `color-mix(in srgb, ${solidColor} 14%, #1f2937)`) 
    root.style.setProperty('--color-border', `color-mix(in srgb, ${solidColor} 20%, #334155)`)
    root.style.setProperty('--color-destructive', '#ff6b6b')
    root.style.setProperty('--color-primary-foreground', primaryForeground)
    root.style.setProperty('--color-secondary-foreground', secondaryForeground)
    root.style.setProperty('--color-card-foreground', primaryForeground)
    root.style.setProperty('--color-popover-foreground', primaryForeground)
    root.style.setProperty('--app-background-image', 'none')
  } else {
    root.style.setProperty('--color-background', `color-mix(in srgb, ${gradientStart} 24%, #05070b 76%)`)
    root.style.setProperty('--color-foreground', getReadableTextColor(gradientStart))
    root.style.setProperty('--color-card', `color-mix(in srgb, ${gradientStart} 22%, #111827 78%)`)
    root.style.setProperty('--color-primary', `color-mix(in srgb, ${gradientStart} 60%, ${gradientEnd})`)
    root.style.setProperty('--color-secondary', gradientEnd)
    root.style.setProperty('--color-muted', `color-mix(in srgb, ${gradientStart} 18%, #1f2937 82%)`)
    root.style.setProperty('--color-border', `color-mix(in srgb, ${gradientStart} 24%, ${gradientEnd} 76%)`)
    root.style.setProperty('--color-destructive', '#ff6b6b')
    root.style.setProperty('--color-primary-foreground', primaryForeground)
    root.style.setProperty('--color-secondary-foreground', secondaryForeground)
    root.style.setProperty('--color-card-foreground', primaryForeground)
    root.style.setProperty('--color-popover-foreground', primaryForeground)
    root.style.setProperty('--app-background-image', buildBackgroundImage(settings))
  }

  root.style.setProperty('--theme-glow-primary', `color-mix(in srgb, ${primaryColor} 70%, white 30%)`)
  root.style.setProperty('--theme-glow-secondary', `color-mix(in srgb, ${secondaryColor} 80%, white 20%)`)
  // Do not override `data-theme` here. App themes (sunrise/day/sunset/night/auto)
  // are applied via `applyAppTheme` to preserve Blog theme classes. This
  // function only updates token variables for custom user themes.
}

export function buildBreathBackgroundImage(settings: BreathingSettings): string {
  const start = normalizeHex(settings.breathGradientStart)
  const end = normalizeHex(settings.breathGradientEnd)
  switch (settings.breathGradientDirection) {
    case 'to-r':
      return `linear-gradient(to right, ${start}, ${end})`
    case 'to-l':
      return `linear-gradient(to left, ${start}, ${end})`
    case 'to-t':
      return `linear-gradient(to top, ${start}, ${end})`
    case 'to-b':
      return `linear-gradient(to bottom, ${start}, ${end})`
    case 'to-tr':
      return `linear-gradient(to top right, ${start}, ${end})`
    case 'to-tl':
      return `linear-gradient(to top left, ${start}, ${end})`
    case 'to-br':
      return `linear-gradient(to bottom right, ${start}, ${end})`
    case 'to-bl':
      return `linear-gradient(to bottom left, ${start}, ${end})`
    case 'radial':
      return `radial-gradient(circle at center, ${start}, ${end})`
    case 'conic':
      return `conic-gradient(from 45deg, ${start}, ${end}, ${start})`
    default:
      return `linear-gradient(to bottom right, ${start}, ${end})`
  }
}

export function applyBreathingSettings(settings: BreathingSettings, root: HTMLElement = document.documentElement) {
  const primary = settings.breathMode === 'solid' ? normalizeHex(settings.breathSolid) : `color-mix(in srgb, ${normalizeHex(settings.breathGradientStart)} 70%, ${normalizeHex(settings.breathGradientEnd)})`
  const secondary = settings.breathMode === 'solid' ? `color-mix(in srgb, ${normalizeHex(settings.breathSolid)} 60%, #ffffff)` : normalizeHex(settings.breathGradientEnd)

  root.style.setProperty('--breath-glow-primary', primary)
  root.style.setProperty('--breath-glow-secondary', secondary)
  // Keep a background version for gradient breathing visuals if needed
  if (settings.breathMode === 'gradient') {
    root.style.setProperty('--breath-background-image', buildBreathBackgroundImage(settings))
  } else {
    root.style.setProperty('--breath-background-image', 'none')
  }
}

export type AppTheme = 'auto' | 'sunrise' | 'day' | 'sunset' | 'night'

export function computeLocalAppTheme(now = new Date()): AppTheme {
  const hour = now.getHours()
  // Sunrise: 5-9
  if (hour >= 5 && hour < 9) return 'sunrise'
  // Day: 9-17
  if (hour >= 9 && hour < 17) return 'day'
  // Sunset: 17-20
  if (hour >= 17 && hour < 20) return 'sunset'
  // Night: otherwise
  return 'night'
}

export function applyAppTheme(theme: AppTheme, root: HTMLElement = document.documentElement) {
  const themeClasses = ['day', 'sunrise', 'sunset', 'night', 'dark']

  const applyFor = (t: AppTheme) => {
    // remove any existing theme classes
    themeClasses.forEach((c) => root.classList.remove(c))
    // add corresponding class for blog CSS compatibility
    if (t === 'day') root.classList.add('day')
    else if (t === 'sunrise') root.classList.add('sunrise')
    else if (t === 'sunset') root.classList.add('sunset')
    else if (t === 'night') root.classList.add('night')

    // set data-theme attribute used by other css variants
    root.setAttribute('data-theme', t)
  }

  if (theme === 'auto') {
    const resolved = computeLocalAppTheme()
    applyFor(resolved)
  } else {
    applyFor(theme)
  }
}

export function startAutoThemeObserver(onChange?: (theme: AppTheme) => void) {
  let timer: number | undefined
  const applyNow = () => {
    const theme = computeLocalAppTheme()
    applyAppTheme(theme)
    if (onChange) onChange(theme)
  }

  applyNow()

  // Check every minute for transitions
  timer = window.setInterval(applyNow, 60 * 1000)

  return () => {
    if (timer) clearInterval(timer)
  }
}
