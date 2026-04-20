const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

type ApiError = {
  message: string
}

export type AuthApiUser = {
  id: number
  name: string | null
  email: string
}

export type AuthApiResponse = {
  user: AuthApiUser
  accessToken: string
  refreshToken: string
}

type RefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}

type MeApiResponse = {
  user: {
    id: number
    email: string | null
  }
}

const parseError = async (response: Response) => {
  try {
    const body = (await response.json()) as ApiError
    return body.message || "Request failed"
  } catch {
    return "Request failed"
  }
}

export const signupApi = async (payload: {
  name: string
  email: string
  password: string
}): Promise<AuthApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as AuthApiResponse
}

export const loginApi = async (payload: {
  email: string
  password: string
}): Promise<AuthApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as AuthApiResponse
}

export const refreshTokenApi = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as RefreshTokenResponse
}

export const meApi = async (token: string): Promise<MeApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as MeApiResponse
}
