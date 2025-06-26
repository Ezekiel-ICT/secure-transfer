"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  twoFactorEnabled: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Simulate checking for existing session
      const token = localStorage.getItem("auth_token")
      if (token) {
        // Simulate user data fetch
        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          twoFactorEnabled: false,
        }
        dispatch({ type: "SET_USER", payload: mockUser })
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        name: "John Doe",
        email,
        twoFactorEnabled: false,
      }

      // Store token
      localStorage.setItem("auth_token", "mock_token")
      if (rememberMe) {
        localStorage.setItem("remember_me", "true")
      }

      dispatch({ type: "SET_USER", payload: mockUser })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const mockUser: User = {
        id: "1",
        name,
        email,
        twoFactorEnabled: false,
      }

      // Store token
      localStorage.setItem("auth_token", "mock_token")

      dispatch({ type: "SET_USER", payload: mockUser })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("remember_me")

      dispatch({ type: "LOGOUT" })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      dispatch({ type: "SET_USER", payload: { ...state.user, ...userData } })
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
