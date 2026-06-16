import { createContext, useState, useContext } from "react"
import { api } from "../services/api.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser")
    return saved ? JSON.parse(saved) : null
  })

  async function register(username, email, password) {
    const data = await api.register(username, email, password)
    const userWithToken = { ...data.user, token: data.token }
    setUser(userWithToken)
    localStorage.setItem("currentUser", JSON.stringify(userWithToken))
  }

  async function login(email, password) {
    const data = await api.login(email, password)
    const userWithToken = { ...data.user, token: data.token }
    setUser(userWithToken)
    localStorage.setItem("currentUser", JSON.stringify(userWithToken))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}