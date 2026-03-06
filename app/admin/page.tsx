"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  Shield, 
  Database, 
  Bell, 
  Key,
  Settings,
  Plus,
  MoreHorizontal,
  Check,
  X,
  RefreshCw,
  History,
  Trash2,
  Edit,
  Mail
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

const users = [
  { id: 1, name: "John Smith", email: "john.smith@apcom.com", role: "Admin", status: "Active", lastActive: "2 mins ago" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@apcom.com", role: "Manager", status: "Active", lastActive: "1 hour ago" },
  { id: 3, name: "Mike Chen", email: "mike.chen@apcom.com", role: "Analyst", status: "Active", lastActive: "3 hours ago" },
  { id: 4, name: "Emily Davis", email: "emily.d@apcom.com", role: "Viewer", status: "Active", lastActive: "Yesterday" },
  { id: 5, name: "Robert Wilson", email: "r.wilson@apcom.com", role: "Manager", status: "Inactive", lastActive: "1 week ago" },
]

const dataSources = [
  { id: 1, name: "SAP ERP", type: "ERP System", status: "Connected", lastSync: "5 mins ago", records: "1.2M" },
  { id: 2, name: "Salesforce", type: "CRM", status: "Connected", lastSync: "15 mins ago", records: "450K" },
  { id: 3, name: "Google Analytics", type: "Analytics", status: "Connected", lastSync: "1 hour ago", records: "2.8M" },
  { id: 4, name: "PostgreSQL DB", type: "Database", status: "Warning", lastSync: "6 hours ago", records: "890K" },
  { id: 5, name: "Shopify", type: "E-commerce", status: "Disconnected", lastSync: "2 days ago", records: "120K" },
]

const auditLogs = [
  { action: "User login", user: "John Smith", ip: "192.168.1.100", timestamp: "2024-01-20 14:32:15" },
  { action: "Report exported", user: "Sarah Johnson", ip: "192.168.1.105", timestamp: "2024-01-20 14:28:00" },
  { action: "Data uploaded", user: "Mike Chen", ip: "192.168.1.110", timestamp: "2024-01-20 14:15:22" },
  { action: "Settings changed", user: "John Smith", ip: "192.168.1.100", timestamp: "2024-01-20 13:45:00" },
  { action: "User created", user: "John Smith", ip: "192.168.1.100", timestamp: "2024-01-20 11:30:00" },
]

function getRoleColor(role: string) {
  switch (role) {
    case "Admin":
      return "bg-destructive/20 text-destructive"
    case "Manager":
      return "bg-primary/20 text-primary"
    case "Analyst":
      return "bg-info/20 text-info"
    case "Viewer":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Connected":
    case "Active":
      return "bg-success/20 text-success"
    case "Warning":
      return "bg-warning/20 text-warning"
    case "Disconnected":
    case "Inactive":
      return "bg-destructive/20 text-destructive"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function AdminPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Administration</h1>
          <p className="text-sm text-muted-foreground">
            Manage users, data sources, and system settings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-success/10 p-3">
                <Database className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Data Sources</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-info/10 p-3">
                <History className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">1,247</p>
                <p className="text-sm text-muted-foreground">Audit Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-warning/10 p-3">
                <Bell className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="datasources" className="gap-2">
              <Database className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an invitation to join the APCOM platform
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="user@company.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select defaultValue="viewer">
                            <SelectTrigger id="role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Access Permissions</Label>
                          <div className="space-y-2">
                            {["Executive Summary", "Sales Dashboard", "Forecast Dashboard", "Campaign Dashboard", "Reports"].map((perm) => (
                              <div key={perm} className="flex items-center gap-2">
                                <Switch id={perm} defaultChecked />
                                <Label htmlFor={perm} className="font-normal">{perm}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gap-2">
                          <Mail className="h-4 w-4" />
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary text-foreground text-xs">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                        </TableCell>
                        <TableCell>
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
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="datasources" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Data Source Connections</CardTitle>
                    <CardDescription>Manage your integrated data sources</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Source
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-secondary p-2">
                              <Database className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-foreground">{source.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{source.type}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(source.status)}>
                            {source.status === "Connected" && <Check className="mr-1 h-3 w-3" />}
                            {source.status === "Disconnected" && <X className="mr-1 h-3 w-3" />}
                            {source.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{source.lastSync}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{source.records}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="mr-2 h-4 w-4" />
                                  Sync History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Disconnect
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
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Recent security events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span className="font-medium text-foreground">{log.action}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{log.user}</span>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm text-muted-foreground">{log.ip}</code>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Enhance account security with 2FA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Enforce 2FA for all users</p>
                      <p className="text-sm text-muted-foreground">Require two-factor authentication</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Allow SMS-based 2FA</p>
                      <p className="text-sm text-muted-foreground">Enable SMS verification codes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Allow authenticator apps</p>
                      <p className="text-sm text-muted-foreground">Support TOTP-based authentication</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Management</CardTitle>
                  <CardDescription>Configure user session settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
                    <Input id="max-sessions" type="number" defaultValue="3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Remember device</p>
                      <p className="text-sm text-muted-foreground">Skip 2FA on trusted devices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="APCOM Industries" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (Euro)</SelectItem>
                        <SelectItem value="gbp">GBP (Pound)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                    <Select defaultValue="january">
                      <SelectTrigger id="fiscal-year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">In-app Notifications</p>
                      <p className="text-sm text-muted-foreground">Show alerts in the dashboard</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Slack Integration</p>
                      <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Receive weekly summary emails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Configuration</CardTitle>
                  <CardDescription>Configure AI agent behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Enable AI Insights</p>
                      <p className="text-sm text-muted-foreground">Show AI recommendations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Auto-generate alerts</p>
                      <p className="text-sm text-muted-foreground">Let AI detect anomalies</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confidence">Minimum Confidence Threshold</Label>
                    <Select defaultValue="70">
                      <SelectTrigger id="confidence">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Retention</CardTitle>
                  <CardDescription>Configure data storage policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="retention-raw">Raw Data Retention</Label>
                    <Select defaultValue="12">
                      <SelectTrigger id="retention-raw">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention-aggregated">Aggregated Data Retention</Label>
                    <Select defaultValue="36">
                      <SelectTrigger id="retention-aggregated">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention-audit">Audit Log Retention</Label>
                    <Select defaultValue="24">
                      <SelectTrigger id="retention-audit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="84">7 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
