import { useAuth } from "@/contexts/AuthContext"
import { ROUTES } from "@/routes/route.constants"
import { Navigate, Outlet } from "react-router-dom"

export default function AuthPageProtector() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
