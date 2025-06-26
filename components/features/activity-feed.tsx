"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Share, Download, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: "upload" | "share" | "download" | "delete"
  description: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
}

export function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "upload",
      description: 'Uploaded "Project Proposal.pdf"',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: { name: "You" },
    },
    {
      id: "2",
      type: "share",
      description: 'Shared "Team Photo.jpg" with john@example.com',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: { name: "You" },
    },
    {
      id: "3",
      type: "download",
      description: 'Downloaded "Meeting Notes.docx"',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    },
    {
      id: "4",
      type: "upload",
      description: 'Uploaded "Demo Video.mp4"',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: { name: "You" },
    },
    {
      id: "5",
      type: "delete",
      description: 'Deleted "Old Backup.zip"',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: { name: "You" },
    },
  ]

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4 text-blue-500" />
      case "share":
        return <Share className="w-4 h-4 text-green-500" />
      case "download":
        return <Download className="w-4 h-4 text-purple-500" />
      case "delete":
        return <Trash className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {activity.user && (
                    <>
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">{activity.user.name}</span>
                      <span className="text-xs text-gray-400">•</span>
                    </>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
