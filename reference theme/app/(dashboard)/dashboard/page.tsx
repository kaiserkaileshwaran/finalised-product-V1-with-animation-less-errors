"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Target,
  Zap,
  Globe,
  TrendingUp,
  Sparkles,
  Play,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { learningPaths } from "@/lib/learning-data"

// Mock data for current progress
const currentPath = learningPaths[0] // Web Developer path
const currentProgress = 35
const completedLessons = 12
const totalLessons = 85

const recommendedLessons = [
  {
    id: "css-box-model",
    title: "The Box Model",
    path: "Web Developer",
    duration: 35,
    type: "concept",
  },
  {
    id: "css-flexbox",
    title: "Flexbox Layout",
    path: "Web Developer",
    duration: 45,
    type: "concept",
  },
  {
    id: "git-branches",
    title: "Git Branching",
    path: "Web Developer",
    duration: 30,
    type: "exercise",
  },
]

const recentAchievements = [
  { name: "First Steps", description: "Complete your first lesson", date: "2 days ago" },
  { name: "Week Warrior", description: "7-day learning streak", date: "1 week ago" },
]

const recentActivity = [
  { lesson: "HTML Fundamentals", path: "Web Developer", date: "Today" },
  { lesson: "CSS Fundamentals", path: "Web Developer", date: "Yesterday" },
  { lesson: "Introduction to HTML", path: "Web Developer", date: "2 days ago" },
]

// 3D Card Component
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="transform-3d transition-transform duration-200 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
            : "rotateX(0) rotateY(0) scale(1)",
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  gradient 
}: { 
  icon: React.ElementType; 
  value: string | number; 
  label: string; 
  gradient: string;
}) {
  return (
    <Card3D>
      <Card className="glass-card border-0 overflow-hidden shine-effect">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} glow-soft`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Card3D>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-6 lg:p-8 mesh-gradient min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold lg:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Developer"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Continue your learning journey where you left off
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          icon={Flame} 
          value={user?.currentStreak || 0} 
          label="Day Streak" 
          gradient="from-orange-500 to-red-500"
        />
        <StatCard 
          icon={Zap} 
          value={user?.totalXp?.toLocaleString() || 0} 
          label="Total XP" 
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard 
          icon={BookOpen} 
          value={completedLessons} 
          label="Lessons Done" 
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard 
          icon={Trophy} 
          value={user?.achievements?.length || 0} 
          label="Achievements" 
          gradient="from-violet-500 to-purple-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Path Progress */}
          <Card3D>
            <Card className="glass-card border-0 overflow-hidden">
              <div className="relative p-6 lg:p-8">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-card">
                        <Globe className="h-8 w-8 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Play className="h-3 w-3" />
                          Currently Learning
                        </p>
                        <h3 className="text-2xl font-bold">{currentPath.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {completedLessons} of {totalLessons} lessons completed
                        </p>
                      </div>
                    </div>
                    <Link href={`/paths/${currentPath.slug}`}>
                      <Button className="rounded-xl btn-apple text-primary-foreground font-medium gap-2">
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-lg">{currentProgress}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-background/50 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Card3D>

          {/* Recommended Next Lessons */}
          <Card3D>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  Recommended Next
                </CardTitle>
                <CardDescription>
                  Continue with these lessons to make progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedLessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/paths/web-developer/lessons/${lesson.id}`}
                    className="flex items-center justify-between rounded-2xl glass-card p-4 transition-all duration-300 hover:bg-card/80 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">{lesson.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{lesson.path}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </Card3D>

          {/* Recent Activity */}
          <Card3D>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border/30 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                          {index < recentActivity.length - 1 && (
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-border/50" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.lesson}</p>
                          <p className="text-sm text-muted-foreground">{activity.path}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground glass-card px-3 py-1 rounded-full">
                        {activity.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Card3D>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card3D>
            <Card className="glass-card border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full mb-4">
                    {/* Outer ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-border/30"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="url(#levelGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${((user?.totalXp || 0) % 1000) / 10 * 2.76} 276`}
                      />
                      <defs>
                        <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Inner content */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                      <span className="text-2xl font-bold text-primary-foreground">{user?.level || 1}</span>
                    </div>
                  </div>
                  <p className="font-semibold text-lg">Level {user?.level || 1}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {1000 - ((user?.totalXp || 0) % 1000)} XP to next level
                  </p>
                </div>
              </CardContent>
            </Card>
          </Card3D>

          {/* Recent Achievements */}
          <Card3D>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className="p-2 rounded-xl bg-amber-500/10">
                    <Trophy className="h-4 w-4 text-amber-500" />
                  </div>
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.name} className="flex items-start gap-3 p-3 rounded-xl glass-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                ))}
                <Link
                  href="/dashboard/achievements"
                  className="block text-center text-sm text-primary hover:underline mt-4"
                >
                  View all achievements
                </Link>
              </CardContent>
            </Card>
          </Card3D>

          {/* Explore More Paths */}
          <Card3D>
            <Card className="glass-card border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Explore More Paths</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover new skills and expand your expertise
                </p>
                <Link href="/paths">
                  <Button variant="outline" className="w-full rounded-xl glass-card border-0 hover:bg-card/80">
                    Browse All Paths
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Card3D>
        </div>
      </div>
    </div>
  )
}
