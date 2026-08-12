'use client'

import { useState, useEffect, useCallback } from 'react'
import { CategoryButton } from './category-button'
import { TasksView } from './tasks-view'
import { ProgressView } from './progress-view'
import { StreakCalendar } from './streak-calendar'
import { SmallModal } from './modal'
import { Notification } from './notification'
import type { AppData, Task } from '@/lib/types'
import { toTitleCase, getToday } from '@/lib/store'
import { saveDataToFirebase, subscribeToData } from '@/lib/firebase'

interface DailyQuestProps {
  userId?: string | null
  onOverlayChange?: (isOpen: boolean) => void
}

export function DailyQuest({ userId, onOverlayChange }: DailyQuestProps) {
  const [data, setData] = useState<AppData>({ categories: {}, categoryOrder: [] })
  const [notification, setNotification] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Modal states
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isTasksViewOpen, setIsTasksViewOpen] = useState(false)
  const [isProgressViewOpen, setIsProgressViewOpen] = useState(false)
  const [isStreakViewOpen, setIsStreakViewOpen] = useState(false)
  const [progressInitialCategoryId, setProgressInitialCategoryId] = useState<string | null>(null)
  
  // Category drag state
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null)
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null)

  // Layout states
  const [isArchivedExpanded, setIsArchivedExpanded] = useState(false)

  // Get effective user ID (fallback to 'kailesh' for backwards compatibility)
  const effectiveUserId = userId || 'kailesh'

  // Subscribe to Firebase data
  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = subscribeToData(effectiveUserId, (firebaseData) => {
      setData(firebaseData)
      setIsLoading(false)
    })
    
    return () => unsubscribe()
  }, [effectiveUserId])

  // Fire onOverlayChange when any full-screen view opens/closes
  useEffect(() => {
    if (onOverlayChange) {
      onOverlayChange(isTasksViewOpen || isProgressViewOpen || isStreakViewOpen)
    }
  }, [isTasksViewOpen, isProgressViewOpen, isStreakViewOpen, onOverlayChange])



  // Save data to Firebase
  const updateData = useCallback(async (newData: AppData) => {
    setData(newData)
    try {
      await saveDataToFirebase(effectiveUserId, newData)
    } catch (error) {
      console.error('Failed to save to Firebase:', error)
      showNotification('Failed to save data. Please try again.')
    }
  }, [effectiveUserId])

  // Show notification
  const showNotification = useCallback((message: string) => {
    setNotification(message)
  }, [])

  // Get ordered category IDs
  const getOrderedCategoryIds = useCallback(() => {
    const allIds = Object.keys(data.categories)
    const order = data.categoryOrder || []
    
    // Return ordered IDs, followed by any new IDs not in the order
    const orderedIds = order.filter(id => allIds.includes(id))
    const newIds = allIds.filter(id => !order.includes(id))
    
    return [...orderedIds, ...newIds]
  }, [data.categories, data.categoryOrder])

  // Create new category
  const handleCreateCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return

    const titleCaseName = toTitleCase(name)
    const nameLower = titleCaseName.toLowerCase()

    // Check if category exists
    const categoryExists = Object.values(data.categories).some(
      cat => cat.name.toLowerCase() === nameLower
    )

    if (categoryExists) {
      showNotification(`Category "${titleCaseName}" already exists!`)
      return
    }

    const id = 'c' + Date.now()
    const currentOrder = data.categoryOrder || []
    
    const newData: AppData = {
      ...data,
      categories: {
        ...data.categories,
        [id]: {
          name: titleCaseName,
          days: { [getToday()]: [] },
          completed: false
        }
      },
      categoryOrder: [...currentOrder, id]
    }
    
    updateData(newData)
    setNewCategoryName('')
    setIsNewCategoryOpen(false)
  }

  // Open category
  const handleOpenCategory = (id: string) => {
    const category = data.categories[id]
    setSelectedCategoryId(id)
    
    if (category.completed) {
      // Show progress view for completed categories
      setProgressInitialCategoryId(id)
      setIsProgressViewOpen(true)
    } else {
      setIsTasksViewOpen(true)
    }
  }

  // Update tasks for a category
  const handleUpdateTasks = (categoryId: string, tasks: Task[]) => {
    const today = getToday()
    const category = data.categories[categoryId]
    
    const newData: AppData = {
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...category,
          days: {
            ...category.days,
            [today]: tasks
          }
        }
      }
    }
    
    updateData(newData)
  }

  // Toggle category done state
  const handleToggleCategoryDone = (categoryId: string) => {
    const category = data.categories[categoryId]
    const today = getToday()
    const isCurrentlyCompleted = category.completed
    
    let updatedDays = { ...category.days }
    
    if (!isCurrentlyCompleted) {
      // Completing the category. If no tasks today, add one so the graph is not empty.
      const todayTasks = updatedDays[today] || []
      if (todayTasks.length === 0) {
        updatedDays[today] = [{ text: 'Category Completed', done: true }]
      } else {
        // Option: we could also mark all incomplete tasks as done, but just tracking completion is fine.
        // We'll trust the user to have marked what they wanted.
      }
    }
    
    const newData: AppData = {
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...category,
          days: updatedDays,
          completed: !isCurrentlyCompleted
        }
      }
    }
    
    updateData(newData)
    
    if (!isCurrentlyCompleted) {
      setIsTasksViewOpen(false)
      showNotification(`"${category.name}" marked as completed!`)
      setProgressInitialCategoryId(categoryId)
      setIsProgressViewOpen(true)
    } else {
      showNotification(`"${category.name}" completion undone.`)
    }
  }

  // Open progress view
  const handleOpenProgress = () => {
    setProgressInitialCategoryId(null)
    setIsProgressViewOpen(true)
  }



  // Category drag handlers
  const handleCategoryDragStart = (categoryId: string) => {
    setDraggedCategoryId(categoryId)
  }

  const handleCategoryDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    if (draggedCategoryId && draggedCategoryId !== categoryId) {
      setDragOverCategoryId(categoryId)
    }
  }

  const handleCategoryDragLeave = () => {
    setDragOverCategoryId(null)
  }

  const handleCategoryDrop = (dropCategoryId: string) => {
    if (!draggedCategoryId || draggedCategoryId === dropCategoryId) {
      setDraggedCategoryId(null)
      setDragOverCategoryId(null)
      return
    }

    const orderedIds = getOrderedCategoryIds()
    const dragIndex = orderedIds.indexOf(draggedCategoryId)
    const dropIndex = orderedIds.indexOf(dropCategoryId)

    if (dragIndex === -1 || dropIndex === -1) {
      setDraggedCategoryId(null)
      setDragOverCategoryId(null)
      return
    }

    const newOrder = [...orderedIds]
    newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, draggedCategoryId)

    const newData: AppData = {
      ...data,
      categoryOrder: newOrder
    }

    updateData(newData)
    setDraggedCategoryId(null)
    setDragOverCategoryId(null)
  }

  const handleCategoryDragEnd = () => {
    setDraggedCategoryId(null)
    setDragOverCategoryId(null)
  }

  const orderedCategoryIds = getOrderedCategoryIds()

  if (isLoading) {
    return (
      <div className="w-[95vw] h-[95vh] mx-auto mt-[2.5vh] border-2 border-border rounded-2xl animate-glow p-5 flex items-center justify-center">
        <div className="text-primary text-xl italic animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-[95vw] h-[95vh] mx-auto mt-[2.5vh] border-2 border-border rounded-2xl animate-glow p-5 flex flex-col gap-4 overflow-hidden">
      {/* Title */}
      <div className="flex justify-center">
        <h1 className="text-center text-primary text-3xl font-bold animate-fade-in-down animate-text-glow-blue italic origin-center">
          Daily Quest
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => setIsNewCategoryOpen(true)}
          className="px-5 py-2.5 rounded-lg border-[1.5px] border-primary bg-primary/10 text-primary cursor-pointer transition-all duration-300 hover:bg-primary/30 hover:animate-glow-subtle italic"
        >
          + New Category
        </button>
        <button
          onClick={handleOpenProgress}
          className="px-5 py-2.5 rounded-lg border-[1.5px] border-primary bg-primary/10 text-primary cursor-pointer transition-all duration-300 hover:bg-primary/30 hover:animate-glow-subtle italic"
        >
          Progress
        </button>
        <button
          onClick={() => setIsStreakViewOpen(true)}
          className="px-5 py-2.5 rounded-lg border-[1.5px] border-primary bg-primary/10 text-primary cursor-pointer transition-all duration-300 hover:bg-primary/30 hover:animate-glow-subtle italic"
        >
          Streak
        </button>
      </div>

      {/* Category List with Drag & Drop */}
      <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto overflow-y-auto pr-2 pb-4 pt-2">
        {/* Live Categories */}
        {orderedCategoryIds.filter(id => data.categories[id] && !data.categories[id].completed).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1 mb-2">
              Active Quest Logs
            </h3>
            {orderedCategoryIds.filter(id => data.categories[id] && !data.categories[id].completed).map((id) => {
              const category = data.categories[id]
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={() => handleCategoryDragStart(id)}
                  onDragOver={(e) => handleCategoryDragOver(e, id)}
                  onDragLeave={handleCategoryDragLeave}
                  onDrop={() => handleCategoryDrop(id)}
                  onDragEnd={handleCategoryDragEnd}
                  className={`transition-all duration-200 w-full ${
                    draggedCategoryId === id ? 'opacity-50 scale-95' : ''
                  } ${
                    dragOverCategoryId === id ? 'border-t-2 border-green-500 shadow-md shadow-green-500/20 pt-2 transition-all' : ''
                  }`}
                >
                  <CategoryButton
                    category={category}
                    onClick={() => handleOpenCategory(id)}
                    onMarkDone={(e) => {
                      e.stopPropagation()
                      handleToggleCategoryDone(id)
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Completed Categories */}
        {orderedCategoryIds.filter(id => data.categories[id] && data.categories[id].completed).length > 0 && (
          <div className="space-y-3 mt-6">
            <button 
              onClick={() => setIsArchivedExpanded(!isArchivedExpanded)}
              className="w-full flex items-center justify-between text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1 mb-2 hover:text-foreground transition-colors cursor-pointer"
            >
              <span>Archived Legends</span>
              <span className={`transform transition-transform ${isArchivedExpanded ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <div className={`space-y-3 transition-all duration-300 overflow-hidden ${isArchivedExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
              {orderedCategoryIds.filter(id => data.categories[id] && data.categories[id].completed).map((id) => {
                const category = data.categories[id]
                return (
                  <div key={id} className="w-full">
                    <CategoryButton
                        category={category}
                        onClick={() => handleOpenCategory(id)}
                        onMarkDone={(e) => {
                          e.stopPropagation()
                          handleToggleCategoryDone(id)
                        }}
                      />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {orderedCategoryIds.length === 0 && (
          <p className="text-center text-muted-foreground italic mt-4 py-8 bg-card/50 rounded-xl border border-dashed border-border/60">
            No categories yet. Create one to get started!
          </p>
        )}
      </div>

      {/* Drag hint */}
      {orderedCategoryIds.length > 1 && (
        <p className="text-center text-muted-foreground text-xs italic">
          Drag categories to reorder them
        </p>
      )}

      {/* New Category Modal */}
      <SmallModal
        isOpen={isNewCategoryOpen}
        onClose={() => {
          setIsNewCategoryOpen(false)
          setNewCategoryName('')
        }}
        title="Create New Category"
      >
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreateCategory()
          }}
          placeholder="Enter category name..."
          autoFocus
          className="w-full px-4 py-3.5 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-base transition-all focus:outline-none focus:border-secondary focus:animate-glow-subtle focus:bg-primary/15 placeholder:text-foreground/50"
        />
        <div className="flex gap-3">
          <button
            onClick={handleCreateCategory}
            className="flex-1 px-5 py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/15 to-primary/10 text-primary cursor-pointer font-bold text-sm italic uppercase transition-all hover:from-primary/25 hover:to-primary/15 hover:animate-glow-subtle hover:-translate-y-0.5 active:translate-y-0"
          >
            Create
          </button>
          <button
            onClick={() => {
              setIsNewCategoryOpen(false)
              setNewCategoryName('')
            }}
            className="flex-1 px-5 py-3 border-[1.5px] border-muted-foreground rounded-lg bg-muted-foreground/10 text-muted-foreground cursor-pointer font-bold text-sm italic uppercase transition-all hover:bg-muted-foreground/20 hover:shadow-[0_0_15px_rgba(155,176,204,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Cancel
          </button>
        </div>
      </SmallModal>

      {/* Tasks View */}
      <TasksView
        isOpen={isTasksViewOpen}
        onClose={() => setIsTasksViewOpen(false)}
        category={selectedCategoryId ? data.categories[selectedCategoryId] : null}
        categoryId={selectedCategoryId}
        onUpdateTasks={handleUpdateTasks}
        onMarkDone={handleToggleCategoryDone}
      />

      {/* Progress View */}
      <ProgressView
        isOpen={isProgressViewOpen}
        onClose={() => {
          setIsProgressViewOpen(false)
          setProgressInitialCategoryId(null)
        }}
        categories={data.categories}
        initialCategoryId={progressInitialCategoryId}
      />

      {/* Streak Calendar */}
      <StreakCalendar
        isOpen={isStreakViewOpen}
        onClose={() => setIsStreakViewOpen(false)}
        categories={data.categories}
      />

      {/* Notification */}
      <Notification
        message={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  )
}
