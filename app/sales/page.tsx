"use client"

import { useState } from "react"
import {
  Smartphone,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Cable,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ItemGroupKpiCard } from "@/components/dashboard/item-group-kpi-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import {
  ChartCard,
  MultiLineChart,
  LOBPerformanceChart,
  ProductMixChart,
  RankingBarChart,
  AttachDevelopmentChart,
} from "@/components/dashboard/charts"
import { DataTable, numberFormat, percentFormat, statusBadge } from "@/components/dashboard/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// ══════════════════════════════════════════════════════════
// Stream A+B (#12-17, #29): Item Group KPI Cards
// DONE: 6 cards — iPhone, Mac, iPad, Apple Watch, AirPods, Accessories.
// Each card shows SI QTD (qty + YoY), SO QTD (qty + YoY), Stock, WOS, Attach.
// Attach formulas follow customer definitions from annotation #29:
//   iPhone  = (iPhone acc + Music acc + iPad acc [Adapter/Reader + Cable]) / iPhone SO
//   Mac     = Mac acc / Mac SO
//   iPad    = (iPad acc + iPad Pro acc) / iPad SO
//   AW      = AW acc / AW SO
//   AirPods = AirPods SO / iPhone SO
//   Acc     = Total Acc SO / iPhone SO
// ══════════════════════════════════════════════════════════
const itemGroupKpis = [
  {
    title: "iPhone",
    icon: <Smartphone className="h-3.5 w-3.5 text-primary" />,
    metrics: {
      sellIn:  { label: "SI QTD", value: "52,840", yoy: 14.2 },
      sellOut: { label: "SO QTD", value: "48,120", yoy: 11.8 },
      stock:   { label: "Stock", value: "18,450", yoy: -3.2 },
      wos:     { label: "WOS", value: "5.8", yoy: -1.5 },
      attach:  { label: "Attach", value: "38.2%", yoy: 2.4 },
    },
  },
  {
    title: "Mac",
    icon: <Monitor className="h-3.5 w-3.5 text-primary" />,
    metrics: {
      sellIn:  { label: "SI QTD", value: "18,520", yoy: 8.5 },
      sellOut: { label: "SO QTD", value: "16,280", yoy: 6.2 },
      stock:   { label: "Stock", value: "8,240", yoy: 5.1 },
      wos:     { label: "WOS", value: "7.2", yoy: 0.8 },
      attach:  { label: "Attach", value: "22.4%", yoy: 1.8 },
    },
  },
  {
    title: "iPad",
    icon: <Tablet className="h-3.5 w-3.5 text-primary" />,
    metrics: {
      sellIn:  { label: "SI QTD", value: "24,680", yoy: 18.3 },
      sellOut: { label: "SO QTD", value: "22,450", yoy: 15.6 },
      stock:   { label: "Stock", value: "12,100", yoy: -1.2 },
      wos:     { label: "WOS", value: "6.4", yoy: -0.6 },
      attach:  { label: "Attach", value: "28.6%", yoy: 3.1 },
    },
  },
  {
    title: "Apple Watch",
    icon: <Watch className="h-3.5 w-3.5 text-primary" />,
    metrics: {
      sellIn:  { label: "SI QTD", value: "15,420", yoy: -2.8 },
      sellOut: { label: "SO QTD", value: "14,650", yoy: -4.1 },
      stock:   { label: "Stock", value: "5,280", yoy: 8.2 },
      wos:     { label: "WOS", value: "4.8", yoy: 2.1 },
      attach:  { label: "Attach", value: "12.8%", yoy: -0.5 },
    },
  },
  {
    title: "AirPods",
    icon: <Headphones className="h-3.5 w-3.5 text-primary" />,
    metrics: {
      sellIn:  { label: "SI QTD", value: "22,180", yoy: 22.1 },
      sellOut: { label: "SO QTD", value: "20,840", yoy: 19.4 },
      stock:   { label: "Stock", value: "9,120", yoy: 2.8 },
      wos:     { label: "WOS", value: "5.4", yoy: -0.3 },
      attach:  { label: "Attach", value: "43.3%", yoy: 4.2 },
    },
  },
  {
    title: "Accessories",
    icon: <Cable className="h-3.5 w-3.5 text-primary" />,
    metrics: {
      sellIn:  { label: "SI QTD", value: "9,210", yoy: 5.4 },
      sellOut: { label: "SO QTD", value: "8,080", yoy: 3.8 },
      stock:   { label: "Stock", value: "36,050", yoy: -6.4 },
      wos:     { label: "WOS", value: "8.1", yoy: -1.2 },
      attach:  { label: "Attach", value: "16.8%", yoy: 0.9 },
    },
  },
]

// ══════════════════════════════════════════════════════════
// Stream I (#18): QTD Weekly Sell-Out Table per LOB
// DONE: Replaces the old "Period Comparison" card.
// ASSUMPTION (was open question): Implemented as TABS per LOB (not stacked tables or accordion).
// ASSUMPTION: Projected run rate uses SIMPLE AVERAGE of last 4 reported weeks (not weighted).
// ASSUMPTION: Mock weekly data simulates reported + unreported weeks.
//   Unreported weeks shown with projected values and lighter styling.
//   Columns: Week, SO Qty, LY SO Qty, YoY%, WoW Delta%, (for unreported: projected run rate)
//   End columns: Projected Q-end, YoY, Stock, WOS
// ══════════════════════════════════════════════════════════
interface WeeklySORow {
  week: string
  soQty: number | null
  lyQty: number
  yoy: number | null
  wow: number | null
  reported: boolean
}

interface LOBWeeklyData {
  lob: string
  weeks: WeeklySORow[]
  projectedQEnd: number
  projectedQEndYoy: number
  stock: number
  wos: number
}

function generateWeeklyData(lob: string, baseSO: number, lyBase: number, stock: number, wos: number): LOBWeeklyData {
  const weeks: WeeklySORow[] = []
  let prevQty: number | null = null

  for (let w = 1; w <= 13; w++) {
    const reported = w <= 8
    const variance = (Math.sin(w * 0.8) * 0.15 + (Math.random() - 0.5) * 0.1)
    const soQty = reported ? Math.round(baseSO * (1 + variance)) : null
    const lyQty = Math.round(lyBase * (1 + (Math.sin(w * 0.6) * 0.1)))
    const yoy = soQty !== null ? Number((((soQty - lyQty) / lyQty) * 100).toFixed(1)) : null
    const wow = soQty !== null && prevQty !== null ? Number((((soQty - prevQty) / prevQty) * 100).toFixed(1)) : null

    weeks.push({ week: `W${w}`, soQty, lyQty, yoy, wow, reported })
    if (soQty !== null) prevQty = soQty
  }

  const reportedWeeks = weeks.filter(w => w.reported && w.soQty !== null)
  const last4 = reportedWeeks.slice(-4)
  const avgRunRate = Math.round(last4.reduce((sum, w) => sum + (w.soQty || 0), 0) / last4.length)

  weeks.forEach(w => {
    if (!w.reported) {
      w.soQty = avgRunRate
      w.yoy = Number((((avgRunRate - w.lyQty) / w.lyQty) * 100).toFixed(1))
      if (prevQty !== null) {
        w.wow = Number((((avgRunRate - prevQty) / prevQty) * 100).toFixed(1))
      }
      prevQty = avgRunRate
    }
  })

  const totalSO = weeks.reduce((sum, w) => sum + (w.soQty || 0), 0)
  const totalLY = weeks.reduce((sum, w) => sum + w.lyQty, 0)
  const projYoy = Number((((totalSO - totalLY) / totalLY) * 100).toFixed(1))

  return { lob, weeks, projectedQEnd: totalSO, projectedQEndYoy: projYoy, stock, wos }
}

const weeklySOByLOB: LOBWeeklyData[] = [
  generateWeeklyData("iPhone", 3700, 3300, 18450, 5.8),
  generateWeeklyData("Mac", 1250, 1180, 8240, 7.2),
  generateWeeklyData("iPad", 1730, 1500, 12100, 6.4),
  generateWeeklyData("Apple Watch", 1130, 1180, 5280, 4.8),
  generateWeeklyData("AirPods", 1600, 1340, 9120, 5.4),
  generateWeeklyData("Accessories", 620, 600, 36050, 8.1),
]

// ══════════════════════════════════════════════════════════
// Stream J (#30): Dynamic Weekly/Quarterly Trend Chart
// DONE: The trend chart adapts based on a period selector:
//   - "Quarter" (default): shows W1 to QTD weekly data
//   - "Year": switches to quarterly view showing SO qty per quarter
//   - "All Years": shows FY-level grouped data
// ASSUMPTION (was open question): Chart type stays as LINE for all views.
// ASSUMPTION: "Attach per quarter" in yearly view is interpreted as showing
//   SO quantity per quarter (not attach rates), since the Attach Development
//   chart (#28) already covers attach. Can be adjusted if customer prefers attach here.
// ASSUMPTION: Multi-year FY data is available (mocked).
// ══════════════════════════════════════════════════════════

const weeklyTrendData = [
  { period: "W1", sellIn: 8500, sellOut: 7200, stock: 82500 },
  { period: "W2", sellIn: 9200, sellOut: 8800, stock: 84800 },
  { period: "W3", sellIn: 7800, sellOut: 9100, stock: 83400 },
  { period: "W4", sellIn: 10500, sellOut: 8500, stock: 85800 },
  { period: "W5", sellIn: 9800, sellOut: 9200, stock: 83500 },
  { period: "W6", sellIn: 8200, sellOut: 10100, stock: 81800 },
  { period: "W7", sellIn: 11200, sellOut: 9500, stock: 83500 },
  { period: "W8", sellIn: 9500, sellOut: 9800, stock: 83200 },
]

const quarterlyTrendData = [
  { period: "Q1 FY25", sellIn: 82500, sellOut: 76200, stock: 85000 },
  { period: "Q2 FY25", sellIn: 88200, sellOut: 81400, stock: 83200 },
  { period: "Q3 FY25", sellIn: 91800, sellOut: 85200, stock: 89800 },
  { period: "Q4 FY25", sellIn: 95400, sellOut: 89800, stock: 95600 },
]

const fyTrendData = [
  { period: "FY23", sellIn: 298000, sellOut: 272000, stock: 78500 },
  { period: "FY24", sellIn: 342000, sellOut: 318000, stock: 82200 },
  { period: "FY25", sellIn: 357900, sellOut: 332600, stock: 83200 },
]

// ══════════════════════════════════════════════════════════
// Stream K (#28): Attach Development Chart — Full Quarter, 13 Weeks
// DONE: New multi-line chart showing all 5 attach rates over 13 weeks.
// ASSUMPTION (was open question): All 5 attach rates (iPhone, Mac, iPad, AW, AirPods)
//   displayed as separate lines on one chart — allows cross-LOB comparison.
// ASSUMPTION: This is a NEW chart, placed below the LOB performance chart.
//   Does NOT replace the weekly SI/SO/Stock trend chart.
// ASSUMPTION: No target/benchmark line included in this version.
//   Can be added once customer confirms desired target values.
// ══════════════════════════════════════════════════════════

const attachDevelopmentData = [
  { week: "W1",  iphone: 35.2, mac: 20.1, ipad: 25.8, aw: 11.2, airpods: 38.5 },
  { week: "W2",  iphone: 36.1, mac: 20.8, ipad: 26.2, aw: 11.5, airpods: 39.2 },
  { week: "W3",  iphone: 35.8, mac: 21.2, ipad: 26.8, aw: 12.0, airpods: 40.1 },
  { week: "W4",  iphone: 36.5, mac: 21.5, ipad: 27.1, aw: 11.8, airpods: 40.8 },
  { week: "W5",  iphone: 37.2, mac: 21.8, ipad: 27.5, aw: 12.2, airpods: 41.5 },
  { week: "W6",  iphone: 37.8, mac: 22.0, ipad: 28.0, aw: 12.5, airpods: 42.0 },
  { week: "W7",  iphone: 37.5, mac: 22.2, ipad: 28.2, aw: 12.4, airpods: 42.8 },
  { week: "W8",  iphone: 38.2, mac: 22.4, ipad: 28.6, aw: 12.8, airpods: 43.3 },
  { week: "W9",  iphone: null, mac: null, ipad: null, aw: null, airpods: null },
  { week: "W10", iphone: null, mac: null, ipad: null, aw: null, airpods: null },
  { week: "W11", iphone: null, mac: null, ipad: null, aw: null, airpods: null },
  { week: "W12", iphone: null, mac: null, ipad: null, aw: null, airpods: null },
  { week: "W13", iphone: null, mac: null, ipad: null, aw: null, airpods: null },
]

// ══════════════════════════════════════════════════════════
// Stream F (#20-27): LOB Performance Chart
// DONE: Grouped bar chart showing sell-out qty across Q1 FY24, Q1 FY25, Q1 FY26.
// YoY% labels on each bar. LOB selector tabs.
// ══════════════════════════════════════════════════════════

const lobPerformanceData = [
  { lob: "iPhone",   fy24q: 38200, fy25q: 43100, fy26q: 48120, yoyFy25: 12.8, yoyFy26: 11.6 },
  { lob: "Mac",      fy24q: 14200, fy25q: 15300, fy26q: 16280, yoyFy25: 7.7,  yoyFy26: 6.4 },
  { lob: "iPad",     fy24q: 16800, fy25q: 19400, fy26q: 22450, yoyFy25: 15.5, yoyFy26: 15.7 },
  { lob: "AW",       fy24q: 14800, fy25q: 15280, fy26q: 14650, yoyFy25: 3.2,  yoyFy26: -4.1 },
  { lob: "AirPods",  fy24q: 14500, fy25q: 17450, fy26q: 20840, yoyFy25: 20.3, yoyFy26: 19.4 },
  { lob: "Acc",      fy24q: 7200,  fy25q: 7780,  fy26q: 8080,  yoyFy25: 8.1,  yoyFy26: 3.9 },
]

// ══════════════════════════════════════════════════════════
// Stream G (#31, #32): Product Mix by LOB
// DONE: Stacked breakdown per item group with QoQ change in pp.
// ══════════════════════════════════════════════════════════

const productMixByGroup: Record<string, {
  data: { name: string; [key: string]: string | number }[]
  segments: { key: string; name: string; color: string }[]
  qoqChanges: { segment: string; change: number }[]
}> = {
  iPhone: {
    data: [
      { name: "This Q",  "iPhone 16": 42, "iPhone 15": 28, "iPhone SE": 18, "Other": 12 },
      { name: "Prev Q",  "iPhone 16": 38, "iPhone 15": 32, "iPhone SE": 19, "Other": 11 },
    ],
    segments: [
      { key: "iPhone 16", name: "iPhone 16", color: "hsl(155, 60%, 50%)" },
      { key: "iPhone 15", name: "iPhone 15", color: "hsl(250, 60%, 55%)" },
      { key: "iPhone SE", name: "iPhone SE", color: "hsl(85, 50%, 55%)" },
      { key: "Other", name: "Other", color: "hsl(0, 0%, 55%)" },
    ],
    qoqChanges: [
      { segment: "iPhone 16", change: 4.0 },
      { segment: "iPhone 15", change: -4.0 },
      { segment: "iPhone SE", change: -1.0 },
      { segment: "Other", change: 1.0 },
    ],
  },
  Mac: {
    data: [
      { name: "This Q",  "MacBook Air": 48, "MacBook Pro": 32, "iMac": 12, "Other": 8 },
      { name: "Prev Q",  "MacBook Air": 44, "MacBook Pro": 34, "iMac": 14, "Other": 8 },
    ],
    segments: [
      { key: "MacBook Air", name: "MacBook Air", color: "hsl(155, 60%, 50%)" },
      { key: "MacBook Pro", name: "MacBook Pro", color: "hsl(250, 60%, 55%)" },
      { key: "iMac", name: "iMac", color: "hsl(85, 50%, 55%)" },
      { key: "Other", name: "Other", color: "hsl(0, 0%, 55%)" },
    ],
    qoqChanges: [
      { segment: "MacBook Air", change: 4.0 },
      { segment: "MacBook Pro", change: -2.0 },
      { segment: "iMac", change: -2.0 },
      { segment: "Other", change: 0 },
    ],
  },
  iPad: {
    data: [
      { name: "This Q",  "iPad Pro": 35, "iPad Air": 30, "iPad 10th": 25, "iPad mini": 10 },
      { name: "Prev Q",  "iPad Pro": 32, "iPad Air": 28, "iPad 10th": 28, "iPad mini": 12 },
    ],
    segments: [
      { key: "iPad Pro", name: "iPad Pro", color: "hsl(155, 60%, 50%)" },
      { key: "iPad Air", name: "iPad Air", color: "hsl(250, 60%, 55%)" },
      { key: "iPad 10th", name: "iPad 10th", color: "hsl(85, 50%, 55%)" },
      { key: "iPad mini", name: "iPad mini", color: "hsl(0, 0%, 55%)" },
    ],
    qoqChanges: [
      { segment: "iPad Pro", change: 3.0 },
      { segment: "iPad Air", change: 2.0 },
      { segment: "iPad 10th", change: -3.0 },
      { segment: "iPad mini", change: -2.0 },
    ],
  },
  "Apple Watch": {
    data: [
      { name: "This Q",  "Ultra 2": 22, "Series 10": 45, "SE": 33 },
      { name: "Prev Q",  "Ultra 2": 20, "Series 10": 42, "SE": 38 },
    ],
    segments: [
      { key: "Ultra 2", name: "Ultra 2", color: "hsl(155, 60%, 50%)" },
      { key: "Series 10", name: "Series 10", color: "hsl(250, 60%, 55%)" },
      { key: "SE", name: "SE", color: "hsl(85, 50%, 55%)" },
    ],
    qoqChanges: [
      { segment: "Ultra 2", change: 2.0 },
      { segment: "Series 10", change: 3.0 },
      { segment: "SE", change: -5.0 },
    ],
  },
  AirPods: {
    data: [
      { name: "This Q",  "AirPods Pro 2": 52, "AirPods 4": 30, "AirPods Max": 18 },
      { name: "Prev Q",  "AirPods Pro 2": 48, "AirPods 4": 28, "AirPods Max": 24 },
    ],
    segments: [
      { key: "AirPods Pro 2", name: "AirPods Pro 2", color: "hsl(155, 60%, 50%)" },
      { key: "AirPods 4", name: "AirPods 4", color: "hsl(250, 60%, 55%)" },
      { key: "AirPods Max", name: "AirPods Max", color: "hsl(85, 50%, 55%)" },
    ],
    qoqChanges: [
      { segment: "AirPods Pro 2", change: 4.0 },
      { segment: "AirPods 4", change: 2.0 },
      { segment: "AirPods Max", change: -6.0 },
    ],
  },
  Accessories: {
    data: [
      { name: "This Q",  "Cases": 35, "Cables": 28, "Chargers": 22, "Other": 15 },
      { name: "Prev Q",  "Cases": 32, "Cables": 30, "Chargers": 24, "Other": 14 },
    ],
    segments: [
      { key: "Cases", name: "Cases", color: "hsl(155, 60%, 50%)" },
      { key: "Cables", name: "Cables", color: "hsl(250, 60%, 55%)" },
      { key: "Chargers", name: "Chargers", color: "hsl(85, 50%, 55%)" },
      { key: "Other", name: "Other", color: "hsl(0, 0%, 55%)" },
    ],
    qoqChanges: [
      { segment: "Cases", change: 3.0 },
      { segment: "Cables", change: -2.0 },
      { segment: "Chargers", change: -2.0 },
      { segment: "Other", change: 1.0 },
    ],
  },
}

// ══════════════════════════════════════════════════════════
// Stream L (#33): Revenue / Back Margin Split by Item Group
// DONE: New section showing Total SI Revenue EUR + YoY, Back Margin Total EUR + YoY,
//   split per item group for both, and final revenue after back margin deduction + YoY.
// ASSUMPTION (was open question): "Back margin" is a rebate/incentive from Apple paid
//   back to APCOM — modeled as a separate EUR value per item group.
// ASSUMPTION: This is a NEW section placed above the detailed data table,
//   not a replacement for the Top Products section.
// ASSUMPTION: Back margin data per item group is available (mocked here).
// ══════════════════════════════════════════════════════════

interface RevenueMarginRow {
  group: string
  siRevenue: number
  siRevenueYoy: number
  backMargin: number
  backMarginYoy: number
  netRevenue: number
  netRevenueYoy: number
}

const revenueMarginData: RevenueMarginRow[] = [
  { group: "iPhone",      siRevenue: 8420000, siRevenueYoy: 14.2, backMargin: 620000, backMarginYoy: 18.5, netRevenue: 7800000, netRevenueYoy: 13.8 },
  { group: "Mac",         siRevenue: 4850000, siRevenueYoy: 8.5,  backMargin: 380000, backMarginYoy: 12.2, netRevenue: 4470000, netRevenueYoy: 8.1 },
  { group: "iPad",        siRevenue: 2980000, siRevenueYoy: 18.3, backMargin: 210000, backMarginYoy: 22.1, netRevenue: 2770000, netRevenueYoy: 17.8 },
  { group: "Apple Watch", siRevenue: 1250000, siRevenueYoy: -2.8, backMargin: 85000,  backMarginYoy: -5.2, netRevenue: 1165000, netRevenueYoy: -2.6 },
  { group: "AirPods",     siRevenue: 1820000, siRevenueYoy: 22.1, backMargin: 145000, backMarginYoy: 25.8, netRevenue: 1675000, netRevenueYoy: 21.5 },
  { group: "Accessories", siRevenue: 580000,  siRevenueYoy: 5.4,  backMargin: 42000,  backMarginYoy: 8.2,  netRevenue: 538000,  netRevenueYoy: 5.1 },
]

const totalRevMargin = {
  siRevenue: revenueMarginData.reduce((s, r) => s + r.siRevenue, 0),
  siRevenueYoy: 12.5,
  backMargin: revenueMarginData.reduce((s, r) => s + r.backMargin, 0),
  backMarginYoy: 15.8,
  netRevenue: revenueMarginData.reduce((s, r) => s + r.netRevenue, 0),
  netRevenueYoy: 12.1,
}

// ── Top products ──
const topProducts = [
  { name: "iPhone 16 Pro Max", value: 12850, change: 24.2 },
  { name: "MacBook Air M3", value: 8420, change: 18.5 },
  { name: "AirPods Pro 2", value: 7280, change: 15.8 },
  { name: "iPad Pro M4", value: 6190, change: 12.1 },
  { name: "iPhone 16", value: 5920, change: 8.4 },
]

// ── Stock health ──
const stockHealthData = [
  { status: "Critical", count: 12, percentage: 8, color: "bg-destructive" },
  { status: "Low", count: 28, percentage: 19, color: "bg-warning" },
  { status: "Healthy", count: 85, percentage: 58, color: "bg-success" },
  { status: "High", count: 22, percentage: 15, color: "bg-info" },
]

// ── Detailed sales table data ──
const salesTableData = [
  { product: "iPhone 16 Pro Max", partner: "Alza.cz", region: "Czech Republic", sellIn: 8520, sellOut: 7850, stock: 2450, wos: 4.8, rr: 1962, share: 12.5, status: "Healthy" },
  { product: "MacBook Air M3", partner: "Euronics HU", region: "Hungary", sellIn: 6280, sellOut: 5920, stock: 1820, wos: 5.2, rr: 1480, share: 9.4, status: "Healthy" },
  { product: "AirPods Pro 2", partner: "Datart.sk", region: "Slovakia", sellIn: 9850, sellOut: 9120, stock: 980, wos: 1.8, rr: 2280, share: 14.5, status: "Critical" },
  { product: "iPad Pro M4", partner: "eMAG.ro", region: "Romania", sellIn: 4520, sellOut: 4280, stock: 3200, wos: 8.2, rr: 1070, share: 6.8, status: "High" },
  { product: "Apple Watch Ultra 2", partner: "Sancta Domenica", region: "Croatia", sellIn: 5680, sellOut: 5420, stock: 1650, wos: 4.5, rr: 1355, share: 8.6, status: "Healthy" },
  { product: "iPhone 16", partner: "Tehnomanija", region: "Serbia", sellIn: 3920, sellOut: 4150, stock: 1280, wos: 4.2, rr: 1037, share: 6.6, status: "Healthy" },
  { product: "iPad Air M2", partner: "Technomarket", region: "Bulgaria", sellIn: 2850, sellOut: 2680, stock: 580, wos: 3.2, rr: 670, share: 4.3, status: "Low" },
  { product: "MacBook Pro M3", partner: "Big Bang", region: "Slovenia", sellIn: 4280, sellOut: 3950, stock: 1420, wos: 5.8, rr: 987, share: 6.3, status: "Healthy" },
  { product: "AirPods 4", partner: "Domod", region: "Bosnia & Herzegovina", sellIn: 2140, sellOut: 2050, stock: 460, wos: 2.9, rr: 512, share: 3.1, status: "Low" },
  { product: "iPhone 16 Pro", partner: "Multicom ME", region: "Montenegro", sellIn: 1680, sellOut: 1540, stock: 380, wos: 3.4, rr: 385, share: 2.4, status: "Healthy" },
  { product: "Apple Watch SE", partner: "Gjirafa50", region: "Kosovo", sellIn: 1920, sellOut: 1860, stock: 290, wos: 2.1, rr: 465, share: 2.8, status: "Low" },
  { product: "MacBook Air M2", partner: "Neptun Albania", region: "Albania", sellIn: 2380, sellOut: 2260, stock: 520, wos: 3.7, rr: 565, share: 3.4, status: "Healthy" },
]

const salesTableColumns = [
  { id: "product", header: "Product", accessor: "product", sortable: true },
  { id: "partner", header: "Partner", accessor: "partner", sortable: true },
  { id: "region", header: "Region", accessor: "region", sortable: true },
  { id: "sellIn", header: "Sell-In", accessor: "sellIn", sortable: true, align: "right" as const, format: numberFormat },
  { id: "sellOut", header: "Sell-Out", accessor: "sellOut", sortable: true, align: "right" as const, format: numberFormat },
  { id: "stock", header: "Stock", accessor: "stock", sortable: true, align: "right" as const, format: numberFormat },
  { id: "wos", header: "WoS", accessor: "wos", sortable: true, align: "right" as const },
  { id: "rr", header: "RR (4W)", accessor: "rr", sortable: true, align: "right" as const, format: numberFormat },
  { id: "share", header: "Share %", accessor: "share", sortable: true, align: "right" as const, format: percentFormat },
  { id: "status", header: "Status", accessor: "status", sortable: true, format: statusBadge },
]

const LOB_TABS = ["All", "iPhone", "Mac", "iPad", "Apple Watch", "AirPods", "Accessories"] as const
const WEEKLY_LOB_TABS = ["iPhone", "Mac", "iPad", "Apple Watch", "AirPods", "Accessories"] as const

function formatEur(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `€${(value / 1_000).toFixed(0)}K`
  return `€${value.toLocaleString()}`
}

function YoYBadge({ yoy }: { yoy: number | null }) {
  if (yoy === null) return <span className="text-[9px] text-muted-foreground">—</span>
  const isPositive = yoy >= 0
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[9px] font-semibold whitespace-nowrap",
      isPositive ? "text-success" : "text-destructive"
    )}>
      {isPositive ? <ArrowUpRight className="h-2 w-2" /> : <ArrowDownRight className="h-2 w-2" />}
      {isPositive ? "+" : ""}{yoy.toFixed(1)}%
    </span>
  )
}

export default function SalesDashboardPage() {
  const [showInsights, setShowInsights] = useState(true)
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")
  const [activeLob, setActiveLob] = useState<string>("All")
  const [productMixLob, setProductMixLob] = useState<string>("iPhone")
  const [weeklyLob, setWeeklyLob] = useState<string>("iPhone")
  const [trendPeriod, setTrendPeriod] = useState<"quarter" | "year" | "all">("quarter")

  const filteredLobData = activeLob === "All"
    ? lobPerformanceData
    : lobPerformanceData.filter((d) => d.lob === activeLob || d.lob === (activeLob === "Apple Watch" ? "AW" : activeLob === "Accessories" ? "Acc" : activeLob))

  const currentMix = productMixByGroup[productMixLob] || productMixByGroup["iPhone"]
  const currentWeeklyLob = weeklySOByLOB.find(d => d.lob === weeklyLob) || weeklySOByLOB[0]

  const trendData = trendPeriod === "quarter" ? weeklyTrendData : trendPeriod === "year" ? quarterlyTrendData : fyTrendData
  const trendSubtitle = trendPeriod === "quarter" ? "Weekly (W1–QTD)" : trendPeriod === "year" ? "Quarterly FY25" : "Fiscal Year Overview"

  return (
    <DashboardLayout 
      title="Sales Dashboard" 
      subtitle="Sell-In / Sell-Out / Stock Analysis"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          {/* Filter Bar */}
          <FilterBar />

          {/* Item Group KPI Cards (Stream A + B) */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {itemGroupKpis.map((kpi) => (
              <ItemGroupKpiCard
                key={kpi.title}
                title={kpi.title}
                icon={kpi.icon}
                metrics={kpi.metrics}
              />
            ))}
          </div>

          {/* Stream I (#18): QTD Weekly Sell-Out Table per LOB */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">QTD Weekly Sell-Out by LOB</CardTitle>
                <p className="text-xs text-muted-foreground">Weekly SO qty with YoY comparison &middot; Unreported weeks show projected run rate (avg last 4W)</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap gap-1">
                {WEEKLY_LOB_TABS.map((tab) => (
                  <Button
                    key={tab}
                    variant={weeklyLob === tab ? "default" : "outline"}
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => setWeeklyLob(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground">Week</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">SO Qty</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">LY Qty</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">YoY%</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">WoW%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentWeeklyLob.weeks.map((w) => (
                      <TableRow key={w.week} className={cn("hover:bg-secondary/50", !w.reported && "opacity-50")}>
                        <TableCell className="py-1.5 text-[11px] font-medium">
                          {w.week}
                          {!w.reported && <span className="ml-1 text-[8px] text-muted-foreground italic">(proj)</span>}
                        </TableCell>
                        <TableCell className="py-1.5 text-right text-[11px] tabular-nums">
                          {w.soQty?.toLocaleString() ?? "—"}
                        </TableCell>
                        <TableCell className="py-1.5 text-right text-[11px] tabular-nums text-muted-foreground">
                          {w.lyQty.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-1.5 text-right">
                          <YoYBadge yoy={w.yoy} />
                        </TableCell>
                        <TableCell className="py-1.5 text-right">
                          {w.wow !== null ? (
                            <span className={cn("text-[9px] font-semibold", w.wow >= 0 ? "text-success" : "text-destructive")}>
                              {w.wow >= 0 ? "+" : ""}{w.wow.toFixed(1)}%
                            </span>
                          ) : <span className="text-[9px] text-muted-foreground">—</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Summary row */}
              <div className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Projected Q-End</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold tabular-nums">{currentWeeklyLob.projectedQEnd.toLocaleString()}</span>
                    <YoYBadge yoy={currentWeeklyLob.projectedQEndYoy} />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Stock</span>
                  <span className="block text-sm font-semibold tabular-nums">{currentWeeklyLob.stock.toLocaleString()}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">WOS</span>
                  <span className="block text-sm font-semibold tabular-nums">{currentWeeklyLob.wos.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Stream J (#30): Dynamic Trend Chart */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold">Sell-In / Sell-Out / Stock Trend</CardTitle>
                  <p className="text-xs text-muted-foreground">{trendSubtitle}</p>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
                  <Button variant={trendPeriod === "quarter" ? "default" : "ghost"} size="sm" className="h-5 px-2 text-[9px]" onClick={() => setTrendPeriod("quarter")}>Quarter</Button>
                  <Button variant={trendPeriod === "year" ? "default" : "ghost"} size="sm" className="h-5 px-2 text-[9px]" onClick={() => setTrendPeriod("year")}>Year</Button>
                  <Button variant={trendPeriod === "all" ? "default" : "ghost"} size="sm" className="h-5 px-2 text-[9px]" onClick={() => setTrendPeriod("all")}>All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <MultiLineChart
                  data={trendData}
                  lines={[
                    { dataKey: "sellIn", name: "Sell-In", color: "hsl(155, 60%, 50%)" },
                    { dataKey: "sellOut", name: "Sell-Out", color: "hsl(250, 60%, 55%)" },
                    { dataKey: "stock", name: "Stock", color: "hsl(85, 50%, 55%)" },
                  ]}
                  height={280}
                />
              </CardContent>
            </Card>

            {/* LOB Performance Chart (Stream F) */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold">Performance by LOB</CardTitle>
                  <p className="text-xs text-muted-foreground">Sell-out qty evolution across fiscal years</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex flex-wrap gap-1">
                  {LOB_TABS.map((tab) => (
                    <Button
                      key={tab}
                      variant={activeLob === tab ? "default" : "outline"}
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                      onClick={() => setActiveLob(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
                <LOBPerformanceChart data={filteredLobData} height={240} />
              </CardContent>
            </Card>
          </div>

          {/* Stream K (#28): Attach Development Chart */}
          <ChartCard title="Attach Rate Development" subtitle="Full quarter (13 weeks) — all LOBs &middot; W9-W13 pending data">
            <AttachDevelopmentChart data={attachDevelopmentData} height={280} />
          </ChartCard>

          {/* Secondary Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Product Mix by LOB (Stream G) */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold">Product Mix by LOB</CardTitle>
                  <p className="text-xs text-muted-foreground">Sub-product breakdown within item group</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex flex-wrap gap-1">
                  {Object.keys(productMixByGroup).map((lob) => (
                    <Button
                      key={lob}
                      variant={productMixLob === lob ? "default" : "outline"}
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                      onClick={() => setProductMixLob(lob)}
                    >
                      {lob}
                    </Button>
                  ))}
                </div>
                <ProductMixChart
                  data={currentMix.data}
                  segments={currentMix.segments}
                  height={160}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentMix.qoqChanges.map((item) => (
                    <div key={item.segment} className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
                      <span className="text-[10px] text-muted-foreground">{item.segment}</span>
                      <span className={cn(
                        "text-[10px] font-semibold",
                        item.change > 0 ? "text-success" : item.change < 0 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}pp
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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

          {/* Stream L (#33): Revenue / Back Margin Split */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Revenue & Back Margin by Item Group</CardTitle>
              <p className="text-xs text-muted-foreground">SI revenue, back margin, and net revenue split per LOB</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground">Item Group</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">SI Revenue</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">YoY</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right border-l border-border">Back Margin</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">YoY</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right border-l border-border">Net Revenue</TableHead>
                      <TableHead className="h-7 text-[9px] font-semibold text-muted-foreground text-right">YoY</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueMarginData.map((row) => (
                      <TableRow key={row.group} className="hover:bg-secondary/50">
                        <TableCell className="py-1.5 text-xs font-medium">{row.group}</TableCell>
                        <TableCell className="py-1.5 text-right text-xs tabular-nums">{formatEur(row.siRevenue)}</TableCell>
                        <TableCell className="py-1.5 text-right"><YoYBadge yoy={row.siRevenueYoy} /></TableCell>
                        <TableCell className="py-1.5 text-right text-xs tabular-nums border-l border-border">{formatEur(row.backMargin)}</TableCell>
                        <TableCell className="py-1.5 text-right"><YoYBadge yoy={row.backMarginYoy} /></TableCell>
                        <TableCell className="py-1.5 text-right text-xs font-medium tabular-nums border-l border-border">{formatEur(row.netRevenue)}</TableCell>
                        <TableCell className="py-1.5 text-right"><YoYBadge yoy={row.netRevenueYoy} /></TableCell>
                      </TableRow>
                    ))}
                    {/* Totals row */}
                    <TableRow className="border-t-2 border-border font-semibold hover:bg-transparent">
                      <TableCell className="py-2 text-xs font-bold">Total</TableCell>
                      <TableCell className="py-2 text-right text-xs font-bold tabular-nums">{formatEur(totalRevMargin.siRevenue)}</TableCell>
                      <TableCell className="py-2 text-right"><YoYBadge yoy={totalRevMargin.siRevenueYoy} /></TableCell>
                      <TableCell className="py-2 text-right text-xs font-bold tabular-nums border-l border-border">{formatEur(totalRevMargin.backMargin)}</TableCell>
                      <TableCell className="py-2 text-right"><YoYBadge yoy={totalRevMargin.backMarginYoy} /></TableCell>
                      <TableCell className="py-2 text-right text-xs font-bold tabular-nums border-l border-border">{formatEur(totalRevMargin.netRevenue)}</TableCell>
                      <TableCell className="py-2 text-right"><YoYBadge yoy={totalRevMargin.netRevenueYoy} /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <ChartCard title="Top Products" subtitle="By sell-out volume QTD">
            <RankingBarChart
              data={topProducts}
              height={200}
              valueFormatter={(v) => v.toLocaleString()}
            />
          </ChartCard>

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
