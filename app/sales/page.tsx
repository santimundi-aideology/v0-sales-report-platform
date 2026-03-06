"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  BarChart3,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
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
import { cn } from "@/lib/utils"

// Sales KPIs
const salesKpis = [
  {
    title: "Sell-In (QTD)",
    value: "142,850",
    change: 12.5,
    trend: "up" as const,
    icon: <Package className="h-4 w-4 text-primary" />,
    subtitle: "units",
  },
  {
    title: "Sell-Out (QTD)",
    value: "128,420",
    change: 8.2,
    trend: "up" as const,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    subtitle: "units",
  },
  {
    title: "Revenue (QTD)",
    value: "$24.8M",
    change: 15.3,
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4 text-primary" />,
  },
  {
    title: "Current Stock",
    value: "89,240",
    change: -2.4,
    trend: "down" as const,
    icon: <BarChart3 className="h-4 w-4 text-primary" />,
    subtitle: "units",
    variant: "warning" as const,
  },
  {
    title: "Weeks of Stock",
    value: "6.2",
    change: -0.8,
    trend: "down" as const,
    icon: <Clock className="h-4 w-4 text-primary" />,
    subtitle: "weeks",
  },
  {
    title: "Attach Rate",
    value: "32.5%",
    change: 2.1,
    trend: "up" as const,
    icon: <ArrowUpRight className="h-4 w-4 text-primary" />,
  },
]

// Weekly trend data
const weeklyTrendData = [
  { period: "W45", sellIn: 18500, sellOut: 16200, stock: 82500 },
  { period: "W46", sellIn: 22100, sellOut: 19800, stock: 84800 },
  { period: "W47", sellIn: 19800, sellOut: 21200, stock: 83400 },
  { period: "W48", sellIn: 24500, sellOut: 22100, stock: 85800 },
  { period: "W49", sellIn: 21200, sellOut: 23500, stock: 83500 },
  { period: "W50", sellIn: 26800, sellOut: 24200, stock: 86100 },
  { period: "W51", sellIn: 23500, sellOut: 25800, stock: 83800 },
  { period: "W52", sellIn: 28200, sellOut: 26400, stock: 85600 },
]

// Regional breakdown
const regionalBreakdown = [
  { name: "Americas", actual: 52100, forecast: 48000 },
  { name: "APAC", actual: 45200, forecast: 42000 },
  { name: "EMEA", actual: 38500, forecast: 40000 },
  { name: "LATAM", actual: 12050, forecast: 14000 },
]

// LOB breakdown
const lobBreakdown = [
  { name: "Consumer", value: 42 },
  { name: "Commercial", value: 28 },
  { name: "Enterprise", value: 20 },
  { name: "Government", value: 10 },
]

// Top products
const topProducts = [
  { name: "Product A Pro", value: 28500, change: 18.2 },
  { name: "Product B Max", value: 22100, change: 12.5 },
  { name: "Product C Elite", value: 18200, change: -5.4 },
  { name: "Product D Basic", value: 15800, change: 8.7 },
  { name: "Product E Lite", value: 12400, change: 22.1 },
]

// Stock health thresholds
const stockHealthData = [
  { status: "Critical", count: 12, percentage: 8, color: "bg-destructive" },
  { status: "Low", count: 28, percentage: 19, color: "bg-warning" },
  { status: "Healthy", count: 85, percentage: 58, color: "bg-success" },
  { status: "High", count: 22, percentage: 15, color: "bg-info" },
]

// Detailed sales table data
const salesTableData = [
  { product: "Product A Pro", partner: "TechCorp Ltd", region: "APAC", country: "Japan", sellIn: 8520, sellOut: 7850, stock: 2450, wos: 4.8, rr: 1962, share: 12.5, status: "Healthy" },
  { product: "Product A Pro", partner: "GlobalTech Inc", region: "EMEA", country: "Germany", sellIn: 6280, sellOut: 5920, stock: 1820, wos: 5.2, rr: 1480, share: 9.4, status: "Healthy" },
  { product: "Product B Max", partner: "Innovate Solutions", region: "Americas", country: "USA", sellIn: 9850, sellOut: 9120, stock: 980, wos: 1.8, rr: 2280, share: 14.5, status: "Critical" },
  { product: "Product B Max", partner: "NextGen Systems", region: "APAC", country: "Singapore", sellIn: 4520, sellOut: 4280, stock: 3200, wos: 8.2, rr: 1070, share: 6.8, status: "High" },
  { product: "Product C Elite", partner: "Digital Partners", region: "EMEA", country: "UK", sellIn: 5680, sellOut: 5420, stock: 1650, wos: 4.5, rr: 1355, share: 8.6, status: "Healthy" },
  { product: "Product C Elite", partner: "TechCorp Ltd", region: "Americas", country: "Canada", sellIn: 3920, sellOut: 4150, stock: 1280, wos: 4.2, rr: 1037, share: 6.6, status: "Healthy" },
  { product: "Product D Basic", partner: "GlobalTech Inc", region: "LATAM", country: "Brazil", sellIn: 2850, sellOut: 2680, stock: 580, wos: 3.2, rr: 670, share: 4.3, status: "Low" },
  { product: "Product E Lite", partner: "Innovate Solutions", region: "APAC", country: "Australia", sellIn: 4280, sellOut: 3950, stock: 1420, wos: 5.8, rr: 987, share: 6.3, status: "Healthy" },
]

const salesTableColumns = [
  { id: "product", header: "Product", accessor: "product", sortable: true },
  { id: "partner", header: "Partner", accessor: "partner", sortable: true },
  { id: "region", header: "Region", accessor: "region", sortable: true },
  { id: "country", header: "Country", accessor: "country", sortable: true },
  { id: "sellIn", header: "Sell-In", accessor: "sellIn", sortable: true, align: "right" as const, format: numberFormat },
  { id: "sellOut", header: "Sell-Out", accessor: "sellOut", sortable: true, align: "right" as const, format: numberFormat },
  { id: "stock", header: "Stock", accessor: "stock", sortable: true, align: "right" as const, format: numberFormat },
  { id: "wos", header: "WoS", accessor: "wos", sortable: true, align: "right" as const },
  { id: "rr", header: "RR (4W)", accessor: "rr", sortable: true, align: "right" as const, format: numberFormat },
  { id: "share", header: "Share %", accessor: "share", sortable: true, align: "right" as const, format: percentFormat },
  { id: "status", header: "Status", accessor: "status", sortable: true, format: statusBadge },
]

// Comparison periods
const comparisonData = [
  { metric: "Sell-In", current: 142850, previous: 126920, change: 12.5 },
  { metric: "Sell-Out", current: 128420, previous: 118680, change: 8.2 },
  { metric: "Revenue", current: 24800000, previous: 21520000, change: 15.3 },
  { metric: "Stock", current: 89240, previous: 91450, change: -2.4 },
  { metric: "WoS", current: 6.2, previous: 7.0, change: -11.4 },
]

export default function SalesDashboardPage() {
  const [showInsights, setShowInsights] = useState(true)
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

  return (
    <DashboardLayout 
      title="Sales Dashboard" 
      subtitle="Sell-In / Sell-Out / Stock Analysis"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          {/* Filter Bar */}
          <FilterBar />

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {salesKpis.map((kpi) => (
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

          {/* Period Comparison */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Period Comparison</CardTitle>
                <Badge variant="outline">vs Previous Quarter</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {comparisonData.map((item) => (
                  <div key={item.metric} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{item.metric}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-foreground">
                        {item.metric === "Revenue" 
                          ? `$${(item.current / 1000000).toFixed(1)}M`
                          : item.metric === "WoS"
                          ? item.current.toFixed(1)
                          : item.current.toLocaleString()
                        }
                      </span>
                      <span className={cn(
                        "flex items-center text-xs font-medium",
                        item.change >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {item.change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(item.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      was {item.metric === "Revenue" 
                        ? `$${(item.previous / 1000000).toFixed(1)}M`
                        : item.metric === "WoS"
                        ? item.previous.toFixed(1)
                        : item.previous.toLocaleString()
                      }
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Weekly Sell-In / Sell-Out / Stock Trend" subtitle="Last 8 weeks">
              <MultiLineChart
                data={weeklyTrendData}
                lines={[
                  { dataKey: "sellIn", name: "Sell-In", color: "hsl(155, 60%, 50%)" },
                  { dataKey: "sellOut", name: "Sell-Out", color: "hsl(250, 60%, 55%)" },
                  { dataKey: "stock", name: "Stock", color: "hsl(85, 50%, 55%)" },
                ]}
                height={300}
              />
            </ChartCard>
            <ChartCard title="Regional Performance" subtitle="Actual vs Forecast">
              <PerformanceBarChart data={regionalBreakdown} height={300} />
            </ChartCard>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard title="Revenue by LOB" subtitle="Product mix distribution">
              <DistributionPieChart data={lobBreakdown} height={220} />
            </ChartCard>
            <ChartCard title="Top Products" subtitle="By sell-out volume">
              <RankingBarChart
                data={topProducts}
                height={220}
                valueFormatter={(v) => v.toLocaleString()}
              />
            </ChartCard>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Stock Health Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">SKU count by stock status</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {stockHealthData.map((item) => (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", item.color)} />
                        <span className="text-muted-foreground">{item.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{item.count} SKUs</span>
                        <span className="text-muted-foreground">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn("h-full transition-all", item.color)}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    View Low Stock Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Data Table */}
          <div>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Data</TabsTrigger>
                  <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                  <TabsTrigger value="high-stock">High Stock</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "chart" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("chart")}
                  >
                    Chart
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <DataTable
                  title="Detailed Sales Analysis"
                  columns={salesTableColumns}
                  data={salesTableData}
                  pageSize={8}
                />
              </TabsContent>
              <TabsContent value="low-stock">
                <DataTable
                  title="Low Stock Items"
                  columns={salesTableColumns}
                  data={salesTableData.filter(row => row.status === "Critical" || row.status === "Low")}
                  pageSize={8}
                />
              </TabsContent>
              <TabsContent value="high-stock">
                <DataTable
                  title="High Stock Items"
                  columns={salesTableColumns}
                  data={salesTableData.filter(row => row.status === "High")}
                  pageSize={8}
                />
              </TabsContent>
              <TabsContent value="trending">
                <DataTable
                  title="Trending Products"
                  columns={salesTableColumns}
                  data={salesTableData.slice(0, 4)}
                  pageSize={8}
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
