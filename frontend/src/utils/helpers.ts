import { Connection } from "../types"
export const getConnectionName = (connections: Connection[], connectionId: string): string => {
  const connection = connections.find((c) => c.id === connectionId)
  return connection ? connection.name : "Unknown Connection"
}

export const isValidQueryContent = (content?: string): boolean => {
  return Boolean(content?.trim())
}

export const generateQueryId = (): string => {
  return Date.now().toString()
}

export const generateQueryName = (queryCount: number): string => {
  return `Query ${queryCount + 1}`
}
