import React from 'react'
import { FolderOpen, History, ChevronRight } from "lucide-react"

interface SidebarActionsProps {
  savedQueriesOpen: boolean
  queryHistoryOpen: boolean
  onToggleSavedQueries: () => void
  onToggleQueryHistory: () => void
}

export function SidebarActions({
  savedQueriesOpen,
  queryHistoryOpen,
  onToggleSavedQueries,
  onToggleQueryHistory
}: SidebarActionsProps) {
  return (
    <div className="border-t border-border">
      <button
        onClick={onToggleSavedQueries}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
      >
        <FolderOpen className="h-4 w-4" />
        <span className="flex-1 text-left">Saved queries</span>
        <ChevronRight className={`h-4 w-4 transition-transform ${savedQueriesOpen ? "rotate-90" : ""}`} />
      </button>

      <button
        onClick={onToggleQueryHistory}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
      >
        <History className="h-4 w-4" />
        <span className="flex-1 text-left">Query history</span>
        <ChevronRight className={`h-4 w-4 transition-transform ${queryHistoryOpen ? "rotate-90" : ""}`} />
      </button>
    </div>
  )
}
