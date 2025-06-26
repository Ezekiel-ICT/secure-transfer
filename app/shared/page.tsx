"use client"

import type React from "react"

import { useState } from "react"
import { Eye, File, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePreview } from "@/components/features/file-preview"

interface SharedFile {
  id: string
  name: string
  size: number
  type: string
  sharedAt: Date
  lastAccessed: Date | null
  isPasswordProtected: boolean
  thumbnail: string | null
}

const data: SharedFile[] = [
  {
    id: "1",
    name: "Document.pdf",
    size: 2.1,
    type: "pdf",
    sharedAt: new Date(),
    lastAccessed: new Date(),
    isPasswordProtected: false,
    thumbnail: null,
  },
  {
    id: "2",
    name: "Presentation.pptx",
    size: 4.3,
    type: "pptx",
    sharedAt: new Date(),
    lastAccessed: null,
    isPasswordProtected: true,
    thumbnail: null,
  },
  {
    id: "3",
    name: "Image.jpg",
    size: 1.8,
    type: "jpg",
    sharedAt: new Date(),
    lastAccessed: new Date(),
    isPasswordProtected: false,
    thumbnail: "https://via.placeholder.com/150",
  },
]

interface FileItem {
  id: string
  name: string
  type: "file"
  size: number
  mimeType: string
  createdAt: Date
  modifiedAt: Date
  isEncrypted: boolean
  isShared: boolean
  thumbnail: string | null
}

const SharedPage = () => {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handlePreview = (file: SharedFile) => {
    // Convert SharedFile to FileItem format for preview
    const fileItem = {
      id: file.id,
      name: file.name,
      type: "file" as const,
      size: file.size,
      mimeType: file.type,
      createdAt: file.sharedAt,
      modifiedAt: file.lastAccessed || file.sharedAt,
      isEncrypted: file.isPasswordProtected,
      isShared: true,
      thumbnail: file.thumbnail,
    }
    setPreviewFile(fileItem)
    setPreviewOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Shared Files</h2>
          <p className="text-sm text-muted-foreground">Manage and view files shared by you and with you.</p>
        </div>
      </div>
      <Tabs defaultValue="shared" className="mt-6">
        <TabsList>
          <TabsTrigger value="shared">Files I've Shared</TabsTrigger>
          <TabsTrigger value="with-me">Files Shared with Me</TabsTrigger>
        </TabsList>
        <TabsContent value="shared" className="mt-4">
          <Table>
            <TableCaption>Files you have shared with others.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Shared At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{file.size} MB</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.sharedAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(file)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Share dialog")}>
                          <User className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.success("Download started")}>
                          <File className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total {data.length} files shared.</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TabsContent>
        <TabsContent value="with-me" className="mt-4">
          <Table>
            <TableCaption>Files shared with you by others.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Shared At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{file.size} MB</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.sharedAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(file)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Download started")}>
                          <File className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total {data.length} files shared with you.</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TabsContent>
      </Tabs>
      <FilePreview
        file={previewFile}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onShare={(fileName) => toast.success(`Share dialog for ${fileName}`)}
        onDownload={(fileId) => toast.success("Download started")}
      />
    </div>
  )
}

function MoreHorizontal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}

export default SharedPage
