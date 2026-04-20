import Dashboard from "@/app/dashboard/page"
import AuthPageProtector from "@/components/auth/AuthPageProtector"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { ROUTES } from "@/routes/route.constants"
import { GalleryVerticalEndIcon } from "lucide-react"
import { Navigate, Route, Routes } from "react-router-dom"

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Acme Inc.
        </a>
        {children}
      </div>
    </div>
  )
}

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
        <Route
          path={ROUTES.AUTH.SIGNUP}
          element={
            <AuthShell>
              <SignupForm />
            </AuthShell>
          }
        />
        <Route
          path={ROUTES.AUTH.LOGIN}
          element={
            <AuthShell>
              <LoginForm />
            </AuthShell>
          }
        />
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
