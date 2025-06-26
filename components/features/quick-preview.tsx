"use client"

import type React from "react"

import { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Video, Volume2, ImageIcon, Lock } from "lucide-react"
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
}

interface QuickPreviewProps {
  file: FileItem
  children: React.ReactNode
}

export function QuickPreview({ file, children }: QuickPreviewProps) {
  const [imageError, setImageError] = useState(false)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = () => {
    if (file.mimeType?.startsWith("image/")) return ImageIcon
    if (file.mimeType?.startsWith("video/")) return Video
    if (file.mimeType?.startsWith("audio/")) return Volume2
    return FileText
  }

  const isImage = file.mimeType?.startsWith("image/")
  const Icon = getFileIcon()

  return (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" side="right" align="start">
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative">
            {isImage && file.thumbnail && !imageError ? (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={file.thumbnail || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                <Icon className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {file.isEncrypted && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-green-500 bg-white dark:bg-gray-800 rounded p-0.5" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h4>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{formatDistanceToNow(file.modifiedAt, { addSuffix: true })}</span>
            </div>

            <div className="flex items-center gap-1">
              {file.isShared && (
                <Badge variant="secondary" className="text-xs">
                  Shared
                </Badge>
              )}
              {file.isEncrypted && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-2 h-2 mr-1" />
                  Encrypted
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Eye className="w-3 h-3" />
              <span>Click to preview</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
