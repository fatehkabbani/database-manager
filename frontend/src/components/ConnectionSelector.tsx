import React from 'react'
import { ChevronDown, CheckCircle, XCircle, Circle } from "lucide-react"
import type { Connection } from '@/types'

interface ConnectionSelectorProps {
  connections: Connection[]
  activeConnection: string
  onConnectionChange: (connectionId: string) => void
}

export function ConnectionSelector({ connections, activeConnection, onConnectionChange }: ConnectionSelectorProps) {
  const activeConnectionData = connections.find((c) => c.id === activeConnection)

  const getStatusIcon = (status: Connection["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "disconnected":
        return <XCircle className="h-3 w-3 text-red-500" />
      case "testing":
        return <Circle className="h-3 w-3 text-yellow-500 animate-pulse" />
    }
  }

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Connection</label>
        <div className="relative">
          <select
            value={activeConnection}
            onChange={(e) => onConnectionChange(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
          >
            {connections.map((conn) => (
              <option key={conn.id} value={conn.id}>
                {conn.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {activeConnectionData && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getStatusIcon(activeConnectionData.status)}
            <span>
              {activeConnectionData.host}:{activeConnectionData.port}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
