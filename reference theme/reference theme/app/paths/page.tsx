"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Search, Globe, Smartphone, Database, TestTube, Palette, Server, GitBranch, Rocket, Layers, Filter, Clock, BookOpen, Sparkles, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { learningPaths, pathColors, difficultyColors } from "@/lib/learning-data"
import { cn } from "@/lib/utils"

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

const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert", "Elite"]

const categories = [
  { name: "All", count: learningPaths.length },
  { name: "Development", count: 4 },
  { name: "Design", count: 1 },
  { name: "DevOps", count: 2 },
  { name: "Architecture", count: 2 },
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
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
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
        className="transform-3d transition-transform duration-200 ease-out h-full"
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

export default function PathsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch =
      path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDifficulty =
      selectedDifficulty === "All" || path.difficulty === selectedDifficulty

    // Simple category mapping
    const pathCategory =
      path.slug.includes("devops") || path.slug.includes("system-design")
        ? "DevOps"
        : path.slug.includes("architect")
        ? "Architecture"
        : path.slug.includes("ui-ux")
        ? "Design"
        : "Development"

    const matchesCategory = selectedCategory === "All" || pathCategory === selectedCategory

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDifficulty("All")
    setSelectedCategory("All")
  }

  const hasActiveFilters = searchQuery || selectedDifficulty !== "All" || selectedCategory !== "All"

  return (
    <div className="min-h-screen bg-background mesh-gradient noise-texture relative">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-bold lg:text-5xl">Learning Paths</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose your path to mastery. Each path takes you from beginner to professional.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-10 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search paths, skills, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 glass-card border-0 rounded-2xl text-base input-glass"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-card/50 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="glass-card rounded-2xl p-4 space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className={cn(
                        "rounded-xl h-9 transition-all",
                        selectedCategory === category.name 
                          ? "btn-apple text-primary-foreground" 
                          : "glass-card border-0 hover:bg-card/80"
                      )}
                    >
                      {category.name}
                      <span className="ml-1.5 text-xs opacity-60">({category.count})</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <span>Level:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={cn(
                        "rounded-xl h-9 transition-all",
                        selectedDifficulty === difficulty
                          ? "btn-apple text-primary-foreground"
                          : difficulty !== "All"
                          ? `glass-card border-0 ${difficultyColors[difficulty]}`
                          : "glass-card border-0 hover:bg-card/80"
                      )}
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active Filters & Clear */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredPaths.length}</span> of {learningPaths.length} paths
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80 rounded-xl"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Paths Grid */}
          {filteredPaths.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPaths.map((path) => {
                const Icon = pathIcons[path.icon] || Globe
                return (
                  <Card3D key={path.id}>
                    <Link href={`/paths/${path.slug}`} className="block h-full">
                      <Card
                        className={cn(
                          "group relative h-full overflow-hidden glass-card border-0 p-6 transition-all duration-500 shine-effect",
                          pathColors[path.color]
                        )}
                      >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-card transition-transform duration-300 group-hover:scale-110">
                              <Icon className="h-8 w-8 text-foreground" />
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-3 py-1.5 text-xs font-semibold glass-card",
                                difficultyColors[path.difficulty]
                              )}
                            >
                              {path.difficulty}
                            </span>
                          </div>

                          <h3 className="mt-5 text-xl font-bold group-hover:text-primary transition-colors">
                            {path.name}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {path.description}
                          </p>

                          {/* Skills */}
                          <div className="mt-5 flex flex-wrap gap-2">
                            {path.skills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg bg-background/40 px-2.5 py-1 text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {path.skills.length > 4 && (
                              <span className="rounded-lg bg-background/40 px-2.5 py-1 text-xs font-medium">
                                +{path.skills.length - 4} more
                              </span>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{path.totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{path.estimatedHours}h</span>
                            </div>
                          </div>

                          {/* Progress bar placeholder */}
                          <div className="mt-5 h-1.5 w-full rounded-full bg-background/30 overflow-hidden">
                            <div className="h-full w-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 group-hover:w-full" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </Card3D>
                )
              })}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No paths found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you are looking for
              </p>
              <Button
                onClick={clearFilters}
                className="rounded-xl btn-apple text-primary-foreground"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
