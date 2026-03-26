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

// LOB Performance Grouped Bar Chart — sell-out evolution across FY/Q with YoY labels
interface LOBPerformanceData {
  lob: string
  fy24q: number
  fy25q: number
  fy26q: number
  yoyFy25: number
  yoyFy26: number
}

interface LOBPerformanceChartProps {
  data: LOBPerformanceData[]
  height?: number
}

const FY_COLORS = {
  fy24: "hsl(0, 0%, 55%)",
  fy25: "hsl(250, 60%, 55%)",
  fy26: "hsl(155, 60%, 50%)",
}

function YoYLabel({ viewBox, value }: { viewBox?: { x: number; y: number; width: number }; value?: string }) {
  if (!viewBox || !value) return null
  return (
    <text x={viewBox.x + (viewBox.width || 0) / 2} y={viewBox.y - 6} textAnchor="middle" fontSize={9} fill="hsl(0, 0%, 50%)">
      {value}
    </text>
  )
}

export function LOBPerformanceChart({ data, height = 300 }: LOBPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }} barGap={2} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" vertical={false} />
        <XAxis
          dataKey="lob"
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
          formatter={(value: number, name: string) => [value.toLocaleString(), name]}
        />
        <Bar dataKey="fy24q" fill={FY_COLORS.fy24} radius={[3, 3, 0, 0]} name="Q1 FY24" />
        <Bar dataKey="fy25q" fill={FY_COLORS.fy25} radius={[3, 3, 0, 0]} name="Q1 FY25" label={({ x, y, width, index }: { x: number; y: number; width: number; index: number }) => {
          const yoy = data[index]?.yoyFy25
          if (yoy === undefined) return null
          const isPositive = yoy >= 0
          return (
            <text x={x + width / 2} y={y - 4} textAnchor="middle" fontSize={8} fill={isPositive ? "hsl(155, 60%, 50%)" : "hsl(0, 65%, 55%)"}>
              {isPositive ? "+" : ""}{yoy}%
            </text>
          )
        }} />
        <Bar dataKey="fy26q" fill={FY_COLORS.fy26} radius={[3, 3, 0, 0]} name="Q1 FY26" label={({ x, y, width, index }: { x: number; y: number; width: number; index: number }) => {
          const yoy = data[index]?.yoyFy26
          if (yoy === undefined) return null
          const isPositive = yoy >= 0
          return (
            <text x={x + width / 2} y={y - 4} textAnchor="middle" fontSize={8} fill={isPositive ? "hsl(155, 60%, 50%)" : "hsl(0, 65%, 55%)"}>
              {isPositive ? "+" : ""}{yoy}%
            </text>
          )
        }} />
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

// Product Mix Stacked Bar Chart — breakdown within each item group with QoQ change
interface ProductMixItem {
  name: string
  [key: string]: string | number
}

interface ProductMixChartProps {
  data: ProductMixItem[]
  segments: { key: string; name: string; color: string }[]
  height?: number
}

const PRODUCT_MIX_COLORS = [
  "hsl(155, 60%, 50%)",
  "hsl(250, 60%, 55%)",
  "hsl(85, 50%, 55%)",
  "hsl(330, 65%, 55%)",
  "hsl(35, 80%, 55%)",
  "hsl(195, 60%, 50%)",
  "hsl(0, 0%, 55%)",
]

// ── Stream K (#28): Attach Development Chart ──
// ASSUMPTION: All 5 attach rates (iPhone, Mac, iPad, AW, AirPods) shown as separate lines on a single chart.
// ASSUMPTION: This is a NEW chart, not a replacement for the existing weekly trend chart.
// ASSUMPTION: No target/benchmark line included — can be added once customer confirms.
// Shows full quarter (13 weeks), with attach rates as defined in Stream B formulas.
interface AttachDevelopmentData {
  week: string
  iphone: number | null
  mac: number | null
  ipad: number | null
  aw: number | null
  airpods: number | null
}

interface AttachDevelopmentChartProps {
  data: AttachDevelopmentData[]
  height?: number
}

const ATTACH_COLORS = {
  iphone: "hsl(155, 60%, 50%)",
  mac: "hsl(250, 60%, 55%)",
  ipad: "hsl(85, 50%, 55%)",
  aw: "hsl(35, 80%, 55%)",
  airpods: "hsl(330, 65%, 55%)",
}

export function AttachDevelopmentChart({ data, height = 300 }: AttachDevelopmentChartProps) {
  const lines = [
    { dataKey: "iphone", name: "iPhone", color: ATTACH_COLORS.iphone },
    { dataKey: "mac", name: "Mac", color: ATTACH_COLORS.mac },
    { dataKey: "ipad", name: "iPad", color: ATTACH_COLORS.ipad },
    { dataKey: "aw", name: "Apple Watch", color: ATTACH_COLORS.aw },
    { dataKey: "airpods", name: "AirPods", color: ATTACH_COLORS.airpods },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" vertical={false} />
        <XAxis
          dataKey="week"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 10 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(270, 10%, 15%)",
            border: "1px solid hsl(0, 0%, 25%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number | null, name: string) => [value !== null ? `${value.toFixed(1)}%` : "—", name]}
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, r: 2.5 }}
            name={line.name}
            connectNulls={false}
            strokeDasharray={undefined}
          />
        ))}
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={10}
          wrapperStyle={{ fontSize: "10px" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function ProductMixChart({ data, segments, height = 240 }: ProductMixChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical" barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 100]}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
          width={70}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(270, 10%, 15%)",
            border: "1px solid hsl(0, 0%, 25%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
        />
        {segments.map((seg, i) => (
          <Bar
            key={seg.key}
            dataKey={seg.key}
            name={seg.name}
            stackId="mix"
            fill={seg.color || PRODUCT_MIX_COLORS[i % PRODUCT_MIX_COLORS.length]}
          />
        ))}
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={8}
          wrapperStyle={{ fontSize: "10px" }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
