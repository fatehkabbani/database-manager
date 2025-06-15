"use client"
import { useState, useEffect, useCallback } from "react"
import {
  Database,
  Table,
  Plus,
  Play,
  Zap,
  Grid3X3,
  Star,
  Lock,
  File,
  Code,
  Search,
  ChevronRight,
  ChevronDown,
  Circle,
  CheckCircle,
  XCircle,
  X,
  MoreHorizontal,
  FolderOpen,
  History,
  Keyboard,
} from "lucide-react"
import { StatusBar } from "@/components/status-bar"
import { useShortcutToast } from "@/components/shortcut-toast"
import { TextEditor } from "@/components/TextEditor"
import { ActionBar } from '@/components/ActionBar'
import { Button } from "@/components/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { SideBar } from "@/components/sideBar"
import { Navbar } from '@/components/navbar'

interface Connection {
  id: string
  name: string
  host: string
  port: number
  username: string
  status: "connected" | "disconnected" | "testing"
}

interface DatabaseItem {
  name: string
  tables: string[]
}

interface QueryFile {
  id: string
  name: string
  content: string
  isUnsaved: boolean
}

interface QueryResult {
  columns: string[]
  rows: any[]
  executionTime: number
  rowsAffected: number
  success: boolean
  error?: string
}

const mockConnections: Connection[] = [
  { id: "1", name: "Local MySQL", host: "localhost", port: 3306, username: "root", status: "connected" },
  { id: "2", name: "Production DB", host: "prod.example.com", port: 3306, username: "admin", status: "disconnected" },
]

const mockDatabases: DatabaseItem[] = [
  {
    name: "ecommerce",
    tables: ["users", "products", "orders", "categories", "order_items"],
  },
  {
    name: "blog",
    tables: ["posts", "comments", "authors", "tags"],
  },
  {
    name: "analytics",
    tables: ["events", "sessions", "users_analytics"],
  },
]
function DatabaseManager() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [activeConnection, setActiveConnection] = useState<string>("1")
  const [selectedDatabase, setSelectedDatabase] = useState<string>("ecommerce")
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set(["ecommerce"]))
  const [searchTerm, setSearchTerm] = useState("")
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [newConnection, setNewConnection] = useState({
    name: "",
    host: "",
    port: 3306,
    username: "",
    password: "",
  })

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
          {
            id: 2,
            email: "jane@example.com",
            first_name: "Jane",
            last_name: "Smith",
            created_at: "2024-01-16 14:20:00",
          },
          {
            id: 3,
            email: "bob@example.com",
            first_name: "Bob",
            last_name: "Johnson",
            created_at: "2024-01-17 09:15:00",
          },
        ],
        executionTime: 0.045,
        rowsAffected: 3,
        success: true,
      }

      setQueryResults(mockResult)
      setIsExecuting(false)
    }, 1000)
  }

  // Update the handleKeyDown function to include toast notifications
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey

      // Ctrl/Cmd + Enter: Execute query
      if (ctrlKey && event.key === "Enter") {
        event.preventDefault()
        if (activeQuery?.content.trim() && !isExecuting) {
          executeQuery()
          showToast("Query executed", "success")
        } else if (!activeQuery?.content.trim()) {
          showToast("No query to execute", "warning")
        }
        return
      }

      // Ctrl/Cmd + N: New query
      if (ctrlKey && event.key === "n") {
        event.preventDefault()
        createNewQuery()
        showToast("New query created", "success")
        return
      }

      // Ctrl/Cmd + S: Save query
      if (ctrlKey && event.key === "s") {
        event.preventDefault()
        showToast("Save functionality coming soon", "info")
        return
      }

      // Ctrl/Cmd + W: Close current query tab
      if (ctrlKey && event.key === "w") {
        event.preventDefault()
        if (queryFiles.length > 1 && activeQueryFile) {
          const queryName = activeQuery?.name || "Query"
          closeQueryFile(activeQueryFile)
          showToast(`${queryName} closed`, "info")
        } else {
          showToast("Cannot close the last query", "warning")
        }
        return
      }

      // Ctrl/Cmd + T: New query (alternative shortcut)
      if (ctrlKey && event.key === "t") {
        event.preventDefault()
        createNewQuery()
        showToast("New query created", "success")
        return
      }

      // Ctrl/Cmd + 1-9: Switch to query tab by number
      if (ctrlKey && event.key >= "1" && event.key <= "9") {
        event.preventDefault()
        const tabIndex = Number.parseInt(event.key) - 1
        if (tabIndex < queryFiles.length) {
          setActiveQueryFile(queryFiles[tabIndex].id)
          showToast(`Switched to ${queryFiles[tabIndex].name}`, "info")
        }
        return
      }

      // F5 or Ctrl/Cmd + R: Execute query (alternative)
      if (event.key === "F5" || (ctrlKey && event.key === "r")) {
        event.preventDefault()
        if (activeQuery?.content.trim() && !isExecuting) {
          executeQuery()
          showToast("Query executed", "success")
        }
        return
      }

      // Escape: Clear results
      if (event.key === "Escape") {
        if (queryResults) {
          setQueryResults(null)
          showToast("Results cleared", "info")
        }
        return
      }
    },
    [activeQuery, isExecuting, createNewQuery, closeQueryFile, queryFiles, activeQueryFile, queryResults, showToast],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const activeConnectionData = connections.find((c) => c.id === activeConnection)
  const filteredDatabases = mockDatabases.filter(
    (db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.tables.some((table) => table.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleDatabase = (dbName: string) => {
    const newExpanded = new Set(expandedDatabases)
    if (newExpanded.has(dbName)) {
      newExpanded.delete(dbName)
    } else {
      newExpanded.add(dbName)
    }
    setExpandedDatabases(newExpanded)
  }

  const updateQueryContent = (content: string) => {
    setQueryFiles((prev) => prev.map((q) => (q.id === activeQueryFile ? { ...q, content, isUnsaved: true } : q)))
  }

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
  const [selected, setSelected] = useState("Database")

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col ">
      <Navbar />
      <div className="h-screen flex bg-background text-foreground overflow-hidden">
        <ActionBar />
        {/* Left Sidebar */}
        <div className="w-72 bg-card border-r border-border flex flex-col">
          {/* two button for page selection either Query or tables */}
          <div className="flex p-4 border-b border-border">
            <ToggleGroup
              type="single"
              value={selected}
              onValueChange={(val) => {
                if (val) setSelected(val)
              }}
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem
                value="Database"
                className="cursor-pointer w-1/2"
                aria-label="Toggle database"
              >
                <Database className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Query"
                className="cursor-pointer w-1/2"
                aria-label="Toggle query"
              >
                <File className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {/* Top Section */}
          {selected === "Database" ? (
            <div className="p-4 border-b border-border h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-lg">Sandbox</span>
                <Circle className="h-2 w-2 text-green-500 fill-current ml-auto" />
              </div>

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

              <div className="flex-1 overflow-hidden p-0 h-full">
                <div className="p-0 w-full">
                  <div className="relative mb-3">
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

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-1">
                    {filteredDatabases.map((database) => (
                      <div key={database.name}>
                        <button
                          onClick={() => {
                            toggleDatabase(database.name)
                            setSelectedDatabase(database.name)
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                        >

                          {expandedDatabases.has(database.name) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}

                          <Database className="h-4 w-4" />
                          <span className="flex-1 text-left truncate">{database.name}</span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {database.tables.length}
                          </span>
                        </button>

                        {expandedDatabases.has(database.name) && (
                          <div className="ml-6 space-y-1 mt-1">
                            {database.tables.map((table) => (
                              <button
                                key={table}
                                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                              >
                                <Table className="h-3 w-3" />
                                <span className="truncate">{table}</span>
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
          ) : (
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
          )}
          <div className="p-4 border-b border-border">
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Connection</label>
              <div className="relative">
                <select
                  value={activeConnection}
                  onChange={(e) => setActiveConnection(e.target.value)}
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

          {/* Bottom Section */}
          <div className="border-t border-border">
            <button
              onClick={() => setSavedQueriesOpen(!savedQueriesOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="flex-1 text-left">Saved queries</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${savedQueriesOpen ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setQueryHistoryOpen(!queryHistoryOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
            >
              <History className="h-4 w-4" />
              <span className="flex-1 text-left">Query history</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${queryHistoryOpen ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header with Tabs */}
          <div className="h-12 bg-card border-b border-border flex items-center">


            <div className="flex-1 flex items-center">
              {queryFiles.map((query) => (
                <div
                  key={query.id}
                  className={`flex items-center gap-2 px-4 py-3 border-r border-border cursor-pointer hover:bg-primary/50 transition-colors ${activeQueryFile === query.id ? "bg-background" : ""
                    }`}
                  onClick={() => setActiveQueryFile(query.id)}
                >
                  <span className="text-sm">{query.name}</span>
                  {query.isUnsaved && <Circle className="h-2 w-2 text-primary fill-current" />}
                  {queryFiles.length > 1 && (
                    <button
                      className="p-1 hover:bg-destructive/20 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeQueryFile(query.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}

              <button onClick={createNewQuery} className="p-3 hover:bg-accent transition-colors">
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

          {/* Query Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex">
                  {/* Editor */}
                  <div className="flex-1">
                    <TextEditor />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="h-64 border-t border-border bg-card">
              <div className="h-12 border-b border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Results</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {queryResults ? `${queryResults.rowsAffected} responses` : "0 responses"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-accent transition-colors">
                    Terminal
                  </button>
                  <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-accent transition-colors">
                    Combined
                  </button>
                  <button
                    onClick={executeQuery}
                    disabled={isExecuting || !activeQuery?.content.trim()}
                    className="px-4 py-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Play className="h-3 w-3" />
                    {isExecuting ? "Running..." : "Run query"}
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 h-full">
                {queryResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {queryResults.executionTime}s
                      </span>
                      <span className="text-muted-foreground">{queryResults.rowsAffected} rows affected</span>
                    </div>

                    <div className="overflow-auto custom-scrollbar max-h-40">
                      <table className="w-full text-sm border border-border rounded-md">
                        <thead className="bg-muted/50">
                          <tr>
                            {queryResults.columns.map((col) => (
                              <th key={col} className="px-3 py-2 text-left font-medium border-b border-border">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResults.rows.map((row, i) => (
                            <tr key={i} className="border-b border-border last:border-b-0">
                              {queryResults.columns.map((col) => (
                                <td key={col} className="px-3 py-2">
                                  {row[col]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Zap className="h-8 w-8 mb-3 opacity-50" />
                    <p className="text-sm">Execute a SurrealQL query to view the results here</p>
                  </div>
                )}
              </div>
            </div>
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
