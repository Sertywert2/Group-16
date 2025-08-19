import type { ReactNode } from "react"
import { Navigate, Link } from "react-router-dom"
import { auth } from "@/lib/auth"

function isAdminFromToken(token: string | null): boolean {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""))
    return payload?.isAdmin === true
  } catch {
    return false
  }
}

export default function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const token = auth.getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdminFromToken(token)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white shadow rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">You do not have admin rights to access this page.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/listings" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Go to Services</Link>
            <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Switch Account</Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
