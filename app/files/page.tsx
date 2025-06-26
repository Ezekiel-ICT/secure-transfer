"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Grid, List, Upload, FolderPlus, Filter, SortAsc, Share, Trash } from "lucide-react"
import { toast } from "sonner"
import { FileBrowser } from "@/components/features/file-browser"
import { ShareDialog } from "@/components/features/share-dialog"
import { CreateFolderDialog } from "@/components/features/create-folder-dialog"
import { NotificationProvider } from "@/contexts/notification-context"
import { FilePreview } from "@/components/features/file-preview"

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
  parentId?: string
}

export default function FilesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [selectedFileForShare, setSelectedFileForShare] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Mock file data
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "file-1",
      name: "Project Proposal.pdf",
      type: "file",
      size: 2048576,
      mimeType: "application/pdf",
      createdAt: new Date("2024-01-18"),
      modifiedAt: new Date("2024-01-18"),
      isEncrypted: true,
      isShared: false,
    },
    {
      id: "file-2",
      name: "Team Photo.jpg",
      type: "file",
      size: 1536000,
      mimeType: "image/jpeg",
      createdAt: new Date("2024-01-22"),
      modifiedAt: new Date("2024-01-22"),
      isEncrypted: true,
      isShared: true,
      thumbnail: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "file-3",
      name: "Meeting Notes.docx",
      type: "file",
      size: 512000,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      createdAt: new Date("2024-01-16"),
      modifiedAt: new Date("2024-01-19"),
      isEncrypted: true,
      isShared: false,
    },
    {
      id: "file-4",
      name: "Demo Video.mp4",
      type: "file",
      size: 15728640,
      mimeType: "video/mp4",
      createdAt: new Date("2024-01-12"),
      modifiedAt: new Date("2024-01-12"),
      isEncrypted: true,
      isShared: true,
    },
  ])

  const [folders, setFolders] = useState<FileItem[]>([
    {
      id: "folder-1",
      name: "Documents",
      type: "folder",
      createdAt: new Date("2024-01-15"),
      modifiedAt: new Date("2024-01-20"),
      isEncrypted: true,
      isShared: false,
    },
    {
      id: "folder-2",
      name: "Images",
      type: "folder",
      createdAt: new Date("2024-01-10"),
      modifiedAt: new Date("2024-01-25"),
      isEncrypted: true,
      isShared: true,
    },
  ])

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

  const handleShare = (fileName: string) => {
    setSelectedFileForShare(fileName)
    setShareDialogOpen(true)
  }

  const handleDelete = (fileIds: string[]) => {
    setFiles((prev) => prev.filter((file) => !fileIds.includes(file.id)))
    setFolders((prev) => prev.filter((folder) => !fileIds.includes(folder.id)))
    setSelectedFiles([])
    toast.success(`${fileIds.length} item(s) deleted successfully`)
  }

  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      createdAt: new Date(),
      modifiedAt: new Date(),
      isEncrypted: true,
      isShared: false,
    }
    setFolders((prev) => [...prev, newFolder])
    toast.success(`Folder "${name}" created successfully`)
  }

  const handlePreview = (file: FileItem) => {
    setPreviewFile(file)
    setPreviewOpen(true)
  }

  const handleDownload = (fileId: string) => {
    toast.success("Download started")
    // In a real app, this would trigger the actual download
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

  const allItems = [...folders, ...files]
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "shared" && item.isShared) ||
      (filterBy === "folders" && item.type === "folder") ||
      (filterBy === "files" && item.type === "file")

    return matchesSearch && matchesFilter
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Always show folders first
    if (a.type === "folder" && b.type === "file") return -1
    if (a.type === "file" && b.type === "folder") return 1

    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "date":
        return b.modifiedAt.getTime() - a.modifiedAt.getTime()
      case "size":
        return (b.size || 0) - (a.size || 0)
      default:
        return 0
    }
  })

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <DashboardLayout>
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Files</h1>
                  <p className="text-gray-600 dark:text-gray-400">Manage your encrypted files and folders</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                  <Button onClick={() => router.push("/dashboard")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search files and folders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-32">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Items</SelectItem>
                          <SelectItem value="files">Files Only</SelectItem>
                          <SelectItem value="folders">Folders Only</SelectItem>
                          <SelectItem value="shared">Shared Items</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                          <SortAsc className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="date">Date Modified</SelectItem>
                          <SelectItem value="size">Size</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* View Mode Toggle */}
                      <div className="flex border rounded-lg">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="rounded-r-none"
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-l-none"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{sortedItems.length} items</span>
                      {selectedFiles.length > 0 && <span>{selectedFiles.length} selected</span>}
                      {searchQuery && <span>Searching for "{searchQuery}"</span>}
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const fileName = sortedItems.find((item) => item.id === selectedFiles[0])?.name
                            if (fileName) handleShare(fileName)
                          }}
                          disabled={selectedFiles.length !== 1}
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(selectedFiles)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
                          Clear Selection
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* File Browser */}
              <FileBrowser
                items={sortedItems}
                viewMode={viewMode}
                selectedFiles={selectedFiles}
                onSelectionChange={setSelectedFiles}
                onShare={handleShare}
                onDelete={handleDelete}
                onPreview={handlePreview}
              />

              {/* Dialogs */}
              <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} fileName={selectedFileForShare} />
              <CreateFolderDialog
                open={createFolderOpen}
                onOpenChange={setCreateFolderOpen}
                onCreate={handleCreateFolder}
              />
              <FilePreview
                file={previewFile}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                onShare={handleShare}
                onDownload={handleDownload}
              />
            </div>
          </DashboardLayout>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
