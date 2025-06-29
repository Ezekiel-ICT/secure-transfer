"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light") // Default to light theme
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem("secure-transfer-theme") as Theme
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
      setTheme(stored)
      } else {
        // First time user - set default to light
        setTheme("light")
        localStorage.setItem("secure-transfer-theme", "light")
      }
    } catch (error) {
      // Fallback if localStorage is not available
      setTheme("light")
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const body = window.document.body
    
    // Remove all theme classes
    root.classList.remove("light", "dark")
    body.classList.remove("light", "dark")

    let resolvedTheme: "light" | "dark" = "light"

    if (theme === "system") {
      resolvedTheme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"
    } else {
      resolvedTheme = theme as "light" | "dark"
    }

    // Apply theme classes to both html and body
    root.classList.add(resolvedTheme)
    body.classList.add(resolvedTheme)
    
    // Set data attribute for better CSS targeting
    root.setAttribute("data-theme", resolvedTheme)
    
    // Save to localStorage with app-specific key
    try {
      localStorage.setItem("secure-transfer-theme", theme)
    } catch (error) {
      // Ignore localStorage errors
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"))
  }

  const resolvedTheme: "light" | "dark" = theme === "system" 
    ? (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : (theme as "light" | "dark")

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="light">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
