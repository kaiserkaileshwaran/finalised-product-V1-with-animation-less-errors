"use client"

import Link from "next/link"
import { ArrowRight, Globe, Smartphone, Database, BookOpen, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { learningPaths, pathColors } from "@/lib/learning-data"
import { cn } from "@/lib/utils"

const pathIcons: Record<string, React.ElementType> = {
  globe: Globe,
  smartphone: Smartphone,
  database: Database,
}

// Mock progress data
const userProgress = [
  { pathId: "path-web-developer", progress: 35, completedLessons: 12, lastActivity: "2 hours ago" },
  { pathId: "path-database-engineer", progress: 15, completedLessons: 4, lastActivity: "3 days ago" },
]

export default function ProgressPage() {
  const activePaths = userProgress.map((progress) => {
    const path = learningPaths.find((p) => p.id === progress.pathId)
    return { ...progress, path }
  }).filter((p) => p.path)

  const completedPaths: typeof activePaths = [] // Empty for now

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">My Progress</h1>
        <p className="mt-1 text-muted-foreground">
          Track your learning journey across all paths
        </p>
      </div>

      {/* Active Paths */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Paths</h2>
        {activePaths.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {activePaths.map(({ path, progress, completedLessons, lastActivity }) => {
              if (!path) return null
              const Icon = pathIcons[path.icon] || Globe
              return (
                <Card
                  key={path.id}
                  className={cn(
                    "border overflow-hidden bg-gradient-to-br",
                    pathColors[path.color]
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background/80">
                          <Icon className="h-7 w-7 text-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{path.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {completedLessons} of {path.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                      <Link href={`/paths/${path.slug}`}>
                        <Button size="sm" variant="secondary" className="gap-1">
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Last activity: {lastActivity}</span>
                      </div>
                      <span>{path.estimatedHours}h estimated</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No active paths</h3>
              <p className="text-muted-foreground mb-4">
                Start learning by choosing a path that interests you
              </p>
              <Link href="/paths">
                <Button>Explore Paths</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Paths */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Completed Paths</h2>
        {completedPaths.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {completedPaths.map(({ path }) => {
              if (!path) return null
              const Icon = pathIcons[path.icon] || Globe
              return (
                <Card key={path.id} className="border bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
                        <CheckCircle className="h-7 w-7 text-success" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{path.name}</h3>
                        <p className="text-sm text-success">Completed</p>
                      </div>
                      <Link href={`/paths/${path.slug}`}>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border border-dashed">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-muted-foreground mb-2">No completed paths yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete your first path to earn a certificate
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning Stats */}
      <Card className="border">
        <CardHeader>
          <CardTitle>Learning Statistics</CardTitle>
          <CardDescription>Your overall learning metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">16</p>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">8.5h</p>
              <p className="text-sm text-muted-foreground">Time Spent</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Exercises Done</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
