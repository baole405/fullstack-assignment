import {
  loginApi,
  meApi,
  refreshTokenApi,
  signupApi,
  type AuthApiUser,
} from "@/lib/auth-api"
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"

type AuthState = {
  token: string | null
  refreshToken: string | null
  user: AuthApiUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isChecking: boolean
  error: string | null
}

const STORAGE_KEYS = {
  token: "auth_token",
  refreshToken: "auth_refresh_token",
  user: "auth_user",
} as const

const persistSession = (
  token: string | null,
  user: AuthApiUser,
  refreshToken: string
) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.token, token)
  }
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken)
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.user)
}

const readSession = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
  const userJson = localStorage.getItem(STORAGE_KEYS.user)

  if (!refreshToken || !userJson) {
    return null
  }

  try {
    const user = JSON.parse(userJson) as AuthApiUser
    return { token, refreshToken, user }
  } catch {
    clearSession()
    return null
  }
}

export const verifySessionThunk = createAsyncThunk(
  "auth/verifySession",
  async () => {
    const stored = readSession()

    if (!stored) {
      return null
    }

    try {
      if (stored.token) {
        const meResponse = await meApi(stored.token)
        const mergedUser: AuthApiUser = {
          id: meResponse.user.id,
          email: meResponse.user.email || stored.user.email,
          name: stored.user.name,
        }

        persistSession(stored.token, mergedUser, stored.refreshToken)

        return {
          token: stored.token,
          refreshToken: stored.refreshToken,
          user: mergedUser,
        }
      }

      throw new Error("Missing access token")
    } catch {
      try {
        const refreshResponse = await refreshTokenApi(stored.refreshToken)
        persistSession(
          refreshResponse.accessToken,
          stored.user,
          refreshResponse.refreshToken
        )

        return {
          token: refreshResponse.accessToken,
          refreshToken: refreshResponse.refreshToken,
          user: stored.user,
        }
      } catch {
        clearSession()
        return null
      }
    }
  }
)

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    payload: {
      email: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi(payload)
      const result = {
        token: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      }

      persistSession(result.token, result.user, result.refreshToken)
      return result
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      )
    }
  }
)

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (
    payload: {
      name: string
      email: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await signupApi(payload)
      const result = {
        token: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      }

      persistSession(result.token, result.user, result.refreshToken)
      return result
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Sign up failed"
      )
    }
  }
)

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isChecking: true,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.error = null
      clearSession()
    },
    clearAuthError(state) {
      state.error = null
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifySessionThunk.fulfilled, (state, action) => {
        state.isChecking = false

        if (!action.payload) {
          state.token = null
          state.refreshToken = null
          state.user = null
          state.isAuthenticated = false
          return
        }

        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || "Login failed"
      })
      .addCase(signupThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || "Sign up failed"
      })
  },
})

export const { logout, clearAuthError, setAuthError } = authSlice.actions
export default authSlice.reducer
