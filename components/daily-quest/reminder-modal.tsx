'use client'

import { useState, useEffect } from 'react'
import { Modal } from './modal'

interface ReminderModalProps {
  isOpen: boolean
  onClose: () => void
  categoryName: string
  initialLabel?: string
  initialDate?: string
  initialTime?: string
  onSave: (label: string, date: string, time?: string) => void
  onClear: () => void
}

export function ReminderModal({ 
  isOpen, 
  onClose, 
  categoryName, 
  initialLabel,
  initialDate, 
  initialTime, 
  onSave, 
  onClear 
}: ReminderModalProps) {
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  // Initialize with current values or tomorrow's date
  useEffect(() => {
    if (isOpen) {
      if (initialDate) {
        setLabel(initialLabel || '')
        setDate(initialDate)
        setTime(initialTime || '')
      } else {
        setLabel('')
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        setDate(tomorrow.toISOString().split('T')[0])
        setTime('09:00')
      }
    }
  }, [isOpen, initialLabel, initialDate, initialTime])

  const handleSave = () => {
    if (!date || !label.trim()) return
    onSave(label.trim(), date, time || undefined)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reminder for ${categoryName}`}>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary/80 uppercase tracking-widest italic ml-1">
            Label *
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Morning Workout"
            className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic focus:outline-none focus:border-secondary transition-colors placeholder:text-foreground/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary/80 uppercase tracking-widest italic ml-1">
            Date *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary/80 uppercase tracking-widest italic ml-1">
            Time (Optional)
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={handleSave}
            disabled={!date || !label.trim()}
            className="flex-1 px-5 py-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border-[1.5px] border-primary text-primary font-bold italic transition-all hover:from-primary/30 hover:to-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            Save Reminder
          </button>
          
          {(initialDate) && (
            <button
              onClick={onClear}
              className="flex-1 px-5 py-3 rounded-lg bg-destructive/10 border-[1.5px] border-destructive text-destructive font-bold italic transition-all hover:bg-destructive/20 hover:shadow-[0_0_15px_rgba(255,95,95,0.3)] hover:-translate-y-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
