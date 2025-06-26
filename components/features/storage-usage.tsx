"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { HardDrive, Zap } from "lucide-react"

export function StorageUsage() {
  const totalStorage = 10 * 1024 * 1024 * 1024 // 10GB in bytes
  const usedStorage = 2.4 * 1024 * 1024 * 1024 // 2.4GB in bytes
  const usagePercentage = (usedStorage / totalStorage) * 100

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(1)} GB`
  }

  const storageBreakdown = [
    { type: "Documents", size: 0.8 * 1024 * 1024 * 1024, color: "bg-blue-500" },
    { type: "Images", size: 0.9 * 1024 * 1024 * 1024, color: "bg-green-500" },
    { type: "Videos", size: 0.5 * 1024 * 1024 * 1024, color: "bg-purple-500" },
    { type: "Other", size: 0.2 * 1024 * 1024 * 1024, color: "bg-gray-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used</span>
            <span>
              {formatBytes(usedStorage)} of {formatBytes(totalStorage)}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-gray-500">{(100 - usagePercentage).toFixed(1)}% available</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Storage Breakdown</h4>
          {storageBreakdown.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm">{item.type}</span>
              </div>
              <span className="text-sm text-gray-500">{formatBytes(item.size)}</span>
            </div>
          ))}
        </div>

        <Button className="w-full" variant="outline">
          <Zap className="w-4 h-4 mr-2" />
          Upgrade Storage
        </Button>
      </CardContent>
    </Card>
  )
}
