"use client"
import { useState, useEffect, useCallback } from "react"
import { StatusBar } from "@/components/status-bar"
import { useShortcutToast } from "@/components/shortcut-toast"
import { TextEditor } from "@/components/TextEditor"
import { ActionBar } from '@/components/ActionBar'
import { Navbar } from '@/components/navbar'
import { getConnections, getTables } from '@/services/api'
import type { Connection, DatabaseItem, QueryFile, QueryResult } from '@/types'
import { DatabaseSidebar } from '@/components/databaseSidebar'
import { QuerySidebar } from '@/components/QuerySidebar'
import { ConnectionSelector } from '@/components/ConnectionSelector'
import { QueryTabs } from '@/components/QueryTabs'
import { QueryResults } from '@/components/QueryResults'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { SidebarToggle } from "@/components/SidebarToggle"
import { SidebarActions } from "@/components/SidebarActions"
function DatabaseManager() {
  // State management
  const [connections, setConnections] = useState<Connection[]>([])
  const [activeConnection, setActiveConnection] = useState<string>("")
  const [databases, setDatabases] = useState<DatabaseItem[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set([""]))
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [selected, setSelected] = useState("Database")

  // Query file management
  const [queryFiles, setQueryFiles] = useState<QueryFile[]>([
    { id: "1", name: "New query", content: "", isUnsaved: false },
  ])
  const [activeQueryFile, setActiveQueryFile] = useState<string>("1")
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [savedQueriesOpen, setSavedQueriesOpen] = useState(false)
  const [queryHistoryOpen, setQueryHistoryOpen] = useState(false)

  const { showToast, ToastComponent } = useShortcutToast()
  const activeQuery = queryFiles.find((q) => q.id === activeQueryFile)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [connectionsData, tablesData] = await Promise.all([
        getConnections(),
        getTables()
      ])

      // Process connections
      const processedConnections = Object.entries(connectionsData.connections).map(([id, conn]: [string, any]) => ({
        id,
        name: conn.name || "Unnamed Connection",
        host: conn.host || "localhost",
        port: conn.port || 3306,
        username: conn.username || "root",
        status: conn.status || "disconnected",
      }))

      setConnections(processedConnections)
      if (connectionsData.activeConnection) {
        setActiveConnection(connectionsData.activeConnection)
      }

      // Process databases
      const processedDatabases = Object.entries(tablesData).map(([dbName, tables]) => ({
        name: dbName,
        tables: tables as string[],
      }))

      setDatabases(processedDatabases)
    }

    loadData()
  }, [])

  // Query management functions
  const createNewQuery = useCallback(() => {
    const newQuery: QueryFile = {
      id: Date.now().toString(),
      name: `Query ${queryFiles.length + 1}`,
      content: "",
      isUnsaved: false,
    }
    setQueryFiles([...queryFiles, newQuery])
    setActiveQueryFile(newQuery.id)
  }, [queryFiles])

  const closeQueryFile = useCallback(
    (queryId: string) => {
      const newFiles = queryFiles.filter((q) => q.id !== queryId)
      if (newFiles.length === 0) {
        createNewQuery()
      } else {
        setQueryFiles(newFiles)
        if (activeQueryFile === queryId) {
          setActiveQueryFile(newFiles[0].id)
        }
      }
    },
    [activeQueryFile, createNewQuery, queryFiles],
  )

  const executeQuery = async () => {
    if (!activeQuery?.content.trim()) return

    setIsExecuting(true)

    // Simulate query execution
    setTimeout(() => {
      const mockResult: QueryResult = {
        columns: ["id", "email", "first_name", "last_name", "created_at"],
        rows: [
          { id: 1, email: "john@example.com", first_name: "John", last_name: "Doe", created_at: "2024-01-15 10:30:00" },
          { id: 2, email: "jane@example.com", first_name: "Jane", last_name: "Smith", created_at: "2024-01-16 14:20:00" },
          { id: 3, email: "bob@example.com", first_name: "Bob", last_name: "Johnson", created_at: "2024-01-17 09:15:00" },
        ],
        executionTime: 0.045,
        rowsAffected: 3,
        success: true,
      }

      setQueryResults(mockResult)
      setIsExecuting(false)
    }, 1000)
  }

  const toggleDatabase = (dbName: string) => {
    const newExpanded = new Set(expandedDatabases)
    if (newExpanded.has(dbName)) {
      newExpanded.delete(dbName)
    } else {
      newExpanded.add(dbName)
    }
    setExpandedDatabases(newExpanded)
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    activeQuery,
    isExecuting,
    queryFiles,
    activeQueryFile,
    queryResults,
    onExecuteQuery: executeQuery,
    onCreateNewQuery: createNewQuery,
    onCloseQueryFile: closeQueryFile,
    onSetActiveQueryFile: setActiveQueryFile,
    onSetQueryResults: setQueryResults,
    showToast
  })

  const activeConnectionData = connections.find((c) => c.id === activeConnection)

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="h-screen flex bg-background text-foreground overflow-hidden">
        <ActionBar />

        {/* Left Sidebar */}
        <div className="w-72 bg-card border-r border-border flex flex-col">
          {/* Toggle between Database and Query views */}
          <SidebarToggle selected={selected} onSelectionChange={setSelected} />

          {/* Content based on selected view */}
          {selected === "Database" ? (
            <DatabaseSidebar
              databases={databases}
              selectedDatabase={selectedDatabase}
              expandedDatabases={expandedDatabases}
              onDatabaseSelect={setSelectedDatabase}
              onToggleDatabase={toggleDatabase}
            />
          ) : (
            <QuerySidebar />
          )}

          {/* Connection Selector */}
          <ConnectionSelector
            connections={connections}
            activeConnection={activeConnection}
            onConnectionChange={setActiveConnection}
          />

          {/* Bottom Section */}
          <SidebarActions   />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Query Tabs */}
          <QueryTabs
            queryFiles={queryFiles}
            activeQueryFile={activeQueryFile}
            onTabChange={setActiveQueryFile}
            onTabClose={closeQueryFile}
            onNewQuery={createNewQuery}
          />

          {/* Query Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex">
                  <div className="flex-1">
                    <TextEditor />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <QueryResults
              queryResults={queryResults}
              isExecuting={isExecuting}
              onExecuteQuery={executeQuery}
              canExecute={!!activeQuery?.content.trim()}
            />
          </div>

          {/* Status Bar */}
          <StatusBar
            connectionStatus={activeConnectionData?.status || "disconnected"}
            connectionName={activeConnectionData?.name || "No connection"}
            selectedDatabase={selectedDatabase}
            activeQuery={activeQuery?.name || "No query"}
            queryCount={queryFiles.length}
            isExecuting={isExecuting}
          />
        </div>
        {ToastComponent}
      </div>
    </div>
  )
}

export default DatabaseManager
