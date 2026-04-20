export const ROUTES = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  ME: "/me",
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  LEGACY_AUTH: {
    LOGIN: "/login",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    AUTH_LOGIN: "/auth/signin",
    AUTH_SIGNUP: "/auth/register",
  },
} as const
