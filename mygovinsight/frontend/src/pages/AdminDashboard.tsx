/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  MessageSquare,
  BarChart3,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { DashboardApi } from "@/lib/api"
import { auth } from "@/lib/auth"

// Mock data (fallbacks)
const citizensData = [
  {
    id: 1,
    name: "Samantha",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Verified",
    rating: 4.8,
    submissions: 12,
    progress: 85,
  },
  {
    id: 2,
    name: "Anonymous",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Pending",
    rating: 3.2,
    submissions: 8,
    progress: 57,
  },
  {
    id: 3,
    name: "Perlman",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Verified",
    rating: 4.6,
    submissions: 15,
    progress: 92,
  },
  {
    id: 4,
    name: "Gingerbread",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Unverified",
    rating: 0,
    submissions: 0,
    progress: 0,
  },
  {
    id: 5,
    name: "Pineapple",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Verified",
    rating: 4.2,
    submissions: 6,
    progress: 78,
  },
  {
    id: 6,
    name: "Blueberries",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Pending",
    rating: 3.8,
    submissions: 4,
    progress: 65,
  },
]

const feedbackData = [
  {
    id: 1,
    citizen: "Samantha",
    avatar: "/placeholder.svg?height=32&width=32",
    sector: "Transport",
    rating: 4,
    ticket: "System 1",
  },
  {
    id: 2,
    citizen: "Anonymous",
    avatar: "/placeholder.svg?height=32&width=32",
    sector: "Medicine",
    rating: 3,
    ticket: "System 1",
  },
  {
    id: 3,
    citizen: "Perlman",
    avatar: "/placeholder.svg?height=32&width=32",
    sector: "Transport",
    rating: 5,
    ticket: "System 1",
  },
  {
    id: 4,
    citizen: "Gingerbread",
    avatar: "/placeholder.svg?height=32&width=32",
    sector: "Healthcare",
    rating: 0,
    ticket: "System 1",
  },
  {
    id: 5,
    citizen: "Pineapple",
    avatar: "/placeholder.svg?height=32&width=32",
    sector: "Transport",
    rating: 3,
    ticket: "System 1",
  },
  {
    id: 6,
    citizen: "Blueberries",
    avatar: "/placeholder.svg?height=32&width=32",
    sector: "Transport",
    rating: 4,
    ticket: "System 1",
  },
]

const chartData = [
  { name: "Sun", value: 80 },
  { name: "Mon", value: 95 },
  { name: "Tue", value: 75 },
  { name: "Wed", value: 100 },
  { name: "Thu", value: 85 },
  { name: "Fri", value: 90 },
  { name: "Sat", value: 95 },
]

const pieData = [
  { name: "Total Order", value: 81, color: "#ef4444" },
  { name: "Customer Growth", value: 22, color: "#10b981" },
  { name: "Total Revenue", value: 62, color: "#3b82f6" },
]

const revenueData = [
  { month: "Jan", 2020: 230, 2021: 280 },
  { month: "Feb", 2020: 180, 2021: 220 },
  { month: "Mar", 2020: 290, 2021: 180 },
  { month: "Apr", 2020: 220, 2021: 340 },
  { month: "May", 2020: 180, 2021: 280 },
  { month: "Jun", 2020: 160, 2021: 190 },
  { month: "Jul", 2020: 200, 2021: 240 },
  { month: "Aug", 2020: 240, 2021: 300 },
  { month: "Sep", 2020: 180, 2021: 220 },
  { month: "Oct", 2020: 160, 2021: 280 },
  { month: "Nov", 2020: 200, 2021: 240 },
  { month: "Dec", 2020: 220, 2021: 180 },
]

const weeklyOrderData = [
  { day: "Sunday", orders: 450 },
  { day: "Monday", orders: 520 },
  { day: "Tuesday", orders: 480 },
  { day: "Wednesday", orders: 600 },
  { day: "Thursday", orders: 580 },
  { day: "Friday", orders: 650 },
  { day: "Saturday", orders: 720 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Citizens")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<any | null>(null)
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();

  useEffect(() => {
    let mounted = true
    async function fetchDashboard() {
      try {
        setLoading(true)
        setError(null)
        const token = auth.getToken()
        if (!token) {
          throw new Error("You need to be logged in as admin to view the dashboard.")
        }
        const data = await DashboardApi.get(token)
        if (mounted) setDashboard(data)
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load dashboard")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchDashboard()
    return () => {
      mounted = false
    }
  }, [])

  // Derived data from dashboard with fallbacks
  const citizensList = useMemo(() => {
    if (!dashboard?.citizenStats) return citizensData
    return dashboard.citizenStats.map((c: any, idx: number) => ({
      id: idx + 1,
      name: c.name || c.email || "Anonymous",
      avatar: "/placeholder.svg?height=32&width=32",
      status: c.verified ? "Verified" : "Unverified",
      rating: Math.round((c.avgRating || 0) * 10) / 10,
      submissions: c.submissions || 0,
      progress: Math.min(100, Math.round((c.progress || 0))),
    }))
  }, [dashboard])

  const recentFeedbackList = useMemo(() => {
    if (!dashboard?.recentFeedback) return feedbackData
    return dashboard.recentFeedback.map((f: any, idx: number) => ({
      id: idx + 1,
      citizen: f.citizenName || "Anonymous",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: f.sector || "--",
      rating: f.rating || 0,
      ticket: f.ticket || f._id || "-",
    }))
  }, [dashboard])

  const weeklyChart = useMemo(() => {
    if (!dashboard?.weeklyCounts) return chartData
    return (dashboard.weeklyCounts || []).map((d: any) => ({ name: d.day, value: d.count }))
  }, [dashboard])
  // Simple, hook-free bar chart using divs
  const SimpleBarChart = ({ data, xKey, yKey, height = 300 }: { data: any[]; xKey: string; yKey: string; height?: number }) => {
    const maxVal = Math.max(...data.map((d) => d[yKey] as number)) || 1
    return (
      <div className="w-full" style={{ height }}>
        <div className="flex items-end h-full gap-3">
          {data.map((d, i) => {
            const value = (d as any)[yKey] as number
            const pct = Math.round((value / maxVal) * 100)
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-600 rounded-t" style={{ height: `${pct}%` }} />
                <span className="mt-2 text-xs text-gray-600">{(d as any)[xKey]}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Simple, hook-free line chart using SVG (minimal aesthetics)
  const SimpleLineChart = ({ data, xKey, yKey, height = 200 }: { data: any[]; xKey: string; yKey: string; height?: number }) => {
    const width = 600
    const padding = 24
    const values = data.map((d) => d[yKey] as number)
    const maxY = Math.max(...values) || 1
    const minY = Math.min(...values) || 0
    const rangeY = Math.max(maxY - minY, 1)
    const stepX = (width - padding * 2) / Math.max(data.length - 1, 1)

    const points = data
      .map((d, i) => {
        const x = padding + i * stepX
        const y = padding + (1 - (d[yKey] - minY) / rangeY) * (height - padding * 2)
        return `${x},${y}`
      })
      .join(" ")

    return (
      <div className="w-full overflow-x-auto">
        <svg width={width} height={height} className="text-blue-600">
          <polyline fill="none" stroke="currentColor" strokeWidth={3} points={points} />
        </svg>
      </div>
    )
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {change}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const TabButton = ({ label, isActive, onClick }: any) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      onClick={onClick}
      className={`transition-all duration-300 ${
        isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {label}
    </Button>
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const renderCitizensView = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Active Citizens</h3>
          <p className="text-sm text-gray-600">Manage and view citizen profiles</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Citizens
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">CITIZEN PROFILES</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Artist</span>
                  <span>Status</span>
                  <span>Ratings</span>
                  <span>Feedback submissions</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {citizensData.map((citizen, index) => (
                  <div
                    key={citizen.id}
                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={citizen.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{citizen.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{citizen.name}</span>
                    </div>

                    <Badge
                      variant={
                        citizen.status === "Verified"
                          ? "default"
                          : citizen.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className={`${
                        citizen.status === "Verified"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : citizen.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {citizen.status}
                    </Badge>

                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">{citizen.rating > 0 ? citizen.rating : "--"}</span>
                      {citizen.rating > 0 && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${citizen.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{citizen.submissions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Citizen Map</CardTitle>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} xKey="name" yKey="value" height={300} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderFeedbackView = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Feedback Submissions</h3>
          <p className="text-sm text-gray-600">Review and manage citizen feedback</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all-sectors">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-sectors">All Sectors</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-institutions">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-institutions">All Institutions</SelectItem>
              <SelectItem value="ministry">Ministry</SelectItem>
              <SelectItem value="department">Department</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">Apply Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">FEEDBACK SUBMISSIONS</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Citizen</span>
                  <span>Sector</span>
                  <span>Ratings</span>
                  <span>Ticket</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {feedbackData.map((feedback, index) => (
                  <div
                    key={feedback.id}
                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={feedback.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{feedback.citizen[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{feedback.citizen}</span>
                    </div>

                    <Badge
                      variant="secondary"
                      className={`${
                        feedback.sector === "Transport"
                          ? "bg-green-100 text-green-800"
                          : feedback.sector === "Medicine"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {feedback.sector}
                    </Badge>

                    <div className="flex items-center space-x-1">{renderStars(feedback.rating)}</div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{feedback.ticket}</span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Fire", rating: 4.8, reviews: "2.1k reviews" },
                { name: "Education", rating: 4.6, reviews: "1.8k reviews" },
                { name: "Transport", rating: 4.4, reviews: "3.2k reviews" },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{service.rating}</div>
                    <div className="text-xs text-gray-500">{service.reviews}</div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View all</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Feedback's</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Policies", rating: 4.9, reviews: "2.1k reviews" },
                { name: "Archives", rating: 4.7, reviews: "1.8k reviews" },
                { name: "Citizen", rating: 4.5, reviews: "3.2k reviews" },
              ].map((feedback, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="font-medium">{feedback.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{feedback.rating}</div>
                    <div className="text-xs text-gray-500">{feedback.reviews}</div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View all projects</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsView = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pie Chart</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Chart
                  </Button>
                  <Button variant="outline" size="sm">
                    Show Value
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {pieData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={item.color}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${item.value * 2.51} 251`}
                          className="transition-all duration-1000 ease-out"
                          style={{ animationDelay: `${index * 200}ms` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{item.value}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chart Order</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={weeklyOrderData} xKey="day" yKey="orders" height={200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Total Revenue</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm">2020</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm">2021</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueData.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-2 text-xs text-gray-600">{row.month}</div>
                    <div className="col-span-5">
                      <div className="h-2 bg-blue-200 rounded">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{ width: `${(row["2020"] / 340) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="col-span-5">
                      <div className="h-2 bg-red-200 rounded">
                        <div
                          className="h-2 bg-red-500 rounded"
                          style={{ width: `${(row["2021"] / 340) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Citizen Map</CardTitle>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} xKey="name" yKey="value" height={400} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              GovInsight <span className="text-blue-600">Pro</span>
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search Feedback" className="pl-10 w-64 bg-gray-50 border-gray-200" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading && (
          <div className="mb-4 text-sm text-gray-600">Loading dashboard...</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Hi, Samantha. Welcome back to Sedap Admin!</p>
          </div>
          <div className="flex items-center space-x-2">
            <TabButton label="Citizens" isActive={activeTab === "Citizens"} onClick={() => setActiveTab("Citizens")} />
            <TabButton
              label="Feedback Management"
              isActive={activeTab === "Feedback Management"}
              onClick={() => setActiveTab("Feedback Management")}
            />
            <TabButton
              label="Analytics"
              isActive={activeTab === "Analytics"}
              onClick={() => setActiveTab("Analytics")}
            />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Feedback"
            value={`${dashboard?.totals?.feedbackCount ?? 845}`}
            change="+12.5% (30d)"
            trend="up"
            icon={MessageSquare}
            color="bg-blue-500"
          />
          <MetricCard
            title="Pending Review"
            value={`--`}
            change="+5.2% (30d)"
            trend="up"
            icon={Clock}
            color="bg-orange-500"
          />
          <MetricCard
            title="Avg Response Time"
            value="2 days"
            change="+2.1% (30d)"
            trend="up"
            icon={BarChart3}
            color="bg-green-500"
          />
          <MetricCard
            title="Average Rating"
            value={`${dashboard?.totals?.averageRating ? (Math.round(dashboard.totals.averageRating * 10) / 10) : 3.5}/5`}
            change="-1.2% (30d)"
            trend="down"
            icon={Star}
            color="bg-purple-500"
          />
        </div>

        {/* Dynamic Content */}
        {activeTab === "Citizens" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Citizens</h3>
                <p className="text-sm text-gray-600">Manage and view citizen profiles</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Citizens
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600">CITIZEN PROFILES</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Artist</span>
                        <span>Status</span>
                        <span>Ratings</span>
                        <span>Feedback submissions</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {citizensList.map((citizen: any, index: number) => (
                        <div
                          key={citizen.id}
                          className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={citizen.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{citizen.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{citizen.name}</span>
                          </div>

                          <Badge
                            variant={
                              citizen.status === "Verified"
                                ? "default"
                                : citizen.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={`${
                              citizen.status === "Verified"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : citizen.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {citizen.status}
                          </Badge>

                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">{citizen.rating > 0 ? citizen.rating : "--"}</span>
                            {citizen.rating > 0 && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${citizen.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{citizen.submissions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Citizen Map</CardTitle>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart data={weeklyChart} xKey="name" yKey="value" height={300} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Feedback Management" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Feedback Submissions</h3>
                <p className="text-sm text-gray-600">Review and manage citizen feedback</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all-sectors">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-sectors">All Sectors</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-institutions">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-institutions">All Institutions</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-blue-600 hover:bg-blue-700">Apply Filter</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600">FEEDBACK SUBMISSIONS</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Citizen</span>
                        <span>Sector</span>
                        <span>Ratings</span>
                        <span>Ticket</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {recentFeedbackList.map((feedback: any, index: number) => (
                        <div
                          key={feedback.id}
                          className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={feedback.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{feedback.citizen[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{feedback.citizen}</span>
                          </div>

                          <Badge
                            variant="secondary"
                            className={`${
                              feedback.sector === "Transport"
                                ? "bg-green-100 text-green-800"
                                : feedback.sector === "Medicine"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {feedback.sector}
                          </Badge>

                          <div className="flex items-center space-x-1">{renderStars(feedback.rating)}</div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{feedback.ticket}</span>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Fire", rating: 4.8, reviews: "2.1k reviews" },
                      { name: "Education", rating: 4.6, reviews: "1.8k reviews" },
                      { name: "Transport", rating: 4.4, reviews: "3.2k reviews" },
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{service.rating}</div>
                          <div className="text-xs text-gray-500">{service.reviews}</div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View all</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Feedback's</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Policies", rating: 4.9, reviews: "2.1k reviews" },
                      { name: "Archives", rating: 4.7, reviews: "1.8k reviews" },
                      { name: "Citizen", rating: 4.5, reviews: "3.2k reviews" },
                    ].map((feedback, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                          <span className="font-medium">{feedback.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{feedback.rating}</div>
                          <div className="text-xs text-gray-500">{feedback.reviews}</div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View all projects</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Analytics" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Pie Chart</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Chart
                        </Button>
                        <Button variant="outline" size="sm">
                          Show Value
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      {pieData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-2">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke={item.color}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${item.value * 2.51} 251`}
                                className="transition-all duration-1000 ease-out"
                                style={{ animationDelay: `${index * 200}ms` }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold">{item.value}%</span>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Chart Order</CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Save Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SimpleLineChart data={weeklyOrderData} xKey="day" yKey="orders" height={200} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Total Revenue</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-sm">2020</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-sm">2021</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {revenueData.map((row, i) => (
                        <div key={i} className="grid grid-cols-12 items-center gap-3">
                          <div className="col-span-2 text-xs text-gray-600">{row.month}</div>
                          <div className="col-span-5">
                            <div className="h-2 bg-blue-200 rounded">
                              <div
                                className="h-2 bg-blue-500 rounded"
                                style={{ width: `${(row["2020"] / 340) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="col-span-5">
                            <div className="h-2 bg-red-200 rounded">
                              <div
                                className="h-2 bg-red-500 rounded"
                                style={{ width: `${(row["2021"] / 340) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Citizen Map</CardTitle>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart data={weeklyChart} xKey="name" yKey="value" height={400} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Previous page</span>
            {[1, 2, 3, 4, 5, 6, 7].map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? "bg-blue-600" : ""}
              >
                {page}
              </Button>
            ))}
            <span className="text-sm text-gray-600">Next page</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">10</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">Go</Button>
          </div>
          <div className="text-sm text-gray-600">
            {date}/
            {month}
             / {year}
          </div>
        </div>
      </div>
    </div>
  )
}
