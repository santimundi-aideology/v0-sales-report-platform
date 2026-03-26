"use client"

import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function getQuarterProgress(): { elapsed: number; quarterLabel: string; daysElapsed: number; totalDays: number } {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  let qStart: Date
  let qEnd: Date
  let qLabel: string

  if (month >= 0 && month <= 2) {
    qStart = new Date(year, 0, 1)
    qEnd = new Date(year, 3, 1)
    qLabel = `Q1 ${year}`
  } else if (month >= 3 && month <= 5) {
    qStart = new Date(year, 3, 1)
    qEnd = new Date(year, 6, 1)
    qLabel = `Q2 ${year}`
  } else if (month >= 6 && month <= 8) {
    qStart = new Date(year, 6, 1)
    qEnd = new Date(year, 9, 1)
    qLabel = `Q3 ${year}`
  } else {
    qStart = new Date(year, 9, 1)
    qEnd = new Date(year + 1, 0, 1)
    qLabel = `Q4 ${year}`
  }

  const totalMs = qEnd.getTime() - qStart.getTime()
  const elapsedMs = now.getTime() - qStart.getTime()
  const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.round(elapsedMs / (1000 * 60 * 60 * 24))
  const elapsed = Math.min(100, Math.round((elapsedMs / totalMs) * 100))

  return { elapsed, quarterLabel: qLabel, daysElapsed, totalDays }
}

export function QuarterProgress() {
  const { elapsed, quarterLabel, daysElapsed, totalDays } = getQuarterProgress()

  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
        <Clock className="h-3 w-3 text-muted-foreground" />
        {quarterLabel}
      </Badge>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${elapsed}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {elapsed}%
        </span>
        <span className="text-[10px] text-muted-foreground">
          of time ({daysElapsed}/{totalDays} days)
        </span>
      </div>
    </div>
  )
}
