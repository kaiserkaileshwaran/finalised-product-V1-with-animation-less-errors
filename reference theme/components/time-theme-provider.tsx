"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "day" | "sunrise" | "sunset" | "night"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isAutoTheme: boolean
  setIsAutoTheme: (auto: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Get theme based on current hour
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours()
  
  // Sunrise: 5 AM - 9 AM
  if (hour >= 5 && hour < 9) return "sunrise"
  // Day: 9 AM - 5 PM
  if (hour >= 9 && hour < 17) return "day"
  // Sunset: 5 PM - 8 PM
  if (hour >= 17 && hour < 20) return "sunset"
  // Night: 8 PM - 5 AM
  return "night"
}

export function TimeThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("night")
  const [isAutoTheme, setIsAutoTheme] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("roadforge-theme") as Theme | null
    const savedAuto = localStorage.getItem("roadforge-auto-theme")
    
    if (savedAuto === "false" && savedTheme) {
      setIsAutoTheme(false)
      setTheme(savedTheme)
    } else {
      setIsAutoTheme(true)
      setTheme(getTimeBasedTheme())
    }
  }, [])

  // Update theme periodically when auto mode is enabled
  useEffect(() => {
    if (!isAutoTheme) return

    const updateTheme = () => {
      setTheme(getTimeBasedTheme())
    }

    // Check every minute
    const interval = setInterval(updateTheme, 60000)
    return () => clearInterval(interval)
  }, [isAutoTheme])

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.remove("day", "sunrise", "sunset", "night", "dark")
    root.classList.add(theme)
    
    // Save preferences
    localStorage.setItem("roadforge-theme", theme)
    localStorage.setItem("roadforge-auto-theme", String(isAutoTheme))
  }, [theme, mounted, isAutoTheme])

  const handleSetTheme = (newTheme: Theme) => {
    setIsAutoTheme(false)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isAutoTheme, setIsAutoTheme }}>
      <div className={mounted ? "" : "opacity-0"}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTimeTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTimeTheme must be used within a TimeThemeProvider")
  }
  return context
}
