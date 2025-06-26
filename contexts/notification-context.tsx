"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  icon?: string
  userId?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
}

type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_READ"; payload: string }
  | { type: "MARK_ALL_READ" }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      const newNotifications = [action.payload, ...state.notifications]
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      }
    case "MARK_READ":
      const updatedNotifications = state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n))
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      }
    case "MARK_ALL_READ":
      const allReadNotifications = state.notifications.map((n) => ({ ...n, read: true }))
      return {
        notifications: allReadNotifications,
        unreadCount: 0,
      }
    case "REMOVE_NOTIFICATION":
      const filteredNotifications = state.notifications.filter((n) => n.id !== action.payload)
      return {
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter((n) => !n.read).length,
      }
    case "SET_NOTIFICATIONS":
      return {
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      }
    default:
      return state
  }
}

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  useEffect(() => {
    // Load initial notifications and set up real-time updates
    loadNotifications()

    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Randomly generate notifications for demo
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        generateRandomNotification()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    // Mock initial notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "File Shared",
        message: "presentation.pdf was shared with john@example.com",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionUrl: "/shared",
        actionLabel: "View Shared Files",
      },
      {
        id: "2",
        type: "info",
        title: "File Downloaded",
        message: "team-photo.jpg was downloaded by sarah@example.com",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
      {
        id: "3",
        type: "warning",
        title: "Storage Warning",
        message: "You're using 85% of your storage space",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        actionUrl: "/settings",
        actionLabel: "Manage Storage",
      },
      {
        id: "4",
        type: "success",
        title: "Upload Complete",
        message: "demo-video.mp4 has been encrypted and uploaded successfully",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
      },
    ]

    dispatch({ type: "SET_NOTIFICATIONS", payload: mockNotifications })
  }

  const generateRandomNotification = () => {
    const notifications = [
      {
        type: "info" as const,
        title: "File Downloaded",
        message: "Your shared file was downloaded",
      },
      {
        type: "success" as const,
        title: "File Shared",
        message: "File shared successfully",
      },
      {
        type: "warning" as const,
        title: "Share Link Expiring",
        message: "A share link will expire in 24 hours",
      },
    ]

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
    addNotification(randomNotification)
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification })

    // Show toast notification
    toast(notification.title, {
      description: notification.message,
    })
  }

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_READ", payload: id })
  }

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_READ" })
  }

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id })
  }

  const value: NotificationContextType = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
