"use client"

import React, { useState } from "react"
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
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { QuarterProgress } from "@/components/dashboard/quarter-progress"
import {
  ChartCard,
  RevenueTrendChart,
  PerformanceBarChart,
  MultiLineChart,
  RankingBarChart,
} from "@/components/dashboard/charts"
import { DataTable, euroFormat, percentFormat, changeIndicator, yoyStatusBadge } from "@/components/dashboard/data-table"
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

// ── KPI data ──
const kpiData = [
  {
    title: "Total Revenue",
    value: "€24.8M",
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

// ── Revenue trend ──
const revenueTrendData = [
  { period: "Q1 FY24", revenue: 18500000, target: 19000000 },
  { period: "Q2 FY24", revenue: 21200000, target: 20500000 },
  { period: "Q3 FY24", revenue: 19800000, target: 21000000 },
  { period: "Q4 FY24", revenue: 23500000, target: 22000000 },
  { period: "Q1 FY25", revenue: 22800000, target: 23000000 },
  { period: "Q2 FY25", revenue: 24800000, target: 24000000 },
]

// ── Regional performance ──
const regionalPerformance = [
  { name: "Czech Republic", actual: 18200, forecast: 17000 },
  { name: "Slovakia", actual: 12500, forecast: 13000 },
  { name: "Hungary", actual: 15800, forecast: 14500 },
  { name: "Romania", actual: 11200, forecast: 12000 },
  { name: "Bulgaria", actual: 6800, forecast: 7500 },
  { name: "Croatia", actual: 8400, forecast: 8000 },
  { name: "Serbia", actual: 7900, forecast: 7600 },
  { name: "Slovenia", actual: 5200, forecast: 5000 },
  { name: "Bosnia & Herz.", actual: 4300, forecast: 4100 },
  { name: "Montenegro", actual: 2100, forecast: 1950 },
  { name: "Kosovo", actual: 2600, forecast: 2400 },
  { name: "Albania", actual: 3100, forecast: 2850 },
]

// ── Sell-out trend ──
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

// ── Top partners ──
const topPartners = [
  { name: "Alza.cz", value: 4850000, change: 15.2 },
  { name: "Euronics HU", value: 3420000, change: 8.7 },
  { name: "Datart.sk", value: 2780000, change: -3.2 },
  { name: "eMAG.ro", value: 2190000, change: 22.1 },
  { name: "Sancta Domenica", value: 1820000, change: 5.4 },
]

// ── Critical alerts ──
const criticalAlerts = [
  {
    type: "Low Stock",
    message: "4 SKUs across Bosnia & Herzegovina and Montenegro below safety threshold",
    severity: "critical" as const,
    time: "2 min ago",
  },
  {
    type: "Forecast Deviation",
    message: "Datart.sk -15% vs forecast this week",
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

// ── Stream H (#3, #10): SI/SO Toggle on Executive Summary Table ──
// DONE: Implemented as a single table with a toggle button to switch between Sell-In and Sell-Out views.
// ASSUMPTION (was open question): Chose toggle button approach over two separate tables — cleaner UX, saves space.
// ASSUMPTION: SO view removes "Total SI Rev" column (annotation #10 says "remove revenue" and "remove first column").
//   SO view shows SO qty per LOB instead of SI qty, keeps EUR (as SO revenue), keeps YoY.
// ASSUMPTION: "Projected sell out" gap is calculated vs last year (same basis as 3-tier status from #9).
//   Coloring uses the same 3-tier logic: Green >=0%, Orange >-10%, Red <=-30%.
// ASSUMPTION: SO data mirrors SI data structure with separate SO-specific mock values.

// ── Partner Performance Table Data (Stream C + H) ──
interface PartnerRow {
  partner: string
  totalSiRevEur: number
  totalSiRevYoy: number
  iphone: { siQty: number; soQty: number; eur: number; soEur: number; yoy: number; soYoy: number }
  mac: { siQty: number; soQty: number; eur: number; soEur: number; yoy: number; soYoy: number }
  ipad: { siQty: number; soQty: number; eur: number; soEur: number; yoy: number; soYoy: number }
  aw: { siQty: number; soQty: number; eur: number; soEur: number; yoy: number; soYoy: number }
  airpods: { siQty: number; soQty: number; eur: number; soEur: number; yoy: number; soYoy: number }
  acc: { siQty: number; soQty: number; eur: number; soEur: number; yoy: number; soYoy: number }
  projectedSiTotal: number
  projectedSiYoy: number
  projectedSoTotal: number
  projectedSoYoy: number
}

const partnerTableData: PartnerRow[] = [
  {
    partner: "Alza.cz",
    totalSiRevEur: 4850000, totalSiRevYoy: 15.2,
    iphone:  { siQty: 8520, soQty: 7850, eur: 2450000, soEur: 2280000, yoy: 18.4, soYoy: 16.2 },
    mac:     { siQty: 2180, soQty: 1980, eur: 1250000, soEur: 1140000, yoy: 8.2, soYoy: 6.8 },
    ipad:    { siQty: 3240, soQty: 3020, eur: 580000, soEur: 542000, yoy: 22.1, soYoy: 19.5 },
    aw:      { siQty: 1850, soQty: 1720, eur: 185000, soEur: 172000, yoy: -2.4, soYoy: -3.8 },
    airpods: { siQty: 2420, soQty: 2280, eur: 210000, soEur: 198000, yoy: 14.8, soYoy: 12.5 },
    acc:     { siQty: 4200, soQty: 3900, eur: 175000, soEur: 162000, yoy: 5.1, soYoy: 4.2 },
    projectedSiTotal: 5420000, projectedSiYoy: 12.8, projectedSoTotal: 5080000, projectedSoYoy: 10.4,
  },
  {
    partner: "Euronics HU",
    totalSiRevEur: 3420000, totalSiRevYoy: 8.7,
    iphone:  { siQty: 6280, soQty: 5920, eur: 1820000, soEur: 1720000, yoy: 12.1, soYoy: 10.5 },
    mac:     { siQty: 1580, soQty: 1420, eur: 880000, soEur: 798000, yoy: 5.4, soYoy: 3.8 },
    ipad:    { siQty: 2100, soQty: 1950, eur: 380000, soEur: 354000, yoy: 15.8, soYoy: 13.2 },
    aw:      { siQty: 1120, soQty: 1040, eur: 112000, soEur: 104000, yoy: -8.2, soYoy: -9.5 },
    airpods: { siQty: 1680, soQty: 1580, eur: 148000, soEur: 139000, yoy: 10.2, soYoy: 8.8 },
    acc:     { siQty: 2800, soQty: 2620, eur: 82000, soEur: 77000, yoy: 3.5, soYoy: 2.8 },
    projectedSiTotal: 3810000, projectedSiYoy: 6.2, projectedSoTotal: 3580000, projectedSoYoy: 4.8,
  },
  {
    partner: "Datart.sk",
    totalSiRevEur: 2780000, totalSiRevYoy: -3.2,
    iphone:  { siQty: 4850, soQty: 4520, eur: 1420000, soEur: 1320000, yoy: -5.8, soYoy: -7.2 },
    mac:     { siQty: 980, soQty: 880, eur: 520000, soEur: 468000, yoy: 2.1, soYoy: 0.5 },
    ipad:    { siQty: 1680, soQty: 1520, eur: 310000, soEur: 280000, yoy: -8.4, soYoy: -10.1 },
    aw:      { siQty: 820, soQty: 740, eur: 82000, soEur: 74000, yoy: -15.2, soYoy: -16.8 },
    airpods: { siQty: 1240, soQty: 1150, eur: 108000, soEur: 100000, yoy: 4.5, soYoy: 2.8 },
    acc:     { siQty: 3500, soQty: 3280, eur: 338000, soEur: 318000, yoy: -1.2, soYoy: -2.5 },
    projectedSiTotal: 2620000, projectedSiYoy: -12.4, projectedSoTotal: 2380000, projectedSoYoy: -15.8,
  },
  {
    partner: "eMAG.ro",
    totalSiRevEur: 2190000, totalSiRevYoy: 22.1,
    iphone:  { siQty: 3850, soQty: 3620, eur: 1080000, soEur: 1020000, yoy: 28.4, soYoy: 25.2 },
    mac:     { siQty: 720, soQty: 650, eur: 380000, soEur: 345000, yoy: 12.5, soYoy: 10.8 },
    ipad:    { siQty: 1250, soQty: 1180, eur: 228000, soEur: 215000, yoy: 18.2, soYoy: 16.5 },
    aw:      { siQty: 680, soQty: 620, eur: 68000, soEur: 62000, yoy: 5.8, soYoy: 4.2 },
    airpods: { siQty: 980, soQty: 920, eur: 86000, soEur: 81000, yoy: 25.4, soYoy: 22.8 },
    acc:     { siQty: 2100, soQty: 1950, eur: 348000, soEur: 324000, yoy: 8.2, soYoy: 6.5 },
    projectedSiTotal: 2580000, projectedSiYoy: 18.5, projectedSoTotal: 2420000, projectedSoYoy: 15.2,
  },
  {
    partner: "Sancta Domenica",
    totalSiRevEur: 1820000, totalSiRevYoy: 5.4,
    iphone:  { siQty: 2850, soQty: 2680, eur: 820000, soEur: 772000, yoy: 8.2, soYoy: 6.5 },
    mac:     { siQty: 580, soQty: 520, eur: 310000, soEur: 278000, yoy: 3.1, soYoy: 1.8 },
    ipad:    { siQty: 920, soQty: 850, eur: 168000, soEur: 155000, yoy: 12.4, soYoy: 10.2 },
    aw:      { siQty: 450, soQty: 410, eur: 45000, soEur: 41000, yoy: -4.8, soYoy: -6.2 },
    airpods: { siQty: 680, soQty: 640, eur: 59000, soEur: 56000, yoy: 8.5, soYoy: 7.1 },
    acc:     { siQty: 1800, soQty: 1680, eur: 418000, soEur: 392000, yoy: 1.2, soYoy: 0.5 },
    projectedSiTotal: 1950000, projectedSiYoy: 4.2, projectedSoTotal: 1840000, projectedSoYoy: 3.1,
  },
  {
    partner: "Tehnomanija",
    totalSiRevEur: 1450000, totalSiRevYoy: -8.5,
    iphone:  { siQty: 2200, soQty: 2020, eur: 640000, soEur: 588000, yoy: -12.4, soYoy: -14.2 },
    mac:     { siQty: 380, soQty: 340, eur: 198000, soEur: 178000, yoy: -5.2, soYoy: -6.8 },
    ipad:    { siQty: 680, soQty: 610, eur: 124000, soEur: 112000, yoy: -2.8, soYoy: -4.5 },
    aw:      { siQty: 320, soQty: 280, eur: 32000, soEur: 28000, yoy: -18.5, soYoy: -20.2 },
    airpods: { siQty: 520, soQty: 470, eur: 46000, soEur: 42000, yoy: -8.2, soYoy: -10.5 },
    acc:     { siQty: 1500, soQty: 1380, eur: 410000, soEur: 380000, yoy: -3.5, soYoy: -5.2 },
    projectedSiTotal: 1280000, projectedSiYoy: -32.1, projectedSoTotal: 1150000, projectedSoYoy: -35.4,
  },
]

// ── Region Performance Table Data ──
const regionTableData: PartnerRow[] = [
  {
    partner: "Czech Republic",
    totalSiRevEur: 6280000, totalSiRevYoy: 12.4,
    iphone:  { siQty: 11200, soQty: 10400, eur: 3250000, soEur: 3020000, yoy: 14.8, soYoy: 12.5 },
    mac:     { siQty: 2950, soQty: 2680, eur: 1680000, soEur: 1520000, yoy: 7.1, soYoy: 5.8 },
    ipad:    { siQty: 4120, soQty: 3850, eur: 740000, soEur: 692000, yoy: 19.2, soYoy: 16.8 },
    aw:      { siQty: 2450, soQty: 2280, eur: 245000, soEur: 228000, yoy: -1.2, soYoy: -2.8 },
    airpods: { siQty: 3100, soQty: 2920, eur: 268000, soEur: 252000, yoy: 12.5, soYoy: 10.8 },
    acc:     { siQty: 5400, soQty: 5020, eur: 225000, soEur: 209000, yoy: 4.8, soYoy: 3.5 },
    projectedSiTotal: 7020000, projectedSiYoy: 10.5, projectedSoTotal: 6580000, projectedSoYoy: 8.2,
  },
  {
    partner: "Hungary",
    totalSiRevEur: 4150000, totalSiRevYoy: 9.8,
    iphone:  { siQty: 7800, soQty: 7280, eur: 2260000, soEur: 2110000, yoy: 13.2, soYoy: 11.4 },
    mac:     { siQty: 1920, soQty: 1740, eur: 1070000, soEur: 972000, yoy: 6.1, soYoy: 4.5 },
    ipad:    { siQty: 2580, soQty: 2380, eur: 465000, soEur: 429000, yoy: 14.5, soYoy: 12.2 },
    aw:      { siQty: 1380, soQty: 1260, eur: 138000, soEur: 126000, yoy: -6.5, soYoy: -8.1 },
    airpods: { siQty: 2050, soQty: 1920, eur: 180000, soEur: 169000, yoy: 11.3, soYoy: 9.5 },
    acc:     { siQty: 3400, soQty: 3150, eur: 100000, soEur: 93000, yoy: 3.2, soYoy: 2.1 },
    projectedSiTotal: 4620000, projectedSiYoy: 7.8, projectedSoTotal: 4320000, projectedSoYoy: 5.5,
  },
  {
    partner: "Slovakia",
    totalSiRevEur: 3420000, totalSiRevYoy: -1.8,
    iphone:  { siQty: 5980, soQty: 5520, eur: 1750000, soEur: 1615000, yoy: -3.5, soYoy: -5.2 },
    mac:     { siQty: 1200, soQty: 1080, eur: 640000, soEur: 576000, yoy: 1.8, soYoy: 0.2 },
    ipad:    { siQty: 2060, soQty: 1880, eur: 380000, soEur: 346000, yoy: -6.2, soYoy: -8.5 },
    aw:      { siQty: 1010, soQty: 920, eur: 101000, soEur: 92000, yoy: -12.8, soYoy: -14.5 },
    airpods: { siQty: 1520, soQty: 1420, eur: 132000, soEur: 124000, yoy: 3.8, soYoy: 2.1 },
    acc:     { siQty: 4280, soQty: 3980, eur: 415000, soEur: 386000, yoy: -0.5, soYoy: -1.8 },
    projectedSiTotal: 3180000, projectedSiYoy: -8.2, projectedSoTotal: 2920000, projectedSoYoy: -11.5,
  },
  {
    partner: "Romania",
    totalSiRevEur: 2850000, totalSiRevYoy: 18.5,
    iphone:  { siQty: 5020, soQty: 4720, eur: 1410000, soEur: 1328000, yoy: 24.2, soYoy: 21.5 },
    mac:     { siQty: 940, soQty: 860, eur: 495000, soEur: 454000, yoy: 10.8, soYoy: 8.5 },
    ipad:    { siQty: 1630, soQty: 1520, eur: 298000, soEur: 278000, yoy: 15.4, soYoy: 13.1 },
    aw:      { siQty: 880, soQty: 810, eur: 88000, soEur: 81000, yoy: 4.2, soYoy: 2.5 },
    airpods: { siQty: 1280, soQty: 1200, eur: 112000, soEur: 105000, yoy: 22.1, soYoy: 19.8 },
    acc:     { siQty: 2740, soQty: 2540, eur: 452000, soEur: 420000, yoy: 7.5, soYoy: 5.8 },
    projectedSiTotal: 3350000, projectedSiYoy: 15.2, projectedSoTotal: 3140000, projectedSoYoy: 12.8,
  },
  {
    partner: "Croatia",
    totalSiRevEur: 2180000, totalSiRevYoy: 6.2,
    iphone:  { siQty: 3450, soQty: 3220, eur: 990000, soEur: 924000, yoy: 9.4, soYoy: 7.8 },
    mac:     { siQty: 700, soQty: 640, eur: 375000, soEur: 342000, yoy: 3.8, soYoy: 2.2 },
    ipad:    { siQty: 1110, soQty: 1020, eur: 202000, soEur: 186000, yoy: 11.8, soYoy: 9.5 },
    aw:      { siQty: 540, soQty: 490, eur: 54000, soEur: 49000, yoy: -3.5, soYoy: -5.2 },
    airpods: { siQty: 820, soQty: 770, eur: 71000, soEur: 67000, yoy: 7.9, soYoy: 6.2 },
    acc:     { siQty: 2160, soQty: 2010, eur: 502000, soEur: 468000, yoy: 1.8, soYoy: 0.5 },
    projectedSiTotal: 2340000, projectedSiYoy: 4.8, projectedSoTotal: 2180000, projectedSoYoy: 3.2,
  },
  {
    partner: "Serbia",
    totalSiRevEur: 1820000, totalSiRevYoy: -5.2,
    iphone:  { siQty: 2780, soQty: 2540, eur: 810000, soEur: 740000, yoy: -8.8, soYoy: -10.5 },
    mac:     { siQty: 480, soQty: 430, eur: 250000, soEur: 224000, yoy: -3.5, soYoy: -5.2 },
    ipad:    { siQty: 860, soQty: 780, eur: 157000, soEur: 142000, yoy: -1.2, soYoy: -3.5 },
    aw:      { siQty: 400, soQty: 360, eur: 40000, soEur: 36000, yoy: -15.8, soYoy: -17.5 },
    airpods: { siQty: 650, soQty: 590, eur: 58000, soEur: 53000, yoy: -6.4, soYoy: -8.2 },
    acc:     { siQty: 1880, soQty: 1740, eur: 515000, soEur: 478000, yoy: -2.8, soYoy: -4.5 },
    projectedSiTotal: 1620000, projectedSiYoy: -18.5, projectedSoTotal: 1480000, projectedSoYoy: -21.2,
  },
  {
    partner: "Bulgaria",
    totalSiRevEur: 980000, totalSiRevYoy: -9.3,
    iphone:  { siQty: 1520, soQty: 1380, eur: 440000, soEur: 400000, yoy: -12.1, soYoy: -14.5 },
    mac:     { siQty: 260, soQty: 230, eur: 135000, soEur: 120000, yoy: -5.8, soYoy: -7.5 },
    ipad:    { siQty: 450, soQty: 400, eur: 82000, soEur: 73000, yoy: -4.5, soYoy: -6.8 },
    aw:      { siQty: 210, soQty: 185, eur: 21000, soEur: 18500, yoy: -20.2, soYoy: -22.5 },
    airpods: { siQty: 340, soQty: 305, eur: 30000, soEur: 27000, yoy: -8.8, soYoy: -10.5 },
    acc:     { siQty: 980, soQty: 900, eur: 278000, soEur: 256000, yoy: -4.2, soYoy: -5.8 },
    projectedSiTotal: 850000, projectedSiYoy: -25.4, projectedSoTotal: 760000, projectedSoYoy: -28.8,
  },
]

function YoYIndicator({ yoy }: { yoy: number }) {
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

function formatEur(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `€${(value / 1_000).toFixed(0)}K`
  return `€${value.toLocaleString()}`
}

const lobColumns = [
  { key: "iphone" as const, label: "iPhone" },
  { key: "mac" as const, label: "Mac" },
  { key: "ipad" as const, label: "iPad" },
  { key: "aw" as const, label: "AW" },
  { key: "airpods" as const, label: "AirPods" },
  { key: "acc" as const, label: "Acc" },
] as const

type LobKey = "iphone" | "mac" | "ipad" | "aw" | "airpods" | "acc"

// ── Stream H (#3, #10): Performance table with SI/SO toggle ──
function PerformanceTable({ data, labelHeader, title }: { data: PartnerRow[]; labelHeader: string; title: string }) {
  const [view, setView] = useState<"si" | "so">("si")
  const isSI = view === "si"

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-4 py-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          <Button
            variant={isSI ? "default" : "ghost"}
            size="sm"
            className="h-6 px-3 text-[10px]"
            onClick={() => setView("si")}
          >
            Sell-In
          </Button>
          <Button
            variant={!isSI ? "default" : "ghost"}
            size="sm"
            className="h-6 px-3 text-[10px]"
            onClick={() => setView("so")}
          >
            Sell-Out
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {/* Row 1: group labels. rowSpan removed to avoid SSR/client hydration mismatch. */}
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="h-6 text-[10px] font-semibold text-muted-foreground" />
                {isSI && (
                  <TableHead colSpan={2} className="h-6 text-center text-[9px] font-semibold text-muted-foreground uppercase tracking-wider border-l border-border">
                    Total SI Rev
                  </TableHead>
                )}
                {lobColumns.map((col) => (
                  <TableHead key={col.key} colSpan={3} className="h-6 text-center text-[9px] font-semibold text-muted-foreground uppercase tracking-wider border-l border-border">
                    {col.label}
                  </TableHead>
                ))}
                <TableHead colSpan={2} className="h-6 text-center text-[9px] font-semibold text-muted-foreground uppercase tracking-wider border-l border-border">
                  {isSI ? "Projected SI" : "Projected SO"}
                </TableHead>
                <TableHead className="h-6 border-l border-border" />
              </TableRow>
              {/* Row 2: sub-column labels */}
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-7 text-[10px] font-semibold text-muted-foreground align-bottom">
                  {labelHeader}
                </TableHead>
                {isSI && (
                  <>
                    <TableHead className="h-7 text-[9px] text-muted-foreground text-right border-l border-border">EUR</TableHead>
                    <TableHead className="h-7 text-[9px] text-muted-foreground text-right">YoY</TableHead>
                  </>
                )}
                {lobColumns.map((col) => (
                  <React.Fragment key={`${col.key}-sub`}>
                    <TableHead className="h-7 text-[9px] text-muted-foreground text-right border-l border-border">Qty</TableHead>
                    <TableHead className="h-7 text-[9px] text-muted-foreground text-right">EUR</TableHead>
                    <TableHead className="h-7 text-[9px] text-muted-foreground text-right">YoY</TableHead>
                  </React.Fragment>
                ))}
                <TableHead className="h-7 text-[9px] text-muted-foreground text-right border-l border-border">EUR</TableHead>
                <TableHead className="h-7 text-[9px] text-muted-foreground text-right">YoY</TableHead>
                <TableHead className="h-7 text-center text-[10px] font-semibold text-muted-foreground border-l border-border">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => {
                const projEur = isSI ? row.projectedSiTotal : row.projectedSoTotal
                const projYoy = isSI ? row.projectedSiYoy : row.projectedSoYoy
                return (
                  <TableRow key={row.partner} className="hover:bg-secondary/50">
                    <TableCell className="py-2 text-xs font-medium text-foreground whitespace-nowrap">
                      {row.partner}
                    </TableCell>
                    {isSI && (
                      <>
                        <TableCell className="py-2 text-right text-xs tabular-nums border-l border-border">
                          {formatEur(row.totalSiRevEur)}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <YoYIndicator yoy={row.totalSiRevYoy} />
                        </TableCell>
                      </>
                    )}
                    {lobColumns.map((col) => {
                      const d = row[col.key as LobKey]
                      const qty = isSI ? d.siQty : d.soQty
                      const eur = isSI ? d.eur : d.soEur
                      const yoy = isSI ? d.yoy : d.soYoy
                      return (
                        <React.Fragment key={col.key}>
                          <TableCell className="py-2 text-right text-[11px] tabular-nums border-l border-border">
                            {qty.toLocaleString()}
                          </TableCell>
                          <TableCell className="py-2 text-right text-[11px] tabular-nums">
                            {formatEur(eur)}
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <YoYIndicator yoy={yoy} />
                          </TableCell>
                        </React.Fragment>
                      )
                    })}
                    <TableCell className="py-2 text-right text-xs font-medium tabular-nums border-l border-border">
                      {formatEur(projEur)}
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <YoYIndicator yoy={projYoy} />
                    </TableCell>
                    <TableCell className="py-2 text-center border-l border-border">
                      {yoyStatusBadge(projYoy)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

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
          {/* Filter Bar + Quarter Progress (Stream E) */}
          <div className="space-y-3">
            <FilterBar />
            <QuarterProgress />
          </div>

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
                <strong>Q2 FY25 is tracking 4% above plan</strong> with strong performance in Czech Republic (+7.1% vs forecast),
                Hungary (+9.0%), and Serbia (+3.9%) offsetting softness in Slovakia (-3.8%) and Bulgaria (-9.3%). Three key opportunities identified:
                (1) Alza.cz showing exceptional momentum with 18.4% above-LY iPhone sell-in, (2) Albania and Kosovo scaling ahead of plan on iPad and accessories,
                and (3) AirPods attach rate improved to 43.3%, the highest in 4 quarters.
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
            <ChartCard title="Regional Performance" subtitle="Actual vs Forecast by market">
              <PerformanceBarChart data={regionalPerformance} height={280} />
            </ChartCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
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
            <ChartCard title="Top Partners" subtitle="By revenue contribution">
              <RankingBarChart
                data={topPartners}
                height={240}
                valueFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`}
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

          {/* Partner Performance Table (Stream C + D) */}
          <div>
            <Tabs defaultValue="partners" className="space-y-4">
              <TabsList>
                <TabsTrigger value="partners">By Partner</TabsTrigger>
                <TabsTrigger value="regions">By Region</TabsTrigger>
              </TabsList>
              <TabsContent value="partners">
                <PerformanceTable
                  data={partnerTableData}
                  labelHeader="Partner"
                  title="Partner Performance Summary"
                />
              </TabsContent>
              <TabsContent value="regions">
                <PerformanceTable
                  data={regionTableData}
                  labelHeader="Region"
                  title="Regional Performance Summary"
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
