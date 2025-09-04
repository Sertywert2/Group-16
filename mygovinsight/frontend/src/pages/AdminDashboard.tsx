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
  Globe,
} from "lucide-react"
import { DashboardApi, FeedbackApi, AuthApi } from "@/lib/api"
import { auth } from "@/lib/auth"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { t, language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState("Citizens")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<any | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  // Feedback Management state
  const [feedback, setFeedback] = useState<any[]>([])
  const [fbPage, setFbPage] = useState(1)
  const [fbPages, setFbPages] = useState(1)
  const [fbTotal, setFbTotal] = useState(0)
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [statusFilter] = useState<string>("all") // placeholder (no status in schema yet)
  const [search, setSearch] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null)
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

  // Fetch feedback list (public endpoint for now)
  useEffect(() => {
    let mounted = true
    async function loadFeedback() {
      try {
        const res: any = await FeedbackApi.list(fbPage, 10)
        if (!mounted) return
        const items = (res?.feedback || []) as any[]
        // Apply simple client-side filters/search until backend supports
        const filtered = items.filter((f) => {
          const matchesSector = sectorFilter === "all" || (f.sector || "").toLowerCase() === sectorFilter
          const s = search.trim().toLowerCase()
          const matchesSearch = !s || (f.comment || "").toLowerCase().includes(s) || (f?.user?.name || f?.user?.email || "").toLowerCase().includes(s)
          return matchesSector && matchesSearch
        })
        setFeedback(filtered)
        setFbPage(res?.page || 1)
        setFbPages(res?.pages || 1)
        setFbTotal(res?.total || filtered.length)
      } catch (e: any) {
        setFeedback([])
        setFbPage(1)
        setFbPages(1)
        setFbTotal(0)
      }
    }
    loadFeedback()
    return () => {
      mounted = false
    }
  }, [fbPage, sectorFilter, search])

  // Current user (decoded from JWT)
  const currentUser = useMemo(() => {
    const token = auth.getToken()
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')?.[1] || ''))
      return payload || null
    } catch {
      return null
    }
  }, [])

  async function handleLogout() {
    try {
      setSigningOut(true)
      try { await AuthApi.logout() } catch {}
    } finally {
      auth.clear()
      navigate('/login')
    }
  }

  // Mock data with fallbacks for better demonstration
  const citizensList = useMemo(() => {
    if (dashboard?.citizens && dashboard.citizens.length > 0) {
      return (dashboard.citizens as any[]).map((c: any, idx: number) => ({
        id: c.id || idx + 1,
        name: c.name || c.email || "Anonymous",
        avatar: "/placeholder.svg?height=32&width=32",
        status: c.status || (c.isVerified ? "Verified" : "Unverified"),
        rating: typeof c.rating === 'number' ? c.rating : Math.round((c.avgRating || 0) * 10) / 10,
        submissions: c.submissions || 0,
        progress: Math.min(100, Math.round(c.progress ?? (c.submissions || 0) * 10)),
      }))
    }
    // Fallback dummy data for demonstration
    return [
      { id: 1, name: "Abebe Kebede", avatar: "/placeholder.svg", status: "Verified", rating: 4.5, submissions: 12, progress: 85 },
      { id: 2, name: "Tigist Haile", avatar: "/placeholder.svg", status: "Verified", rating: 4.8, submissions: 8, progress: 70 },
      { id: 3, name: "Dawit Tekle", avatar: "/placeholder.svg", status: "Pending", rating: 4.2, submissions: 5, progress: 45 },
      { id: 4, name: "Meron Tadesse", avatar: "/placeholder.svg", status: "Verified", rating: 4.7, submissions: 15, progress: 95 },
      { id: 5, name: "Yonas Girma", avatar: "/placeholder.svg", status: "Unverified", rating: 3.9, submissions: 3, progress: 25 },
    ]
  }, [dashboard])

  const recentFeedbackList = useMemo(() => {
    if (dashboard?.feedback && dashboard.feedback.length > 0) {
      return (dashboard.feedback as any[]).map((f: any, idx: number) => ({
        id: f.id || f._id || idx + 1,
        citizen: f.citizen || f.citizenName || "Anonymous",
        avatar: "/placeholder.svg?height=32&width=32",
        sector: f.sector || "General",
        rating: f.rating || 0,
        ticket: f.ticket || (typeof f._id === 'string' ? f._id.slice(-6) : "-"),
      }))
    }
    // Fallback dummy feedback data
    return [
      { id: 1, citizen: "Abebe Kebede", avatar: "/placeholder.svg", sector: "Healthcare", rating: 4, ticket: "HLT001", comment: "Excellent service at the health center", date: new Date().toISOString() },
      { id: 2, citizen: "Tigist Haile", avatar: "/placeholder.svg", sector: "Education", rating: 5, ticket: "EDU002", comment: "Great improvement in school facilities", date: new Date().toISOString() },
      { id: 3, citizen: "Dawit Tekle", avatar: "/placeholder.svg", sector: "Transport", rating: 3, ticket: "TRP003", comment: "Road conditions need improvement", date: new Date().toISOString() },
      { id: 4, citizen: "Meron Tadesse", avatar: "/placeholder.svg", sector: "Healthcare", rating: 5, ticket: "HLT004", comment: "Quick response from medical staff", date: new Date().toISOString() },
      { id: 5, citizen: "Yonas Girma", avatar: "/placeholder.svg", sector: "Municipal", rating: 4, ticket: "MUN005", comment: "Efficient permit processing", date: new Date().toISOString() },
    ]
  }, [dashboard])

  const weeklyChart = useMemo(() => {
    if (dashboard?.weeklyOrderData && dashboard.weeklyOrderData.length > 0) {
      return (dashboard.weeklyOrderData as any[]).map((d: any) => ({ name: d.day, value: d.orders }))
    }
    // Fallback weekly feedback data
    return [
      { name: "Mon", value: 45 },
      { name: "Tue", value: 52 },
      { name: "Wed", value: 38 },
      { name: "Thu", value: 61 },
      { name: "Fri", value: 55 },
      { name: "Sat", value: 28 },
      { name: "Sun", value: 33 },
    ]
  }, [dashboard])

  const weeklyOrdersForLine = useMemo(() => {
    if (dashboard?.weeklyOrderData && dashboard.weeklyOrderData.length > 0) {
      return (dashboard.weeklyOrderData as any[]).map((d: any) => ({ day: d.day, orders: d.orders }))
    }
    // Fallback line chart data
    return [
      { day: "Mon", orders: 45 },
      { day: "Tue", orders: 52 },
      { day: "Wed", orders: 38 },
      { day: "Thu", orders: 61 },
      { day: "Fri", orders: 55 },
      { day: "Sat", orders: 28 },
      { day: "Sun", orders: 33 },
    ]
  }, [dashboard])
  // Mock analytics data
  const pieData = useMemo(() => {
    if (dashboard?.pieData && dashboard.pieData.length > 0) {
      return dashboard.pieData
    }
    return [
      { name: "Healthcare", value: 35, color: "#ef4444" },
      { name: "Education", value: 28, color: "#3b82f6" },
      { name: "Transport", value: 22, color: "#10b981" },
      { name: "Municipal", value: 15, color: "#f59e0b" },
    ]
  }, [dashboard])

  const revenueData = useMemo(() => {
    if (dashboard?.revenueData && dashboard.revenueData.length > 0) {
      return dashboard.revenueData
    }
    return [
      { month: "Jan", "2023": 245, "2024": 280 },
      { month: "Feb", "2023": 220, "2024": 265 },
      { month: "Mar", "2023": 280, "2024": 310 },
      { month: "Apr", "2023": 195, "2024": 240 },
      { month: "May", "2023": 310, "2024": 340 },
      { month: "Jun", "2023": 285, "2024": 315 },
    ]
  }, [dashboard])

  const topServices = useMemo(() => {
    return [
      { name: "Health Centers", rating: 4.8, feedback: 89 },
      { name: "Education Services", rating: 4.6, feedback: 76 },
      { name: "Public Transport", rating: 4.2, feedback: 65 },
      { name: "Municipal Services", rating: 4.4, feedback: 58 },
    ]
  }, [])

  // Simple, hook-free bar chart using divs
  const SimpleBarChart = ({ data, xKey, yKey, height = 300 }: { data: any[]; xKey: string; yKey: string; height?: number }) => {
    if (!data || data.length === 0) {
      return <div className="w-full h-[200px] flex items-center justify-center text-sm text-gray-500">{t('dashboard.no_data')}</div>
    }
    const maxVal = Math.max(...data.map((d) => d[yKey] as number)) || 1
    return (
      <div className="w-full" style={{ height }}>
        <div className="flex items-end h-full gap-3">
          {data.map((d, i) => {
            const value = (d as any)[yKey] as number
            const pct = Math.round((value / maxVal) * 100)
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-600 rounded-t transition-all duration-1000 ease-out" style={{ height: `${pct}%` }} />
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
    if (!data || data.length === 0) {
      return <div className="w-full h-[160px] flex items-center justify-center text-sm text-gray-500">{t('dashboard.no_data')}</div>
    }
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
                  <span>Citizen</span>
                  <span>Status</span>
                  <span>Ratings</span>
                  <span>Feedback submissions</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {citizensList.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No citizens found.</div>
                )}
                {citizensList.map((citizen, index) => (
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

      {selectedFeedback && (
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Feedback Details</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedFeedback(null)}>Close</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-700">
              <div><span className="font-medium">Citizen:</span> {selectedFeedback?.user?.name || selectedFeedback?.user?.email || selectedFeedback.citizen || 'Anonymous'}</div>
              <div><span className="font-medium">Rating:</span> {selectedFeedback.rating}/5</div>
              <div><span className="font-medium">Sector:</span> {selectedFeedback.sector || 'General'}</div>
              <div><span className="font-medium">Date:</span> {selectedFeedback.date ? new Date(selectedFeedback.date).toLocaleString() : '-'}</div>
            </div>
            <div>
              <div className="font-medium mb-1">Comment</div>
              <div className="p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">{selectedFeedback.comment || '—'}</div>
            </div>
            {Array.isArray(selectedFeedback.files) && selectedFeedback.files.length > 0 && (
              <div>
                <div className="font-medium mb-1">Files</div>
                <ul className="list-disc pl-5 text-sm">
                  {selectedFeedback.files.map((f: any, i: number) => (
                    <li key={i} className="break-all">
                      {f.originalname || f.filename}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
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
          <Input
            placeholder="Search by comment or user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
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
                {feedback.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No feedback found.</div>
                )}
                {feedback.map((fb, index) => (
                  <div
                    key={fb._id || fb.id || index}
                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={fb.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{(fb.citizen || fb?.user?.name || fb?.user?.email || "?")[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{fb.citizen || fb?.user?.name || fb?.user?.email || "Anonymous"}</span>
                    </div>

                    <Badge
                      variant="secondary"
                      className={`${
                        (fb.sector || "Transport") === "Transport"
                          ? "bg-green-100 text-green-800"
                          : (fb.sector || "") === "Medicine"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {fb.sector || "General"}
                    </Badge>

                    <div className="flex items-center space-x-1">{renderStars(fb.rating || 0)}</div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{fb.ticket || (typeof fb._id === 'string' ? fb._id.slice(-6) : '-')}</span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedFeedback(fb)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>
              Showing page {fbPage} of {fbPages} • Total {fbTotal}
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled={fbPage <= 1} onClick={() => setFbPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button variant="outline" size="sm" disabled={fbPage >= fbPages} onClick={() => setFbPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(Math.floor(service.rating))}
                      <span className="text-xs text-gray-600 ml-1">{service.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.feedback}</div>
                    <div className="text-xs text-gray-500">{t('dashboard.feedback_submissions')}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.top_feedback')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFeedbackList.slice(0, 3).map((fb, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={fb.avatar} />
                    <AvatarFallback>{fb.citizen[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{fb.citizen}</div>
                    <div className="text-xs text-gray-600 truncate">{fb.comment}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(fb.rating)}
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {pieData.map((item: any, index: number) => (
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
                          stroke={item.color || "#3b82f6"}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(item.value || 0) * 2.51} 251`}
                          className="transition-all duration-1000 ease-out"
                          style={{ animationDelay: `${index * 200}ms` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{item.value ?? 0}%</span>
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
              <SimpleLineChart data={weeklyOrdersForLine} xKey="day" yKey="orders" height={200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('dashboard.total_revenue')}</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm">2023</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm">2024</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueData.map((row: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-2 text-xs text-gray-600">{row.month}</div>
                    <div className="col-span-5">
                      <div className="h-2 bg-blue-200 rounded">
                        <div
                          className="h-2 bg-blue-500 rounded transition-all duration-1000 ease-out"
                          style={{ width: `${(row["2023"] / 340) * 100}%`, animationDelay: `${i * 100}ms` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{row["2023"]} feedback</div>
                    </div>
                    <div className="col-span-5">
                      <div className="h-2 bg-green-200 rounded">
                        <div
                          className="h-2 bg-green-500 rounded transition-all duration-1000 ease-out"
                          style={{ width: `${(row["2024"] / 340) * 100}%`, animationDelay: `${i * 100 + 50}ms` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{row["2024"]} feedback</div>
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
  )

  /* Settings Modal */
  const SettingsModal = () => (
    !settingsOpen ? null : (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setSettingsOpen(false)} />
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Account & Settings</h3>
            <Button variant="ghost" onClick={() => setSettingsOpen(false)}>Close</Button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500">Name</div>
              <div className="font-medium">{currentUser?.name || '—'}</div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium">{currentUser?.email || '—'}</div>
              <div className="text-gray-500">Role</div>
              <div><Badge variant="secondary">{currentUser?.isAdmin ? 'Admin' : 'User'}</Badge></div>
              <div className="text-gray-500">Session Expires</div>
              <div className="font-medium">{currentUser?.exp ? new Date(currentUser.exp * 1000).toLocaleString() : '—'}</div>
            </div>
            <div className="pt-2">
              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleLogout} disabled={signingOut}>
                {signingOut ? 'Signing out…' : 'Sign out'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  )

  // Render modal at root of component
  return (
    <div className="min-h-screen bg-gray-50">
      { /* Header */ }
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              {t('landing.title')} <span className="text-blue-600">{t('landing.subtitle')}</span>
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder={t('dashboard.search_feedback')} className="pl-10 w-64 bg-gray-50 border-gray-200" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={language} onValueChange={(value: 'en' | 'am') => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">አማርኛ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('dashboard.export_data')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.settings')}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading && (
          <div className="mb-4 text-sm text-gray-600">{t('dashboard.loading')}</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h2>
            <p className="text-gray-600">{t('dashboard.welcome')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <TabButton label={t('dashboard.citizens')} isActive={activeTab === "Citizens"} onClick={() => setActiveTab("Citizens")} />
            <TabButton
              label={t('dashboard.feedback_management')}
              isActive={activeTab === "Feedback Management"}
              onClick={() => setActiveTab("Feedback Management")}
            />
            <TabButton
              label={t('dashboard.analytics')}
              isActive={activeTab === "Analytics"}
              onClick={() => setActiveTab("Analytics")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title={t('dashboard.total_feedback')}
            value={`${dashboard?.metrics?.totalFeedback ?? '247'}`}
            change="+12.5% (30d)"
            trend="up"
            icon={MessageSquare}
            color="bg-blue-500"
          />
          <MetricCard
            title={t('dashboard.pending_review')}
            value={`${dashboard?.metrics?.pendingReview ?? '18'}`}
            change="+5.2% (30d)"
            trend="up"
            icon={Clock}
            color="bg-orange-500"
          />
          <MetricCard
            title={t('dashboard.avg_response_time')}
            value={`${dashboard?.metrics?.avgResponseTime ?? '2.4h'}`}
            change="-8.3% (30d)"
            trend="down"
            icon={BarChart3}
            color="bg-green-500"
          />
          <MetricCard
            title={t('dashboard.average_rating')}
            value={`${typeof dashboard?.metrics?.averageRating === 'number' ? (Math.round(dashboard.metrics.averageRating * 10) / 10) : '4.3'}/5`}
            change="+3.7% (30d)"
            trend="up"
            icon={Star}
            color="bg-purple-500"
          />
        </div>

        {activeTab === "Citizens" && renderCitizensView()}
        {activeTab === "Feedback Management" && renderFeedbackView()}
        {activeTab === "Analytics" && renderAnalyticsView()}
      </div>

      <SettingsModal />
    </div>
  )

}
