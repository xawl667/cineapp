import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser")
    return savedUser ? JSON.parse(savedUser) : null
  })

  function register(username, email, password) {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    const alreadyExists = existingUsers.find(u => u.email === email)
    if (alreadyExists) {
      throw new Error("Cet email est déjà utilisé")
    }

    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      password
    }

    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]))
    
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser)) // ✅ AJOUT
  }

  function login(email, password) {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    const foundUser = existingUsers.find(
      u => u.email === email && u.password === password
    )

    if (!foundUser) {
      throw new Error("Email ou mot de passe incorrect")
    }

    setUser(foundUser)
    localStorage.setItem("currentUser", JSON.stringify(foundUser)) // ✅ AJOUT
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("currentUser") // ✅ propre
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