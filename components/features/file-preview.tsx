"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  Share,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Play,
  Pause,
  Volume2,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: number
  mimeType?: string
  createdAt: Date
  modifiedAt: Date
  isEncrypted: boolean
  isShared: boolean
  thumbnail?: string
  url?: string // Mock URL for preview
}

interface FilePreviewProps {
  file: FileItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onShare?: (fileName: string) => void
  onDownload?: (fileId: string) => void
}

export function FilePreview({ file, open, onOpenChange, onShare, onDownload }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (file && open) {
      setIsLoading(true)
      setError(null)
      setZoom(100)
      setRotation(0)

      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [file, open])

  if (!file) return null

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = file.mimeType?.startsWith("image/")
  const isPDF = file.mimeType === "application/pdf"
  const isVideo = file.mimeType?.startsWith("video/")
  const isAudio = file.mimeType?.startsWith("audio/")
  const isText = file.mimeType?.startsWith("text/") || file.mimeType?.includes("document")

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-sm text-gray-500">Loading preview...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Preview Error</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => setError(null)}>
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    // Image Preview
    if (isImage) {
      return (
        <div className="relative">
          <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={file.thumbnail || `/placeholder.svg?height=400&width=600`}
              alt={file.name}
              className="max-w-full max-h-96 object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Image Controls */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))} disabled={zoom <= 25}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-500 min-w-16 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setZoom(100)
                setRotation(0)
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )
    }

    // PDF Preview
    if (isPDF) {
      return (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">PDF Document</h3>
            <p className="text-sm text-gray-500 mb-4">
              PDF preview is not available in this demo. Click download to view the full document.
            </p>
            <Button onClick={() => onDownload?.(file.id)}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      )
    }

    // Video Preview
    if (isVideo) {
      return (
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              className="w-full max-h-96"
              controls
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const video = document.querySelector("video")
                if (video) {
                  if (isPlaying) {
                    video.pause()
                  } else {
                    video.play()
                  }
                }
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )
    }

    // Audio Preview
    if (isAudio) {
      return (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8 text-center text-white">
            <Volume2 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="font-medium mb-2">{file.name}</h3>
            <p className="text-sm opacity-90 mb-4">Audio File</p>
          </div>

          <audio className="w-full" controls preload="metadata">
            <source src="/placeholder-audio.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )
    }

    // Text/Document Preview
    if (isText) {
      return (
        <div className="space-y-4">
          <ScrollArea className="h-96 w-full border rounded-lg">
            <div className="p-4 font-mono text-sm">
              <div className="text-gray-500 mb-4">
                # {file.name}
                <br /># This is a preview of the document content
                <br /># In a real application, you would fetch and display the actual file content
              </div>
              <div className="space-y-2">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </p>
                <br />
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                <p>
                  Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                  sunt.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      )
    }

    // Unsupported file type
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Preview Not Available</h3>
          <p className="text-sm text-gray-500 mb-4">
            This file type cannot be previewed. Download the file to view its contents.
          </p>
          <Button onClick={() => onDownload?.(file.id)}>
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg font-semibold truncate pr-4">{file.name}</DialogTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>Modified {formatDistanceToNow(file.modifiedAt, { addSuffix: true })}</span>
              <span>•</span>
              <span className="capitalize">{file.mimeType?.split("/")[0] || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {file.isEncrypted && (
                <Badge variant="outline" className="text-xs">
                  🔒 Encrypted
                </Badge>
              )}
              {file.isShared && (
                <Badge variant="secondary" className="text-xs">
                  📤 Shared
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onShare?.(file.name)}>
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDownload?.(file.id)}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">{renderPreviewContent()}</div>
      </DialogContent>
    </Dialog>
  )
}
