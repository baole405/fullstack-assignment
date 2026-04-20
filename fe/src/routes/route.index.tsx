import Dashboard from "@/app/dashboard/page"
import AuthPageProtector from "@/components/auth/AuthPageProtector"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { ROUTES } from "@/routes/route.constants"
import { Navigate, Route, Routes } from "react-router-dom"

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.AUTH.SIGNUP} replace />}
      />
      <Route
        path={ROUTES.ME}
        element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
      />

      <Route element={<AuthPageProtector />}>
        <Route path={ROUTES.AUTH.SIGNUP} element={<SignupForm />} />
        <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      </Route>

      <Route
        path={ROUTES.LEGACY_AUTH.SIGNIN}
        element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
      />
      <Route
        path={ROUTES.LEGACY_AUTH.LOGIN}
        element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
      />
      <Route
        path={ROUTES.LEGACY_AUTH.SIGNUP}
        element={<Navigate to={ROUTES.AUTH.SIGNUP} replace />}
      />
      <Route
        path={ROUTES.LEGACY_AUTH.AUTH_LOGIN}
        element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
      />
      <Route
        path={ROUTES.LEGACY_AUTH.AUTH_SIGNUP}
        element={<Navigate to={ROUTES.AUTH.SIGNUP} replace />}
      />

      <Route path="*" element={<Navigate to={ROUTES.AUTH.SIGNUP} replace />} />
    </Routes>
  )
}
