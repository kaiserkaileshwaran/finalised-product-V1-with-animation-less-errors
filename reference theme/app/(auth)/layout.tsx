import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Blueprint",
  description: "Sign in or create an account to start your learning journey",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background mesh-gradient noise-texture relative overflow-hidden">
      {children}
    </div>
  )
}
