'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Modal } from './modal'
import type { Category, Task } from '@/lib/types'
import { getToday } from '@/lib/store'
import { cn } from '@/lib/utils'

interface StreakCalendarProps {
  isOpen: boolean
  onClose: () => void
  categories: Record<string, Category>
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export function StreakCalendar({ isOpen, onClose, categories }: StreakCalendarProps) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [mobileMonth, setMobileMonth] = useState(today.getMonth())
  const pillStripRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // ─── Compute accessible date range ───────────────────────────────────────
  const { minDate, maxDate, allMonths } = useMemo(() => {
    // Find the earliest date any category has data
    let earliest: Date | null = null
    Object.values(categories).forEach(cat => {
      if (cat.days) {
        Object.keys(cat.days).forEach(dateStr => {
          const d = new Date(dateStr + 'T00:00:00')
          if (!earliest || d < earliest) earliest = d
        })
      }
    })

    // 3 months before earliest (or 3 months before today if no data)
    const base = earliest || today
    const minD = new Date(base.getFullYear(), base.getMonth() - 3, 1)
    
    // Desktop: show the full year of currentYear
    // Mobile: show all months but we will start from current month using startIdx
    
    const months: { year: number; month: number; label: string }[] = []
    
    // Show full 12 months for the current selected year
    for (let i = 0; i < 12; i++) {
      months.push({
        year: currentYear,
        month: i,
        label: `${MONTHS[i]}, ${currentYear}`
      })
    }

    const maxD = new Date(today.getFullYear(), today.getMonth(), 1)
    return { minDate: minD, maxDate: maxD, allMonths: months }
  }, [categories])

  // ─── Embla for mobile main calendar ──────────────────────────────────────
  // We show all 12 months in embla, startIndex = index of current month
  const startIdx = useMemo(() => {
    const index = allMonths.findIndex(m => m.year === today.getFullYear() && m.month === today.getMonth())
    return index >= 0 ? index : 0
  }, [allMonths, today])

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex: startIdx, align: 'center' })

  useEffect(() => {
    if (!isOpen) return
    setCurrentYear(today.getFullYear())
    setMobileMonth(today.getMonth())
    setSelectedDate(null)
  }, [isOpen, today])

  useEffect(() => {
    if (!emblaApi || !isOpen) return
    emblaApi.scrollTo(startIdx, true)
  }, [emblaApi, isOpen, startIdx])

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const idx = emblaApi.selectedScrollSnap()
        const m = allMonths[idx]
        if (m) {
          setMobileMonth(m.month)
          setCurrentYear(m.year)
        }
      }
      onSelect()
      emblaApi.on('select', onSelect)
      return () => { emblaApi.off('select', onSelect) }
    }
  }, [emblaApi, allMonths])

  // Sync pill strip scroll to active pill
  useEffect(() => {
    if (pillStripRef.current) {
      const active = pillStripRef.current.querySelector('[data-active="true"]') as HTMLElement
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [mobileMonth, currentYear])

  // ─── Day data ─────────────────────────────────────────────────────────────
  const getDayData = (dateStr: string) => {
    const assignedCategories: string[] = []
    let hasAssignment = false
    let completedAll = true

    Object.values(categories).forEach(cat => {
      if (cat.days?.[dateStr]?.length > 0) {
        hasAssignment = true
        assignedCategories.push(cat.name)
        if (cat.days[dateStr].some(t => !t.done)) completedAll = false
      }
    })

    return { assignedCategories, hasAssignment, completedAll }
  }

  // Only true if we are looking at the current year and the month is after this month
  const isFutureMonth = (year: number, month: number) => {
    return (year === today.getFullYear() && month > today.getMonth()) || year > today.getFullYear()
  }

  const isInRange = (year: number, month: number) => {
    return !isFutureMonth(year, month)
  }

  // Is a specific date strictly in the future (after today)?
  const isFutureDate = (dateStr: string): boolean => {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return dateStr > todayStr
  }

  // ─── Selected day details ─────────────────────────────────────────────────
  const getSelectedDayDetails = () => {
    if (!selectedDate) return null
    const dateObj = new Date(selectedDate + 'T00:00:00')
    const categoriesData: { name: string; tasks: Task[]; completed: number; total: number }[] = []
    let totalTasks = 0
    let completedTasks = 0

    Object.entries(categories).forEach(([, cat]) => {
      if (cat.days?.[selectedDate]?.length > 0) {
        const tasks = cat.days[selectedDate]
        const completed = tasks.filter(t => t?.done).length
        totalTasks += tasks.length
        completedTasks += completed
        categoriesData.push({ name: cat.name, tasks, completed, total: tasks.length })
      }
    })

    return { dateObj, categoriesData, totalTasks, completedTasks }
  }

  const selectedDayDetails = getSelectedDayDetails()

  // ─── Render a single month grid ───────────────────────────────────────────
  const renderMonthGrid = (year: number, monthIndex: number, dimmed: boolean) => {
    const monthStart = new Date(year, monthIndex, 1)
    const monthEnd = new Date(year, monthIndex + 1, 0)
    const startDay = monthStart.getDay()
    const days: (number | null)[] = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= monthEnd.getDate(); d++) days.push(d)

    return (
      <div className={cn("flex flex-col items-center gap-2", dimmed && "opacity-40 pointer-events-none select-none")}>
        <h3 className="text-primary font-bold italic w-full text-center mb-1">{MONTHS[monthIndex]} {year}</h3>
        <div className="grid grid-cols-7 gap-2 md:gap-2.5">
          {WEEKDAYS.map((day, i) => (
            <div key={`header-${i}`} className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center text-[10px] text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          {days.map((day, i) => {
            if (day === null) return <div key={i} className="w-9 h-9 md:w-10 md:h-10" />
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const { hasAssignment, completedAll } = getDayData(dateStr)
            const isSelected = selectedDate === dateStr
            const isFuture = isFutureDate(dateStr)

            return (
              <button
                key={i}
                onClick={() => !dimmed && !isFuture && setSelectedDate(dateStr)}
                disabled={isFuture || dimmed}
                className={cn(
                  'rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all min-w-8 h-8 md:min-w-9 md:h-9 relative leading-none shadow-sm',
                  isFuture
                    ? 'bg-muted/40 text-muted-foreground/80 border border-border/30 opacity-80 cursor-not-allowed'
                    : 'cursor-pointer',
                  !isFuture && !hasAssignment && 'bg-border/30 text-muted-foreground hover:bg-border/50',
                  !isFuture && hasAssignment && completedAll && 'bg-secondary/20 text-secondary shadow-[0_0_8px_rgba(124,255,154,0.3)] hover:shadow-[0_0_15px_rgba(124,255,154,0.6)] hover:scale-105',
                  !isFuture && hasAssignment && !completedAll && 'bg-destructive/20 text-destructive shadow-[0_0_8px_rgba(255,95,95,0.3)] hover:shadow-[0_0_15px_rgba(255,95,95,0.6)] hover:scale-105',
                  isSelected && !isFuture && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 z-10'
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onEscape={() => (selectedDate ? setSelectedDate(null) : onClose())} title="Streak Calendar" className="max-w-6xl w-[96vw] max-h-[94dvh] h-[94dvh]">
      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">

        {/* ── DESKTOP: Year selector + full grid ───────────────────────────── */}
        {!isMobile && (
          <>
            {/* Year Nav */}
            <div className="flex items-center justify-center gap-4 mb-3 flex-shrink-0">
              <button
                onClick={() => setCurrentYear(y => y - 1)}
                disabled={currentYear - 1 < minDate.getFullYear() || (currentYear - 1 === minDate.getFullYear() && 11 < minDate.getMonth())}
                className="px-3 py-1.5 rounded-md border border-primary bg-primary/10 text-primary text-xs font-bold transition-all hover:bg-primary/30 disabled:opacity-30 disabled:cursor-not-allowed"
              >Prev</button>
              <div className="text-primary text-base font-bold min-w-16 text-center">{currentYear}</div>
              <button
                onClick={() => setCurrentYear(y => y + 1)}
                disabled={currentYear + 1 > maxDate.getFullYear() || (currentYear + 1 === maxDate.getFullYear() && 0 > maxDate.getMonth())}
                className="px-3 py-1.5 rounded-md border border-primary bg-primary/10 text-primary text-xs font-bold transition-all hover:bg-primary/30 disabled:opacity-30 disabled:cursor-not-allowed"
              >Next</button>
            </div>

            {/* Month Grid */}
            <div className="flex-1 overflow-y-auto w-full px-2 py-4">
              <div className="grid gap-6 mx-auto justify-center max-w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {MONTHS.map((_, monthIndex) => {
                  const dimmed = !isInRange(currentYear, monthIndex)
                  return (
                    <div key={monthIndex}>
                      {renderMonthGrid(currentYear, monthIndex, dimmed)}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── MOBILE: Embla swipeable calendar ─────────────────────────────── */}
        {isMobile && (
          <>
            {/* Current Month Title */}
            <div className="text-center text-muted-foreground text-sm mb-2 flex-shrink-0">
              Swipe to browse months
            </div>

            {/* Swipeable month */}
            <div className="flex-1 overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y h-full">
                {allMonths.map((m, idx) => (
                  <div key={idx} className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start pt-2 px-4">
                    {renderMonthGrid(m.year, m.month, false)}
                  </div>
                ))}
              </div>
            </div>

            {/* Pill strip month navigation */}
            <div className="flex-shrink-0 mt-3 pb-1">
              <div
                ref={pillStripRef}
                className="flex gap-2 overflow-x-auto pb-1 px-2 scroll-smooth"
                style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
              >
                {allMonths.map((m, idx) => {
                  const isActive = m.year === currentYear && m.month === mobileMonth
                  return (
                    <button
                      key={idx}
                      data-active={isActive}
                      onClick={() => {
                        setMobileMonth(m.month)
                        setCurrentYear(m.year)
                        emblaApi?.scrollTo(idx)
                      }}
                      className={cn(
                        "flex-shrink-0 px-3 py-1 rounded-full border text-xs font-semibold transition-all whitespace-nowrap",
                        isActive
                          ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(79,195,255,0.3)] scale-105"
                          : "bg-card border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary/80"
                      )}
                    >
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-primary/20 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[10px]">
            <div className="w-3 h-3 rounded bg-border/50 border border-foreground/5" />
            <span className="text-muted-foreground">No tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <div className="w-3 h-3 rounded bg-secondary shadow-[0_0_4px_rgba(124,255,154,0.6)]" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <div className="w-3 h-3 rounded bg-destructive shadow-[0_0_4px_rgba(255,95,95,0.6)]" />
            <span className="text-muted-foreground">Pending</span>
          </div>
        </div>
        <div className="text-center text-muted-foreground text-[10px] italic mt-1 flex-shrink-0">
          Click on a date to view details
        </div>
      </div>

      {/* Day Details Panel */}
      {selectedDate && selectedDayDetails && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="w-full max-w-lg bg-card/95 backdrop-blur-md border-[1.5px] border-primary rounded-2xl shadow-[0_8px_32px_rgba(79,195,255,0.2)] flex flex-col overflow-hidden max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-primary/30 flex-shrink-0 bg-primary/5">
              <span className="text-primary font-bold text-xl italic tracking-wide">
                {selectedDayDetails.dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {selectedDayDetails.categoriesData.length === 0 ? (
                <div className="text-center text-muted-foreground py-10 italic text-lg">No tasks assigned for this day.</div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-primary/10 rounded-xl text-center text-sm flex flex-wrap justify-center gap-6 border border-primary/20">
                    <span className="text-foreground">Total: <strong className="text-lg">{selectedDayDetails.totalTasks}</strong></span>
                    <span className="text-secondary">Done: <strong className="text-lg">{selectedDayDetails.completedTasks}</strong></span>
                    <span className="text-destructive">Pending: <strong className="text-lg">{selectedDayDetails.totalTasks - selectedDayDetails.completedTasks}</strong></span>
                  </div>
                  <div className="space-y-4">
                    {selectedDayDetails.categoriesData.map((catData, i) => (
                      <div key={i} className="p-4 rounded-xl border border-primary/20 bg-card/50">
                        <div className="text-secondary font-bold text-base mb-3 flex items-center gap-2">
                          <span className="italic">{catData.name}</span>
                          <span className="text-secondary/70 text-xs font-normal bg-secondary/10 px-2 py-0.5 rounded-full">
                            {catData.completed} / {catData.total} Finished
                          </span>
                        </div>
                        <div className="space-y-2">
                          {catData.tasks.map((task, j) => (
                            <div key={j} className={cn(
                              'flex items-start gap-3 p-3 bg-primary/5 rounded-lg text-sm border transition-colors',
                              task.done ? 'border-secondary/30 text-secondary/80' : 'border-destructive/30 text-destructive font-medium'
                            )}>
                              <span className="flex-shrink-0 mt-0.5">{task.done ? '✓' : '✗'}</span>
                              <span>{task.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
