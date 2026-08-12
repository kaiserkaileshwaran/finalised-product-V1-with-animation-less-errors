import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { TimeThemeProvider } from '@/components/time-theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Blueprint - Master Technical Skills From Zero to Elite',
  description: 'Blueprint is a mastery-based learning platform with structured paths to help you become a professional developer. Real concepts, real projects, real skills.',
  keywords: ['learning', 'programming', 'web development', 'coding', 'courses', 'tech skills'],
  authors: [{ name: 'Blueprint' }],
  openGraph: {
    title: 'Blueprint - Master Technical Skills',
    description: 'Structured learning paths from beginner to elite. Real concepts, real projects, real skills.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blueprint - Master Technical Skills',
    description: 'Structured learning paths from beginner to elite.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <TimeThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TimeThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
