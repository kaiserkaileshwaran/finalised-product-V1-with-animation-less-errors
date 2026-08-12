"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Rocket, Flame, Trophy, Star, Medal, Crown, Zap, Gem, Book, Code, Target, Brain, Shield, Swords, Heart, Moon, Sun, Mountain, Footprints, Award, Sparkles, Lock } from "lucide-react"

interface Badge3DProps {
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
  unlockedAt?: Date
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

const rarityConfig = {
  common: {
    bg: "from-slate-400 via-slate-500 to-slate-600",
    ring: "from-slate-300 to-slate-500",
    glow: "0 0 30px oklch(0.6 0.02 250 / 0.4)",
    particles: "bg-slate-300",
    label: "Common",
    labelBg: "bg-slate-500/20 text-slate-400",
  },
  rare: {
    bg: "from-blue-400 via-blue-500 to-blue-600",
    ring: "from-blue-300 to-cyan-400",
    glow: "0 0 40px oklch(0.65 0.2 250 / 0.5)",
    particles: "bg-blue-300",
    label: "Rare",
    labelBg: "bg-blue-500/20 text-blue-400",
  },
  epic: {
    bg: "from-violet-400 via-purple-500 to-purple-700",
    ring: "from-violet-300 to-purple-400",
    glow: "0 0 50px oklch(0.55 0.25 280 / 0.6)",
    particles: "bg-violet-300",
    label: "Epic",
    labelBg: "bg-violet-500/20 text-violet-400",
  },
  legendary: {
    bg: "from-amber-300 via-orange-400 to-red-500",
    ring: "from-yellow-200 via-amber-300 to-orange-400",
    glow: "0 0 60px oklch(0.75 0.2 60 / 0.7), 0 0 100px oklch(0.7 0.2 40 / 0.4)",
    particles: "bg-amber-200",
    label: "Legendary",
    labelBg: "bg-amber-500/20 text-amber-400",
  },
}

const iconMap: Record<string, React.ElementType> = {
  rocket: Rocket,
  flame: Flame,
  trophy: Trophy,
  star: Star,
  medal: Medal,
  crown: Crown,
  lightning: Zap,
  zap: Zap,
  gem: Gem,
  book: Book,
  code: Code,
  target: Target,
  brain: Brain,
  shield: Shield,
  sword: Swords,
  heart: Heart,
  moon: Moon,
  sun: Sun,
  mountain: Mountain,
  first_steps: Footprints,
  footprints: Footprints,
  award: Award,
  sparkles: Sparkles,
}

const sizeConfig = {
  sm: { container: "w-20 h-20", icon: "w-8 h-8", inner: "w-14 h-14" },
  md: { container: "w-28 h-28", icon: "w-10 h-10", inner: "w-20 h-20" },
  lg: { container: "w-36 h-36", icon: "w-14 h-14", inner: "w-26 h-26" },
}

export function Badge3D({
  name,
  description,
  icon,
  rarity,
  unlocked,
  unlockedAt,
  size = "md",
  showTooltip = true,
}: Badge3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [showParticles, setShowParticles] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)
  
  const config = rarityConfig[rarity]
  const sizes = sizeConfig[size]
  const IconComponent = iconMap[icon.toLowerCase().replace(/[-\s]/g, "_")] || iconMap[icon] || Award
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!unlocked || !badgeRef.current) return
    
    const rect = badgeRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    setRotation({
      x: (y - 0.5) * 30,
      y: (x - 0.5) * -30,
    })
  }
  
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (unlocked && rarity !== "common") {
      setShowParticles(true)
    }
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
    setShowParticles(false)
  }

  return (
    <div className="relative group">
      <div
        ref={badgeRef}
        className={cn(
          "relative cursor-pointer select-none",
          sizes.container
        )}
        style={{ perspective: "800px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Badge Container */}
        <div
          className={cn(
            "relative w-full h-full transition-all duration-500 ease-out",
            unlocked ? "transform-gpu" : "grayscale brightness-50"
          )}
          style={{
            transform: unlocked
              ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? "scale(1.15) translateZ(20px)" : ""}`
              : "",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Outer Glow Ring - Only for unlocked badges */}
          {unlocked && (
            <div
              className={cn(
                "absolute inset-[-8px] rounded-full opacity-0 transition-all duration-500",
                isHovered && "opacity-100"
              )}
              style={{
                background: `conic-gradient(from 0deg, ${rarity === "legendary" ? "oklch(0.8 0.2 60), oklch(0.7 0.2 40), oklch(0.8 0.2 60)" : rarity === "epic" ? "oklch(0.6 0.25 280), oklch(0.5 0.2 300), oklch(0.6 0.25 280)" : rarity === "rare" ? "oklch(0.65 0.2 250), oklch(0.5 0.15 230), oklch(0.65 0.2 250)" : "oklch(0.6 0.02 250), oklch(0.5 0.02 250), oklch(0.6 0.02 250)"})`,
                animation: isHovered ? "spin 3s linear infinite" : "none",
                filter: "blur(8px)",
              }}
            />
          )}

          {/* Badge Base - Hexagonal shape with depth */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl overflow-hidden",
              "transition-all duration-500"
            )}
            style={{
              boxShadow: unlocked && isHovered ? config.glow : "0 4px 20px oklch(0 0 0 / 0.3)",
              transform: "translateZ(-5px)",
            }}
          >
            {/* Gradient Background */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br",
              config.bg
            )} />
            
            {/* Inner Shine */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(135deg, oklch(1 0 0 / 0.4) 0%, transparent 50%, oklch(0 0 0 / 0.2) 100%)`,
                transform: `rotate(${rotation.y * 2}deg)`,
              }}
            />
            
            {/* Geometric Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Inner Badge Circle */}
          <div
            className="absolute inset-[10%] rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(180deg, oklch(0.2 0.02 270 / 0.9) 0%, oklch(0.1 0.02 270 / 0.95) 100%)`,
              boxShadow: "inset 0 2px 10px oklch(0 0 0 / 0.5), inset 0 -1px 5px oklch(1 0 0 / 0.1)",
              transform: "translateZ(10px)",
            }}
          >
            {/* Icon */}
            {unlocked ? (
              <IconComponent
                className={cn(
                  sizes.icon,
                  "transition-all duration-300",
                  isHovered ? "scale-110" : "",
                  rarity === "legendary" ? "text-amber-300 drop-shadow-[0_0_10px_oklch(0.8_0.2_60/0.8)]" :
                  rarity === "epic" ? "text-violet-300 drop-shadow-[0_0_8px_oklch(0.6_0.25_280/0.7)]" :
                  rarity === "rare" ? "text-blue-300 drop-shadow-[0_0_6px_oklch(0.65_0.2_250/0.6)]" :
                  "text-slate-200"
                )}
                style={{
                  transform: `translateZ(15px) ${isHovered ? "scale(1.1)" : ""}`,
                }}
              />
            ) : (
              <Lock className={cn(sizes.icon, "text-slate-500")} />
            )}
          </div>

          {/* Spinning Border for Legendary */}
          {rarity === "legendary" && unlocked && (
            <div
              className="absolute inset-[-2px] rounded-2xl overflow-hidden pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, oklch(0.85 0.18 60), oklch(0.75 0.2 40), oklch(0.7 0.22 30), oklch(0.75 0.2 40), oklch(0.85 0.18 60))`,
                animation: "spin 4s linear infinite",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: "2px",
              }}
            />
          )}

          {/* Floating Particles */}
          {showParticles && unlocked && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-1.5 h-1.5 rounded-full",
                    config.particles
                  )}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animation: `particle-float-${i % 3} 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: `0 0 6px ${rarity === "legendary" ? "oklch(0.8 0.2 60)" : rarity === "epic" ? "oklch(0.6 0.25 280)" : "oklch(0.65 0.2 250)"}`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 mt-3 z-50",
            "w-52 p-4 rounded-xl",
            "liquid-glass border border-border/30",
            "opacity-0 scale-95 pointer-events-none",
            "group-hover:opacity-100 group-hover:scale-100",
            "transition-all duration-300"
          )}
          style={{ top: "100%" }}
        >
          <div className="text-center">
            {/* Rarity Badge */}
            <span className={cn(
              "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2",
              config.labelBg
            )}>
              {config.label}
            </span>
            
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
            
            {unlocked && unlockedAt && (
              <p className="text-[10px] text-muted-foreground/70 mt-2 pt-2 border-t border-border/30">
                Unlocked {new Date(unlockedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            )}
            
            {!unlocked && (
              <p className="text-[10px] text-muted-foreground/70 mt-2 pt-2 border-t border-border/30">
                Keep learning to unlock this badge
              </p>
            )}
          </div>
          
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card/80 border-l border-t border-border/30 rotate-45 backdrop-blur-xl" />
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particle-float-0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(-15px, -25px) scale(0.5); opacity: 0.5; }
        }
        @keyframes particle-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(15px, -20px) scale(0.6); opacity: 0.4; }
        }
        @keyframes particle-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(-10px, -30px) scale(0.4); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

// Achievement badges showcase
export function BadgeShowcase({ badges }: { badges: Badge3DProps[] }) {
  // Group by rarity for display
  const grouped = {
    legendary: badges.filter(b => b.rarity === "legendary"),
    epic: badges.filter(b => b.rarity === "epic"),
    rare: badges.filter(b => b.rarity === "rare"),
    common: badges.filter(b => b.rarity === "common"),
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([rarity, rarityBadges]) => (
        rarityBadges.length > 0 && (
          <div key={rarity}>
            <h3 className={cn(
              "text-sm font-semibold uppercase tracking-wider mb-4",
              rarity === "legendary" && "text-amber-400",
              rarity === "epic" && "text-violet-400",
              rarity === "rare" && "text-blue-400",
              rarity === "common" && "text-slate-400"
            )}>
              {rarity} ({rarityBadges.filter(b => b.unlocked).length}/{rarityBadges.length})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {rarityBadges.map((badge, index) => (
                <Badge3D key={index} {...badge} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}

// All available achievements
export const allAchievements: Omit<Badge3DProps, "unlocked" | "unlockedAt">[] = [
  // Common
  { name: "First Steps", description: "Complete your first lesson", icon: "rocket", rarity: "common" },
  { name: "Night Owl", description: "Learn between 12am-4am", icon: "moon", rarity: "common" },
  { name: "Early Bird", description: "Learn between 5am-7am", icon: "sun", rarity: "common" },
  { name: "Bookworm", description: "Read 10 documentation references", icon: "book", rarity: "common" },
  { name: "Curious Mind", description: "Explore 3 different learning paths", icon: "sparkles", rarity: "common" },
  
  // Rare
  { name: "Week Warrior", description: "Maintain a 7-day streak", icon: "flame", rarity: "rare" },
  { name: "Knowledge Seeker", description: "Complete 50 lessons", icon: "book", rarity: "rare" },
  { name: "Perfect Score", description: "Get 100% on 10 quizzes", icon: "target", rarity: "rare" },
  { name: "Quick Learner", description: "Complete a path in under 30 days", icon: "zap", rarity: "rare" },
  { name: "Problem Solver", description: "Complete 25 coding exercises", icon: "code", rarity: "rare" },
  { name: "Dedicated", description: "Learn for 50 total hours", icon: "heart", rarity: "rare" },
  
  // Epic
  { name: "Path Pioneer", description: "Complete your first path", icon: "trophy", rarity: "epic" },
  { name: "Code Master", description: "Complete 100 exercises", icon: "code", rarity: "epic" },
  { name: "Month Master", description: "30-day learning streak", icon: "flame", rarity: "epic" },
  { name: "Mountain Climber", description: "Reach Level 25", icon: "mountain", rarity: "epic" },
  { name: "Project Builder", description: "Complete 10 real-world projects", icon: "award", rarity: "epic" },
  { name: "Mentor", description: "Help 5 other learners", icon: "heart", rarity: "epic" },
  
  // Legendary
  { name: "Elite Developer", description: "Complete an Elite difficulty path", icon: "crown", rarity: "legendary" },
  { name: "Diamond Mind", description: "Reach Level 50", icon: "gem", rarity: "legendary" },
  { name: "Brain Power", description: "Complete 500 lessons", icon: "brain", rarity: "legendary" },
  { name: "Unstoppable", description: "100-day learning streak", icon: "shield", rarity: "legendary" },
  { name: "Legend", description: "Complete all learning paths", icon: "star", rarity: "legendary" },
]
