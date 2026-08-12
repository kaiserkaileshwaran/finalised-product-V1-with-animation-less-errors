'use client'

import type { Category } from '@/lib/types'
import { computeProgressLogs, formatDateForDisplay } from '@/lib/store'

interface ProgressLogsProps {
  category: Category | null
}

export function ProgressLogs({ category }: ProgressLogsProps) {
  if (!category) {
    return (
      <div className="text-muted-foreground text-center pt-10">
        Select a category to view progress
      </div>
    )
  }

  const logs = computeProgressLogs(category)

  if (!logs || logs.length === 0) {
    return (
      <div className="text-muted-foreground text-center pt-10 font-bold text-lg">
        No data here
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full">
      {logs.map((entry, index) => (
        <div
          key={entry.date}
          className="pb-4 mb-4 border-b border-primary/20 last:border-b-0"
        >
          {/* Date Header */}
          <div className="flex justify-between items-center text-primary font-bold text-sm mb-2 pb-1.5 border-b border-primary/30">
            <span>{formatDateForDisplay(entry.date)}</span>
            <span className={`text-xs ${entry.isAllDone ? 'text-secondary' : 'text-muted-foreground'}`}>
              {entry.completed.length}/{entry.total}
            </span>
          </div>

          {/* Completed Tasks */}
          {entry.completed.length > 0 && (
            <div className="mb-2.5">
              <div className="text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
                ✓ Completed
              </div>
              {entry.completed.map((task, i) => (
                <div
                  key={i}
                  className="text-xs py-1 pl-4 relative text-foreground/90 break-words before:content-['✓'] before:absolute before:left-0 before:text-secondary before:font-bold"
                >
                  {task.text}
                </div>
              ))}
            </div>
          )}

          {/* Pending Tasks */}
          {entry.pending.length > 0 ? (
            <div className="mb-2.5">
              <div className="text-destructive text-xs font-semibold uppercase tracking-wider mb-1">
                ✗ Not Completed
              </div>
              {entry.pending.map((task, i) => (
                <div
                  key={i}
                  className="text-xs py-1 pl-4 relative text-foreground/80 break-words before:content-['—'] before:absolute before:left-2 before:opacity-60"
                >
                  {task.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary italic text-xs py-2 font-semibold">
              All tasks completed!
            </div>
          )}

          {/* Stats */}
          <div className="text-xs text-foreground/60 mt-1.5 pt-1.5 border-t border-primary/15">
            Completion: {entry.completionRate}% ({entry.completed.length} done)
          </div>
        </div>
      ))}
    </div>
  )
}
