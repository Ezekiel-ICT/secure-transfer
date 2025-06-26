"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { File, FileText, Video, Download, Share, MoreHorizontal, ImageIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RecentFile {
  id: string
  name: string
  type: string
  size: number
  modifiedAt: Date
  isShared: boolean
}

export function RecentFiles() {
  const recentFiles: RecentFile[] = [
    {
      id: "1",
      name: "Project Proposal.pdf",
      type: "application/pdf",
      size: 2048576,
      modifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isShared: true,
    },
    {
      id: "2",
      name: "Team Photo.jpg",
      type: "image/jpeg",
      size: 1536000,
      modifiedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isShared: false,
    },
    {
      id: "3",
      name: "Meeting Notes.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 512000,
      modifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isShared: true,
    },
    {
      id: "4",
      name: "Demo Video.mp4",
      type: "video/mp4",
      size: 15728640,
      modifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isShared: false,
    },
  ]

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    if (type.includes("document") || type.includes("text")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Files</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <a href="/files">View All</a>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFiles.map((file) => {
            const Icon = getFileIcon(file.type)
            return (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Icon className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(file.modifiedAt, { addSuffix: true })}</span>
                      {file.isShared && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            Shared
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
