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
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-foreground text-background shadow-sm shadow-muted/20">
            <GalleryVerticalEndIcon className="size-5" />
          </div>
          <p className="text-sm font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Acme
          </p>
        </div>
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
