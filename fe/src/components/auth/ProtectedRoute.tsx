import { useAppSelector } from "@/app/hooks"
import { ROUTES } from "@/routes/route.constants"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isChecking = useAppSelector((state) => state.auth.isChecking)
  const location = useLocation()

  if (isChecking) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />
    )
  }

  return <Outlet />
}
