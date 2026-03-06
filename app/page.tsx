"use client"

import { useState } from "react"
import {
  DollarSign,
  Package,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import {
  ChartCard,
  RevenueTrendChart,
  PerformanceBarChart,
  MultiLineChart,
  DistributionPieChart,
  RankingBarChart,
} from "@/components/dashboard/charts"
import { DataTable, currencyFormat, percentFormat, changeIndicator, statusBadge } from "@/components/dashboard/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for KPIs
const kpiData = [
  {
    title: "Total Revenue",
    value: "$24.8M",
    change: 12.5,
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4 text-primary" />,
    sparkline: [65, 72, 68, 85, 92, 88, 95],
  },
  {
    title: "Sell-In Units",
    value: "142.3K",
    change: 8.2,
    trend: "up" as const,
    icon: <Package className="h-4 w-4 text-primary" />,
    sparkline: [45, 52, 48, 55, 62, 58, 65],
  },
  {
    title: "Sell-Out Units",
    value: "128.5K",
    change: -2.4,
    trend: "down" as const,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    sparkline: [55, 52, 58, 45, 42, 48, 44],
  },
  {
    title: "Stock Level",
    value: "89.2K",
    change: 5.8,
    trend: "up" as const,
    icon: <BarChart3 className="h-4 w-4 text-primary" />,
    sparkline: [42, 45, 52, 58, 55, 62, 65],
  },
  {
    title: "Forecast Accuracy",
    value: "87.2%",
    change: 4.1,
    trend: "up" as const,
    icon: <Target className="h-4 w-4 text-primary" />,
    variant: "success" as const,
  },
  {
    title: "Weeks of Stock",
    value: "6.2",
    subtitle: "weeks",
    change: -0.8,
    trend: "down" as const,
    icon: <Clock className="h-4 w-4 text-primary" />,
    variant: "warning" as const,
  },
  {
    title: "Rolling Rate (4W)",
    value: "32.1K",
    change: 3.2,
    trend: "up" as const,
    icon: <RefreshCw className="h-4 w-4 text-primary" />,
  },
]

// Mock data for revenue trend
const revenueTrendData = [
  { period: "Q1 FY24", revenue: 18500000, target: 19000000 },
  { period: "Q2 FY24", revenue: 21200000, target: 20500000 },
  { period: "Q3 FY24", revenue: 19800000, target: 21000000 },
  { period: "Q4 FY24", revenue: 23500000, target: 22000000 },
  { period: "Q1 FY25", revenue: 22800000, target: 23000000 },
  { period: "Q2 FY25", revenue: 24800000, target: 24000000 },
]

// Mock data for regional performance
const regionalPerformance = [
  { name: "APAC", actual: 45200, forecast: 42000 },
  { name: "EMEA", actual: 38500, forecast: 40000 },
  { name: "Americas", actual: 52100, forecast: 48000 },
]

// Mock data for product mix
const productMixData = [
  { name: "Consumer", value: 42 },
  { name: "Commercial", value: 28 },
  { name: "Enterprise", value: 20 },
  { name: "Other", value: 10 },
]

// Mock data for top partners
const topPartners = [
  { name: "TechCorp Ltd", value: 12850000, change: 15.2 },
  { name: "GlobalTech Inc", value: 9420000, change: 8.7 },
  { name: "Innovate Solutions", value: 7280000, change: -3.2 },
  { name: "NextGen Systems", value: 5190000, change: 22.1 },
  { name: "Digital Partners", value: 4320000, change: 5.4 },
]

// Mock data for sell-out trend
const sellOutTrendData = [
  { period: "W1", sellIn: 8500, sellOut: 7200, stock: 12000 },
  { period: "W2", sellIn: 9200, sellOut: 8800, stock: 12400 },
  { period: "W3", sellIn: 7800, sellOut: 9100, stock: 11100 },
  { period: "W4", sellIn: 10500, sellOut: 8500, stock: 13100 },
  { period: "W5", sellIn: 9800, sellOut: 9200, stock: 13700 },
  { period: "W6", sellIn: 8200, sellOut: 10100, stock: 11800 },
  { period: "W7", sellIn: 11200, sellOut: 9500, stock: 13500 },
  { period: "W8", sellIn: 9500, sellOut: 9800, stock: 13200 },
]

// Mock data for alerts
const criticalAlerts = [
  {
    type: "Low Stock",
    message: "3 SKUs in APAC below safety threshold",
    severity: "critical" as const,
    time: "2 min ago",
  },
  {
    type: "Forecast Deviation",
    message: "Partner XYZ -15% vs forecast this week",
    severity: "warning" as const,
    time: "1 hour ago",
  },
  {
    type: "Campaign Alert",
    message: "Q2 Promo ROI tracking below target",
    severity: "warning" as const,
    time: "3 hours ago",
  },
]

// Mock data for performance table
const performanceTableData = [
  { partner: "TechCorp Ltd", region: "APAC", sellIn: 28500, sellOut: 24200, stock: 8500, wos: 5.2, variance: 12.5, status: "Healthy" },
  { partner: "GlobalTech Inc", region: "EMEA", sellIn: 22100, sellOut: 19800, stock: 6200, wos: 4.8, variance: 8.2, status: "Healthy" },
  { partner: "Innovate Solutions", region: "Americas", sellIn: 18500, sellOut: 16200, stock: 4800, wos: 3.2, variance: -5.4, status: "Warning" },
  { partner: "NextGen Systems", region: "APAC", sellIn: 15200, sellOut: 14800, stock: 2100, wos: 2.1, variance: 22.1, status: "Critical" },
  { partner: "Digital Partners", region: "EMEA", sellIn: 12800, sellOut: 11500, stock: 5200, wos: 6.8, variance: 5.4, status: "Healthy" },
]

const tableColumns = [
  { id: "partner", header: "Partner", accessor: "partner", sortable: true },
  { id: "region", header: "Region", accessor: "region", sortable: true },
  { id: "sellIn", header: "Sell-In", accessor: "sellIn", sortable: true, align: "right" as const, format: currencyFormat },
  { id: "sellOut", header: "Sell-Out", accessor: "sellOut", sortable: true, align: "right" as const, format: currencyFormat },
  { id: "stock", header: "Stock", accessor: "stock", sortable: true, align: "right" as const, format: currencyFormat },
  { id: "wos", header: "WoS", accessor: "wos", sortable: true, align: "right" as const },
  { id: "variance", header: "Variance", accessor: "variance", sortable: true, align: "right" as const, format: changeIndicator },
  { id: "status", header: "Status", accessor: "status", sortable: true, format: statusBadge },
]

export default function ExecutiveSummaryPage() {
  const [showInsights, setShowInsights] = useState(true)

  return (
    <DashboardLayout 
      title="Executive Summary" 
      subtitle="FY25 Q2 Performance Overview"
    >
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Filter Bar */}
          <FilterBar />

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
            {kpiData.map((kpi) => (
              <KpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                icon={kpi.icon}
                variant={kpi.variant}
                subtitle={kpi.subtitle}
                sparkline={kpi.sparkline}
              />
            ))}
          </div>

          {/* AI Summary Block */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">AI Executive Summary</CardTitle>
                <p className="text-xs text-muted-foreground">Generated just now</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Q2 FY25 is tracking 4% above plan</strong> with strong performance in Americas (+8.5% vs forecast) 
                offsetting softness in EMEA (-3.8%). Three key opportunities identified: (1) TechCorp Ltd showing 
                exceptional momentum with 28% above-forecast sell-out, (2) Consumer segment gaining share at 42% of mix, 
                up from 38% last quarter, and (3) forecast accuracy improved to 87.2%, the highest in 4 quarters.
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  3 stock risks
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  5 opportunities
                </Badge>
                <Button variant="link" className="h-auto p-0 text-xs text-primary">
                  View detailed analysis
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Revenue Trend" subtitle="Quarterly performance vs target" badge="YoY +12.5%">
              <RevenueTrendChart data={revenueTrendData} height={280} />
            </ChartCard>
            <ChartCard title="Regional Performance" subtitle="Actual vs Forecast by region">
              <PerformanceBarChart data={regionalPerformance} height={280} />
            </ChartCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard title="Sell-In / Sell-Out / Stock" subtitle="Weekly trend (8 weeks)">
              <MultiLineChart
                data={sellOutTrendData}
                lines={[
                  { dataKey: "sellIn", name: "Sell-In", color: "hsl(155, 60%, 50%)" },
                  { dataKey: "sellOut", name: "Sell-Out", color: "hsl(250, 60%, 55%)" },
                  { dataKey: "stock", name: "Stock", color: "hsl(85, 50%, 55%)" },
                ]}
                height={240}
              />
            </ChartCard>
            <ChartCard title="Product Mix" subtitle="Revenue by LOB">
              <DistributionPieChart data={productMixData} height={240} />
            </ChartCard>
            <ChartCard title="Top Partners" subtitle="By revenue contribution">
              <RankingBarChart
                data={topPartners}
                height={240}
                valueFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
            </ChartCard>
          </div>

          {/* Critical Alerts */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <CardTitle className="text-sm font-semibold">Critical Alerts</CardTitle>
                <Badge variant="destructive" className="h-5">3</Badge>
              </div>
              <Button variant="link" className="h-auto p-0 text-xs text-primary">
                View all alerts
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          alert.severity === "critical" ? "bg-destructive" : "bg-warning"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Table */}
          <div>
            <Tabs defaultValue="partners" className="space-y-4">
              <TabsList>
                <TabsTrigger value="partners">By Partner</TabsTrigger>
                <TabsTrigger value="products">By Product</TabsTrigger>
                <TabsTrigger value="regions">By Region</TabsTrigger>
              </TabsList>
              <TabsContent value="partners">
                <DataTable
                  title="Partner Performance Summary"
                  columns={tableColumns}
                  data={performanceTableData}
                />
              </TabsContent>
              <TabsContent value="products">
                <DataTable
                  title="Product Performance Summary"
                  columns={tableColumns}
                  data={performanceTableData}
                />
              </TabsContent>
              <TabsContent value="regions">
                <DataTable
                  title="Regional Performance Summary"
                  columns={tableColumns}
                  data={performanceTableData}
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
