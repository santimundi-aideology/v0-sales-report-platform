"use client"

import { useState } from "react"
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Settings,
  X,
  ChevronRight,
  TrendingDown,
  Package,
  Target,
  Megaphone,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Alert data
const alerts = [
  {
    id: "1",
    type: "low-stock",
    severity: "critical",
    title: "Critical Stock Alert",
    message: "AirPods Pro 2 stock at Datart.sk depleted to 1.8 WoS. Immediate action required.",
    product: "AirPods Pro 2",
    partner: "Datart.sk",
    region: "Central Europe",
    timestamp: "2 minutes ago",
    status: "new",
  },
  {
    id: "2",
    type: "low-stock",
    severity: "critical",
    title: "Stock Below Safety Threshold",
    message: "4 SKUs across Bosnia & Herzegovina and Montenegro below minimum safety stock levels.",
    product: "Multiple",
    partner: "Various",
    region: "Adriatics",
    timestamp: "15 minutes ago",
    status: "new",
  },
  {
    id: "3",
    type: "forecast-deviation",
    severity: "warning",
    title: "Forecast Deviation Alert",
    message: "eMAG.ro sell-out trending 15% below forecast for the current week.",
    product: "All Products",
    partner: "eMAG.ro",
    region: "Eastern Europe",
    timestamp: "1 hour ago",
    status: "acknowledged",
  },
  {
    id: "4",
    type: "campaign",
    severity: "warning",
    title: "Campaign Underperformance",
    message: "Q2 Summer Sale ROI tracking 20% below target in Kosovo and Albania.",
    product: "Campaign Related",
    partner: "Regional",
    region: "Western Balkans",
    timestamp: "2 hours ago",
    status: "acknowledged",
  },
  {
    id: "5",
    type: "high-stock",
    severity: "info",
    title: "Overstock Warning",
    message: "MacBook Pro M3 at Big Bang showing 8.2 WoS. Consider rebalancing.",
    product: "MacBook Pro M3",
    partner: "Big Bang",
    region: "Adriatics",
    timestamp: "3 hours ago",
    status: "in-progress",
  },
  {
    id: "6",
    type: "forecast-deviation",
    severity: "info",
    title: "Positive Forecast Variance",
    message: "Alza.cz exceeding forecast by 28%. Consider allocation increase.",
    product: "iPhone 16 Pro Max",
    partner: "Alza.cz",
    region: "Central Europe",
    timestamp: "4 hours ago",
    status: "resolved",
  },
]

// Summary stats
const alertStats = [
  { label: "Critical", count: 2, color: "bg-destructive" },
  { label: "Warning", count: 2, color: "bg-warning" },
  { label: "Info", count: 2, color: "bg-info" },
  { label: "Resolved", count: 5, color: "bg-success" },
]

// Alert types
const alertTypes = [
  { value: "all", label: "All Types" },
  { value: "low-stock", label: "Low Stock" },
  { value: "high-stock", label: "High Stock" },
  { value: "forecast-deviation", label: "Forecast Deviation" },
  { value: "campaign", label: "Campaign" },
]

// Notification settings
const notificationSettings = [
  { id: "email-critical", label: "Email for Critical Alerts", enabled: true },
  { id: "email-warning", label: "Email for Warning Alerts", enabled: true },
  { id: "email-info", label: "Email for Info Alerts", enabled: false },
  { id: "slack", label: "Slack Notifications", enabled: true },
  { id: "mobile", label: "Mobile Push Notifications", enabled: false },
]

export default function AlertsCenterPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [alertStatuses, setAlertStatuses] = useState<Record<string, string>>(
    alerts.reduce((acc, alert) => ({ ...acc, [alert.id]: alert.status }), {})
  )

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low-stock":
        return <Package className="h-4 w-4" />
      case "high-stock":
        return <Package className="h-4 w-4" />
      case "forecast-deviation":
        return <TrendingDown className="h-4 w-4" />
      case "campaign":
        return <Megaphone className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" }
      case "warning":
        return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" }
      case "info":
        return { bg: "bg-info/10", text: "text-info", border: "border-info/30" }
      default:
        return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-destructive/10 text-destructive",
      acknowledged: "bg-warning/10 text-warning",
      "in-progress": "bg-info/10 text-info",
      resolved: "bg-success/10 text-success",
    }
    return (
      <Badge className={cn("text-[10px] capitalize", styles[status] || "bg-muted text-muted-foreground")}>
        {status.replace("-", " ")}
      </Badge>
    )
  }

  const updateAlertStatus = (alertId: string, newStatus: string) => {
    setAlertStatuses((prev) => ({ ...prev, [alertId]: newStatus }))
  }

  const filteredAlerts = selectedFilter === "all" 
    ? alerts 
    : alerts.filter(a => a.type === selectedFilter)

  return (
    <DashboardLayout 
      title="Alerts Center" 
      subtitle="Monitor and manage system alerts"
    >
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            {alertStats.map((stat) => (
              <Card key={stat.label} className="border-border">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", stat.color + "/10")}>
                    <span className={cn("text-xl font-bold", stat.color.replace("bg-", "text-"))}>
                      {stat.count}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">alerts</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert List */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Active Alerts</CardTitle>
                <Badge variant="secondary">{filteredAlerts.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="h-8 w-40">
                    <Filter className="mr-2 h-3 w-3" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alertTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border">
                  {filteredAlerts.map((alert) => {
                    const styles = getSeverityStyles(alert.severity)
                    const currentStatus = alertStatuses[alert.id]
                    return (
                      <div
                        key={alert.id}
                        className={cn(
                          "p-4 transition-colors hover:bg-secondary/50",
                          currentStatus === "new" && "bg-secondary/30"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", styles.bg)}>
                            <span className={styles.text}>{getAlertIcon(alert.type)}</span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                                <Badge variant="outline" className={cn("text-[10px]", styles.text)}>
                                  {alert.severity}
                                </Badge>
                                {getStatusBadge(currentStatus)}
                              </div>
                              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <div className="flex items-center gap-4 pt-2">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-[10px]">{alert.product}</Badge>
                                <Badge variant="outline" className="text-[10px]">{alert.partner}</Badge>
                                <Badge variant="outline" className="text-[10px]">{alert.region}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              {currentStatus !== "resolved" && (
                                <>
                                  {currentStatus === "new" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => updateAlertStatus(alert.id, "acknowledged")}
                                    >
                                      Acknowledge
                                    </Button>
                                  )}
                                  {currentStatus === "acknowledged" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => updateAlertStatus(alert.id, "in-progress")}
                                    >
                                      Start Working
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => updateAlertStatus(alert.id, "resolved")}
                                  >
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Resolve
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary">
                                View Details
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="w-80 space-y-4">
          {/* Notification Settings */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center gap-2 pb-3">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <Label htmlFor={setting.id} className="text-xs text-muted-foreground">
                    {setting.label}
                  </Label>
                  <Switch id={setting.id} defaultChecked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alert Timeline */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 min ago", action: "New critical alert created", type: "new" },
                  { time: "15 min ago", action: "Alert #3 acknowledged by Admin", type: "acknowledged" },
                  { time: "1 hour ago", action: "Alert #5 marked in-progress", type: "in-progress" },
                  { time: "2 hours ago", action: "Alert #6 resolved", type: "resolved" },
                  { time: "4 hours ago", action: "Settings updated", type: "system" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          item.type === "new" && "bg-destructive",
                          item.type === "acknowledged" && "bg-warning",
                          item.type === "in-progress" && "bg-info",
                          item.type === "resolved" && "bg-success",
                          item.type === "system" && "bg-muted-foreground"
                        )}
                      />
                      {index < 4 && <div className="h-8 w-px bg-border" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-foreground">{item.action}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Views */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Saved Views</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Critical Alerts", count: 2 },
                { name: "My Assigned", count: 3 },
                { name: "Central Europe", count: 4 },
                { name: "Stock Alerts", count: 5 },
              ].map((view) => (
                <Button
                  key={view.name}
                  variant="ghost"
                  className="w-full justify-between h-8 text-xs"
                >
                  {view.name}
                  <Badge variant="secondary" className="text-[10px]">
                    {view.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
