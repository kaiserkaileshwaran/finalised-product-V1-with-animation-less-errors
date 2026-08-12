'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  showCloseButton?: boolean
  children: React.ReactNode
  className?: string
  onEscape?: () => void
}

export function Modal({ isOpen, onClose, title, showCloseButton = true, children, className, onEscape }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onEscape) {
          onEscape()
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, onEscape])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          'w-[min(92vw,1200px)] max-w-[1200px] max-h-[90dvh] min-h-[min(60dvh,640px)] overflow-hidden bg-gradient-to-br from-card to-[#142036] border-2 border-primary/70 rounded-2xl shadow-[0_0_40px_rgba(79,195,255,0.15)] flex flex-col animate-modal-open',
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center p-4 border-b border-primary flex-shrink-0">
            <span className="text-primary font-semibold">{title}</span>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="cursor-pointer text-muted-foreground border-[1.5px] border-border/60 bg-card/70 hover:bg-primary/10 hover:text-primary hover:border-primary/50 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

interface SmallModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function SmallModal({ isOpen, onClose, title, children }: SmallModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-card to-[#142036] border-2 border-primary rounded-xl p-10 w-[90%] max-w-[400px] animate-glow animate-modal-open flex flex-col gap-5">
        <div className="text-primary text-2xl font-bold text-center text-shadow-[0_0_15px_rgba(79,195,255,0.8)]">
          {title}
        </div>
        {children}
      </div>
    </div>
  )
}
