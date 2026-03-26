"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricRow {
  label: string
  value: string | number
  yoy?: number
}

interface ItemGroupKpiCardProps {
  title: string
  icon: React.ReactNode
  metrics: {
    sellIn: MetricRow
    sellOut: MetricRow
    stock: MetricRow
    wos: MetricRow
    attach: MetricRow
  }
}

function YoyBadge({ yoy }: { yoy?: number }) {
  if (yoy === undefined) return null
  const isPositive = yoy >= 0
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[10px] font-semibold",
      isPositive ? "text-success" : "text-destructive"
    )}>
      {isPositive ? (
        <ArrowUpRight className="h-2.5 w-2.5" />
      ) : (
        <ArrowDownRight className="h-2.5 w-2.5" />
      )}
      {isPositive ? "+" : ""}{yoy.toFixed(1)}%
    </span>
  )
}

export function ItemGroupKpiCard({ title, icon, metrics }: ItemGroupKpiCardProps) {
  const rows = [
    { key: "SI", ...metrics.sellIn },
    { key: "SO", ...metrics.sellOut },
    { key: "Stock", ...metrics.stock },
    { key: "WOS", ...metrics.wos },
    { key: "Attach", ...metrics.attach },
  ]

  return (
    <Card className="relative overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-1 pt-3 px-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
          {icon}
        </div>
        <CardTitle className="text-xs font-semibold tracking-tight text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        <div className="space-y-1">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {row.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground tabular-nums">
                  {row.value}
                </span>
                <YoyBadge yoy={row.yoy} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
