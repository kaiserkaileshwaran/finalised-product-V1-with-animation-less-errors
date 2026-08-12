"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Trophy,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Newspaper,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Learning Paths", href: "/paths", icon: Map },
  { name: "My Progress", href: "/dashboard/progress", icon: BookOpen },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Blog", href: "/blog", icon: Newspaper },
]

const bottomNav = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col glass-card border-0 border-r border-border/30 transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between px-5">
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
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Blueprint
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl glass-card border-0 hover:bg-card/80"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User info with streak */}
      {user && (
        <div className={cn("mx-4 mb-4 p-4 rounded-2xl glass-card", collapsed && "mx-2 p-2")}>
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground shrink-0">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="truncate font-semibold">{user.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span>{user.currentStreak} streak</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <span>{user.totalXp?.toLocaleString() || 0} XP</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3", collapsed && "hidden")}>
          Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary glow-soft"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
                collapsed && "justify-center px-3"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-primary/10" : "bg-transparent group-hover:bg-card/50"
              )}>
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              </div>
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && (
                <Sparkles className="h-3 w-3 text-primary ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border/30 p-4 space-y-1">
        <p className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3", collapsed && "hidden")}>
          Account
        </p>
        {bottomNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
                collapsed && "justify-center px-3"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              </div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-3"
          )}
        >
          <div className="p-2 rounded-lg bg-transparent">
            <LogOut className="h-5 w-5 shrink-0" />
          </div>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}
