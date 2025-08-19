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
import { DashboardApi, FeedbackApi, AuthApi } from "@/lib/api"
import { auth } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()
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
        // soft-fail to demo data if needed
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

  // Derived data from dashboard (no mock fallbacks)
  const citizensList = useMemo(() => {
    if (!dashboard?.citizens) return [] as any[]
    return (dashboard.citizens as any[]).map((c: any, idx: number) => ({
      id: c.id || idx + 1,
      name: c.name || c.email || "Anonymous",
      avatar: "/placeholder.svg?height=32&width=32",
      status: c.status || (c.isVerified ? "Verified" : "Unverified"),
      rating: typeof c.rating === 'number' ? c.rating : Math.round((c.avgRating || 0) * 10) / 10,
      submissions: c.submissions || 0,
      progress: Math.min(100, Math.round(c.progress ?? (c.submissions || 0) * 10)),
    }))
  }, [dashboard])

  const recentFeedbackList = useMemo(() => {
    if (!dashboard?.feedback) return [] as any[]
    return (dashboard.feedback as any[]).map((f: any, idx: number) => ({
      id: f.id || f._id || idx + 1,
      citizen: f.citizen || f.citizenName || "Anonymous",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: f.sector || "General",
      rating: f.rating || 0,
      ticket: f.ticket || (typeof f._id === 'string' ? f._id.slice(-6) : "-"),
    }))
  }, [dashboard])

  const weeklyChart = useMemo(() => {
    if (!dashboard?.weeklyOrderData) return [] as any[]
    return (dashboard.weeklyOrderData as any[]).map((d: any) => ({ name: d.day, value: d.orders }))
  }, [dashboard])

  const weeklyOrdersForLine = useMemo(() => {
    const src = (dashboard?.weeklyOrderData as any[]) || []
    return src.map((d: any) => ({ day: d.day, orders: d.orders }))
  }, [dashboard])
  // Simple, hook-free bar chart using divs
  const SimpleBarChart = ({ data, xKey, yKey, height = 300 }: { data: any[]; xKey: string; yKey: string; height?: number }) => {
    if (!data || data.length === 0) {
      return <div className="w-full h-[200px] flex items-center justify-center text-sm text-gray-500">No data</div>
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
    if (!data || data.length === 0) {
      return <div className="w-full h-[160px] flex items-center justify-center text-sm text-gray-500">No data</div>
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

      {/* Details Panel */}
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
          {/* Pagination */}
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
              <div className="text-sm text-gray-500">No data available.</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Feedback's</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-500">No data available.</div>
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
              <div className="grid grid-cols-3 gap-4">
                {(((dashboard as any)?.pieData || []) as any[]).length === 0 && (
                  <div className="col-span-3 text-sm text-gray-500">No data</div>
                )}
                {(((dashboard as any)?.pieData || []) as any[]).map((item: any, index: number) => (
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
                {(((dashboard as any)?.revenueData || []) as any[]).length === 0 && (
                  <div className="text-sm text-gray-500">No data</div>
                )}
                {(((dashboard as any)?.revenueData || []) as any[]).map((row: any, i: number) => (
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
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
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
            value={`${dashboard?.metrics?.totalFeedback ?? '--'}`}
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
            value={`--`}
            change="+2.1% (30d)"
            trend="up"
            icon={BarChart3}
            color="bg-green-500"
          />
          <MetricCard
            title="Average Rating"
            value={`${typeof dashboard?.metrics?.averageRating === 'number' ? (Math.round(dashboard.metrics.averageRating * 10) / 10) : '--'}/5`}
            change="-1.2% (30d)"
            trend="down"
            icon={Star}
            color="bg-purple-500"
          />
        </div>

        {/* Dynamic Content */}
        {activeTab === "Citizens" && renderCitizensView()}
        {activeTab === "Feedback Management" && renderFeedbackView()}
        {activeTab === "Analytics" && renderAnalyticsView()}
      </div>

      <SettingsModal />
    </div>
  )

}
