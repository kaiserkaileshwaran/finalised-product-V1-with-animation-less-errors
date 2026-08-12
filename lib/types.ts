export interface Task {
  text: string
  done: boolean
  isNew?: boolean
}

export interface CategoryReminder {
  label?: string
  date: string
  time?: string
  status: 'scheduled' | 'completed' | 'notified'
}

export interface Category {
  name: string
  days: Record<string, Task[]>
  completed: boolean
  reminder?: CategoryReminder
}

export interface AppData {
  categories: Record<string, Category>
  categoryOrder?: string[] // For drag-and-drop ordering
}

export interface LogEntry {
  date: string
  completed: Task[]
  pending: Task[]
  total: number
  completionRate: number
  isAllDone: boolean
}

export type TimeRange = 7 | 30 | 180 | 365 | 'max'
