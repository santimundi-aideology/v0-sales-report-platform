"use client"

import { useState, useCallback } from "react"
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  Eye,
  X,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Upload history
const uploadHistory = [
  {
    id: "1",
    filename: "sell_out_data_w52.xlsx",
    type: "Sell-Out & Stock",
    uploadedBy: "John Doe",
    uploadedAt: "Jan 15, 2025 10:30 AM",
    status: "success",
    records: 2450,
    errors: 0,
    warnings: 12,
  },
  {
    id: "2",
    filename: "partner_forecast_q1.csv",
    type: "Forecast",
    uploadedBy: "Jane Smith",
    uploadedAt: "Jan 14, 2025 3:45 PM",
    status: "success",
    records: 1820,
    errors: 0,
    warnings: 5,
  },
  {
    id: "3",
    filename: "sell_in_jan_2025.xlsx",
    type: "Sell-In",
    uploadedBy: "Mike Johnson",
    uploadedAt: "Jan 13, 2025 9:15 AM",
    status: "warning",
    records: 3200,
    errors: 3,
    warnings: 28,
  },
  {
    id: "4",
    filename: "campaign_budget_q1.xlsx",
    type: "Campaign",
    uploadedBy: "Sarah Wilson",
    uploadedAt: "Jan 12, 2025 2:00 PM",
    status: "error",
    records: 0,
    errors: 15,
    warnings: 0,
  },
  {
    id: "5",
    filename: "stock_levels_dec.csv",
    type: "Sell-Out & Stock",
    uploadedBy: "John Doe",
    uploadedAt: "Jan 10, 2025 11:20 AM",
    status: "success",
    records: 4100,
    errors: 0,
    warnings: 8,
  },
]

// File type configurations
const fileTypes = [
  {
    id: "sell-in",
    name: "Sell-In Data",
    description: "Partner purchase orders and shipments",
    format: "XLSX, CSV",
    template: "sell_in_template.xlsx",
  },
  {
    id: "sell-out",
    name: "Sell-Out & Stock",
    description: "POS sales and inventory levels",
    format: "XLSX, CSV",
    template: "sell_out_stock_template.xlsx",
  },
  {
    id: "forecast",
    name: "Forecast Data",
    description: "Partner forecasts and projections",
    format: "XLSX, CSV",
    template: "forecast_template.xlsx",
  },
  {
    id: "campaign",
    name: "Campaign Data",
    description: "Campaign investments and results",
    format: "XLSX, CSV",
    template: "campaign_template.xlsx",
  },
]

// Sample preview data
const previewData = [
  { partner: "TechCorp Ltd", product: "Product A Pro", sellOut: 2850, stock: 1200, date: "2025-01-15" },
  { partner: "GlobalTech Inc", product: "Product B Max", sellOut: 1920, stock: 850, date: "2025-01-15" },
  { partner: "Innovate Solutions", product: "Product C Elite", sellOut: 1450, stock: 620, date: "2025-01-15" },
  { partner: "NextGen Systems", product: "Product D Basic", sellOut: 980, stock: 420, date: "2025-01-15" },
]

export default function DataUploadsPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Simulate upload
    simulateUpload()
  }, [])

  const simulateUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploadProgress(null)
            setShowPreview(true)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { className: string; icon: React.ReactNode }> = {
      success: {
        className: "bg-success/10 text-success",
        icon: <CheckCircle2 className="h-3 w-3" />,
      },
      warning: {
        className: "bg-warning/10 text-warning",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      error: {
        className: "bg-destructive/10 text-destructive",
        icon: <X className="h-3 w-3" />,
      },
      processing: {
        className: "bg-info/10 text-info",
        icon: <Clock className="h-3 w-3" />,
      },
    }
    const style = styles[status] || styles.processing
    return (
      <Badge className={cn("gap-1 text-[10px]", style.className)}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <DashboardLayout 
      title="Data Uploads" 
      subtitle="Upload and manage data files"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Upload New Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-secondary/30 hover:border-primary/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadProgress !== null ? (
                <div className="w-full max-w-md space-y-4 text-center">
                  <RefreshCw className="mx-auto h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm font-medium text-foreground">Uploading file...</p>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Drag and drop your files here
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or click to browse (XLSX, CSV supported)
                  </p>
                  <Button className="mt-4" onClick={simulateUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Type Templates */}
        <div className="grid gap-4 lg:grid-cols-4">
          {fileTypes.map((type) => (
            <Card key={type.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                    <p className="text-[10px] text-muted-foreground">Format: {type.format}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full gap-2 text-xs">
                  <Download className="h-3 w-3" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload History */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
            <CardTitle className="text-sm font-semibold">Upload History</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-border px-4 pt-3">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="warning">Warnings</TabsTrigger>
                  <TabsTrigger value="error">Errors</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">File</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Uploaded By</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs text-right">Records</TableHead>
                      <TableHead className="text-xs text-right">Errors</TableHead>
                      <TableHead className="text-xs text-right">Warnings</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadHistory.map((upload) => (
                      <TableRow key={upload.id} className="hover:bg-secondary/50">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{upload.filename}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="text-[10px]">
                            {upload.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {upload.uploadedBy}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {upload.uploadedAt}
                        </TableCell>
                        <TableCell className="py-3 text-right text-sm">
                          {upload.records.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className={cn(
                            "text-sm font-medium",
                            upload.errors > 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {upload.errors}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className={cn(
                            "text-sm font-medium",
                            upload.warnings > 0 ? "text-warning" : "text-muted-foreground"
                          )}>
                            {upload.warnings}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          {getStatusBadge(upload.status)}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="success" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">File</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Records</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadHistory
                      .filter((u) => u.status === "success")
                      .map((upload) => (
                        <TableRow key={upload.id} className="hover:bg-secondary/50">
                          <TableCell className="py-3 text-sm">{upload.filename}</TableCell>
                          <TableCell className="py-3">
                            <Badge variant="outline" className="text-[10px]">{upload.type}</Badge>
                          </TableCell>
                          <TableCell className="py-3 text-sm">{upload.records.toLocaleString()}</TableCell>
                          <TableCell className="py-3">{getStatusBadge(upload.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="warning" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">File</TableHead>
                      <TableHead className="text-xs">Warnings</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadHistory
                      .filter((u) => u.status === "warning")
                      .map((upload) => (
                        <TableRow key={upload.id} className="hover:bg-secondary/50">
                          <TableCell className="py-3 text-sm">{upload.filename}</TableCell>
                          <TableCell className="py-3 text-sm text-warning">{upload.warnings}</TableCell>
                          <TableCell className="py-3">{getStatusBadge(upload.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="error" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">File</TableHead>
                      <TableHead className="text-xs">Errors</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadHistory
                      .filter((u) => u.status === "error")
                      .map((upload) => (
                        <TableRow key={upload.id} className="hover:bg-secondary/50">
                          <TableCell className="py-3 text-sm">{upload.filename}</TableCell>
                          <TableCell className="py-3 text-sm text-destructive">{upload.errors}</TableCell>
                          <TableCell className="py-3">{getStatusBadge(upload.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Preview Import Data</DialogTitle>
              <DialogDescription>
                Review the data before importing. 4 records found.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Partner</TableHead>
                    <TableHead className="text-xs">Product</TableHead>
                    <TableHead className="text-xs text-right">Sell-Out</TableHead>
                    <TableHead className="text-xs text-right">Stock</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{row.partner}</TableCell>
                      <TableCell className="text-sm">{row.product}</TableCell>
                      <TableCell className="text-right text-sm">{row.sellOut.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">{row.stock.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm text-success">All records validated successfully</span>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowPreview(false)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
