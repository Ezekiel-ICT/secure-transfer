"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Share, Mail, QrCode, Calendar, Lock, Download, Eye } from "lucide-react"
import { toast } from "sonner"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string | null
}

export function ShareDialog({ open, onOpenChange, fileName }: ShareDialogProps) {
  const [shareSettings, setShareSettings] = useState({
    password: "",
    enablePassword: false,
    expirationDate: "",
    enableExpiration: false,
    downloadLimit: "",
    enableDownloadLimit: false,
    allowPreview: true,
    notifyOnAccess: true,
  })

  const [shareLink, setShareLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  const generateShareLink = async () => {
    setIsGenerating(true)

    try {
      // Simulate API call to generate secure share link
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockLink = `https://securetransfer.app/s/${Math.random().toString(36).substr(2, 12)}`
      setShareLink(mockLink)
      toast.success("Share link generated successfully!")
    } catch (error) {
      toast.error("Failed to generate share link")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const sendEmail = async () => {
    if (!emailRecipients.trim()) {
      toast.error("Please enter at least one email address")
      return
    }

    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Email sent successfully!")
      setEmailRecipients("")
      setEmailMessage("")
    } catch (error) {
      toast.error("Failed to send email")
    }
  }

  const getExpirationOptions = () => [
    { value: "1h", label: "1 hour" },
    { value: "24h", label: "24 hours" },
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "custom", label: "Custom date" },
  ]

  const getDownloadLimitOptions = () => [
    { value: "1", label: "1 download" },
    { value: "5", label: "5 downloads" },
    { value: "10", label: "10 downloads" },
    { value: "25", label: "25 downloads" },
    { value: "unlimited", label: "Unlimited" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="w-5 h-5" />
            Share File
          </DialogTitle>
          <DialogDescription>
            Share "{fileName}" securely with others. Configure access permissions and security settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure password protection and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password Protection */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Password Protection</Label>
                  <p className="text-sm text-muted-foreground">Require a password to access the file</p>
                </div>
                <Switch
                  checked={shareSettings.enablePassword}
                  onCheckedChange={(checked) => setShareSettings({ ...shareSettings, enablePassword: checked })}
                />
              </div>

              {shareSettings.enablePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={shareSettings.password}
                    onChange={(e) => setShareSettings({ ...shareSettings, password: e.target.value })}
                  />
                </div>
              )}

              {/* Expiration Date */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Expiration Date</Label>
                  <p className="text-sm text-muted-foreground">Automatically expire the share link</p>
                </div>
                <Switch
                  checked={shareSettings.enableExpiration}
                  onCheckedChange={(checked) => setShareSettings({ ...shareSettings, enableExpiration: checked })}
                />
              </div>

              {shareSettings.enableExpiration && (
                <div className="space-y-2">
                  <Label>Expires in</Label>
                  <Select
                    value={shareSettings.expirationDate}
                    onValueChange={(value) => setShareSettings({ ...shareSettings, expirationDate: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiration time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getExpirationOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Download Limit */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Download Limit</Label>
                  <p className="text-sm text-muted-foreground">Limit the number of downloads</p>
                </div>
                <Switch
                  checked={shareSettings.enableDownloadLimit}
                  onCheckedChange={(checked) => setShareSettings({ ...shareSettings, enableDownloadLimit: checked })}
                />
              </div>

              {shareSettings.enableDownloadLimit && (
                <div className="space-y-2">
                  <Label>Maximum downloads</Label>
                  <Select
                    value={shareSettings.downloadLimit}
                    onValueChange={(value) => setShareSettings({ ...shareSettings, downloadLimit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select download limit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDownloadLimitOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Preview</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow recipients to preview the file without downloading
                  </p>
                </div>
                <Switch
                  checked={shareSettings.allowPreview}
                  onCheckedChange={(checked) => setShareSettings({ ...shareSettings, allowPreview: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notify on Access</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone accesses the file</p>
                </div>
                <Switch
                  checked={shareSettings.notifyOnAccess}
                  onCheckedChange={(checked) => setShareSettings({ ...shareSettings, notifyOnAccess: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Share Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Link</CardTitle>
              <CardDescription>Generate a secure link to share your file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!shareLink ? (
                <Button onClick={generateShareLink} disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Share Link"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={shareLink} readOnly className="flex-1" />
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {shareSettings.enablePassword && (
                      <Badge variant="secondary">
                        <Lock className="w-3 h-3 mr-1" />
                        Password Protected
                      </Badge>
                    )}
                    {shareSettings.enableExpiration && (
                      <Badge variant="secondary">
                        <Calendar className="w-3 h-3 mr-1" />
                        Expires {shareSettings.expirationDate}
                      </Badge>
                    )}
                    {shareSettings.enableDownloadLimit && (
                      <Badge variant="secondary">
                        <Download className="w-3 h-3 mr-1" />
                        {shareSettings.downloadLimit} downloads max
                      </Badge>
                    )}
                    {shareSettings.allowPreview && (
                      <Badge variant="secondary">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview enabled
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Sharing
              </CardTitle>
              <CardDescription>Send the share link directly via email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  placeholder="Enter email addresses separated by commas"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={sendEmail} disabled={!shareLink} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
