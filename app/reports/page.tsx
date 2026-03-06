"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Search,
  Plus,
  MoreHorizontal,
  FileSpreadsheet,
  FileBarChart,
  Filter,
  Star,
  Trash2,
  Edit,
  Copy,
  Share2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"

const savedReports = [
  {
    id: 1,
    name: "Weekly Sales Summary",
    description: "Aggregated sales data by region and product category",
    type: "sales",
    format: "Excel",
    createdBy: "John Smith",
    createdAt: "2024-01-15",
    lastRun: "2024-01-20",
    schedule: "Weekly",
    starred: true,
  },
  {
    id: 2,
    name: "Monthly Forecast Accuracy",
    description: "Comparison of forecasted vs actual sales performance",
    type: "forecast",
    format: "PDF",
    createdBy: "Sarah Johnson",
    createdAt: "2024-01-10",
    lastRun: "2024-01-19",
    schedule: "Monthly",
    starred: false,
  },
  {
    id: 3,
    name: "Inventory Health Report",
    description: "DOH analysis and stock level recommendations",
    type: "inventory",
    format: "Excel",
    createdBy: "Mike Chen",
    createdAt: "2024-01-08",
    lastRun: "2024-01-20",
    schedule: "Daily",
    starred: true,
  },
  {
    id: 4,
    name: "Campaign Performance Q1",
    description: "ROI analysis for all active marketing campaigns",
    type: "campaign",
    format: "PowerPoint",
    createdBy: "Emily Davis",
    createdAt: "2024-01-05",
    lastRun: "2024-01-18",
    schedule: "On-demand",
    starred: false,
  },
  {
    id: 5,
    name: "Customer Segment Analysis",
    description: "Sales breakdown by customer segments and buying patterns",
    type: "sales",
    format: "PDF",
    createdBy: "John Smith",
    createdAt: "2024-01-01",
    lastRun: "2024-01-17",
    schedule: "Quarterly",
    starred: false,
  },
  {
    id: 6,
    name: "SKU Performance Matrix",
    description: "Product-level performance metrics with recommendations",
    type: "inventory",
    format: "Excel",
    createdBy: "Sarah Johnson",
    createdAt: "2023-12-20",
    lastRun: "2024-01-20",
    schedule: "Weekly",
    starred: true,
  },
]

const reportTemplates = [
  {
    id: 1,
    name: "Sales Performance",
    description: "Standard sales metrics and trends",
    icon: FileBarChart,
    fields: ["Date Range", "Region", "Product Category", "Sales Rep"],
  },
  {
    id: 2,
    name: "Forecast Comparison",
    description: "Actual vs forecasted performance",
    icon: FileSpreadsheet,
    fields: ["Date Range", "Forecast Model", "Confidence Level"],
  },
  {
    id: 3,
    name: "Inventory Status",
    description: "Stock levels and health metrics",
    icon: FileText,
    fields: ["Date Range", "Warehouse", "Product Category", "DOH Threshold"],
  },
  {
    id: 4,
    name: "Campaign Analysis",
    description: "Marketing campaign effectiveness",
    icon: FileBarChart,
    fields: ["Date Range", "Campaign Type", "Channel"],
  },
]

function getTypeColor(type: string) {
  switch (type) {
    case "sales":
      return "bg-primary/20 text-primary"
    case "forecast":
      return "bg-info/20 text-info"
    case "inventory":
      return "bg-warning/20 text-warning"
    case "campaign":
      return "bg-chart-4/20 text-chart-4"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getFormatIcon(format: string) {
  switch (format) {
    case "Excel":
      return <FileSpreadsheet className="h-4 w-4 text-success" />
    case "PDF":
      return <FileText className="h-4 w-4 text-destructive" />
    case "PowerPoint":
      return <FileBarChart className="h-4 w-4 text-warning" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)

  const filteredReports = savedReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Create, schedule, and manage your analytics reports
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Choose a template to get started with your new report
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-secondary/50 ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <template.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium text-foreground">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedTemplate && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium text-foreground">Report Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input id="report-name" placeholder="Enter report name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select defaultValue="excel">
                        <SelectTrigger id="format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pptx">PowerPoint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule</Label>
                      <Select defaultValue="ondemand">
                        <SelectTrigger id="schedule">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ondemand">On-demand</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipients">Email Recipients</Label>
                      <Input id="recipients" placeholder="email@company.com" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="save-template" />
                    <Label htmlFor="save-template" className="text-sm font-normal">
                      Save as template for future use
                    </Label>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!selectedTemplate}>Create Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Templates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer transition-colors hover:bg-secondary/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <template.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Saved Reports */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Your saved and scheduled reports</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="forecast">Forecast</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <button className="text-muted-foreground hover:text-warning transition-colors">
                        <Star className={`h-4 w-4 ${report.starred ? "fill-warning text-warning" : ""}`} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{report.name}</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getTypeColor(report.type)}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(report.format)}
                        <span className="text-sm">{report.format}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {report.schedule}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {report.lastRun}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{report.createdBy}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Report Activity</CardTitle>
            <CardDescription>Latest report generations and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Generated", report: "Weekly Sales Summary", user: "John Smith", time: "2 hours ago" },
                { action: "Downloaded", report: "Inventory Health Report", user: "Mike Chen", time: "4 hours ago" },
                { action: "Scheduled", report: "Monthly Forecast Accuracy", user: "Sarah Johnson", time: "Yesterday" },
                { action: "Edited", report: "Campaign Performance Q1", user: "Emily Davis", time: "2 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}{" "}
                        <span className="font-medium">{activity.report}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
