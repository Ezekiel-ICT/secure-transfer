"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Download, 
  Lock, 
  File, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  Copy,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

interface FileInfo {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  encryptionLevel: string
  expiryDate: string
}

export default function DownloadPage() {
  const params = useParams()
  const router = useRouter()
  const fileId = params?.id as string

  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [encryptionKey, setEncryptionKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState("")
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (fileId) {
      fetchFileInfo()
    }
  }, [fileId])

  const fetchFileInfo = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Simulate API call to fetch file info
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock file info - in real app, this would come from your API
      const mockFileInfo: FileInfo = {
        id: fileId,
        name: "document.pdf",
        size: 2457600, // 2.4 MB
        type: "application/pdf",
        uploadDate: "2024-01-15T10:30:00Z",
        encryptionLevel: "AES-256",
        expiryDate: "2024-02-15T10:30:00Z"
      }
      
      setFileInfo(mockFileInfo)
    } catch (err) {
      setError("File not found or has expired")
    } finally {
      setIsLoading(false)
    }
  }

  const validateKey = async (key: string) => {
    if (!key.trim()) {
      setIsKeyValid(null)
      return
    }

    try {
      // Simulate key validation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock validation - in real app, this would validate against your backend
      const isValid = key.length >= 16 // Simple validation for demo
      setIsKeyValid(isValid)
      
      if (!isValid) {
        setError("Invalid encryption key. Please check and try again.")
      } else {
        setError("")
      }
    } catch (err) {
      setError("Error validating encryption key")
      setIsKeyValid(false)
    }
  }

  const handleKeyChange = (value: string) => {
    setEncryptionKey(value)
    setIsKeyValid(null)
    setError("")
    
    // Debounced validation
    setTimeout(() => validateKey(value), 1000)
  }

  const handleDownload = async () => {
    if (!fileInfo || !encryptionKey || !isKeyValid) return

    try {
      setIsDecrypting(true)
      setDownloadProgress(0)
      setError("")

      // Simulate decryption process
      for (let i = 0; i <= 50; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setDownloadProgress(i)
      }

      setIsDecrypting(false)
      setIsDownloading(true)

      // Simulate download process
      for (let i = 50; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setDownloadProgress(i)
      }

      // In a real app, you would initiate the actual file download here
      toast.success("File downloaded successfully!")
      
      // Reset states
      setIsDownloading(false)
      setDownloadProgress(0)
      
    } catch (err) {
      setError("Download failed. Please try again.")
      setIsDecrypting(false)
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const copyDownloadLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Download link copied to clipboard!")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading file information...</p>
        </div>
      </div>
    )
  }

  if (error && !fileInfo) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-800 dark:text-red-200">File Not Found</CardTitle>
            <CardDescription>
              The file you're looking for doesn't exist or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyDownloadLink}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Secure File Download
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your encryption key to decrypt and download the file
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* File Information Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="w-5 h-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {fileInfo && (
                <>
                  {/* File Preview */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <File className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{fileInfo.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{fileInfo.type}</p>
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">File Size</Label>
                      <p className="font-semibold">{formatFileSize(fileInfo.size)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">Encryption</Label>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">{fileInfo.encryptionLevel}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">Uploaded</Label>
                      <p className="font-semibold">{formatDate(fileInfo.uploadDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">Expires</Label>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-semibold">{formatDate(fileInfo.expiryDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      This file is encrypted with military-grade AES-256 encryption. 
                      You need the correct encryption key to decrypt and download it.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>

          {/* Download Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Decrypt & Download
              </CardTitle>
              <CardDescription>
                Enter the encryption key provided by the file sender
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Encryption Key Input */}
              <div className="space-y-3">
                <Label htmlFor="encryptionKey" className="font-medium">
                  Encryption Key *
                </Label>
                <div className="relative">
                  <Input
                    id="encryptionKey"
                    type={showKey ? "text" : "password"}
                    value={encryptionKey}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    placeholder="Enter your encryption key..."
                    className={`pr-10 font-mono ${
                      isKeyValid === true ? "border-green-500 bg-green-50 dark:bg-green-950" :
                      isKeyValid === false ? "border-red-500 bg-red-50 dark:bg-red-950" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                {/* Key Validation Status */}
                {isKeyValid === true && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Valid encryption key</span>
                  </div>
                )}
                {isKeyValid === false && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Invalid encryption key</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Progress Bar */}
              {(isDecrypting || isDownloading) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {isDecrypting ? "Decrypting file..." : "Downloading..."}
                    </span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}

              {/* Download Button */}
              <Button 
                onClick={handleDownload}
                disabled={!encryptionKey || !isKeyValid || isDecrypting || isDownloading}
                className="w-full"
                size="lg"
              >
                {isDecrypting ? (
                  <>
                    <Lock className="w-4 h-4 mr-2 animate-pulse" />
                    Decrypting...
                  </>
                ) : isDownloading ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Decrypt & Download File
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Security Notice</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your encryption key is never stored on our servers. The decryption happens 
                      locally in your browser for maximum security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
 