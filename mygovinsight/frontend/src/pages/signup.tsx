import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, User, Lock } from "lucide-react"

export default function RegisterPage() {
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
            <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
          </div>

          {/* Registration form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10"
                  placeholder=""
                />
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <Input type="text" className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10" placeholder="" />
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <Input type="text" className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10" placeholder="" />
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <Input type="text" className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10" placeholder="" />
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg pr-10"
                  placeholder=""
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
                  placeholder=""
                />
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input type="text" className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg" placeholder="" />
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox id="terms" className="mt-1" />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                Terms and conditions <span className="text-gray-400">I already have one,</span>
                <Link to="#" className="text-blue-500 hover:underline">
                  click here.
                </Link>
              </label>
            </div>

            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-6">
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
