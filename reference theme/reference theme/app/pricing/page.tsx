"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Check, X, HelpCircle, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with learning",
    features: [
      { name: "Access to beginner paths", included: true },
      { name: "Basic progress tracking", included: true },
      { name: "Community forum access", included: true },
      { name: "5 exercises per day", included: true },
      { name: "All paths (Beginner to Elite)", included: false },
      { name: "Advanced projects", included: false },
      { name: "Verifiable certificates", included: false },
      { name: "Priority support", included: false },
      { name: "Exclusive Discord access", included: false },
    ],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Everything you need to master any skill",
    features: [
      { name: "Access to beginner paths", included: true },
      { name: "Basic progress tracking", included: true },
      { name: "Community forum access", included: true },
      { name: "Unlimited exercises", included: true },
      { name: "All paths (Beginner to Elite)", included: true },
      { name: "Advanced projects", included: true },
      { name: "Verifiable certificates", included: true },
      { name: "Priority support", included: true },
      { name: "Exclusive Discord access", included: true },
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
    gradient: "from-primary to-accent",
  },
  {
    name: "Team",
    price: "$49",
    period: "/seat/month",
    description: "For teams and organizations",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Team management dashboard", included: true },
      { name: "Progress analytics", included: true },
      { name: "Custom learning paths", included: true },
      { name: "SSO integration", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Invoice billing", included: true },
      { name: "API access", included: true },
      { name: "On-premise deployment", included: false },
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    gradient: "from-violet-500 to-purple-600",
  },
]

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "What happens to my progress if I cancel?",
    answer:
      "Your progress is always saved. If you downgrade to Free, you will retain access to beginner content and can see your historical progress.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! Students with a valid .edu email can get 50% off Pro. Contact our support team to verify your student status.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and for Team plans we also offer invoice billing.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes, all Pro subscriptions come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. No questions asked.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background mesh-gradient noise-texture relative">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 glass-card px-5 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">14-day free trial on all plans</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                pricing
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Start learning for free, upgrade when you are ready for more.
              All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card3D key={plan.name}>
                <Card
                  className={`relative glass-card border-0 p-8 h-full flex flex-col ${
                    plan.highlighted
                      ? "border-2 border-primary/30 glow-primary"
                      : ""
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                      {plan.badge}
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 glow-soft`}>
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {plan.name}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.highlighted ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" : ""}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground text-lg">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {plan.description}
                  </p>
                  
                  <ul className="mt-8 space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="flex items-start gap-3 text-sm"
                      >
                        {feature.included ? (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                            <Check className="h-3 w-3 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/30">
                            <X className="h-3 w-3 text-muted-foreground/50" />
                          </div>
                        )}
                        <span
                          className={
                            feature.included ? "" : "text-muted-foreground/50"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={plan.href} className="block mt-8">
                    <Button
                      className={`w-full h-12 rounded-xl font-semibold gap-2 ${
                        plan.highlighted 
                          ? "btn-apple text-primary-foreground" 
                          : "glass-card border-0 hover:bg-card/80"
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </Card3D>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Compare Plans
          </h2>
          <div className="overflow-x-auto glass-card rounded-2xl p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="pb-4 text-left font-semibold">Feature</th>
                  <th className="pb-4 text-center font-semibold">Free</th>
                  <th className="pb-4 text-center font-semibold text-primary">Pro</th>
                  <th className="pb-4 text-center font-semibold">Team</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Learning Paths", "Beginner only", "All paths", "All paths + Custom"],
                  ["Exercises", "5/day", "Unlimited", "Unlimited"],
                  ["Projects", "Basic", "All projects", "All + Custom"],
                  ["Certificates", "-", "Yes", "Yes"],
                  ["Support", "Community", "Priority", "Dedicated"],
                  ["Analytics", "Basic", "Advanced", "Team dashboard"],
                ].map(([feature, free, pro, team], index) => (
                  <tr
                    key={feature}
                    className="border-b border-border/10 last:border-0"
                  >
                    <td className="py-4 px-2 font-medium">{feature}</td>
                    <td className="py-4 px-2 text-center text-muted-foreground">
                      {free}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">{pro}</td>
                    <td className="py-4 px-2 text-center">{team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Everything you need to know about our plans
          </p>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card3D key={faq.question}>
                <Card className="glass-card border-0 p-6">
                  <h3 className="font-semibold flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-11">
                    {faq.answer}
                  </p>
                </Card>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
                <h2 className="text-3xl font-bold text-primary-foreground sm:text-5xl text-balance">
                  Ready to start learning?
                </h2>
                <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                  Join thousands of developers who are mastering professional skills
                  with Blueprint.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="h-14 px-10 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow gap-2">
                      Start Free Trial
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/paths">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="h-14 px-10 rounded-2xl text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Explore Paths
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      <Footer />
    </div>
  )
}
