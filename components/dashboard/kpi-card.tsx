"use client"

import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "critical"
  subtitle?: string
  sparkline?: number[]
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  trend,
  icon,
  variant = "default",
  subtitle,
  sparkline,
}: KpiCardProps) {
  const trendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus
  const TrendIcon = trendIcon

  const trendColor = 
    trend === "up" ? "text-success" : 
    trend === "down" ? "text-destructive" : 
    "text-muted-foreground"

  const borderColor = {
    default: "border-border",
    success: "border-success/30",
    warning: "border-warning/30",
    critical: "border-destructive/30",
  }[variant]

  const accentColor = {
    default: "bg-primary/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
    critical: "bg-destructive/10",
  }[variant]

  return (
    <Card className={cn("relative overflow-hidden transition-all hover:border-primary/50", borderColor)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", accentColor)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <TrendIcon className={cn("h-3 w-3", trendColor)} />
            <span className={cn("text-xs font-medium", trendColor)}>
              {change > 0 ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
        {sparkline && sparkline.length > 0 && (
          <div className="mt-3 flex h-8 items-end gap-0.5">
            {sparkline.map((val, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-primary/30 transition-all hover:bg-primary"
                style={{ height: `${(val / Math.max(...sparkline)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
