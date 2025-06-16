import React from 'react'
import { useState } from 'react'
import {
  Database,
  Table,
  Search,
  ChevronRight,
  ChevronDown,
  Circle,
  Zap,
  Grid3X3,
  Star,
  Lock,
  Plus,
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DatabaseItem } from '@/types'

interface DatabaseSidebarProps {
  databases: DatabaseItem[]
  selectedDatabase: string
  expandedDatabases: Set<string>
  onDatabaseSelect: (dbName: string) => void
  onToggleDatabase: (dbName: string) => void
  onTableSelect: (table: string, database: DatabaseItem) => void
}

export function DatabaseSidebar({
  databases,
  selectedDatabase,
  expandedDatabases,
  onDatabaseSelect,
  onToggleDatabase,
  onTableSelect
}: DatabaseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDatabases = databases.filter(
    (db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.tables.some((table) => table.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSelectTable = (table: string, database: DatabaseItem) => {
    console.log(`SELECT * FROM  ${database.name}.${table}`)
    onTableSelect(table, database)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-lg">sandbox</span>
          <Circle className="h-2 w-2 text-green-500 fill-current ml-auto" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-1 mb-4">
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Zap className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Lock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input border border-border rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Scrollable Database List - Fixed height with scroll */}
      <div className=" min-h-0 px-4  ">
        <div className="overflow-y-auto pr-2 h-[450px]  [&::-webkit-scrollbar]:w-0.5
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-primary/50
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb:hover]:bg-primary/70
  [&::-webkit-scrollbar-thumb:active]:bg-primary/80
  [&::-webkit-scrollbar-track:hover]:bg-secondary/20
  [&::-webkit-scrollbar-track:active]:bg-secondary/30
  [&::-webkit-scrollbar-thumb:focus]:bg-primary/60
  [&::-webkit-scrollbar-track]:bg-[#181a2d]
  ">
          <div className="space-y-1 pb-4">
            {filteredDatabases.map((database) => (
              <div key={database.name}>
                <button
                  onClick={() => {
                    onToggleDatabase(database.name)
                    onDatabaseSelect(database.name)
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-md transition-colors cursor-pointer"
                >
                  {expandedDatabases.has(database.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Database className="h-4 w-4 c" />
                  <span className="flex-1 text-left truncate">{database.name}</span>
                </button>

                {expandedDatabases.has(database.name) && (
                  <div className="ml-6 space-y-1 mt-1">
                    {database.tables.map((table) => (
                      <button
                        key={table}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer"
                        onClick={() => handleSelectTable(table, database)}
                      >
                        <Table className="h-3 w-3" />
                        <span className="truncate">{table}</span>
                        <Plus className="h-3 w-3 text-muted-foreground ml-auto" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
