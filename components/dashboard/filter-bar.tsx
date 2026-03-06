"use client"

import { useState } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  id: string
  label: string
  options: FilterOption[]
  multiple?: boolean
}

const defaultFilters: FilterConfig[] = [
  {
    id: "region",
    label: "Region",
    options: [
      { value: "all", label: "All Regions" },
      { value: "apac", label: "APAC" },
      { value: "emea", label: "EMEA" },
      { value: "americas", label: "Americas" },
    ],
  },
  {
    id: "country",
    label: "Country",
    options: [
      { value: "all", label: "All Countries" },
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "de", label: "Germany" },
      { value: "jp", label: "Japan" },
      { value: "sg", label: "Singapore" },
      { value: "au", label: "Australia" },
    ],
  },
  {
    id: "rtm",
    label: "RTM",
    options: [
      { value: "all", label: "All RTM" },
      { value: "direct", label: "Direct" },
      { value: "indirect", label: "Indirect" },
      { value: "hybrid", label: "Hybrid" },
    ],
  },
  {
    id: "partner",
    label: "Partner",
    options: [
      { value: "all", label: "All Partners" },
      { value: "partner-a", label: "TechCorp Ltd" },
      { value: "partner-b", label: "GlobalTech Inc" },
      { value: "partner-c", label: "Innovate Solutions" },
      { value: "partner-d", label: "NextGen Systems" },
    ],
  },
  {
    id: "lob",
    label: "LOB",
    options: [
      { value: "all", label: "All LOB" },
      { value: "consumer", label: "Consumer" },
      { value: "commercial", label: "Commercial" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
  {
    id: "period",
    label: "Period",
    options: [
      { value: "qtd", label: "QTD" },
      { value: "ytd", label: "YTD" },
      { value: "4w", label: "Last 4 Weeks" },
      { value: "mtd", label: "MTD" },
    ],
  },
]

interface FilterBarProps {
  filters?: FilterConfig[]
  onFilterChange?: (filters: Record<string, string | string[]>) => void
}

export function FilterBar({ filters = defaultFilters, onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  const handleFilterChange = (filterId: string, value: string) => {
    const newFilters = { ...activeFilters }
    if (value === "all" || value === "") {
      delete newFilters[filterId]
    } else {
      newFilters[filterId] = value
    }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters({})
    onFilterChange?.({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filters</span>
      </div>

      {/* Primary filters (always visible) */}
      {filters.slice(0, 4).map((filter) => (
        <Select
          key={filter.id}
          value={activeFilters[filter.id] || "all"}
          onValueChange={(value) => handleFilterChange(filter.id, value)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-sm">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {/* More filters popover */}
      {filters.length > 4 && (
        <Popover open={showMoreFilters} onOpenChange={setShowMoreFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              More
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              {filters.slice(4).map((filter) => (
                <div key={filter.id} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {filter.label}
                  </label>
                  <Select
                    value={activeFilters[filter.id] || "all"}
                    onValueChange={(value) => handleFilterChange(filter.id, value)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Active filter count and clear */}
      {activeFilterCount > 0 && (
        <>
          <Badge variant="secondary" className="h-6">
            {activeFilterCount} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        </>
      )}
    </div>
  )
}
