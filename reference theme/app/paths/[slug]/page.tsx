"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Play,
  Smartphone,
  Database,
  TestTube,
  Palette,
  Server,
  GitBranch,
  Rocket,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPathBySlug, difficultyColors, pathColors } from "@/lib/learning-data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const pathIcons: Record<string, React.ElementType> = {
  globe: Globe,
  smartphone: Smartphone,
  database: Database,
  "check-circle": TestTube,
  palette: Palette,
  server: Server,
  "git-branch": GitBranch,
  rocket: Rocket,
  layers: Layers,
}

export default function PathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const path = getPathBySlug(resolvedParams.slug)
  const { isAuthenticated } = useAuth()

  if (!path) {
    notFound()
  }

  const Icon = pathIcons[path.icon] || Globe

  // Mock progress - in production this would come from user data
  const userProgress = 35
  const completedTopics = 3

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Back link */}
          <Link
            href="/paths"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all paths
          </Link>

          {/* Hero Section */}
          <div
            className={cn(
              "rounded-2xl border bg-gradient-to-br p-8 lg:p-12 mb-8",
              pathColors[path.color]
            )}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background/80">
                    <Icon className="h-8 w-8 text-foreground" />
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm font-medium",
                      difficultyColors[path.difficulty]
                    )}
                  >
                    {path.difficulty}
                  </span>
                </div>

                <h1 className="text-3xl font-bold lg:text-4xl mb-4">{path.name}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {path.description}
                </p>

                {/* Skills */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-background/80 px-3 py-1.5 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{path.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{path.estimatedHours} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    <span>{path.levels.length} levels</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="lg:text-right">
                {isAuthenticated ? (
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Your progress</p>
                      <p className="text-3xl font-bold">{userProgress}%</p>
                      <Progress value={userProgress} className="h-2 mt-2 w-48" />
                    </div>
                    <Button size="lg" className="gap-2">
                      <Play className="h-4 w-4" />
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign up to track your progress
                    </p>
                    <Link href="/register">
                      <Button size="lg" className="gap-2">
                        Start Learning
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Path Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content - Curriculum */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">Curriculum</h2>

              {path.levels.map((level, levelIndex) => (
                <Card key={level.id} className="border overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{level.name}</CardTitle>
                        <CardDescription>{level.description}</CardDescription>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          difficultyColors[level.difficulty]
                        )}
                      >
                        {level.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {level.topics.map((topic, topicIndex) => {
                        const isCompleted = levelIndex === 0 && topicIndex < completedTopics
                        const isCurrent = levelIndex === 0 && topicIndex === completedTopics
                        const isLocked = levelIndex > 0 || topicIndex > completedTopics

                        return (
                          <div
                            key={topic.id}
                            className={cn(
                              "flex items-center justify-between p-4 transition-colors",
                              isCurrent && "bg-primary/5",
                              isLocked && "opacity-60"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-lg",
                                  isCompleted
                                    ? "bg-success/10"
                                    : isCurrent
                                    ? "bg-primary/10"
                                    : "bg-muted"
                                )}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-success" />
                                ) : isLocked ? (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <BookOpen className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{topic.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {topic.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {topic.lessons.length || 3} lessons
                              </p>
                              {isCurrent && (
                                <Link href={`/paths/${path.slug}/lessons/${topic.lessons[0]?.id || topic.id}`}>
                                  <Button size="sm" className="mt-2 gap-1">
                                    Start
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What you'll learn */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-lg">What you&apos;ll learn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {path.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Path includes */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-lg">This path includes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{path.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{path.estimatedHours} hours of content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{path.levels.length} skill levels</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Hands-on projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Certificate on completion</span>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {path.difficulty === "Beginner"
                      ? "No prior experience required. Just bring your curiosity and willingness to learn!"
                      : `Basic understanding of ${path.skills[0]} and related concepts.`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
