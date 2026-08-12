import type { AppData, Category, Task, LogEntry, TimeRange } from './types'

const STORAGE_KEY = 'daily-quest-data'

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getToday(): string {
  return formatLocalDate(new Date())
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return { categories: {} }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { categories: {} }
    }
  }
  return { categories: {} }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function categoryHasIncompleteToday(category: Category): boolean {
  const d = getToday()
  if (!category.days || !category.days[d]) return false
  return category.days[d].some(task => !task.done)
}

export function computeProgressLogs(category: Category): LogEntry[] | null {
  if (!category.days || Object.keys(category.days).length === 0) {
    return null
  }

  const logEntries = Object.entries(category.days)
    .filter(([dateStr, tasks]) => {
      if (!dateStr || typeof dateStr !== 'string') return false
      if (!Array.isArray(tasks) || tasks.length === 0) return false
      return tasks.every(t => t && typeof t === 'object')
    })
    .map(([date, tasks]) => {
      const sanitizedTasks = tasks.map(t => ({
        text: String(t.text || 'Untitled Task'),
        done: Boolean(t.done),
      }))

      const completed = sanitizedTasks.filter(t => t.done)
      const pending = sanitizedTasks.filter(t => !t.done)

      return {
        date,
        completed,
        pending,
        total: sanitizedTasks.length,
        completionRate: Math.round((completed.length / sanitizedTasks.length) * 100),
        isAllDone: pending.length === 0,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return logEntries
}

export function calcPoints(category: Category, daysRange: TimeRange): { d: string; pts: number }[] {
  if (!category.days || typeof category.days !== 'object') return []

  const now = new Date()
  const endDate = new Date(now)
  let startDate = new Date(now)

  const allDates = Object.keys(category.days)
    .filter(d => !isNaN(new Date(d).getTime()))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (allDates.length === 0) return []

  if (daysRange === 'max') {
    startDate = new Date(allDates[0])
  } else {
    startDate.setDate(startDate.getDate() - daysRange + 1)
  }

  let runningTotal = 0
  const points: { d: string; pts: number }[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = formatLocalDate(currentDate)
    const tasks = category.days[dateStr] || []

    const completedToday = tasks.filter(t => t && t.done).length
    runningTotal += completedToday

    points.push({
      d: dateStr,
      pts: runningTotal,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return points
}

export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = getToday()
  const now = new Date()
  const yesterday = formatLocalDate(new Date(now.getTime() - 86400000))

  let label = ''
  if (dateStr === today) {
    label = ' (Today)'
  } else if (dateStr === yesterday) {
    label = ' (Yesterday)'
  }

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-US', options) + label
}
