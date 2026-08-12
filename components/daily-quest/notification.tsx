'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NotificationProps {
  message: string | null
  onClose: () => void
  type?: 'success' | 'error' | 'info'
}

export function Notification({ message, onClose, type = 'info' }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Determine type based on message content if not explicitly set
  const resolvedType = message?.toLowerCase().includes('completed') || 
                       message?.toLowerCase().includes('success') ||
                       message?.toLowerCase().includes('marked as') 
                       ? 'success' 
                       : message?.toLowerCase().includes('error') || 
                         message?.toLowerCase().includes('failed') ||
                         message?.toLowerCase().includes('already exists')
                         ? 'error' 
                         : type

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      className={cn(
        'fixed top-5 right-5 px-4 py-3 rounded-md text-sm z-50 transition-all duration-300 italic',
        resolvedType === 'success' && 'bg-secondary/20 border border-secondary/80 text-secondary',
        resolvedType === 'error' && 'bg-destructive/20 border border-destructive/80 text-destructive',
        resolvedType === 'info' && 'bg-primary/20 border border-primary/80 text-primary',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      )}
    >
      {message}
    </div>
  )
}
