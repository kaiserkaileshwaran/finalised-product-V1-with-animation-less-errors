"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ArrowRight, CheckCircle, Globe, Smartphone, Database, TestTube, Palette, Server, GitBranch, Rocket, Layers, Zap, Trophy, Users, BookOpen, Target, Sparkles, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { learningPaths, pathColors } from "@/lib/learning-data"

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

const stats = [
  { value: "9", label: "Learning Paths", icon: Layers },
  { value: "500+", label: "Lessons", icon: BookOpen },
  { value: "50K+", label: "Learners", icon: Users },
  { value: "95%", label: "Completion Rate", icon: Trophy },
]

const testimonials = [
  {
    quote: "Blueprint transformed my career. I went from knowing nothing about web development to landing a senior role in 8 months.",
    author: "Sarah Chen",
    role: "Senior Developer at Stripe",
    avatar: "SC",
  },
  {
    quote: "The structured paths and real-world projects made all the difference. This is how learning should be.",
    author: "Marcus Johnson",
    role: "Tech Lead at Vercel",
    avatar: "MJ",
  },
  {
    quote: "Finally, a platform that takes you from beginner to professional with clear milestones and practical skills.",
    author: "Emily Park",
    role: "Founder, DevStudio",
    avatar: "EP",
  },
]

const features = [
  {
    icon: Target,
    title: "Structured Paths",
    description: "Follow expert-designed learning paths from beginner to elite. No more confusion about what to learn next.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Real-World Projects",
    description: "Build production-ready applications as you learn. Every path ends with a capstone project.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Trophy,
    title: "Mastery Challenges",
    description: "Prove your skills with comprehensive challenges. Earn certificates that employers trust.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Learn alongside thousands of developers. Share projects, get feedback, and grow together.",
    gradient: "from-violet-500 to-purple-500",
  },
]

// 3D Card Component with mouse tracking
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

// Floating Icon Component
function FloatingIcon({ Icon, delay = 0, className = "" }: { Icon: React.ElementType; delay?: number; className?: string }) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="glass-card p-4 rounded-2xl">
        <Icon className="h-8 w-8 text-primary" />
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background mesh-gradient noise-texture relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse"
            style={{ 
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` 
            }}
          />
          <div 
            className="absolute bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px] animate-pulse"
            style={{ 
              animationDelay: "1s",
              transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)` 
            }}
          />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
          <FloatingIcon Icon={Rocket} delay={0} className="absolute top-32 left-[10%] opacity-60" />
          <FloatingIcon Icon={Zap} delay={1} className="absolute top-48 right-[15%] opacity-50" />
          <FloatingIcon Icon={Globe} delay={2} className="absolute bottom-32 left-[20%] opacity-40" />
          <FloatingIcon Icon={Trophy} delay={1.5} className="absolute bottom-48 right-[10%] opacity-50" />
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 glass-card px-5 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">New: System Architect Path now available</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl text-balance leading-[1.1]">
              Master technical skills.{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_ease-in-out_infinite]">
                From zero to elite.
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              Blueprint is a mastery-based learning platform with structured paths to help you become a 
              professional developer. Real concepts, real projects, real skills.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-base gap-3 btn-apple rounded-2xl text-primary-foreground font-semibold">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/paths">
                <Button variant="outline" size="lg" className="h-14 px-10 text-base gap-3 glass-card rounded-2xl border-0 hover:bg-card/80">
                  <Play className="h-4 w-4" />
                  Explore Paths
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-24">
            {stats.map((stat, index) => (
              <Card3D key={stat.label}>
                <div className="glass-card rounded-2xl p-6 text-center shine-effect">
                  <div className="flex justify-center mb-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Paths Preview Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance">
              Choose your path to mastery
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Expert-designed learning paths that take you from beginner to professional. 
              Each path builds on real-world skills that employers value.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningPaths.slice(0, 6).map((path, index) => {
              const Icon = pathIcons[path.icon] || Globe
              return (
                <Card3D key={path.id}>
                  <Link href={`/paths/${path.slug}`}>
                    <Card className={`group relative overflow-hidden glass-card border-0 p-6 h-full transition-all duration-500 shine-effect ${pathColors[path.color]}`}>
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-primary/5 to-transparent" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl glass-card">
                            <Icon className="h-7 w-7 text-foreground" />
                          </div>
                          <span className="rounded-full glass-card px-3 py-1 text-xs font-medium">
                            {path.difficulty}
                          </span>
                        </div>
                        <h3 className="mt-5 text-xl font-semibold">{path.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {path.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {path.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-background/40 px-2.5 py-1 text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {path.totalLessons} lessons
                          </span>
                          <span>{path.estimatedHours}h</span>
                        </div>
                        
                        {/* 3D Progress Bar */}
                        <div className="mt-4 h-1 w-full rounded-full bg-background/30 overflow-hidden">
                          <div className="h-full w-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 group-hover:w-full" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Card3D>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/paths">
              <Button variant="outline" size="lg" className="gap-2 glass-card border-0 rounded-2xl px-8 h-12 hover:bg-card/80">
                View All Paths
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance">
              Everything you need to become a professional
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform is designed by industry experts who understand what it takes 
              to succeed in tech.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card3D key={feature.title}>
                <Card className="glass-card border-0 p-6 h-full shine-effect">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} glow-soft`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance">
              How Blueprint works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A proven system for mastering technical skills
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                description: "Select from 9 expert-designed paths covering web development, mobile, DevOps, and more.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Learn & Build",
                description: "Progress through structured lessons with concepts, code examples, exercises, and real projects.",
                gradient: "from-violet-500 to-purple-500",
              },
              {
                step: "03",
                title: "Achieve Mastery",
                description: "Complete mastery challenges, earn certificates, and prove your professional-level skills.",
                gradient: "from-amber-500 to-orange-500",
              },
            ].map((item, index) => (
              <Card3D key={item.step}>
                <div className="glass-card rounded-2xl p-8 h-full relative overflow-hidden">
                  <div className={`text-7xl font-bold bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent opacity-20`}>
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-border to-transparent" />
                  )}
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance">
              Trusted by developers worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers who have transformed their careers with Blueprint.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card3D key={testimonial.author}>
                <Card className="glass-card border-0 p-8 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="h-4 w-4 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start learning for free, upgrade when you are ready for more.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card3D>
              <Card className="glass-card border-0 p-8 h-full">
                <div className="text-sm font-medium text-muted-foreground">Free</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Perfect for getting started with learning
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Access to beginner paths",
                    "Basic progress tracking",
                    "Community forum access",
                    "Limited exercises per day",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button variant="outline" className="w-full h-12 rounded-xl glass-card border-0 hover:bg-card/80">
                    Get Started
                  </Button>
                </Link>
              </Card>
            </Card3D>

            {/* Pro Plan */}
            <Card3D>
              <Card className="relative glass-card border-2 border-primary/30 p-8 h-full glow-primary">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
                <div className="text-sm font-medium text-muted-foreground">Pro</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Everything you need to master any skill
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Access to all paths (Beginner to Elite)",
                    "Advanced projects & challenges",
                    "Verifiable certificates",
                    "Priority community support",
                    "Exclusive Discord access",
                    "Early access to new content",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button className="w-full h-12 rounded-xl btn-apple text-primary-foreground font-semibold">
                    Start Pro Trial
                  </Button>
                </Link>
              </Card>
            </Card3D>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Card3D>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 lg:p-20 text-center glow-primary">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                                    radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
                  backgroundSize: "50px 50px"
                }} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl text-balance">
                  Ready to start your journey?
                </h2>
                <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                  Join thousands of developers who are mastering professional skills with Blueprint. 
                  Start learning today, completely free.
                </p>
                <div className="mt-10">
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="h-14 px-10 text-base gap-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow">
                      Start Learning Now
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      <Footer />
      
      {/* CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
