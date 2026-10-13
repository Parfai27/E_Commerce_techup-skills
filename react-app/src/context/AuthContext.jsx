import { createContext, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)
const TOKEN_KEY = "selz_token"
const USER_KEY = "selz_user"

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null")
  } catch {
    return null
  }
}

async function postAuth(path, body, token) {
  const headers = { "Content-Type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  function saveSession(nextUser, nextToken) {
    setUser(nextUser)
    setToken(nextToken)
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(USER_KEY)
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken)
    else localStorage.removeItem(TOKEN_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      async login(email, password) {
        const data = await postAuth("/api/auth/login", { email, password })
        saveSession(data.user, data.token)
        return data
      },
      async register(name, email, password) {
        const data = await postAuth("/api/auth/register", { name, email, password })
        saveSession(data.user, null)
        return data
      },
      forgotPassword(email) {
        return postAuth("/api/auth/forgot-password", { email })
      },
      resetPassword(email, code, newPassword) {
        return postAuth("/api/auth/reset-password", { email, code, newPassword })
      },
      createSeller(name, email, password) {
        return postAuth("/api/auth/sellers", { name, email, password }, token)
      },
      logout() {
        saveSession(null, null)
      },
    }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
