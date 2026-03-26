"use client"

import { useState } from "react"
import {
  Target,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Settings,
  RefreshCw,
  ChevronRight,
  Edit2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import {
  ChartCard,
  MultiLineChart,
  PerformanceBarChart,
} from "@/components/dashboard/charts"
import { DataTable, numberFormat, percentFormat, changeIndicator, statusBadge } from "@/components/dashboard/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

// Forecast KPIs
const forecastKpis = [
  {
    title: "Forecast Accuracy",
    value: "87.2%",
    change: 5.2,
    trend: "up" as const,
    icon: <Target className="h-4 w-4 text-primary" />,
    variant: "success" as const,
  },
  {
    title: "AI Forecast (Next 4W)",
    value: "145.2K",
    change: 8.5,
    trend: "up" as const,
    icon: <Sparkles className="h-4 w-4 text-primary" />,
    subtitle: "units",
  },
  {
    title: "Partner Forecast",
    value: "138.8K",
    change: 4.2,
    trend: "up" as const,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    subtitle: "units",
  },
  {
    title: "Variance",
    value: "+4.6%",
    change: 4.6,
    trend: "up" as const,
    icon: <AlertTriangle className="h-4 w-4 text-warning" />,
    variant: "warning" as const,
  },
]

// Forecast vs Actual Trend
const forecastTrendData = [
  { period: "W45", actual: 16200, aiForecast: 15800, partnerForecast: 16500 },
  { period: "W46", actual: 19800, aiForecast: 18500, partnerForecast: 17200 },
  { period: "W47", actual: 21200, aiForecast: 20800, partnerForecast: 19500 },
  { period: "W48", actual: 22100, aiForecast: 22500, partnerForecast: 21000 },
  { period: "W49", actual: 23500, aiForecast: 23200, partnerForecast: 22800 },
  { period: "W50", actual: 24200, aiForecast: 24800, partnerForecast: 23500 },
  { period: "W51", actual: null, aiForecast: 26200, partnerForecast: 24800 },
  { period: "W52", actual: null, aiForecast: 27500, partnerForecast: 25200 },
  { period: "W1", actual: null, aiForecast: 28800, partnerForecast: 26500 },
  { period: "W2", actual: null, aiForecast: 30200, partnerForecast: 27800 },
]

// Regional Forecast Breakdown
const regionalForecast = [
  { name: "Central Europe", actual: 46500, forecast: 45200 },
  { name: "Eastern Europe", actual: 18000, forecast: 19500 },
  { name: "Adriatics", actual: 16250, forecast: 15800 },
  { name: "Western Balkans", actual: 12500, forecast: 13100 },
]

// Forecast accuracy by partner
const partnerAccuracyData = [
  { partner: "Alza.cz", accuracy: 92, bias: -2.5 },
  { partner: "eMAG.ro", accuracy: 88, bias: 4.2 },
  { partner: "Datart.sk", accuracy: 85, bias: -8.5 },
  { partner: "Tehnomanija", accuracy: 78, bias: 12.1 },
  { partner: "Big Bang", accuracy: 91, bias: 1.8 },
]

// Scenario summary
const scenarioData = [
  { name: "Conservative", forecast: 132500, probability: 25, description: "Based on historical lows and market challenges" },
  { name: "Base Case", forecast: 145200, probability: 50, description: "AI model primary prediction" },
  { name: "Optimistic", forecast: 162800, probability: 25, description: "Assumes favorable market conditions" },
]

// Detailed forecast table
const forecastTableData = [
  { product: "iPhone 16 Pro Max", partner: "Alza.cz", region: "Central Europe", currentStock: 8520, aiForecast: 9250, partnerForecast: 8800, variance: 5.1, accuracy: 92, status: "Aligned" },
  { product: "MacBook Air M3", partner: "eMAG.ro", region: "Eastern Europe", currentStock: 6280, aiForecast: 6850, partnerForecast: 7200, variance: -4.9, accuracy: 88, status: "Under" },
  { product: "AirPods Pro 2", partner: "Datart.sk", region: "Central Europe", currentStock: 980, aiForecast: 11200, partnerForecast: 9500, variance: 17.9, accuracy: 78, status: "Critical" },
  { product: "iPhone 16", partner: "Tehnomanija", region: "Western Balkans", currentStock: 3200, aiForecast: 4850, partnerForecast: 5200, variance: -6.7, accuracy: 85, status: "Under" },
  { product: "MacBook Pro M3", partner: "Big Bang", region: "Adriatics", currentStock: 1650, aiForecast: 5920, partnerForecast: 5800, variance: 2.1, accuracy: 91, status: "Aligned" },
  { product: "iPad Air M2", partner: "Technomarket", region: "Eastern Europe", currentStock: 1280, aiForecast: 4280, partnerForecast: 4100, variance: 4.4, accuracy: 89, status: "Aligned" },
]

const forecastTableColumns = [
  { id: "product", header: "Product", accessor: "product", sortable: true },
  { id: "partner", header: "Partner", accessor: "partner", sortable: true },
  { id: "region", header: "Region", accessor: "region", sortable: true },
  { id: "currentStock", header: "Current Stock", accessor: "currentStock", sortable: true, align: "right" as const, format: numberFormat },
  { id: "aiForecast", header: "AI Forecast", accessor: "aiForecast", sortable: true, align: "right" as const, format: numberFormat },
  { id: "partnerForecast", header: "Partner FC", accessor: "partnerForecast", sortable: true, align: "right" as const, format: numberFormat },
  { id: "variance", header: "Variance %", accessor: "variance", sortable: true, align: "right" as const, format: changeIndicator },
  { id: "accuracy", header: "Accuracy %", accessor: "accuracy", sortable: true, align: "right" as const, format: percentFormat },
  { id: "status", header: "Status", accessor: "status", sortable: true, format: (value: unknown) => {
    const status = String(value)
    const styles: Record<string, string> = {
      "Aligned": "bg-success/10 text-success",
      "Under": "bg-warning/10 text-warning",
      "Over": "bg-info/10 text-info",
      "Critical": "bg-destructive/10 text-destructive",
    }
    return (
      <Badge className={cn("text-[10px] font-medium", styles[status] || "bg-muted text-muted-foreground")}>
        {status}
      </Badge>
    )
  }},
]

export default function ForecastDashboardPage() {
  const [showInsights, setShowInsights] = useState(true)
  const [adjustmentValue, setAdjustmentValue] = useState([0])

  return (
    <DashboardLayout 
      title="Forecast Dashboard" 
      subtitle="AI & Partner Forecast Analysis"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          {/* Filter Bar */}
          <FilterBar />

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {forecastKpis.map((kpi) => (
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

          {/* Scenario Summary */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Scenario Analysis</CardTitle>
                <p className="text-xs text-muted-foreground">Next 4 weeks forecast scenarios</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Forecast Configuration</DialogTitle>
                    <DialogDescription>
                      Adjust forecast parameters and thresholds
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Forecast Horizon (Weeks)</Label>
                      <Input type="number" defaultValue={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Variance Threshold (%)</Label>
                      <Input type="number" defaultValue={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Manual Adjustment (%): {adjustmentValue[0]}%</Label>
                      <Slider
                        value={adjustmentValue}
                        onValueChange={setAdjustmentValue}
                        min={-20}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Apply Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {scenarioData.map((scenario) => (
                  <Card key={scenario.name} className={cn(
                    "border-border bg-secondary/30",
                    scenario.name === "Base Case" && "border-primary/50 bg-primary/5"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">{scenario.name}</span>
                        <Badge variant="outline" className="text-[10px]">{scenario.probability}%</Badge>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-foreground">
                        {(scenario.forecast / 1000).toFixed(1)}K
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{scenario.description}</p>
                      <div className="mt-3">
                        <Progress value={scenario.probability} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Forecast vs Actual Trend" subtitle="10-week view with 4-week projection" badge="AI + Partner">
              <MultiLineChart
                data={forecastTrendData}
                lines={[
                  { dataKey: "actual", name: "Actual", color: "hsl(155, 60%, 50%)" },
                  { dataKey: "aiForecast", name: "AI Forecast", color: "hsl(250, 60%, 55%)" },
                  { dataKey: "partnerForecast", name: "Partner FC", color: "hsl(85, 50%, 55%)" },
                ]}
                height={300}
              />
            </ChartCard>
            <ChartCard title="Regional Forecast Performance" subtitle="Actual vs AI Forecast">
              <PerformanceBarChart data={regionalForecast} height={300} />
            </ChartCard>
          </div>

          {/* Partner Accuracy */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Partner Forecast Accuracy</CardTitle>
              <p className="text-xs text-muted-foreground">Historical accuracy and bias by partner</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerAccuracyData.map((partner) => (
                  <div key={partner.partner} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{partner.partner}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          Accuracy: <span className="font-medium text-foreground">{partner.accuracy}%</span>
                        </span>
                        <span className={cn(
                          "font-medium",
                          partner.bias >= 0 ? "text-success" : "text-destructive"
                        )}>
                          Bias: {partner.bias >= 0 ? "+" : ""}{partner.bias}%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-2 gap-1">
                      <div className="overflow-hidden rounded-full bg-secondary flex-1">
                        <div
                          className={cn(
                            "h-full transition-all",
                            partner.accuracy >= 90 ? "bg-success" : partner.accuracy >= 80 ? "bg-warning" : "bg-destructive"
                          )}
                          style={{ width: `${partner.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Forecast Table */}
          <div>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Forecasts</TabsTrigger>
                <TabsTrigger value="variance">High Variance</TabsTrigger>
                <TabsTrigger value="underforecast">Under-Forecast</TabsTrigger>
                <TabsTrigger value="overforecast">Over-Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <DataTable
                  title="Detailed Forecast Analysis"
                  columns={forecastTableColumns}
                  data={forecastTableData}
                />
              </TabsContent>
              <TabsContent value="variance">
                <DataTable
                  title="High Variance Items"
                  columns={forecastTableColumns}
                  data={forecastTableData.filter(row => Math.abs(row.variance) > 10)}
                />
              </TabsContent>
              <TabsContent value="underforecast">
                <DataTable
                  title="Under-Forecast Items"
                  columns={forecastTableColumns}
                  data={forecastTableData.filter(row => row.variance < -5)}
                />
              </TabsContent>
              <TabsContent value="overforecast">
                <DataTable
                  title="Over-Forecast Items"
                  columns={forecastTableColumns}
                  data={forecastTableData.filter(row => row.variance > 5)}
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
