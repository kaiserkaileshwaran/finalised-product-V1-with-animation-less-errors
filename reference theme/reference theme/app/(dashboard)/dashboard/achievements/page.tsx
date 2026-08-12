"use client"

import { Trophy, Lock, Star, Flame, Zap, Map, Code, BookOpen, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const allAchievements = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: BookOpen,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    xp: 50,
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    xp: 100,
  },
  {
    id: "path-pioneer",
    name: "Path Pioneer",
    description: "Complete your first learning path",
    icon: Map,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    xp: 500,
  },
  {
    id: "code-master",
    name: "Code Master",
    description: "Complete 10 coding exercises",
    icon: Code,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    xp: 150,
  },
  {
    id: "streak-legend",
    name: "Streak Legend",
    description: "Maintain a 30-day learning streak",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    xp: 300,
  },
  {
    id: "quiz-ace",
    name: "Quiz Ace",
    description: "Score 100% on 5 quizzes",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    xp: 200,
  },
  {
    id: "speed-learner",
    name: "Speed Learner",
    description: "Complete 5 lessons in one day",
    icon: Zap,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    xp: 100,
  },
  {
    id: "project-builder",
    name: "Project Builder",
    description: "Complete your first project",
    icon: Code,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    xp: 250,
  },
  {
    id: "multi-path",
    name: "Multi-Path Master",
    description: "Start learning 3 different paths",
    icon: Map,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    xp: 150,
  },
  {
    id: "certified",
    name: "Certified Professional",
    description: "Earn your first certificate",
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    xp: 1000,
  },
  {
    id: "elite-master",
    name: "Elite Master",
    description: "Complete an Elite-level path",
    icon: Trophy,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    xp: 2000,
  },
  {
    id: "community-helper",
    name: "Community Helper",
    description: "Help 10 other learners with their questions",
    icon: Star,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    xp: 200,
  },
]

export default function AchievementsPage() {
  const { user } = useAuth()
  const unlockedIds = user?.achievements?.map((a) => a.id) || ["first-steps", "week-warrior", "path-pioneer"]

  const unlockedAchievements = allAchievements.filter((a) => unlockedIds.includes(a.id))
  const lockedAchievements = allAchievements.filter((a) => !unlockedIds.includes(a.id))

  const totalXpFromAchievements = unlockedAchievements.reduce((sum, a) => sum + a.xp, 0)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Achievements</h1>
        <p className="mt-1 text-muted-foreground">
          Track your learning milestones and earn rewards
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-card/50 border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unlockedIds.length}</p>
              <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalXpFromAchievements.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">XP from Achievements</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lockedAchievements.length}</p>
              <p className="text-sm text-muted-foreground">Achievements Remaining</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      <Card className="border mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Unlocked
          </CardTitle>
          <CardDescription>
            Achievements you&apos;ve earned through your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-4 rounded-lg border bg-card/50 p-4"
              >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shrink-0", achievement.bgColor)}>
                  <achievement.icon className={cn("h-6 w-6", achievement.color)} />
                </div>
                <div>
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-primary mt-1">+{achievement.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Locked Achievements */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Locked
          </CardTitle>
          <CardDescription>
            Keep learning to unlock these achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-4 rounded-lg border border-dashed bg-muted/30 p-4 opacity-60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted shrink-0">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">+{achievement.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
