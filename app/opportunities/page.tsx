"use client"

import { useState } from "react"
import {
  Sparkles,
  Send,
  MessageSquare,
  TrendingUp,
  Package,
  AlertTriangle,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Lightbulb,
  Target,
  ArrowUpRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DataTable, numberFormat, percentFormat, statusBadge } from "@/components/dashboard/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Sample conversation messages
const sampleConversation = [
  {
    role: "user",
    content: "Where are we underperforming this quarter?",
  },
  {
    role: "assistant",
    content: `Based on my analysis of Q2 FY25 data, I've identified **3 key areas of underperformance**:

**1. Eastern Europe** (-3.8% vs forecast)
- Primary driver: Romania and Bulgaria showing softer demand
- Products affected: iPad Pro M4 and iPad Air M2
- Partner concern: eMAG.ro at 88% of target

**2. Western Balkans Expansion** (-14% vs forecast)
- New market entry challenges in Bosnia & Herzegovina, Montenegro, Kosovo, and Albania
- Partner onboarding delays affecting sell-through
- Recommend: Increase channel support investment

**3. Accessories LOB** (-5.2% vs forecast)
- Slower-than-expected premium attach in secondary markets
- Competitive pressure on entry price points
- Action: Review bundle strategy for accessories and Apple Watch

Would you like me to drill down into any of these areas?`,
    citations: ["Q2 FY25 Sales Report", "Regional Performance Dashboard", "Partner Scorecard"],
  },
  {
    role: "user",
    content: "Which partner is likely to achieve 50K units in the next 4 weeks?",
  },
  {
    role: "assistant",
    content: `Based on current trajectory and historical patterns, here are the partners most likely to hit **50K units in the next 4 weeks**:

**High Confidence (>85% probability)**
| Partner | Current 4W Rate | Projected 4W | Confidence |
|---------|-----------------|--------------|------------|
| Alza.cz | 48.2K | 52.5K | 92% |
| eMAG.ro | 47.8K | 51.2K | 87% |

**Medium Confidence (70-85% probability)**
| Partner | Current 4W Rate | Projected 4W | Confidence |
|---------|-----------------|--------------|------------|
| Datart.sk | 42.5K | 48.8K | 78% |

**Key Factors for Alza.cz:**
- Strong Q2 campaign momentum (+32% lift)
- New product launch driving incremental demand
- Favorable inventory position (5.2 WoS)

**Recommendation:** Allocate additional 3K units to Alza.cz to capture upside opportunity.`,
    citations: ["Partner Forecast Model", "Historical Sell-Out Data", "Inventory Analysis"],
  },
]

// Suggested questions
const suggestedQuestions = [
  "Where are we underperforming this quarter?",
  "Which partner is likely to achieve X units?",
  "What products need refill soon?",
  "Show me campaign ROI by region",
  "What's causing the forecast variance?",
  "Which SKUs are at risk of stockout?",
]

// Recommendation cards
const recommendations = [
  {
    type: "opportunity",
    title: "Stock Allocation Opportunity",
    partner: "Alza.cz",
    product: "iPhone 16 Pro Max",
    description: "28% above-forecast sell-out velocity suggests allocation increase of 500 units.",
    impact: "+$125K revenue potential",
    confidence: 92,
    status: "High",
  },
  {
    type: "risk",
    title: "Low Stock Alert",
    partner: "Datart.sk",
    product: "AirPods Pro 2",
    description: "Current stock depletes in 1.8 weeks at current velocity. Urgent refill needed.",
    impact: "$85K revenue at risk",
    confidence: 95,
    status: "Critical",
  },
  {
    type: "opportunity",
    title: "Campaign Timing",
    partner: "eMAG.ro",
    product: "iPad Pro M4",
    description: "Historical data suggests 15% better ROI with campaign launch in W2 vs W4.",
    impact: "+$42K incremental ROI",
    confidence: 78,
    status: "Medium",
  },
  {
    type: "action",
    title: "Forecast Adjustment",
    partner: "Tehnomanija",
    product: "All Products",
    description: "Partner forecast consistently 12% optimistic. Recommend AI-adjusted baseline.",
    impact: "Improved accuracy 88%→94%",
    confidence: 85,
    status: "Medium",
  },
]

// Stock health classifications
const stockHealthData = [
  { product: "iPhone 16 Pro Max", partner: "Alza.cz", stock: 8520, wos: 5.2, velocity: 1640, status: "OK", refill: "No action needed" },
  { product: "AirPods Pro 2", partner: "Datart.sk", stock: 980, wos: 1.8, velocity: 545, status: "Critical", refill: "Urgent: +2000 units" },
  { product: "MacBook Pro M3", partner: "Big Bang", stock: 1650, wos: 4.5, velocity: 367, status: "OK", refill: "No action needed" },
  { product: "iPad Air M2", partner: "Technomarket", stock: 580, wos: 3.2, velocity: 181, status: "Low", refill: "Recommend: +500 units" },
  { product: "iPhone 16", partner: "Tehnomanija", stock: 3200, wos: 8.2, velocity: 390, status: "High", refill: "Consider rebalance" },
  { product: "MacBook Air M2", partner: "Neptun Albania", stock: 2850, wos: 6.8, velocity: 419, status: "OK", refill: "No action needed" },
]

const stockTableColumns = [
  { id: "product", header: "Product", accessor: "product", sortable: true },
  { id: "partner", header: "Partner", accessor: "partner", sortable: true },
  { id: "stock", header: "Stock", accessor: "stock", sortable: true, align: "right" as const, format: numberFormat },
  { id: "wos", header: "WoS", accessor: "wos", sortable: true, align: "right" as const },
  { id: "velocity", header: "4W Velocity", accessor: "velocity", sortable: true, align: "right" as const, format: numberFormat },
  { id: "status", header: "Status", accessor: "status", sortable: true, format: statusBadge },
  { id: "refill", header: "Recommendation", accessor: "refill", sortable: false },
]

export default function OpportunityAgentPage() {
  const [messages, setMessages] = useState(sampleConversation)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    setMessages([...messages, { role: "user", content: inputValue }])
    setInputValue("")
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm analyzing your question. This is a simulated response for demonstration purposes. In production, this would connect to the AI backend for real-time analysis.",
          citations: ["Analysis in progress"],
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <DashboardLayout 
      title="Opportunity Agent" 
      subtitle="AI-Powered Business Intelligence"
    >
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Chat Panel */}
        <div className="flex w-[480px] flex-col border-r border-border pr-6">
          <Card className="flex flex-1 flex-col border-border">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-border pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Ask strategic business questions</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                          message.role === "user"
                            ? "bg-primary/20 text-primary"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {message.role === "user" ? (
                          <span className="text-xs font-medium">JD</span>
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex-1 rounded-lg p-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        )}
                      >
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        {message.citations && (
                          <div className="mt-3 flex flex-wrap gap-1 border-t border-border pt-2">
                            {message.citations.map((citation, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">
                                {citation}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {message.role === "assistant" && (
                          <div className="mt-2 flex items-center gap-2 pt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <div className="rounded-lg bg-secondary p-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            {/* Suggested Questions */}
            <div className="border-t border-border px-4 py-3">
              <p className="mb-2 text-xs text-muted-foreground">Suggested questions:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommendations Panel */}
        <div className="flex-1 space-y-6 overflow-auto">
          {/* Recommendation Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">AI Recommendations</h3>
              <Badge variant="secondary">{recommendations.length} active</Badge>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {recommendations.map((rec, index) => (
                <Card
                  key={index}
                  className={cn(
                    "border-border transition-all hover:border-primary/50",
                    rec.type === "risk" && "border-l-2 border-l-destructive",
                    rec.type === "opportunity" && "border-l-2 border-l-success",
                    rec.type === "action" && "border-l-2 border-l-warning"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg",
                            rec.type === "risk" && "bg-destructive/10",
                            rec.type === "opportunity" && "bg-success/10",
                            rec.type === "action" && "bg-warning/10"
                          )}
                        >
                          {rec.type === "risk" ? (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          ) : rec.type === "opportunity" ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <Lightbulb className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{rec.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{rec.partner}</Badge>
                            <Badge variant="outline" className="text-[10px]">{rec.product}</Badge>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-[10px]",
                          rec.status === "Critical" && "bg-destructive/10 text-destructive",
                          rec.status === "High" && "bg-success/10 text-success",
                          rec.status === "Medium" && "bg-warning/10 text-warning"
                        )}
                      >
                        {rec.status}
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{rec.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">{rec.impact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {rec.confidence}% confidence
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 gap-1 text-[10px] text-primary">
                          Why this?
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stock Health Table */}
          <div>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Stock</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="low">Low</TabsTrigger>
                <TabsTrigger value="high">Overstock</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <DataTable
                  title="Stock Health Analysis"
                  columns={stockTableColumns}
                  data={stockHealthData}
                />
              </TabsContent>
              <TabsContent value="critical">
                <DataTable
                  title="Critical Stock Items"
                  columns={stockTableColumns}
                  data={stockHealthData.filter((row) => row.status === "Critical")}
                />
              </TabsContent>
              <TabsContent value="low">
                <DataTable
                  title="Low Stock Items"
                  columns={stockTableColumns}
                  data={stockHealthData.filter((row) => row.status === "Low")}
                />
              </TabsContent>
              <TabsContent value="high">
                <DataTable
                  title="Overstock Items"
                  columns={stockTableColumns}
                  data={stockHealthData.filter((row) => row.status === "High")}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
