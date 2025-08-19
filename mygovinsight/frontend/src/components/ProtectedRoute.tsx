import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { auth } from "@/lib/auth"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = auth.getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
