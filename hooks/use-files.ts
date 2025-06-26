"use client"

import { useState, useEffect } from "react"

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

export function useFiles(folderId?: string) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles(folderId)
  }, [folderId])

  const fetchFiles = async (parentId?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockFolders: FileItem[] = [
        {
          id: "folder-1",
          name: "Documents",
          type: "folder",
          createdAt: new Date("2024-01-15"),
          modifiedAt: new Date("2024-01-20"),
          isEncrypted: true,
          isShared: false,
          parentId,
        },
        {
          id: "folder-2",
          name: "Images",
          type: "folder",
          createdAt: new Date("2024-01-10"),
          modifiedAt: new Date("2024-01-25"),
          isEncrypted: true,
          isShared: true,
          parentId,
        },
      ]

      const mockFiles: FileItem[] = [
        {
          id: "file-1",
          name: "presentation.pdf",
          type: "file",
          size: 2048576,
          mimeType: "application/pdf",
          createdAt: new Date("2024-01-18"),
          modifiedAt: new Date("2024-01-18"),
          isEncrypted: true,
          isShared: false,
          parentId,
        },
        {
          id: "file-2",
          name: "vacation-photo.jpg",
          type: "file",
          size: 1536000,
          mimeType: "image/jpeg",
          createdAt: new Date("2024-01-22"),
          modifiedAt: new Date("2024-01-22"),
          isEncrypted: true,
          isShared: true,
          thumbnail: "/placeholder.svg?height=64&width=64",
          parentId,
        },
        {
          id: "file-3",
          name: "report.docx",
          type: "file",
          size: 512000,
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          createdAt: new Date("2024-01-16"),
          modifiedAt: new Date("2024-01-19"),
          isEncrypted: true,
          isShared: false,
          parentId,
        },
        {
          id: "file-4",
          name: "demo-video.mp4",
          type: "file",
          size: 15728640,
          mimeType: "video/mp4",
          createdAt: new Date("2024-01-12"),
          modifiedAt: new Date("2024-01-12"),
          isEncrypted: true,
          isShared: true,
          parentId,
        },
      ]

      setFolders(mockFolders)
      setFiles(mockFiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files")
    } finally {
      setIsLoading(false)
    }
  }

  const createFolder = async (name: string, parentId?: string) => {
    try {
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name,
        type: "folder",
        createdAt: new Date(),
        modifiedAt: new Date(),
        isEncrypted: true,
        isShared: false,
        parentId,
      }

      setFolders((prev) => [...prev, newFolder])
      return newFolder
    } catch (err) {
      throw new Error("Failed to create folder")
    }
  }

  const deleteFiles = async (fileIds: string[]) => {
    try {
      setFiles((prev) => prev.filter((file) => !fileIds.includes(file.id)))
      setFolders((prev) => prev.filter((folder) => !fileIds.includes(folder.id)))
    } catch (err) {
      throw new Error("Failed to delete files")
    }
  }

  const renameFile = async (fileId: string, newName: string) => {
    try {
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, name: newName, modifiedAt: new Date() } : file)),
      )
      setFolders((prev) =>
        prev.map((folder) => (folder.id === fileId ? { ...folder, name: newName, modifiedAt: new Date() } : folder)),
      )
    } catch (err) {
      throw new Error("Failed to rename file")
    }
  }

  return {
    files,
    folders,
    isLoading,
    error,
    createFolder,
    deleteFiles,
    renameFile,
    refetch: () => fetchFiles(folderId),
  }
}
