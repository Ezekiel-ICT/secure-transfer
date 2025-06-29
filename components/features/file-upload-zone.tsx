"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle, Lock, Zap, Copy, Mail, Link, Shield, Eye, EyeOff, Download } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "pending" | "encrypting" | "uploading" | "completed" | "error"
  error?: string
  encryptionProgress?: number
  uploadSpeed?: string
  downloadUrl?: string
  encryptionKey?: string
}

export function FileUploadZone() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [totalProgress, setTotalProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [encryptionKey, setEncryptionKey] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [showEncryptionKey, setShowEncryptionKey] = useState(false)
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [encryptionLevel, setEncryptionLevel] = useState("aes256")
  const [expiryDate, setExpiryDate] = useState("")
  const [downloadLimit, setDownloadLimit] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper to generate random key
  const generateKey = () => {
    const key = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setEncryptionKey(key)
  }

  // Generate download URL
  const generateDownloadUrl = (fileId: string) => {
    return `${window.location.origin}/downloads/${fileId}`
  }

  // Modified handleFiles to show modal for first file
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setPendingFile(file)
    setShowModal(true)
  }, [])

  // Confirm upload from modal
  const confirmUpload = () => {
    if (!pendingFile) return
    const fileId = Math.random().toString(36).substr(2, 9)
    const downloadUrl = generateDownloadUrl(fileId)
    
    const newFile = {
      id: fileId,
      file: pendingFile,
      progress: 0,
      status: "pending",
      encryptionProgress: 0,
      downloadUrl,
      encryptionKey: encryptionEnabled ? encryptionKey : undefined,
    }
    setUploadFiles((prev) => [...prev, newFile])
    processFile(newFile)
    setShowModal(false)
    resetModal()
  }

  // Reset modal state
  const resetModal = () => {
    setPendingFile(null)
    setEncryptionKey("")
    setRecipientEmail("")
    setEmailMessage("")
    setShowEncryptionKey(false)
    setEncryptionEnabled(true)
    setEncryptionLevel("aes256")
    setExpiryDate("")
    setDownloadLimit("")
    setPassword("")
    setShowPassword(false)
    setActiveTab("upload")
  }

  // Cancel modal
  const cancelModal = () => {
    setShowModal(false)
    resetModal()
  }

  // Send email with file
  const sendEmail = async () => {
    if (!recipientEmail.trim()) {
      toast.error("Please enter a recipient email")
      return
    }

    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Email sent successfully!", {
        description: `File shared with ${recipientEmail}`
      })
    } catch (error) {
      toast.error("Failed to send email")
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const processFile = async (uploadFile: UploadFile) => {
    try {
      // Update status to encrypting
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "encrypting", progress: 5 } : f)),
      )

      // Simulate encryption with detailed progress
      if (uploadFile.encryptionKey) {
        await simulateEncryption(uploadFile.id)
      }

      // Update status to uploading
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading", progress: 30, uploadSpeed: "2.5 MB/s" } : f,
        ),
      )

      // Simulate upload with progress and speed
      await simulateUpload(uploadFile.id)

      // Mark as completed
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f)),
      )

      toast.success(`${uploadFile.file.name} uploaded successfully`, {
        description: "File encrypted and stored securely",
      })
    } catch (error) {
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f,
        ),
      )
      toast.error(`Failed to upload ${uploadFile.file.name}`)
    }
  }

  const simulateEncryption = async (fileId: string) => {
    // Simulate encryption progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                encryptionProgress: i,
                progress: 5 + i * 0.25, // 5% to 30% overall progress
              }
            : f,
        ),
      )
    }
  }

  const simulateUpload = async (fileId: string) => {
    const speeds = ["1.2 MB/s", "2.5 MB/s", "3.1 MB/s", "2.8 MB/s", "3.5 MB/s"]

    for (let i = 30; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)]

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress: i,
                uploadSpeed: randomSpeed,
              }
            : f,
        ),
      )
    }
  }

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const clearCompleted = () => {
    setUploadFiles((prev) => prev.filter((f) => f.status !== "completed"))
  }

  const retryFile = (fileId: string) => {
    const file = uploadFiles.find((f) => f.id === fileId)
    if (file) {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "pending", progress: 0, error: undefined } : f)),
      )
      processFile(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "encrypting":
        return <Lock className="w-4 h-4 text-blue-500 animate-pulse" />
      case "uploading":
        return <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
      default:
        return <File className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (file: UploadFile) => {
    switch (file.status) {
      case "pending":
        return "Pending"
      case "encrypting":
        return `Encrypting... ${file.encryptionProgress || 0}%`
      case "uploading":
        return `Uploading... ${file.uploadSpeed || ""}`
      case "completed":
        return "Completed"
      case "error":
        return "Error"
      default:
        return "Unknown"
    }
  }

  const completedFiles = uploadFiles.filter((f) => f.status === "completed").length
  const totalFiles = uploadFiles.length
  const hasActiveUploads = uploadFiles.some((f) => f.status === "uploading" || f.status === "encrypting")

  return (
    <div className="space-y-4">
      {/* Enhanced Modal for file details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-full rounded-2xl shadow-2xl border-0 bg-background p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Secure File Upload</h2>
                  <p className="text-blue-100 text-sm">Encrypt and share your files securely</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelModal}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <File className="w-4 h-4" />
                  File Details
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="share" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Share
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                {/* File Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border">
                      {pendingFile && (
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                            {pendingFile.type.startsWith("image/") ? (
                              <img 
                                src={URL.createObjectURL(pendingFile)} 
                                alt="preview" 
                                className="object-contain max-h-28 max-w-full rounded" 
                              />
                            ) : (
                              <File className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                            {pendingFile.name}
                          </h3>
                          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{formatFileSize(pendingFile.size)}</span>
                            <span>•</span>
                            <span>{pendingFile.type}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">Security Features</span>
                      </div>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• End-to-end encryption</li>
                        <li>• Secure file transfer</li>
                        <li>• Password protection available</li>
                        <li>• Download link expiration</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900 dark:text-green-100">Upload Benefits</span>
                      </div>
                      <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                        <li>• Fast upload speeds</li>
                        <li>• Resume capability</li>
                        <li>• Global CDN distribution</li>
                        <li>• Instant sharing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Encryption Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Enable Encryption</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Encrypt file before upload</p>
                      </div>
                      <Switch
                        checked={encryptionEnabled}
                        onCheckedChange={setEncryptionEnabled}
                      />
                    </div>

                    {encryptionEnabled && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Encryption Level</Label>
                          <select
                            value={encryptionLevel}
                            onChange={(e) => setEncryptionLevel(e.target.value)}
                            className="w-full mt-2 p-2 border rounded-lg bg-background"
                          >
                            <option value="aes128">AES-128 (Faster)</option>
                            <option value="aes256">AES-256 (More Secure)</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Encryption Key</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="relative flex-1">
                              <Input
                                type={showEncryptionKey ? "text" : "password"}
                                value={encryptionKey}
                                readOnly
                                placeholder="Click 'Generate Key' to create encryption key"
                                className="font-mono text-sm"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                              >
                                {showEncryptionKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                            <Button
                              onClick={generateKey}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Generate
                            </Button>
                          </div>
                          {encryptionKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => copyToClipboard(encryptionKey, "Encryption key")}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Key
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Password Protection */}
                    <div>
                      <Label className="text-base font-medium">Password Protection</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Add password to download link</p>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password (optional)"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Access Control */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Access Control</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Set download restrictions</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Expiration Date</Label>
                      <Input
                        type="datetime-local"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Download Limit</Label>
                      <Input
                        type="number"
                        value={downloadLimit}
                        onChange={(e) => setDownloadLimit(e.target.value)}
                        placeholder="Unlimited"
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited downloads</p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">Security Note</span>
                      </div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Keep your encryption key safe. It's required to decrypt and download the file.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="share" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Email Sharing */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Share via Email</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Send file directly to recipients</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Recipient Email</Label>
                      <Input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="recipient@example.com"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Message (Optional)</Label>
                      <Textarea
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={sendEmail}
                      disabled={!recipientEmail.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>

                  {/* Download Link Preview */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Download Link</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Share this link with others</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Link className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">Generated Link</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded border p-3 font-mono text-xs break-all">
                        {pendingFile ? generateDownloadUrl(Math.random().toString(36).substr(2, 9)) : "Link will be generated after upload"}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => copyToClipboard(generateDownloadUrl(Math.random().toString(36).substr(2, 9)), "Download link")}
                        disabled={!pendingFile}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">Download Process</span>
                      </div>
                      <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>1. Recipient clicks the download link</li>
                        <li>2. Enters the encryption key (if required)</li>
                        <li>3. File is decrypted and downloaded</li>
                        <li>4. Download is tracked and logged</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={cancelModal}>
                  Cancel
                </Button>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {pendingFile && (
                    <span>File: {pendingFile.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setActiveTab(activeTab === "upload" ? "security" : activeTab === "security" ? "share" : "upload")}
                  variant="outline"
                  disabled={activeTab === "share"}
                >
                  {activeTab === "upload" ? "Next: Security" : activeTab === "security" ? "Next: Share" : "Previous"}
                </Button>
                <Button
                  onClick={confirmUpload}
                  disabled={!pendingFile || (encryptionEnabled && !encryptionKey)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 scale-105"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="*/*"
        />
        <div className={`transition-all duration-200 ${isDragActive ? "scale-110" : ""}`}>
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? "text-blue-500" : "text-gray-400"}`} />
          {isDragActive ? (
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Maximum file size: 100MB. All files are encrypted before upload.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Fast upload</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Upload Queue ({completedFiles}/{totalFiles})
            </h3>
            <div className="flex gap-2">
              {completedFiles > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
              {hasActiveUploads && (
                <Badge variant="secondary" className="animate-pulse">
                  Uploading...
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {uploadFiles.map((uploadFile) => (
              <Card key={uploadFile.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getStatusIcon(uploadFile.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{uploadFile.file.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatFileSize(uploadFile.file.size)}</span>
                          <span>•</span>
                          <span>{getStatusText(uploadFile)}</span>
                          {uploadFile.status === "completed" && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                <Lock className="w-2 h-2 mr-1" />
                                Encrypted
                              </Badge>
                            </>
                          )}
                        </div>
                        {uploadFile.status === "completed" && uploadFile.downloadUrl && (
                          <div className="flex items-center gap-2 mt-2">
                            <Link className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-mono truncate">
                              {uploadFile.downloadUrl}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(uploadFile.downloadUrl!, "Download link")}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadFile.status === "error" && (
                        <Button variant="outline" size="sm" onClick={() => retryFile(uploadFile.id)}>
                          Retry
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        disabled={uploadFile.status === "uploading" || uploadFile.status === "encrypting"}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {uploadFile.status !== "completed" && uploadFile.status !== "error" && (
                    <div className="space-y-1">
                      <Progress value={uploadFile.progress} className="h-2" />
                      {uploadFile.status === "encrypting" && uploadFile.encryptionProgress !== undefined && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Encrypting with AES-256...</span>
                          <span>{uploadFile.encryptionProgress}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadFile.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                      <p className="text-xs text-red-600 dark:text-red-400">{uploadFile.error}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
