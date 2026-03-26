"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  TrendingUp,
  LineChart,
  Megaphone,
  Sparkles,
  AlertCircle,
  Upload,
  FileText,
  Shield,
  Settings,
  ChevronRight,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  {
    title: "OVERVIEW",
    items: [
      {
        title: "Executive Summary",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        title: "Sales Dashboard",
        url: "/sales",
        icon: TrendingUp,
      },
      {
        title: "Forecast Dashboard",
        url: "/forecast",
        icon: LineChart,
      },
      {
        title: "Campaign Dashboard",
        url: "/campaigns",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "AI & INSIGHTS",
    items: [
      {
        title: "Opportunity Agent",
        url: "/opportunities",
        icon: Sparkles,
        badge: "AI",
      },
      {
        title: "Alerts Center",
        url: "/alerts",
        icon: AlertCircle,
        badge: "12",
        badgeVariant: "destructive" as const,
      },
    ],
  },
  {
    title: "DATA MANAGEMENT",
    items: [
      {
        title: "Data Uploads",
        url: "/uploads",
        icon: Upload,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        title: "Access Control",
        url: "/admin",
        icon: Shield,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2A7DE1]">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">APCOM</span>
            <span className="text-xs text-muted-foreground">Sales & Forecast</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-2 text-[10px] font-medium tracking-wider text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent"
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant === "destructive" ? "destructive" : "secondary"}
                              className="ml-auto h-5 px-1.5 text-[10px]"
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {isActive && (
                            <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <span className="text-xs font-medium text-primary">JD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-foreground">John Doe</span>
            <span className="text-[10px] text-muted-foreground">Organization Admin</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
