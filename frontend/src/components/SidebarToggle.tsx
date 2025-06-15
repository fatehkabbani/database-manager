import React from 'react'
import { Database, File } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface SidebarToggleProps {
  selected: string
  onSelectionChange: (value: string) => void
}

export function SidebarToggle({ selected, onSelectionChange }: SidebarToggleProps) {
  return (
    <div className="flex p-4 border-b border-border">
      <ToggleGroup
        type="single"
        value={selected}
        onValueChange={(val) => {
          if (val) onSelectionChange(val)
        }}
        variant="outline"
        className="w-full"
      >
        <ToggleGroupItem value="Database" className="cursor-pointer w-1/2" aria-label="Toggle database">
          <Database className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="Query" className="cursor-pointer w-1/2" aria-label="Toggle query">
          <File className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
