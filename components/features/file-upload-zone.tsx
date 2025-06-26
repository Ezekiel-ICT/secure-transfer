"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle, Lock, Zap } from "lucide-react"
import { toast } from "sonner"

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "pending" | "encrypting" | "uploading" | "completed" | "error"
  error?: string
  encryptionProgress?: number
  uploadSpeed?: string
}

export function FileUploadZone() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [totalProgress, setTotalProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 100MB.`)
        return false
      }
      return true
    })

    const newFiles: UploadFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending",
      encryptionProgress: 0,
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])

    // Start processing files
    newFiles.forEach((uploadFile) => {
      processFile(uploadFile)
    })
  }, [])

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
      await simulateEncryption(uploadFile.id)

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
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
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
