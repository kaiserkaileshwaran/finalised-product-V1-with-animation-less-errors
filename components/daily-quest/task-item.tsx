'use client'

import { Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/lib/types'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface TaskItemProps {
  task: Task
  index: number
  onToggle: () => void
  onDelete: () => void
  isNew?: boolean
  isDeleting?: boolean
  isDragging?: boolean
  isDragOver?: boolean
  onDragStart?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: () => void
  onDragEnd?: () => void
  disabled?: boolean
}

export function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  disabled
}: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable={!disabled}
      onDragStart={!disabled ? onDragStart : undefined}
      onDragOver={!disabled ? onDragOver : undefined}
      onDragLeave={!disabled ? onDragLeave : undefined}
      onDrop={!disabled ? onDrop : undefined}
      onDragEnd={!disabled ? onDragEnd : undefined}
      className={cn(
        "group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 relative",
        disabled ? "opacity-75 cursor-default bg-card/50" : "cursor-grab active:cursor-grabbing",
        task.done 
          ? "bg-card/30 border-border/40" 
          : "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/20",
        isDragging && 'opacity-50 scale-95 border-primary animate-glow-subtle',
        isDragOver && 'border-t-2 border-t-green-500 shadow-[0_-4px_12px_rgba(34,197,94,0.25)] bg-green-500/5 translate-y-1'
      )}
    >
      <button
        onClick={!disabled ? onToggle : undefined}
        disabled={disabled}
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors shrink-0",
          task.done
            ? disabled ? "bg-primary/50 border-primary/50 text-primary-foreground/50" : "bg-primary border-primary text-primary-foreground animate-pop"
            : "border-muted-foreground/30 hover:border-primary text-transparent",
          disabled && !task.done && "cursor-not-allowed hidden"
        )}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </button>

      <span 
        className={cn(
          "flex-1 text-base transition-colors font-medium break-words",
          task.done ? "text-muted-foreground line-through decoration-border" : "text-foreground",
          disabled && "pl-2" // shift slightly left if checkbox is hidden
        )}
      >
        {task.text}
      </span>

      {!disabled && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity h-8 w-8 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  )
}
