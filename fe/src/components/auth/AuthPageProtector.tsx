import { useAppSelector } from "@/app/hooks"
import { ROUTES } from "@/routes/route.constants"
import { Navigate, Outlet } from "react-router-dom"

export default function AuthPageProtector() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isChecking = useAppSelector((state) => state.auth.isChecking)

  if (isChecking) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
