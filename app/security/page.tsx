"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Key, Activity, AlertTriangle, CheckCircle, Monitor, MapPin, Clock, Shield } from "lucide-react"
import { toast } from "sonner"
import { TwoFactorSetup } from "@/components/features/two-factor-setup"
import { formatDistanceToNow } from "date-fns"
import { NotificationProvider } from "@/contexts/notification-context"

interface LoginSession {
  id: string
  device: string
  location: string
  ip: string
  lastActive: Date
  isCurrent: boolean
}

interface LoginActivity {
  id: string
  action: string
  device: string
  location: string
  timestamp: Date
  success: boolean
}

export default function SecurityPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [setupDialogOpen, setSetupDialogOpen] = useState(false)

  // Mock data
  const [activeSessions] = useState<LoginSession[]>([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, NY",
      ip: "192.168.1.100",
      lastActive: new Date(),
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "New York, NY",
      ip: "192.168.1.101",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isCurrent: false,
    },
    {
      id: "3",
      device: "Firefox on MacOS",
      location: "San Francisco, CA",
      ip: "10.0.0.50",
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isCurrent: false,
    },
  ])

  const [loginActivity] = useState<LoginActivity[]>([
    {
      id: "1",
      action: "Login",
      device: "Chrome on Windows",
      location: "New York, NY",
      timestamp: new Date(),
      success: true,
    },
    {
      id: "2",
      action: "Login",
      device: "Safari on iPhone",
      location: "New York, NY",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      success: true,
    },
    {
      id: "3",
      action: "Failed Login Attempt",
      device: "Unknown Device",
      location: "Unknown Location",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      success: false,
    },
    {
      id: "4",
      action: "Password Changed",
      device: "Chrome on Windows",
      location: "New York, NY",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      success: true,
    },
  ])

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)

    // Check if 2FA is enabled
    const twoFactorStatus = localStorage.getItem("two_factor_enabled")
    setTwoFactorEnabled(twoFactorStatus === "true")
  }, [router])

  const handleTerminateSession = (sessionId: string) => {
    toast.success("Session terminated successfully")
  }

  const handleEnable2FA = () => {
    setSetupDialogOpen(true)
  }

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false)
    localStorage.setItem("two_factor_enabled", "false")
    toast.success("Two-factor authentication disabled")
  }

  const handle2FASetupComplete = () => {
    setTwoFactorEnabled(true)
    localStorage.setItem("two_factor_enabled", "true")
    setSetupDialogOpen(false)
    toast.success("Two-factor authentication enabled successfully!")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <DashboardLayout>
            <div className="space-y-6">
              {/* Header Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account security and privacy settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Security Overview */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Two-Factor Authentication */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Two-Factor Authentication
                      </CardTitle>
                      <CardDescription>
                        Add an extra layer of security to your account with two-factor authentication
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${twoFactorEnabled ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <div>
                            <p className="font-medium">
                              Two-Factor Authentication is {twoFactorEnabled ? "Enabled" : "Disabled"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {twoFactorEnabled
                                ? "Your account is protected with 2FA"
                                : "Enable 2FA to secure your account"}
                            </p>
                          </div>
                        </div>
                        {twoFactorEnabled ? (
                          <Button variant="outline" onClick={handleDisable2FA}>
                            Disable
                          </Button>
                        ) : (
                          <Button onClick={handleEnable2FA}>Enable 2FA</Button>
                        )}
                      </div>

                      {twoFactorEnabled && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              Two-Factor Authentication Active
                            </p>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Your account is protected with authenticator app verification. Keep your backup codes safe.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Password Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Password Security
                      </CardTitle>
                      <CardDescription>Manage your password and security preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-gray-500">Last changed 3 days ago</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Login Notifications</p>
                          <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                        </div>
                        <Badge variant="secondary">Enabled</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Sessions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        Active Sessions
                      </CardTitle>
                      <CardDescription>Manage devices that are currently signed in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activeSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Monitor className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{session.device}</p>
                                  {session.isCurrent && (
                                    <Badge variant="secondary" className="text-xs">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {session.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(session.lastActive, { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!session.isCurrent && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTerminateSession(session.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Terminate
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Security Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {twoFactorEnabled ? "95" : "75"}/100
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {twoFactorEnabled ? "Excellent security" : "Good security"}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Strong password</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Two-factor auth</span>
                            {twoFactorEnabled ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Email verified</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {loginActivity.slice(0, 4).map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {activity.success ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.device}</p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        View Full Activity
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Audit
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 2FA Setup Dialog */}
              <TwoFactorSetup
                open={setupDialogOpen}
                onOpenChange={setSetupDialogOpen}
                onComplete={handle2FASetupComplete}
              />
            </div>
          </DashboardLayout>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
