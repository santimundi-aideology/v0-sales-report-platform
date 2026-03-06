"use client"

import { useState } from "react"
import {
  Megaphone,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  ChevronRight,
  BarChart3,
  PieChart,
  Sparkles,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import {
  ChartCard,
  MultiLineChart,
  PerformanceBarChart,
  DistributionPieChart,
  RankingBarChart,
} from "@/components/dashboard/charts"
import { DataTable, currencyFormat, numberFormat, percentFormat, changeIndicator, statusBadge } from "@/components/dashboard/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Campaign KPIs
const campaignKpis = [
  {
    title: "Total Investment",
    value: "$4.2M",
    change: 8.5,
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4 text-primary" />,
    subtitle: "FY25",
  },
  {
    title: "Active Campaigns",
    value: "12",
    change: 20,
    trend: "up" as const,
    icon: <Megaphone className="h-4 w-4 text-primary" />,
  },
  {
    title: "Campaign ROI",
    value: "3.2x",
    change: 12.5,
    trend: "up" as const,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    variant: "success" as const,
  },
  {
    title: "Avg. Lift",
    value: "+28%",
    change: 5.2,
    trend: "up" as const,
    icon: <Target className="h-4 w-4 text-primary" />,
  },
]

// Campaign spend by type
const spendByType = [
  { name: "ATL", value: 35 },
  { name: "BDF", value: 42 },
  { name: "AD Fund", value: 23 },
]

// Campaign performance trend
const campaignTrendData = [
  { period: "Jan", investment: 320000, sellOut: 42000, roi: 2.8 },
  { period: "Feb", investment: 280000, sellOut: 38500, roi: 2.9 },
  { period: "Mar", investment: 420000, sellOut: 58200, roi: 3.1 },
  { period: "Apr", investment: 380000, sellOut: 52800, roi: 3.0 },
  { period: "May", investment: 520000, sellOut: 72500, roi: 3.2 },
  { period: "Jun", investment: 450000, sellOut: 65200, roi: 3.4 },
]

// Partner campaign performance
const partnerPerformance = [
  { name: "TechCorp Ltd", actual: 185000, forecast: 160000 },
  { name: "GlobalTech Inc", actual: 142000, forecast: 150000 },
  { name: "Innovate Solutions", actual: 128000, forecast: 120000 },
  { name: "NextGen Systems", actual: 95000, forecast: 110000 },
]

// Top campaigns by ROI
const topCampaigns = [
  { name: "Summer Sale Q2", value: 4.2, change: 15.2 },
  { name: "Back to School", value: 3.8, change: 8.5 },
  { name: "Holiday Preview", value: 3.5, change: 22.1 },
  { name: "Spring Promo", value: 3.2, change: -2.4 },
  { name: "Flash Sale Feb", value: 2.9, change: 5.8 },
]

// Active campaigns
const activeCampaigns = [
  {
    name: "Q2 Summer Sale",
    type: "BDF",
    status: "active",
    budget: 520000,
    spent: 385000,
    sellOut: 72500,
    roi: 3.2,
    startDate: "May 1, 2025",
    endDate: "Jun 30, 2025",
    progress: 74,
  },
  {
    name: "Partner Boost Program",
    type: "ATL",
    status: "active",
    budget: 380000,
    spent: 295000,
    sellOut: 58200,
    roi: 2.9,
    startDate: "Apr 15, 2025",
    endDate: "Jul 15, 2025",
    progress: 78,
  },
  {
    name: "Digital Push Q2",
    type: "AD Fund",
    status: "active",
    budget: 250000,
    spent: 142000,
    sellOut: 35800,
    roi: 3.5,
    startDate: "Jun 1, 2025",
    endDate: "Aug 31, 2025",
    progress: 57,
  },
]

// Detailed campaign table
const campaignTableData = [
  { campaign: "Q2 Summer Sale", partner: "TechCorp Ltd", country: "USA", type: "BDF", investment: 185000, sellOut: 28500, lift: 32, roi: 3.8, status: "Active" },
  { campaign: "Q2 Summer Sale", partner: "GlobalTech Inc", country: "Germany", type: "BDF", investment: 142000, sellOut: 21200, lift: 25, roi: 3.2, status: "Active" },
  { campaign: "Partner Boost", partner: "Innovate Solutions", country: "Japan", type: "ATL", investment: 128000, sellOut: 18500, lift: 28, roi: 2.9, status: "Active" },
  { campaign: "Partner Boost", partner: "NextGen Systems", country: "UK", type: "ATL", investment: 95000, sellOut: 14200, lift: 22, roi: 2.8, status: "Active" },
  { campaign: "Digital Push", partner: "Digital Partners", country: "Singapore", type: "AD Fund", investment: 85000, sellOut: 15800, lift: 35, roi: 4.2, status: "Active" },
  { campaign: "Flash Sale Feb", partner: "TechCorp Ltd", country: "Australia", type: "BDF", investment: 62000, sellOut: 9850, lift: 18, roi: 2.4, status: "Completed" },
]

const campaignTableColumns = [
  { id: "campaign", header: "Campaign", accessor: "campaign", sortable: true },
  { id: "partner", header: "Partner", accessor: "partner", sortable: true },
  { id: "country", header: "Country", accessor: "country", sortable: true },
  { id: "type", header: "Type", accessor: "type", sortable: true, format: (value: unknown) => {
    const type = String(value)
    const styles: Record<string, string> = {
      "ATL": "bg-chart-1/10 text-chart-1",
      "BDF": "bg-chart-2/10 text-chart-2",
      "AD Fund": "bg-chart-3/10 text-chart-3",
    }
    return (
      <Badge className={cn("text-[10px] font-medium", styles[type] || "bg-muted text-muted-foreground")}>
        {type}
      </Badge>
    )
  }},
  { id: "investment", header: "Investment", accessor: "investment", sortable: true, align: "right" as const, format: currencyFormat },
  { id: "sellOut", header: "Sell-Out", accessor: "sellOut", sortable: true, align: "right" as const, format: numberFormat },
  { id: "lift", header: "Lift %", accessor: "lift", sortable: true, align: "right" as const, format: percentFormat },
  { id: "roi", header: "ROI", accessor: "roi", sortable: true, align: "right" as const, format: (value: unknown) => `${Number(value).toFixed(1)}x` },
  { id: "status", header: "Status", accessor: "status", sortable: true, format: statusBadge },
]

// AI Recommendations
const aiRecommendations = [
  {
    title: "Optimal Campaign Timing",
    description: "Historical analysis suggests launching Q3 campaigns 2 weeks earlier for +15% ROI improvement.",
    impact: "high",
  },
  {
    title: "Product Focus Shift",
    description: "Product B Max shows 40% higher campaign lift than average. Consider increasing allocation.",
    impact: "high",
  },
  {
    title: "Partner Optimization",
    description: "TechCorp Ltd campaigns consistently outperform by 25%. Recommend increased budget share.",
    impact: "medium",
  },
]

export default function CampaignDashboardPage() {
  const [showInsights, setShowInsights] = useState(true)

  return (
    <DashboardLayout 
      title="Campaign Dashboard" 
      subtitle="Campaign Investment & Performance Analytics"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          {/* Filter Bar */}
          <FilterBar />

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {campaignKpis.map((kpi) => (
              <KpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                icon={kpi.icon}
                subtitle={kpi.subtitle}
                variant={kpi.variant}
              />
            ))}
          </div>

          {/* Active Campaigns Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Active Campaigns</h3>
              <Button variant="link" className="h-auto p-0 text-xs text-primary">
                View all campaigns
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {activeCampaigns.map((campaign) => (
                <Card key={campaign.name} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{campaign.type}</Badge>
                          <Badge className="bg-success/10 text-success text-[10px]">
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{campaign.roi}x</p>
                        <p className="text-[10px] text-muted-foreground">ROI</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Budget Progress</span>
                        <span className="font-medium text-foreground">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          ${(campaign.spent / 1000).toFixed(0)}K / ${(campaign.budget / 1000).toFixed(0)}K
                        </span>
                        <span className="text-muted-foreground">
                          {campaign.sellOut.toLocaleString()} units sold
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {campaign.startDate} - {campaign.endDate}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Campaign Performance Trend" subtitle="Investment vs Sell-Out by month">
              <MultiLineChart
                data={campaignTrendData}
                lines={[
                  { dataKey: "investment", name: "Investment ($)", color: "hsl(155, 60%, 50%)" },
                  { dataKey: "sellOut", name: "Sell-Out (units)", color: "hsl(250, 60%, 55%)" },
                ]}
                height={280}
              />
            </ChartCard>
            <ChartCard title="Partner Campaign Performance" subtitle="Actual vs Target">
              <PerformanceBarChart data={partnerPerformance} height={280} />
            </ChartCard>
          </div>

          {/* Secondary Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard title="Spend by Type" subtitle="Investment distribution">
              <DistributionPieChart data={spendByType} height={220} />
            </ChartCard>
            <ChartCard title="Top Campaigns by ROI" subtitle="Best performing campaigns">
              <RankingBarChart
                data={topCampaigns}
                height={220}
                valueFormatter={(v) => `${v.toFixed(1)}x`}
              />
            </ChartCard>
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg border border-border bg-secondary/30 p-3",
                      rec.impact === "high" && "border-l-2 border-l-primary"
                    )}
                  >
                    <p className="text-xs font-medium text-foreground">{rec.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Campaign Details Table */}
          <div>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Campaigns</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <DataTable
                  title="Campaign Performance Details"
                  columns={campaignTableColumns}
                  data={campaignTableData}
                />
              </TabsContent>
              <TabsContent value="active">
                <DataTable
                  title="Active Campaigns"
                  columns={campaignTableColumns}
                  data={campaignTableData.filter(row => row.status === "Active")}
                />
              </TabsContent>
              <TabsContent value="completed">
                <DataTable
                  title="Completed Campaigns"
                  columns={campaignTableColumns}
                  data={campaignTableData.filter(row => row.status === "Completed")}
                />
              </TabsContent>
              <TabsContent value="planned">
                <DataTable
                  title="Planned Campaigns"
                  columns={campaignTableColumns}
                  data={[]}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showInsights && (
          <AiInsightsPanel onClose={() => setShowInsights(false)} />
        )}
      </div>
    </DashboardLayout>
  )
}
