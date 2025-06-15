export interface Connection {
  id: string
  name: string
  host: string
  port: number
  username: string
  status: "connected" | "disconnected" | "testing"
}

export interface DatabaseItem {
  name: string
  tables: string[]
}

export interface QueryFile {
  id: string
  name: string
  content: string
  isUnsaved: boolean
}

export interface QueryResult {
  columns: string[]
  rows: any[]
  executionTime: number
  rowsAffected: number
  success: boolean
  error?: string
}
