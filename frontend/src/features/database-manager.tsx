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
import { fetchApi } from "@/utils/fetchApi"
function DatabaseManager() {
  // State management
  const [connections, setConnections] = useState<Connection[]>([])
  const [activeConnection, setActiveConnection] = useState<string>("")
  const [databases, setDatabases] = useState<DatabaseItem[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set([""]))
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [selected, setSelected] = useState("Database")

  // Code editor state
  const [editorCode, setEditorCode] = useState<string>("")

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

  // Handle table selection from DatabaseSidebar
  const handleTableSelect = useCallback((table: string, database: DatabaseItem) => {
    const newCode = `SELECT * FROM ${database.name}.\`${table}\`;`
    setEditorCode(newCode)

    setQueryFiles(prev =>
      prev.map(q =>
        q.id === activeQueryFile
          ? { ...q, content: newCode, isUnsaved: true }
          : q
      )
    )

    showToast(`Added ${database.name}.${table} to editor`, "success")
  }, [activeQueryFile, showToast])

  // Handle editor content changes
  const handleEditorChange = useCallback((value: string) => {
    setEditorCode(value)

    // Update the current query file content
    setQueryFiles(prev =>
      prev.map(q =>
        q.id === activeQueryFile
          ? { ...q, content: value, isUnsaved: true }
          : q
      )
    )
  }, [activeQueryFile])

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
    setEditorCode("")
  }, [queryFiles])

  const closeQueryFile = useCallback(
    (queryId: string) => {
      const newFiles = queryFiles.filter((q) => q.id !== queryId)
      if (newFiles.length === 0) {
        createNewQuery()
      } else {
        setQueryFiles(newFiles)
        if (activeQueryFile === queryId) {
          const newActiveQuery = newFiles[0]
          setActiveQueryFile(newActiveQuery.id)
          setEditorCode(newActiveQuery.content)
        }
      }
    },
    [activeQueryFile, createNewQuery, queryFiles],
  )

  // Update editor when switching tabs
  useEffect(() => {
    const currentQuery = queryFiles.find(q => q.id === activeQueryFile)
    if (currentQuery) {
      setEditorCode(currentQuery.content)
    }
  }, [activeQueryFile, queryFiles])

  const executeQuery = async () => {
    if (!editorCode.trim()) return

    setIsExecuting(true)

    // const response = await fetchApi({
    //   url: '/run_query',
    //   method: 'POST',
    //   body: {
    //     query: editorCode,
    //   }
    // })
    // if (response.status !== 'success') {
    //   showToast(`Error executing query: ${response.status}`, "warning")
    //   setIsExecuting(false)
    //   return
    // }


    // const mockResult: QueryResult = {
    //   columns: response.data.columns || [],
    //   rows: response.data.rows || [],
    //   executionTime: response.data.executionTime || 0.000,
    //   rowsAffected: response.data.rowsAffected || 0,
    //   success: response.success || false,
    // }
    const mockResult: QueryResult = {
      columns: ["id", "name", "email", "created_at", "is_active", "department_id"],
      rows: [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.comjohn.doe@company.com",
          created_at: "2024-01-15 10:30:00",
          is_active: true,
          department_id: 101,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@company.com",
          created_at: "2024-01-16 14:22:00",
          is_active: true,
          department_id: 102,
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob.johnson@company.com",
          created_at: "2024-01-17 09:15:00",
          is_active: false,
          department_id: 101,
        },
        {
          id: 4,
          name: "Alice Brown",
          email: "alice.brown@company.com",
          created_at: "2024-01-18 16:45:00",
          is_active: true,
          department_id: 103,
        },
        {
          id: 5,
          name: "Charlie Wilson",
          email: null,
          created_at: "2024-01-19 11:30:00",
          is_active: true,
          department_id: 102,
        },
      ],
      rowsAffected: 5,
      executionTime: 0.023,
      success: true,
    }
    setQueryResults(mockResult)
    setIsExecuting(false)
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
    onSetQueryResults: setQueryResults
  })

  const activeConnectionData = connections.find((c) => c.id === activeConnection)
  return (
    <div className="h-screen  text-forground flex flex-col background-primary" >
      <Navbar />
      <div className="h-screen flex  text-foreground overflow-hidden background-primary" >
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
              onTableSelect={handleTableSelect}
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
          <SidebarActions
            savedQueriesOpen={savedQueriesOpen}
            queryHistoryOpen={queryHistoryOpen}
            onToggleSavedQueries={() => setSavedQueriesOpen(!savedQueriesOpen)}
            onToggleQueryHistory={() => setQueryHistoryOpen(!queryHistoryOpen)}
          />
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
                    <TextEditor
                      value={editorCode}
                      onChange={handleEditorChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <QueryResults
              queryResults={queryResults}
              isExecuting={isExecuting}
              onExecuteQuery={executeQuery}
              canExecute={!!editorCode.trim()}
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
