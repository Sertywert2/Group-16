import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock } from "lucide-react"
import { useState } from "react"
import { AuthApi } from "@/lib/api"
import { auth } from "@/lib/auth"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await AuthApi.signin({ email, password })
      if (res?.token) {
        auth.setToken(res.token)
        navigate("/dashboard")
      } else {
        setError("Invalid response from server")
      }
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Back to home link */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Main card */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          {/* Language selector */}
          <div className="flex justify-end mb-6">
            <span className="text-gray-400 text-sm">English En</span>
          </div>

          {/* Logo and title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              GovInsight <span className="text-blue-600">Pro</span>
            </h1>
            <h2 className="text-xl font-semibold text-gray-900">Administrator Sign in</h2>
          </div>

          {/* Login form */}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="text-right">
              <Link to="#" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
              {loading ? "Signing in..." : "Sign in as Admin"}
            </Button>
          </form>

          {/* Register link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-500 hover:underline">
              Register.
            </Link>
          </div>

          {/* Admin verification notice */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Administrator access requires verification of government credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

