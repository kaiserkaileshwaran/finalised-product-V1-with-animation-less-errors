'use client'

import { useState, useEffect } from 'react'
import { Modal } from './modal'
import { ProgressChart } from './progress-chart'
import { ProgressLogs } from './progress-logs'
import type { Category, TimeRange } from '@/lib/types'

interface ProgressViewProps {
  isOpen: boolean
  onClose: () => void
  categories: Record<string, Category>
  initialCategoryId?: string | null
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '1 Week', value: 7 },
  { label: '1 Month', value: 30 },
  { label: '6 Months', value: 180 },
  { label: '1 Year', value: 365 },
  { label: 'Max', value: 'max' },
]

// Custom hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

export function ProgressView({ isOpen, onClose, categories, initialCategoryId }: ProgressViewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId || '')
  const [timeRange, setTimeRange] = useState<TimeRange>(30)
  const isMobile = useIsMobile()

  // Sync selection whenever a category opens this view
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId)
    }
  }, [initialCategoryId, isOpen])

  const selectedCategory = selectedCategoryId ? categories[selectedCategoryId] : null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Progress & Logs">
      {/* Category Header: direct name when from a category click; dropdown when from Progress button */}
      <div className="p-3 border-b border-primary text-center">
        {initialCategoryId ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary text-lg font-bold italic drop-shadow-[0_0_10px_rgba(79,195,255,0.6)]">
              {categories[initialCategoryId]?.name}
            </span>
            {categories[initialCategoryId]?.completed && (
              <span className="text-secondary text-xs font-bold bg-secondary/10 border border-secondary/40 px-2 py-0.5 rounded-full">✓ Completed</span>
            )}
          </div>
        ) : (
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="bg-card text-primary border border-primary rounded-md px-3 py-1.5 italic focus:outline-none w-full max-w-xs"
          >
            <option value="">— Select Category —</option>
            {Object.entries(categories).map(([id, cat]) => (
              <option key={id} value={id}>
                {cat.completed ? `${cat.name} ✓` : cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 flex ${isMobile ? 'flex-col overflow-y-auto' : 'overflow-hidden'}`}>
        {/* Graph Section */}
        <div className={`${isMobile ? 'h-[400px] flex-shrink-0 border-b border-primary' : 'flex-1 border-r border-primary'} flex flex-col min-h-0`}>
          {/* Graph Controls */}
          <div className="p-4 border-b border-border bg-gradient-to-br from-card/80 to-[#142036]/80 flex-shrink-0">
            <div className="text-primary text-center font-bold mb-3 text-shadow-[0_0_10px_rgba(79,195,255,0.8)]">
              Productivity vs Time
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {TIME_RANGES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-3 py-1.5 rounded-md border-[1.5px] text-xs font-bold transition-all ${
                    timeRange === value
                      ? 'bg-primary text-primary-foreground border-primary animate-glow-subtle'
                      : 'bg-primary/10 text-primary border-primary hover:bg-primary/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 p-4 min-h-0" style={{ minHeight: isMobile ? '250px' : '0' }}>
            <ProgressChart category={selectedCategory} timeRange={timeRange} />
          </div>
        </div>

        {/* Logs Section */}
        <div className={`${isMobile ? 'flex-none min-h-[300px]' : 'w-[35%]'} p-4 overflow-y-auto`}>
          <ProgressLogs category={selectedCategory} />
        </div>
      </div>
    </Modal>
  )
}
