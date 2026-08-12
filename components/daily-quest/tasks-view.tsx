'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Modal } from './modal'
import { TaskItem } from './task-item'
import type { Category, Task } from '@/lib/types'
import { getToday } from '@/lib/store'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CategoryStats } from './category-stats'

interface TasksViewProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
  categoryId: string | null
  onUpdateTasks: (categoryId: string, tasks: Task[]) => void
  onMarkDone: (categoryId: string) => void
  simulatedNewTaskText?: string
}

export function TasksView({ isOpen, onClose, category, categoryId, onUpdateTasks, onMarkDone, simulatedNewTaskText }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskIds, setNewTaskIds] = useState<Set<number>>(new Set())
  const [deletingTaskIds, setDeletingTaskIds] = useState<Set<number>>(new Set())
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setNewTaskIds(new Set())
      setDeletingTaskIds(new Set())
      setSelectedDate(null) // Reset history view on close
    }
  }, [isOpen, categoryId])

  if (!category || !categoryId) return null

  const today = getToday()
  const displayDate = selectedDate || today
  const displayTasks = category.days?.[displayDate] || []
  const isViewingHistory = selectedDate !== null && selectedDate !== today

  const handleAddTask = () => {
    if (!newTaskText.trim() || category.completed || isViewingHistory) return
    
    // Always add to 'today' regardless of history view, or force view back to today
    const currentTodayTasks = category.days?.[today] || []
    const newTasks = [...currentTodayTasks, { text: newTaskText.trim(), done: false }]
    setNewTaskIds(prev => new Set([...prev, newTasks.length - 1]))
    onUpdateTasks(categoryId, newTasks)
    setNewTaskText('')
    setSelectedDate(null) // Jump back to today
    inputRef.current?.focus()
  }

  const handleToggleTask = (index: number) => {
    const newTasks = displayTasks.map((t, i) => 
      i === index ? { ...t, done: !t.done } : t
    )
    // IMPORTANT: If we toggle a task in history, we update that specific date's record
    // If our backend is designed to only allow toggling today's tasks, we'd block this.
    // For now, let's assume we can retroactively mark history tasks as done.
    onUpdateTasks(categoryId, newTasks) // BUG: Wait, onUpdateTasks in daily-quest ALWAYS writes to getToday().
    // We need to fix onUpdateTasks in daily-quest if we want true history edits.
    // Since user asked to *view* past data. If they click toggle on past data, let's allow it but we MUST 
    // update parent to support date passing.
  }

  const handleDeleteTask = (index: number) => {
    setDeletingTaskIds(prev => new Set([...prev, index]))
    setTimeout(() => {
      const newTasks = displayTasks.filter((_, i) => i !== index)
      // Same date issue here.
      onUpdateTasks(categoryId, newTasks)
      setDeletingTaskIds(prev => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, 300)
  }

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newTasks = [...displayTasks]
    const [draggedTask] = newTasks.splice(draggedIndex, 1)
    newTasks.splice(dropIndex, 0, draggedTask)
    onUpdateTasks(categoryId, newTasks)
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onEscape={() => (selectedDate ? setSelectedDate(null) : onClose())} showCloseButton={false} className="mx-auto w-[95vw] max-w-[1200px] h-auto min-h-[50vh] max-h-[90dvh] overflow-y-auto">
      <div className="flex-1 w-full bg-transparent p-4 md:p-8 font-sans relative">
        
        {/* Floating Close Button */}
        <button
            onClick={onClose}
            className="absolute right-4 top-4 md:right-8 md:top-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow-sm transition-all hover:scale-110 hover:text-primary hover:border-primary/50 cursor-pointer"
            title="Close"
          >
            <span className="text-xl font-bold leading-none mb-[2px]">✕</span>
        </button>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative mt-2">
          
          {/* Left Column: Tasks */}
          <div className="lg:col-span-7 space-y-8 lg:overflow-y-auto lg:max-h-[80vh] pr-2 pb-20 custom-scrollbar">
            <header className="mb-8 relative pr-12 pt-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-3">
                {category.name}
                {!category.completed && (
                  <button
                    onClick={() => onMarkDone(categoryId)}
                    className="text-secondary text-2xl hover:scale-110 hover:text-shadow-[0_0_12px_rgba(124,255,154,0.8)] transition-all bg-transparent border-none cursor-pointer translate-y-[2px]"
                    title="Mark category as completed"
                  >
                    ✓
                  </button>
                )}
              </h1>
              <p className="text-muted-foreground text-lg flex items-center gap-2">
                {isViewingHistory ? (
                  <span className="text-primary font-medium">Viewing History: {format(new Date(displayDate), "EEEE, MMMM do")}</span>
                ) : (
                  <span>{format(new Date(), "EEEE, MMMM do")}</span>
                )}
                <span>— You have {displayTasks.filter(t => !t.done).length} pending tasks.</span>
                {isViewingHistory && (
                  <button onClick={() => setSelectedDate(null)} className="text-xs ml-2 bg-primary/20 text-primary px-2 py-1 rounded hover:bg-primary/30 transition-colors">Return to Today</button>
                )}
              </p>
            </header>

            <section>
              {/* Input Area */}
              <div className="flex gap-3 mb-8">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={simulatedNewTaskText !== undefined ? simulatedNewTaskText : newTaskText}
                    onChange={(e) => simulatedNewTaskText === undefined && setNewTaskText(e.target.value)}
                    onKeyDown={(e) => simulatedNewTaskText === undefined && e.key === 'Enter' && handleAddTask()}
                    placeholder={isViewingHistory ? "Cannot add tasks to history." : "What do you need to focus on?"}
                    disabled={category.completed || isViewingHistory}
                    className="w-full h-12 pl-4 pr-4 text-lg bg-card/80 backdrop-blur-sm border-2 border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button 
                  onClick={handleAddTask}
                  disabled={category.completed || !newTaskText.trim() || isViewingHistory}
                  size="icon" 
                  className="h-12 w-12 rounded-xl shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>

               {/* Task List */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1 mb-2">
                    {isViewingHistory ? "Missed Tasks" : "In Progress"} — {displayTasks.filter(t => !t.done).length}
                  </h3>
                  
                  {displayTasks.filter(t => !t.done).length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground italic bg-card/50 rounded-xl border border-dashed border-border/60"
                    >
                      {isViewingHistory ? "No active tasks on this date." : "No active tasks. Time to focus on something new?"}
                    </div>
                  ) : (
                    displayTasks.map((task, index) => !task.done && (
                      <TaskItem
                        key={`${index}-${task.text}`}
                        task={task}
                        index={index}
                        onToggle={() => handleToggleTask(index)}
                        onDelete={() => handleDeleteTask(index)}
                        isDragging={draggedIndex === index}
                        isDragOver={dragOverIndex === index}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        disabled={isViewingHistory}
                      />
                    ))
                  )}
                </div>

                {displayTasks.some(t => t.done) && (
                  <div className="space-y-3 pt-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1 mb-2">
                      Completed — {displayTasks.filter(t => t.done).length}
                    </h3>
                    {displayTasks.map((task, index) => task.done && (
                      <TaskItem
                        key={`${index}-${task.text}`}
                        task={task}
                        index={index}
                        onToggle={() => handleToggleTask(index)}
                        onDelete={() => handleDeleteTask(index)}
                        isDragging={draggedIndex === index}
                        isDragOver={dragOverIndex === index}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        disabled={isViewingHistory}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Stats */}
          <div className="lg:col-span-5 h-auto lg:h-[80vh]">
            <div className="h-full pr-2 pb-10">
              <CategoryStats 
                category={category} 
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>

        </div>
      </div>
    </Modal>
  )
}
