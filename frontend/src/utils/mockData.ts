import type { Connection, DatabaseItem, QueryResult } from '@/types'

export const createMockConnections = (connectionsData: any): Connection[] => {
  return Object.entries(connectionsData).map(([id, conn]: [string, any]) => ({
    id,
    name: conn.name || "Unnamed Connection",
    host: conn.host || "localhost",
    port: conn.port || 3306,
    username: conn.username || "root",
    status: conn.status || "disconnected" as const,
  }))
}

export const createMockDatabases = (tablesData: any): DatabaseItem[] => {
  return Object.entries(tablesData).map(([dbName, tables]) => ({
    name: dbName,
    tables: tables as string[],
  }))
}

export const createMockQueryResult = (): QueryResult => ({
  columns: ["id", "email", "first_name", "last_name", "created_at"],
  rows: [
    { id: 1, email: "john@example.com", first_name: "John", last_name: "Doe", created_at: "2024-01-15 10:30:00" },
    { id: 2, email: "jane@example.com", first_name: "Jane", last_name: "Smith", created_at: "2024-01-16 14:20:00" },
    { id: 3, email: "bob@example.com", first_name: "Bob", last_name: "Johnson", created_at: "2024-01-17 09:15:00" },
  ],
  executionTime: 0.045,
  rowsAffected: 3,
  success: true,
})
