import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedUser = authService.getCurrentUser()
    const token = authService.getToken()
    
    if (savedUser && token) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.login(email, password)
      setUser(response.user)
      setLoading(false)
      return { success: true }
    } catch (error) {
      setError(error.message)
      setLoading(false)
      return { success: false, error: error.message }
    }
  }

  const signup = async (name, email, password) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.register(name, email, password)
      setUser(response.user)
      setLoading(false)
      return { success: true }
    } catch (error) {
      setError(error.message)
      setLoading(false)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

