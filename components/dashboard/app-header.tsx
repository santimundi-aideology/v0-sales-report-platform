"use client"

import { useState } from "react"
import { Search, Bell, Calendar, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"

interface AppHeaderProps {
  title: string
  subtitle?: string
}

const datePresets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This Quarter", days: 0 },
  { label: "Year to Date", days: 0 },
]

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const [dateRange, setDateRange] = useState("Last 30 days")
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, partners, regions..."
            className="h-9 w-64 bg-secondary pl-9 text-sm"
          />
        </div>

        {/* Date Range Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{dateRange}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex">
              <div className="border-r border-border p-2">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={dateRange === preset.label ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setDateRange(preset.label)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <div className="p-2">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* AI Assistant Toggle */}
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sparkles className="h-4 w-4 text-primary" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px]">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium">Notifications</span>
              <Badge variant="secondary" className="text-xs">5 new</Badge>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">Low Stock Alert</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  3 products below safety stock in APAC region
                </p>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-sm font-medium">Forecast Deviation</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Partner XYZ sell-out 15% below forecast
                </p>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">AI Recommendation</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  New opportunity identified for Q2 campaign
                </p>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                <span className="text-xs font-medium text-primary">JD</span>
              </div>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-4 py-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@apcom.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
