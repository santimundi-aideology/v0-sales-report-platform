"use client"

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Theme-aware colors
const CHART_COLORS = {
  primary: "hsl(155, 60%, 50%)",
  secondary: "hsl(250, 60%, 55%)",
  tertiary: "hsl(85, 50%, 55%)",
  quaternary: "hsl(330, 65%, 55%)",
  muted: "hsl(0, 0%, 40%)",
}

interface ChartCardProps {
  title: string
  subtitle?: string
  badge?: string
  children: React.ReactNode
}

export function ChartCard({ title, subtitle, badge, children }: ChartCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Revenue Trend Chart
interface RevenueTrendData {
  period: string
  revenue: number
  target: number
}

interface RevenueTrendChartProps {
  data: RevenueTrendData[]
  height?: number
}

export function RevenueTrendChart({ data, height = 300 }: RevenueTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" vertical={false} />
        <XAxis
          dataKey="period"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(270, 10%, 15%)",
            border: "1px solid hsl(0, 0%, 25%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, ""]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          fill="url(#revenueGradient)"
          name="Revenue"
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke={CHART_COLORS.muted}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Target"
        />
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={10}
          wrapperStyle={{ fontSize: "11px" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Performance Bar Chart
interface PerformanceData {
  name: string
  actual: number
  forecast: number
}

interface PerformanceBarChartProps {
  data: PerformanceData[]
  height?: number
}

export function PerformanceBarChart({ data, height = 300 }: PerformanceBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(270, 10%, 15%)",
            border: "1px solid hsl(0, 0%, 25%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [value.toLocaleString(), ""]}
        />
        <Bar dataKey="actual" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Actual" />
        <Bar dataKey="forecast" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="Forecast" />
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={10}
          wrapperStyle={{ fontSize: "11px" }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Multi Line Chart
interface MultiLineData {
  period: string
  [key: string]: string | number
}

interface MultiLineChartProps {
  data: MultiLineData[]
  lines: { dataKey: string; name: string; color: string }[]
  height?: number
}

export function MultiLineChart({ data, lines, height = 300 }: MultiLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" vertical={false} />
        <XAxis
          dataKey="period"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(270, 10%, 15%)",
            border: "1px solid hsl(0, 0%, 25%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, r: 3 }}
            name={line.name}
          />
        ))}
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={10}
          wrapperStyle={{ fontSize: "11px" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Distribution Pie Chart
interface DistributionData {
  name: string
  value: number
}

interface DistributionPieChartProps {
  data: DistributionData[]
  height?: number
}

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.muted,
]

export function DistributionPieChart({ data, height = 200 }: DistributionPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(270, 10%, 15%)",
            border: "1px solid hsl(0, 0%, 25%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value}%`, ""]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconSize={8}
          wrapperStyle={{ fontSize: "11px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Horizontal Bar Chart for Rankings
interface RankingData {
  name: string
  value: number
  change?: number
}

interface RankingBarChartProps {
  data: RankingData[]
  height?: number
  valueFormatter?: (value: number) => string
}

export function RankingBarChart({
  data,
  height = 200,
  valueFormatter = (v) => v.toLocaleString(),
}: RankingBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-3" style={{ height }}>
      {data.map((item, index) => (
        <div key={item.name} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">#{index + 1}</span>
              <span className="font-medium text-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{valueFormatter(item.value)}</span>
              {item.change !== undefined && (
                <span
                  className={
                    item.change >= 0 ? "text-success" : "text-destructive"
                  }
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change}%
                </span>
              )}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
