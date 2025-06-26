"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  File,
  Folder,
  FileText,
  Archive,
  Video,
  Music,
  MoreHorizontal,
  Download,
  Share,
  Trash,
  Edit,
  Lock,
  ImageIcon,
  Eye,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { QuickPreview } from "./quick-preview"

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

interface FileBrowserProps {
  items: FileItem[]
  viewMode: "grid" | "list"
  selectedFiles: string[]
  onSelectionChange: (selected: string[]) => void
  onShare: (fileName: string) => void
  onDelete: (fileIds: string[]) => void
  onPreview?: (file: FileItem) => void
}

export function FileBrowser({
  items,
  viewMode,
  selectedFiles,
  onSelectionChange,
  onShare,
  onDelete,
  onPreview,
}: FileBrowserProps) {
  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder") return Folder

    if (item.mimeType?.startsWith("image/")) return ImageIcon
    if (item.mimeType?.startsWith("video/")) return Video
    if (item.mimeType?.startsWith("audio/")) return Music
    if (item.mimeType?.includes("text") || item.mimeType?.includes("document")) return FileText
    if (item.mimeType?.includes("zip") || item.mimeType?.includes("archive")) return Archive

    return File
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedFiles, itemId])
    } else {
      onSelectionChange(selectedFiles.filter((id) => id !== itemId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(items.map((item) => item.id))
    } else {
      onSelectionChange([])
    }
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Folder className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
            No files match your current search and filter criteria. Try adjusting your search terms or filters.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedFiles.length === items.length && items.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Select all ({items.length} items)</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {items.map((item) => {
            const Icon = getFileIcon(item)
            const isSelected = selectedFiles.includes(item.id)

            return (
              <QuickPreview file={item} key={item.id}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => handleItemSelect(item.id, !isSelected)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {item.type === "file" && (
                            <>
                              <DropdownMenuItem onClick={() => onPreview?.(item)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => onShare(item.name)}>
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => onDelete([item.id])}>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div
                        className="relative mb-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.type === "file") onPreview?.(item)
                        }}
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <Icon
                            className={`w-16 h-16 hover:opacity-80 transition-opacity ${
                              item.type === "folder"
                                ? "text-blue-500"
                                : item.mimeType?.startsWith("image/")
                                  ? "text-green-500"
                                  : item.mimeType?.startsWith("video/")
                                    ? "text-purple-500"
                                    : item.mimeType?.includes("document")
                                      ? "text-blue-600"
                                      : "text-gray-400"
                            }`}
                          />
                        )}
                        {item.isEncrypted && <Lock className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />}
                        {item.type === "file" && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-medium text-sm truncate w-full mb-1" title={item.name}>
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        {item.size && <span>{formatFileSize(item.size)}</span>}
                        {item.size && <span>•</span>}
                        <span>{formatDistanceToNow(item.modifiedAt, { addSuffix: true })}</span>
                      </div>

                      <div className="flex gap-1 flex-wrap justify-center">
                        {item.isShared && (
                          <Badge variant="secondary" className="text-xs">
                            Shared
                          </Badge>
                        )}
                        {item.isEncrypted && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="w-2 h-2 mr-1" />
                            Encrypted
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </QuickPreview>
            )
          })}
        </div>
      </div>
    )
  }

  // List view
  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center space-x-2 p-4 border-b bg-gray-50 dark:bg-gray-800">
          <Checkbox
            checked={selectedFiles.length === items.length && items.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <div className="flex-1 grid grid-cols-5 gap-4 text-sm font-medium text-gray-500">
            <span>Name</span>
            <span>Size</span>
            <span>Modified</span>
            <span>Status</span>
            <span></span>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y">
          {items.map((item) => {
            const Icon = getFileIcon(item)
            const isSelected = selectedFiles.includes(item.id)

            return (
              <div
                key={item.id}
                className={`flex items-center space-x-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                  isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => handleItemSelect(item.id, !isSelected)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Icon
                        className={`w-5 h-5 ${
                          item.type === "folder"
                            ? "text-blue-500"
                            : item.mimeType?.startsWith("image/")
                              ? "text-green-500"
                              : item.mimeType?.startsWith("video/")
                                ? "text-purple-500"
                                : item.mimeType?.includes("document")
                                  ? "text-blue-600"
                                  : "text-gray-400"
                        }`}
                      />
                      {item.isEncrypted && <Lock className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />}
                    </div>
                    <span className="font-medium truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm text-gray-500">{item.size ? formatFileSize(item.size) : "—"}</span>

                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(item.modifiedAt, { addSuffix: true })}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.isShared && (
                      <Badge variant="secondary" className="text-xs">
                        Shared
                      </Badge>
                    )}
                    {item.isEncrypted && (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="w-2 h-2 mr-1" />
                        Encrypted
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.type === "file" && (
                          <>
                            <DropdownMenuItem onClick={() => onPreview?.(item)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => onShare(item.name)}>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete([item.id])}>
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
