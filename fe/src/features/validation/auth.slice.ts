import { loginApi, meApi, signupApi, type AuthApiUser } from "@/lib/auth-api"
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"

type AuthState = {
  token: string | null
  user: AuthApiUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isChecking: boolean
  error: string | null
}

const STORAGE_KEYS = {
  token: "auth_token",
  user: "auth_user",
} as const

const persistSession = (token: string, user: AuthApiUser) => {
  localStorage.setItem(STORAGE_KEYS.token, token)
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.user)
}

const readSession = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  const userJson = localStorage.getItem(STORAGE_KEYS.user)

  if (!token || !userJson) {
    return null
  }

  try {
    const user = JSON.parse(userJson) as AuthApiUser
    return { token, user }
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
      const meResponse = await meApi(stored.token)
      const mergedUser: AuthApiUser = {
        id: meResponse.user.id,
        email: meResponse.user.email || stored.user.email,
        name: stored.user.name,
      }

      persistSession(stored.token, mergedUser)

      return {
        token: stored.token,
        user: mergedUser,
      }
    } catch {
      clearSession()
      return null
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
        user: response.user,
      }

      persistSession(result.token, result.user)
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
        user: response.user,
      }

      persistSession(result.token, result.user)
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
          state.user = null
          state.isAuthenticated = false
          return
        }

        state.token = action.payload.token
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
