'use client'

import { useEffect, useRef, useState } from 'react'
import type { Category, TimeRange } from '@/lib/types'
import { calcPoints } from '@/lib/store'

interface ProgressChartProps {
  category: Category | null
  timeRange: TimeRange
}

export function ProgressChart({ category, timeRange }: ProgressChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; value: number } | null>(null)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [category, timeRange])

  if (!category) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a category to view progress
      </div>
    )
  }

  const points = calcPoints(category, timeRange)

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available yet
      </div>
    )
  }

  const padding = 60
  const width = 600
  const height = 400
  const chartW = width - padding * 2
  const chartH = height - padding * 2
  const maxY = Math.max(...points.map(p => p.pts), 10)
  const maxX = points.length - 1 || 1

  const dotAnimationDuration = 0.4
  const dotAnimationStagger = 0.1
  const lineAnimationDelay = (points.length * dotAnimationStagger) + dotAnimationDuration

  // Generate grid lines
  const yGridLines = Array.from({ length: 6 }, (_, i) => ({
    y: padding + chartH - (i / 5) * chartH,
    value: Math.round((i / 5) * maxY)
  }))

  const step = Math.max(1, Math.floor(points.length / 6))
  const xLabels = points.filter((_, i) => i % step === 0).map((p, i) => ({
    x: padding + ((i * step) / maxX) * chartW,
    date: new Date(p.d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  // Generate path
  let pathData = ''
  points.forEach((p, i) => {
    const x = padding + (i / maxX) * chartW
    const y = padding + chartH - (p.pts / maxY) * chartH

    if (i === 0) {
      pathData = `M ${x} ${y}`
    } else {
      const prevX = padding + ((i - 1) / maxX) * chartW
      const prevY = padding + chartH - (points[i - 1].pts / maxY) * chartH
      const controlX = prevX + (x - prevX) / 2
      pathData += ` C ${controlX} ${prevY}, ${controlX} ${y}, ${x} ${y}`
    }
  })

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full max-h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y Grid Lines */}
        {yGridLines.map((line, i) => (
          <g key={`y-${i}`}>
            <line
              x1={padding}
              y1={line.y}
              x2={padding + chartW}
              y2={line.y}
              className="stroke-primary/15"
              strokeWidth="0.8"
              strokeDasharray="4,4"
            />
            <text
              x={padding - 8}
              y={line.y + 4}
              textAnchor="end"
              className="fill-primary text-[13px] font-bold"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {line.value}
            </text>
          </g>
        ))}

        {/* X Labels */}
        {xLabels.map((label, i) => (
          <g key={`x-${i}`}>
            <line
              x1={label.x}
              y1={padding}
              x2={label.x}
              y2={padding + chartH}
              className="stroke-primary/15"
              strokeWidth="0.8"
              strokeDasharray="4,4"
            />
            <text
              x={label.x}
              y={padding + chartH + 18}
              textAnchor="middle"
              className="fill-primary text-[13px] font-bold"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {label.date}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line
          x1={padding}
          y1={padding + chartH}
          x2={padding + chartW}
          y2={padding + chartH}
          className="stroke-primary/60"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + chartH}
          className="stroke-primary/60"
          strokeWidth="2"
        />

        {/* Axis Titles */}
        <text
          x={20}
          y={padding + chartH / 2}
          textAnchor="middle"
          transform={`rotate(-90 20 ${padding + chartH / 2})`}
          className="fill-primary text-[11px] font-bold"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Tasks Completed
        </text>
        <text
          x={padding + chartW / 2}
          y={padding + chartH + 50}
          textAnchor="middle"
          className="fill-primary text-[11px] font-bold"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Date
        </text>

        {/* Line Path */}
        <path
          key={`path-${animationKey}`}
          d={pathData}
          fill="none"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(79, 195, 255, 0.6))',
            strokeDasharray: '2000',
            strokeDashoffset: '2000',
            animation: `drawLine 2s ease-out ${lineAnimationDelay}s forwards`
          }}
        />

        {/* Data Points */}
        {points.map((p, i) => {
          const x = padding + (i / maxX) * chartW
          const y = padding + chartH - (p.pts / maxY) * chartH
          return (
            <circle
              key={`dot-${i}-${animationKey}`}
              cx={x}
              cy={y}
              r={4}
              className="fill-secondary stroke-primary"
              strokeWidth="2"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(124, 255, 154, 0.8))',
                opacity: 0,
                animation: `fadeIn ${dotAnimationDuration}s ease-out ${i * dotAnimationStagger}s forwards`
              }}
              onMouseEnter={(e) => {
                const rect = svgRef.current?.getBoundingClientRect()
                if (rect) {
                  setTooltip({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    date: p.d,
                    value: p.pts
                  })
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute bg-card border-2 border-primary rounded-lg px-3 py-2 text-sm pointer-events-none shadow-lg z-10"
          style={{
            left: tooltip.x,
            top: tooltip.y - 50,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-bold text-primary">
            {new Date(tooltip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div>Total: {tooltip.value}</div>
        </div>
      )}

      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
