import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, User, Lock, ShieldCheck } from "lucide-react"
import { AuthApi } from "@/lib/api"
import { auth } from "@/lib/auth"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stage, setStage] = useState<'register' | 'verify'>("register")
  const [otp, setOtp] = useState("")

  async function onRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all required fields.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (!accepted) {
      setError("Please accept the terms and conditions.")
      return
    }
    setLoading(true)
    try {
      const res = await AuthApi.register({ name, email, password })
      // Backend returns { message, otp, email }
      if ((res as any)?.otp) {
        setStage("verify")
      } else {
        // Fallback: proceed to verify stage regardless
        setStage("verify")
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!otp.trim()) {
      setError("Enter the 6-digit OTP sent to your email (also printed in server logs).")
      return
    }
    setLoading(true)
    try {
      const res = await AuthApi.activate({ email, otp })
      if ((res as any)?.token) {
        auth.setToken((res as any).token)
        navigate("/listings")
      } else {
        setError("Activation failed: invalid server response")
      }
    } catch (err: any) {
      setError(err?.message || "Activation failed")
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

       
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              GovInsight <span className="text-blue-600">Pro</span>
            </h1>
            <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
          </div>

          {/* Registration / Verification */}
          {stage === "register" ? (
            <form className="space-y-4" onSubmit={onRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <Input
                    type="text"
                    className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox id="terms" className="mt-1" checked={accepted} onCheckedChange={(v) => setAccepted(Boolean(v))} />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I accept the terms and conditions
                </label>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-2">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={onVerify}>
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span>Enter the 6-digit OTP sent to {email}. It is also printed in the backend logs.</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-2">
                {loading ? "Verifying..." : "Verify & Continue"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
