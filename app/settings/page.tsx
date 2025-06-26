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
import { User, Bell, HardDrive, Shield, Download, Camera, Save, Trash, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Software developer passionate about security and privacy.",
    avatar: "/placeholder.svg?height=100&width=100",
    timezone: "America/New_York",
    language: "en",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    fileShared: true,
    fileDownloaded: true,
    securityAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    allowFileSharing: true,
    showOnlineStatus: false,
    dataRetention: "1year",
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

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Notification preferences updated!")
    } catch (error) {
      toast.error("Failed to update notifications")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Privacy settings updated!")
    } catch (error) {
      toast.error("Failed to update privacy settings")
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
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Privacy
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

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose how you want to be notified about activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, emailNotifications: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                          </div>
                          <Switch
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, pushNotifications: checked })
                            }
                          />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-4">Activity Notifications</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">File Shared</Label>
                                <p className="text-sm text-muted-foreground">When someone shares a file with you</p>
                              </div>
                              <Switch
                                checked={notifications.fileShared}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, fileShared: checked })
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">File Downloaded</Label>
                                <p className="text-sm text-muted-foreground">
                                  When someone downloads your shared files
                                </p>
                              </div>
                              <Switch
                                checked={notifications.fileDownloaded}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, fileDownloaded: checked })
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">Security Alerts</Label>
                                <p className="text-sm text-muted-foreground">Important security notifications</p>
                              </div>
                              <Switch
                                checked={notifications.securityAlerts}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, securityAlerts: checked })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-4">Email Preferences</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">Weekly Digest</Label>
                                <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                              </div>
                              <Switch
                                checked={notifications.weeklyDigest}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, weeklyDigest: checked })
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                              </div>
                              <Switch
                                checked={notifications.marketingEmails}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, marketingEmails: checked })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleSaveNotifications} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Preferences"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Profile Visibility</Label>
                          <Select
                            value={privacy.profileVisibility}
                            onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                              <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                              <SelectItem value="contacts">Contacts Only - Only people you share files with</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Allow File Sharing</Label>
                            <p className="text-sm text-muted-foreground">Allow others to share files with you</p>
                          </div>
                          <Switch
                            checked={privacy.allowFileSharing}
                            onCheckedChange={(checked) => setPrivacy({ ...privacy, allowFileSharing: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Show Online Status</Label>
                            <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                          </div>
                          <Switch
                            checked={privacy.showOnlineStatus}
                            onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Data Retention</Label>
                          <Select
                            value={privacy.dataRetention}
                            onValueChange={(value) => setPrivacy({ ...privacy, dataRetention: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30days">30 Days</SelectItem>
                              <SelectItem value="90days">90 Days</SelectItem>
                              <SelectItem value="1year">1 Year</SelectItem>
                              <SelectItem value="forever">Forever</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">How long to keep your deleted files in trash</p>
                        </div>
                      </div>

                      <Button onClick={handleSavePrivacy} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Privacy Settings"}
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
