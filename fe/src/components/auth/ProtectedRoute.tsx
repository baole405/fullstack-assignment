import { useAuth } from "@/contexts/AuthContext"
import { ROUTES } from "@/routes/route.constants"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />
    )
  }

  return <Outlet />
}
