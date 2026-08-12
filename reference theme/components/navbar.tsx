"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon, Sunrise, Sunset, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTimeTheme } from "@/components/time-theme-provider"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Paths", href: "/paths" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
]

const themeOptions = [
  { name: "Auto (Time-based)", value: "auto", icon: Sparkles },
  { name: "Sunrise", value: "sunrise", icon: Sunrise },
  { name: "Day", value: "day", icon: Sun },
  { name: "Sunset", value: "sunset", icon: Sunset },
  { name: "Night", value: "night", icon: Moon },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme, isAutoTheme, setIsAutoTheme } = useTimeTheme()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleThemeChange = (value: string) => {
    if (value === "auto") {
      setIsAutoTheme(true)
    } else {
      setTheme(value as "day" | "sunrise" | "sunset" | "night")
    }
  }

  const currentThemeIcon = {
    sunrise: Sunrise,
    day: Sun,
    sunset: Sunset,
    night: Moon,
  }[theme]

  const ThemeIcon = currentThemeIcon

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "glass-card py-2" 
          : "bg-transparent py-4"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent transition-transform duration-300 group-hover:scale-110 glow-soft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-primary-foreground"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Blueprint
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
            >
              {item.name}
              <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl glass-card border-0 hover:bg-card/80 transition-all duration-300 hover:scale-105"
              >
                <ThemeIcon className="h-4 w-4" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-0 rounded-xl p-2">
              {themeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={cn(
                    "rounded-lg cursor-pointer transition-colors",
                    (option.value === "auto" && isAutoTheme) ||
                      (option.value === theme && !isAutoTheme)
                      ? "bg-primary/10 text-primary"
                      : ""
                  )}
                >
                  {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-card/50">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button 
                    size="sm" 
                    className="rounded-xl h-10 w-10 p-0 bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    {user?.name?.charAt(0) || "U"}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-xl px-4 hover:bg-card/50">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm" 
                    className="rounded-xl px-5 btn-apple text-primary-foreground font-medium"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-xl glass-card border-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="glass-card mx-4 mt-2 rounded-2xl p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-card/50 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-card/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-card/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-card/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block rounded-xl px-4 py-3 text-base font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
