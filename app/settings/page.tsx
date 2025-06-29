"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, HardDrive, Shield, Download, Camera, Save, Trash, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    language: "",
    timezone: "",
  })


  // Storage settings
  const [storage, setStorage] = useState({
    autoDelete: false,
    autoDeleteDays: 30,
    compressionEnabled: true,
    encryptionLevel: "aes256",
  })

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

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveStorage = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Storage settings updated!")
    } catch (error) {
      toast.error("Failed to update storage settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not available in demo mode")
  }

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive an email when ready.")
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
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
              </div>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="storage" className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Storage
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Account
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information and profile settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                          <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Photo
                          </Button>
                          <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                        </div>
                      </div>

                      {/* Profile Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={profile.timezone}
                            onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select
                            value={profile.language}
                            onValueChange={(value) => setProfile({ ...profile, language: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="ja">日本語</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Storage Tab */}
                <TabsContent value="storage" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Storage Settings</CardTitle>
                      <CardDescription>Manage your storage preferences and optimization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Auto-delete Old Files</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically delete files after a certain period
                            </p>
                          </div>
                          <Switch
                            checked={storage.autoDelete}
                            onCheckedChange={(checked) => setStorage({ ...storage, autoDelete: checked })}
                          />
                        </div>

                        {storage.autoDelete && (
                          <div className="space-y-2 ml-6">
                            <Label>Delete files older than</Label>
                            <Select
                              value={storage.autoDeleteDays.toString()}
                              onValueChange={(value) =>
                                setStorage({ ...storage, autoDeleteDays: Number.parseInt(value) })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="180">6 months</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">File Compression</Label>
                            <p className="text-sm text-muted-foreground">Compress files to save storage space</p>
                          </div>
                          <Switch
                            checked={storage.compressionEnabled}
                            onCheckedChange={(checked) => setStorage({ ...storage, compressionEnabled: checked })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Encryption Level</Label>
                          <Select
                            value={storage.encryptionLevel}
                            onValueChange={(value) => setStorage({ ...storage, encryptionLevel: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aes128">AES-128 (Faster)</SelectItem>
                              <SelectItem value="aes256">AES-256 (More Secure)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Higher encryption levels provide better security but may be slower
                          </p>
                        </div>
                      </div>

                      <Button onClick={handleSaveStorage} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Storage Settings"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Management</CardTitle>
                      <CardDescription>Manage your account data and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Export Your Data</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Download a copy of all your data including files, settings, and activity history.
                          </p>
                          <Button variant="outline" onClick={handleExportData}>
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                          </Button>
                        </div>

                        <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">Danger Zone</h4>
                          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="destructive" onClick={handleDeleteAccount}>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Account Created</span>
                          <span className="text-sm text-gray-600">January 15, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Last Login</span>
                          <span className="text-sm text-gray-600">Today at 2:30 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Account Type</span>
                          <Badge variant="secondary">Free Plan</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Storage Used</span>
                          <span className="text-sm text-gray-600">2.4 GB / 10 GB</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DashboardLayout>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
