import { createContext, useContext } from "react"

export type AuthUser = {
  id: number
  name: string | null
  email: string
}

export type AuthLoginPayload = {
  token: string
  user: AuthUser
}

type AuthContextType = {
  isAuthenticated: boolean
  user: AuthUser | null
  token: string | null
  authLogin: (payload: AuthLoginPayload) => void
  authLogout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
