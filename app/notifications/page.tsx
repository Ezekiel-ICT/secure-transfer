"use client"

import { useState } from "react"
import { AuthProvider } from "@/contexts/auth-context"

import { NotificationProvider } from "@/contexts/notification-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Example notification data
const notifications = [
  {
    id: 1,
    title: "File Uploaded",
    message: "Your file 'Document.pdf' was uploaded successfully.",
    date: new Date().toLocaleString(),
    type: "success",
  },
  {
    id: 2,
    title: "File Shared",
    message: "You shared 'Presentation.pptx' with John Doe.",
    date: new Date().toLocaleString(),
    type: "info",
  },
  {
    id: 3,
    title: "Security Alert",
    message: "A new device was used to access your account.",
    date: new Date().toLocaleString(),
    type: "warning",
  },
]

export default function NotificationsPage() {
  const [allNotifications] = useState(notifications)
  return (
      <AuthProvider>
        <NotificationProvider>
          <DashboardLayout>
            <div className="container mx-auto py-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Notifications</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allNotifications.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell>{n.title}</TableCell>
                      <TableCell>{n.message}</TableCell>
                      <TableCell>{n.date}</TableCell>
                      <TableCell>{n.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DashboardLayout>
        </NotificationProvider>
      </AuthProvider>
  )
}
