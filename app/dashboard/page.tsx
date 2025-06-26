"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QuickStats } from "@/components/features/quick-stats"
import { RecentFiles } from "@/components/features/recent-files"
import { StorageUsage } from "@/components/features/storage-usage"
import { ActivityFeed } from "@/components/features/activity-feed"
import { FileUploadZone } from "@/components/features/file-upload-zone"
import { ShareDialog } from "@/components/features/share-dialog"
import { NotificationProvider } from "@/contexts/notification-context"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedFileForShare, setSelectedFileForShare] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

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
              {/* Welcome Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your secure files and shares</p>
              </div>

              {/* Quick Stats */}
              <QuickStats />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* File Upload */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold mb-2">File Upload</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Drag and drop files or click to browse - all files are encrypted automatically
                      </p>
                    </div>
                    <FileUploadZone />
                  </div>

                  <RecentFiles />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <StorageUsage />
                  <ActivityFeed />
                </div>
              </div>

              <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} fileName={selectedFileForShare} />
            </div>
          </DashboardLayout>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
