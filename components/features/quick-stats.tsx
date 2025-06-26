"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Files, Share, Shield, HardDrive } from "lucide-react"

export function QuickStats() {
  const stats = [
    {
      title: "Total Files",
      value: "1,234",
      change: "+12%",
      icon: Files,
      color: "text-blue-600",
    },
    {
      title: "Shared Files",
      value: "89",
      change: "+5%",
      icon: Share,
      color: "text-green-600",
    },
    {
      title: "Encrypted Files",
      value: "1,234",
      change: "100%",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: "Storage Used",
      value: "2.4 GB",
      change: "+8%",
      icon: HardDrive,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
