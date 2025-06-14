"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Circle, Zap } from "lucide-react"

interface StatusBarProps {
  connectionStatus: "connected" | "disconnected" | "testing"
  connectionName: string
  selectedDatabase: string
  activeQuery: string
  queryCount: number
  isExecuting: boolean
}

export function StatusBar({
  connectionStatus,
  connectionName,
  selectedDatabase,
  activeQuery,
  queryCount,
  isExecuting,
}: StatusBarProps) {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const ctrlKey = isMac ? "⌘" : "Ctrl"

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "disconnected":
        return <XCircle className="h-3 w-3 text-red-500" />
      case "testing":
        return <Circle className="h-3 w-3 text-yellow-500 animate-pulse" />
    }
  }

  return (
    <div className="h-6 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span>{connectionName}</span>
          <Separator orientation="vertical" className="h-3" />
          <span>{selectedDatabase}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-4 text-xs">
            {queryCount} {queryCount === 1 ? "query" : "queries"}
          </Badge>
          <span>•</span>
          <span>{activeQuery}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isExecuting && (
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 animate-pulse" />
            <span>Executing...</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">{ctrlKey}+↵</kbd>
            Run
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">{ctrlKey}+N</kbd>
            New
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">{ctrlKey}+W</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}
