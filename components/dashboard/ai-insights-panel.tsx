"use client"

import { useState } from "react"
import { Sparkles, ChevronRight, AlertTriangle, TrendingUp, Package, Lightbulb, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Insight {
  id: string
  type: "risk" | "opportunity" | "action" | "info"
  title: string
  description: string
  metric?: string
  impact?: "high" | "medium" | "low"
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "risk",
    title: "Stock Depletion Risk",
    description: "3 SKUs in APAC region projected to hit zero stock within 2 weeks based on current sell-out velocity.",
    metric: "-15% WoS",
    impact: "high",
  },
  {
    id: "2",
    type: "opportunity",
    title: "Expansion Opportunity",
    description: "Partner TechCorp showing 28% above-forecast performance. Consider increasing allocation by 500 units.",
    metric: "+28% vs FC",
    impact: "high",
  },
  {
    id: "3",
    type: "action",
    title: "Campaign Timing",
    description: "Historical data suggests launching Q2 promo 2 weeks earlier could improve ROI by 12%.",
    metric: "+12% ROI",
    impact: "medium",
  },
  {
    id: "4",
    type: "info",
    title: "Forecast Accuracy",
    description: "Overall forecast accuracy improved to 87% this quarter, up from 82% last quarter.",
    metric: "87% accuracy",
    impact: "low",
  },
]

interface AiInsightsPanelProps {
  isOpen?: boolean
  onClose?: () => void
  insights?: Insight[]
}

export function AiInsightsPanel({ isOpen = true, onClose, insights = mockInsights }: AiInsightsPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "action":
        return <Lightbulb className="h-4 w-4 text-warning" />
      case "info":
        return <Package className="h-4 w-4 text-info" />
    }
  }

  const getTypeBadge = (type: Insight["type"]) => {
    const styles = {
      risk: "bg-destructive/10 text-destructive",
      opportunity: "bg-success/10 text-success",
      action: "bg-warning/10 text-warning",
      info: "bg-info/10 text-info",
    }
    return styles[type]
  }

  const visibleInsights = insights.filter(i => !dismissedIds.has(i.id))

  if (!isOpen) return null

  return (
    <Card className="w-80 shrink-0 border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">AI Insights</CardTitle>
          <Badge variant="secondary" className="h-5 text-xs">
            {visibleInsights.length}
          </Badge>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2 p-3">
            {visibleInsights.map((insight) => (
              <Card
                key={insight.id}
                className={cn(
                  "cursor-pointer border-border bg-secondary/30 transition-all hover:bg-secondary/50",
                  insight.impact === "high" && "border-l-2 border-l-primary"
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {getIcon(insight.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">
                            {insight.title}
                          </span>
                          <Badge className={cn("h-4 px-1 text-[10px]", getTypeBadge(insight.type))}>
                            {insight.type}
                          </Badge>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {insight.description}
                        </p>
                        {insight.metric && (
                          <div className="pt-1">
                            <Badge variant="outline" className="text-[10px] font-mono">
                              {insight.metric}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDismissedIds(new Set([...dismissedIds, insight.id]))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {visibleInsights.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No new insights</p>
                <p className="text-xs text-muted-foreground">
                  AI is continuously analyzing your data
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t border-border p-3">
          <Button variant="outline" className="w-full gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Ask AI Assistant
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
