import React from 'react'
import { File, Circle } from "lucide-react"
import { SideBar } from "@/components/sideBar"

export function QuerySidebar() {
  return (
    <div className="p-4 border-b border-border h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
          <File className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-lg">Queries</span>
        <Circle className="h-2 w-2 text-green-500 fill-current ml-auto" />
      </div>
      <SideBar />
    </div>
  )
}
