"use client"

import { addDays, format, parseISO } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock } from "lucide-react"
import type { DateRange } from "react-day-picker"

import dashboardData from "./data.json"

const statusVariant: Record<string, "secondary" | "outline" | "default"> = {
  Confirmed: "secondary",
  Pending: "outline",
  Completed: "default",
  Sent: "secondary",
  "In progress": "secondary",
}

export default function Dashboard() {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: addDays(new Date("2025-07-09"), -30),
    to: new Date("2025-07-09"),
  })
  const [activeTab, setActiveTab] = useState("30d")
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("18:00")

  useEffect(() => {
    if (activeTab === "custom") {
      return
    }

    const end = new Date("2025-07-09")
    const from = addDays(
      end,
      activeTab === "1d"
        ? -1
        : activeTab === "3d"
          ? -3
          : activeTab === "7d"
            ? -7
            : -30
    )

    setSelectedRange({ from, to: end })
  }, [activeTab])

  const rangeLabel = useMemo(() => {
    if (!selectedRange.from || !selectedRange.to) {
      return "Select range"
    }
    return `${format(selectedRange.from, "MMM d")}${
      selectedRange.to ? ` — ${format(selectedRange.to, "MMM d")}` : ""
    }`
  }, [selectedRange])

  const filteredChartData = useMemo(() => {
    const { from, to } = selectedRange
    if (!from || !to) {
      return dashboardData.timeSeries
    }

    return dashboardData.timeSeries.filter((item) => {
      const date = parseISO(item.date)
      return date >= from && date <= to
    })
  }, [selectedRange])

  const filteredEvents = useMemo(() => {
    const { from, to } = selectedRange
    if (!from || !to) {
      return dashboardData.scheduleEvents
    }

    const startDate = parseISO(`${format(from, "yyyy-MM-dd")}T${startTime}:00`)
    const endDate = parseISO(`${format(to, "yyyy-MM-dd")}T${endTime}:00`)

    return dashboardData.scheduleEvents.filter((event) => {
      const eventDate = parseISO(`${event.date}T${event.time}:00`)
      return eventDate >= startDate && eventDate <= endDate
    })
  }, [selectedRange, startTime, endTime])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-muted/50 bg-background/80 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-6" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Overview
              </p>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
          <Card className="rounded-3xl border">
            <CardHeader className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <CardTitle>Lead generation overview</CardTitle>
                <CardDescription>
                  Track all inbound leads by contact and company over time.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="rounded-full bg-muted/80 p-1">
                    <TabsTrigger value="1d">1d</TabsTrigger>
                    <TabsTrigger value="3d">3d</TabsTrigger>
                    <TabsTrigger value="7d">7d</TabsTrigger>
                    <TabsTrigger value="30d">30d</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarDays className="size-4" />
                  {rangeLabel}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {dashboardData.overview.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-3xl border border-muted/60 bg-muted/50 p-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-muted/60 bg-background p-4">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">Time window</p>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData.overview.trend}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr]">
                      <div>
                        <Label htmlFor="start-time">Start time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(event) => setStartTime(event.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(event) => setEndTime(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-[340px] min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={filteredChartData}
                        margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="leadGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--primary)"
                              stopOpacity={0.45}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--primary)"
                              stopOpacity={0.06}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid opacity={0.2} vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          minTickGap={30}
                          tickFormatter={(value) =>
                            format(parseISO(value), "MMM d")
                          }
                        />
                        <Tooltip
                          formatter={(value: any) => [
                            `${value} leads`,
                            "Leads",
                          ]}
                          labelFormatter={(label: any) =>
                            typeof label === "string"
                              ? format(parseISO(label), "MMM d, yyyy")
                              : label
                          }
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary)"
                          strokeWidth={3}
                          fill="url(#leadGradient)"
                          fillOpacity={1}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <Card className="rounded-3xl border border-muted/60 bg-muted/50">
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                      Filter events in the selected date range.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="range"
                      selected={selectedRange}
                      onSelect={setSelectedRange}
                      fixedWeeks
                      required
                    />
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border border-muted/60 bg-muted/50">
                  <CardHeader>
                    <CardTitle>Upcoming schedule</CardTitle>
                    <CardDescription>
                      Events matching the selected date and time range.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {filteredEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No scheduled events in this range.
                      </p>
                    ) : (
                      filteredEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-3xl border border-muted/70 bg-background p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold">{event.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  parseISO(`${event.date}T${event.time}`),
                                  "MMM d, yyyy 'at' HH:mm"
                                )}
                              </p>
                            </div>
                            <Badge
                              variant={
                                statusVariant[event.status] ?? "secondary"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">
                            Owner: {event.owner}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <Card className="rounded-3xl border border-muted/60 bg-muted/50">
              <CardHeader>
                <CardTitle>Most visited contacts</CardTitle>
                <CardDescription>
                  Top leads by recent visit activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Visits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.topContacts.map((contact) => (
                      <TableRow key={contact.company}>
                        <TableCell>{contact.company}</TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-muted/60 bg-muted/50">
              <CardHeader>
                <CardTitle>Least visited contacts</CardTitle>
                <CardDescription>
                  Lower engagement opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Visits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.leastVisitedContacts.map((contact) => (
                      <TableRow key={contact.company}>
                        <TableCell>{contact.company}</TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border border-muted/60 bg-muted/50">
            <CardHeader>
              <CardTitle>Activity timeline</CardTitle>
              <CardDescription>
                Recent tasks and updates sorted by time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.timeline.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-3xl border border-muted/70 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>{item.time}</span>
                    <Badge variant={statusVariant[item.status] ?? "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
