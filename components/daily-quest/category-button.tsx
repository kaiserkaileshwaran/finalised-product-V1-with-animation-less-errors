'use client'

import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'
import { categoryHasIncompleteToday, getToday } from '@/lib/store'
import { Check, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface CategoryButtonProps {
  category: Category
  onClick: () => void
  onMarkDone?: (e: React.MouseEvent) => void
}

export function CategoryButton({ category, onClick, onMarkDone }: CategoryButtonProps) {
  const hasIncomplete = categoryHasIncompleteToday(category)
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      className={cn(
        "group flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full",
        category.completed 
          ? "bg-card/30 border-border/40" 
          : hasIncomplete
            ? "bg-destructive/10 border-destructive hover:shadow-[0_0_14px_rgba(255,95,95,0.4)]"
            : "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/20",
        // Glow effect for active category
        !category.completed && !hasIncomplete && "hover:animate-glow-subtle"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            if (onMarkDone) onMarkDone(e)
          }}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors shrink-0",
            category.completed
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary text-transparent"
          )}
          title="Quick Complete"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <span 
            className={cn(
              "text-base transition-colors truncate font-medium",
              category.completed ? "text-muted-foreground line-through decoration-border" : "text-foreground"
            )}
            title={category.name}
          >
            {category.name}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
