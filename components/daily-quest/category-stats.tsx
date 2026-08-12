'use client'

import { useMemo, useEffect, useRef, useState, useCallback } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"
import { format, subDays, startOfWeek, eachDayOfInterval, getDay, isSameDay, subMonths, startOfMonth, endOfMonth, isAfter } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Trophy, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface CategoryStatsProps {
  category: Category
  selectedDate?: string | null
  onSelectDate?: (date: string) => void
}

interface HeatmapTooltip {
  date: string
  count: number
  x: number
  y: number
  flipX: boolean
  flipY: boolean
}

export function CategoryStats({ category, selectedDate, onSelectDate }: CategoryStatsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const heatmapContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredCell, setHoveredCell] = useState<HeatmapTooltip | null>(null)

  // Convert Category.days Record to ActivityLog[] flat format for easy charting
  const activityLog = useMemo(() => {
    const days = category?.days || {}
    return Object.entries(days).map(([date, tasks]: [string, any]) => {
      const count = tasks.filter((t: any) => t.done).length
      return { date, count }
    })
  }, [category])

  // Calculate current streak (consecutive days with at least 1 completed task)
  const currentStreak = useMemo(() => {
    let streak = 0
    let checkDate = new Date()
    
    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd")
      const log = activityLog.find(l => l.date === dateStr)
      if (log && log.count > 0) {
        streak++
        checkDate = subDays(checkDate, 1)
      } else {
        const isToday = format(new Date(), "yyyy-MM-dd") === dateStr
        if (!isToday || streak > 0) break
        checkDate = subDays(checkDate, 1)
      }
    }
    return streak
  }, [activityLog])

  // Chart Data: Last 14 days
  const chartData = useMemo(() => {
    const end = new Date()
    const start = subDays(end, 13)
    const days = eachDayOfInterval({ start, end })

    return days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      const log = activityLog.find(l => l.date === dateStr)
      return {
        date: format(day, "MMM dd"),
        count: log ? log.count : 0
      }
    })
  }, [activityLog])

  // Heatmap Data: Last 12 months in real calendar structure
  const { heatmapMonths } = useMemo(() => {
    const today = new Date()
    const months = []
    const activityMap = new Map(activityLog.map(l => [l.date, l.count]))
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })
      
      const monthDays: any[] = []
      
      // Pad beginning of month
      const startDayOfWeek = getDay(start)
      for (let j = 0; j < startDayOfWeek; j++) {
        monthDays.push({ isEmpty: true, id: `pad-start-${i}-${j}` })
      }
      
      // Add actual days
      days.forEach(day => {
        const dateStr = format(day, "yyyy-MM-dd")
        monthDays.push({
          date: dateStr,
          count: activityMap.get(dateStr) || 0,
          isEmpty: false,
          isFuture: isAfter(day, today)
        })
      })
      
      // Pad end of month
      const endDayOfWeek = getDay(end)
      for (let j = endDayOfWeek + 1; j < 7; j++) {
        monthDays.push({ isEmpty: true, id: `pad-end-${i}-${j}` })
      }
      
      months.push({
        label: format(monthDate, "MMM yyyy"),
        id: format(monthDate, "yyyy-MM"),
        days: monthDays
      })
    }
    
    return { heatmapMonths: months }
  }, [activityLog])

  // Total tasks completed this month
  const thisMonthCount = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return activityLog
      .filter(log => {
        const logDate = new Date(log.date)
        return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear
      })
      .reduce((sum, item) => sum + item.count, 0)
  }, [activityLog])

  // Auto-scroll heatmap to today (right)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [heatmapMonths])

  const handleCellMouseEnter = useCallback((e: React.MouseEvent, cell: { date: string; count: number }) => {
    const container = heatmapContainerRef.current
    if (!container) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const x = rect.left - containerRect.left + rect.width / 2
    const y = rect.top - containerRect.top
    const flipX = x > containerRect.width - 160
    const flipY = y < 60
    setHoveredCell({ date: cell.date, count: cell.count, x, y, flipX, flipY })
  }, [])

  const handleCellMouseLeave = useCallback(() => {
    setHoveredCell(null)
  }, [])

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Flame className="w-16 h-16 text-primary" />
          </div>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 text-primary font-medium mb-1">
              <Flame className="w-4 h-4 fill-primary" />
              <span>Current Streak</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {currentStreak} <span className="text-sm font-sans font-normal text-muted-foreground">days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Trophy className="w-16 h-16 text-foreground" />
          </div>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>This Month</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {thisMonthCount} <span className="text-sm font-sans font-normal text-muted-foreground">tasks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend Chart */}
      <Card className="shadow-sm border-border flex flex-col" style={{ height: '340px' }}>
        <CardHeader className="pb-2 shrink-0">
          <CardTitle className="text-base font-medium text-foreground">
            Productivity Trend
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 w-full pl-0 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 16, left: 70, bottom: 36 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                axisLine={{ stroke: "royalblue", strokeWidth: 2 }}
                tickLine={{ stroke: "royalblue" }}
                tick={{ fontSize: 10, fill: "royalblue" }}
                interval={2}
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: -20,
                  style: { fill: "royalblue", fontSize: 12, fontWeight: 600 },
                }}
              />

              <YAxis
                axisLine={{ stroke: "royalblue", strokeWidth: 2 }}
                tickLine={{ stroke: "royalblue" }}
                tick={{ fontSize: 10, fill: "royalblue" }}
                allowDecimals={false}
                width={16}
                label={{
                  value: "Tasks Completed",
                  angle: -90,
                  dx: -62,
                  dy: 10,
                  position: "insideLeft",
                  style: { fill: "royalblue", fontSize: 11, fontWeight: 600, textAnchor: 'middle' },
                }}
              />

              <RechartsTooltip
                contentStyle={{
                  background: 'rgba(10,20,40,0.92)',
                  border: '1.5px solid rgba(79,195,255,0.5)',
                  borderRadius: '10px',
                  boxShadow: '0 0 16px rgba(79,195,255,0.2)',
                  color: '#4fc3ff',
                  fontStyle: 'italic',
                }}
                labelStyle={{ color: '#4fc3ff', fontWeight: 700 }}
                itemStyle={{ color: '#7cff9a' }}
                cursor={{ stroke: "#00f2fe", strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#00f2fe"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#7cff9a" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground flex items-center justify-between">
            <span>Activity Map</span>
            <span className="text-xs font-normal text-muted-foreground">Last 12 Months</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          {/* Scrollable heatmap with month labels */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div ref={heatmapContainerRef} className="flex gap-6 relative" style={{ width: 'max-content' }}>
              {heatmapMonths.map((month) => (
                <div key={month.id} className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-muted-foreground font-semibold px-1">{month.label}</span>
                  <div className="grid grid-cols-7 gap-[3px]">
                    {/* Day Headers S M T W T F S */}
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <span key={i} className="text-[8px] text-muted-foreground/40 text-center leading-none">{d}</span>
                    ))}
                    {/* Calendar Grid */}
                    {month.days.map((cell) => {
                      if (cell.isEmpty) {
                        return <div key={cell.id} className="w-[10px] h-[10px]" />
                      }
                      if (cell.isFuture) {
                        return <div key={cell.date} className="w-[10px] h-[10px] rounded-[2px] bg-muted/10 pointer-events-none" />
                      }
                      return (
                        <div
                          key={cell.date}
                          onClick={() => onSelectDate && onSelectDate(cell.date)}
                          onMouseEnter={(e) => handleCellMouseEnter(e, cell)}
                          onMouseLeave={handleCellMouseLeave}
                          className={cn(
                            "w-[10px] h-[10px] rounded-[2px] transition-all hover:ring-2 ring-foreground/40 z-10 cursor-pointer hover:scale-125",
                            getColorForCount(cell.count),
                            selectedDate === cell.date && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-125 drop-shadow-md"
                          )}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Animated tooltip */}
              {hoveredCell && (
                <div
                  className="absolute z-50 pointer-events-none"
                  style={{
                    left: hoveredCell.flipX ? hoveredCell.x - 150 : hoveredCell.x + 8,
                    top: hoveredCell.flipY ? hoveredCell.y + 14 : hoveredCell.y - 60,
                  }}
                >
                  <div className="animate-in fade-in zoom-in-95 duration-150 bg-card/95 backdrop-blur-md border border-primary/50 rounded-xl px-3 py-2 shadow-[0_0_16px_rgba(79,195,255,0.25)] min-w-[140px]">
                    <div className="text-primary font-bold text-xs italic">
                      {format(new Date(hoveredCell.date + 'T00:00:00'), "MMMM d, yyyy")}
                    </div>
                    <div className="text-muted-foreground text-[10px] mt-0.5">
                      {hoveredCell.count === 0 
                        ? 'No tasks completed' 
                        : `${hoveredCell.count} task${hoveredCell.count > 1 ? 's' : ''} completed`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky legend */}
          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border/30 text-[10px] text-muted-foreground sticky bottom-0 bg-card">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-muted" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/30" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/60" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-primary" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getColorForCount(count: number) {
  if (count === 0) return "bg-muted"
  if (count <= 2) return "bg-primary/30"
  if (count <= 4) return "bg-primary/60"
  return "bg-primary"
}
