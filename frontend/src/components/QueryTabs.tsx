import React from 'react'
import { Plus, X, Circle, Keyboard, Star, MoreHorizontal } from "lucide-react"
import type { QueryFile } from '@/types'

interface QueryTabsProps {
  queryFiles: QueryFile[]
  activeQueryFile: string
  onTabChange: (queryId: string) => void
  onTabClose: (queryId: string) => void
  onNewQuery: () => void
}

export function QueryTabs({ queryFiles, activeQueryFile, onTabChange, onTabClose, onNewQuery }: QueryTabsProps) {
  return (
    <div className="h-12 bg-card border-b border-border flex items-center">
      <div className="flex-1 flex items-center">
        {queryFiles.map((query) => (
          <div
            key={query.id}
            className={`flex items-center gap-2 px-4 py-3 border-r border-border cursor-pointer hover:bg-primary/50 transition-colors ${
              activeQueryFile === query.id ? "bg-background" : ""
            }`}
            onClick={() => onTabChange(query.id)}
          >
            <span className="text-sm">{query.name}</span>
            {query.isUnsaved && <Circle className="h-2 w-2 text-primary fill-current" />}
            {queryFiles.length > 1 && (
              <button
                className="p-1 hover:bg-destructive/20 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(query.id)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        <button onClick={onNewQuery} className="p-3 hover:bg-accent transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4">
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <Keyboard className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <Star className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
