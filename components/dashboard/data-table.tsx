"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  MoreHorizontal,
  Search,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Column {
  id: string
  header: string
  accessor: string
  sortable?: boolean
  align?: "left" | "center" | "right"
  format?: (value: unknown) => React.ReactNode
}

interface DataTableProps {
  title?: string
  columns: Column[]
  data: Record<string, unknown>[]
  searchable?: boolean
  exportable?: boolean
  pageSize?: number
}

export function DataTable({
  title,
  columns,
  data,
  searchable = true,
  exportable = true,
  pageSize = 10,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  // Filter data based on search
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    }
    return sortDirection === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const getSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="ml-1 h-3 w-3" />
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    )
  }

  return (
    <Card className="border-border">
      {(title || searchable || exportable) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-4 py-3">
          {title && <CardTitle className="text-sm font-semibold">{title}</CardTitle>}
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-48 pl-8 text-sm"
                />
              </div>
            )}
            {exportable && (
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "h-10 text-xs font-medium text-muted-foreground",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.sortable && "cursor-pointer select-none"
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && getSortIcon(column.id)}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-secondary/50">
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        "py-3 text-sm",
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center"
                      )}
                    >
                      {column.format
                        ? column.format(row[column.accessor])
                        : String(row[column.accessor] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Drill Down</DropdownMenuItem>
                        <DropdownMenuItem>Export Row</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length} entries
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2 text-xs"
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-7 w-7 p-0 text-xs"
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Status badge formatter helper
export function statusBadge(value: unknown) {
  const status = String(value).toLowerCase()
  const variants: Record<string, { className: string; label: string }> = {
    healthy: { className: "bg-success/10 text-success", label: "Healthy" },
    ok: { className: "bg-success/10 text-success", label: "OK" },
    warning: { className: "bg-warning/10 text-warning", label: "Warning" },
    low: { className: "bg-warning/10 text-warning", label: "Low" },
    critical: { className: "bg-destructive/10 text-destructive", label: "Critical" },
    high: { className: "bg-destructive/10 text-destructive", label: "High" },
  }
  const variant = variants[status] || { className: "bg-muted text-muted-foreground", label: status }
  return (
    <Badge className={cn("text-[10px] font-medium", variant.className)}>
      {variant.label}
    </Badge>
  )
}

// Currency formatter helper
export function currencyFormat(value: unknown) {
  const num = Number(value)
  if (isNaN(num)) return value
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Percentage formatter helper
export function percentFormat(value: unknown) {
  const num = Number(value)
  if (isNaN(num)) return value
  return `${num.toFixed(1)}%`
}

// Number formatter helper
export function numberFormat(value: unknown) {
  const num = Number(value)
  if (isNaN(num)) return value
  return new Intl.NumberFormat("en-US").format(num)
}

// Change indicator helper
export function changeIndicator(value: unknown) {
  const num = Number(value)
  if (isNaN(num)) return value
  const isPositive = num >= 0
  return (
    <span className={cn("font-medium", isPositive ? "text-success" : "text-destructive")}>
      {isPositive ? "+" : ""}{num.toFixed(1)}%
    </span>
  )
}
