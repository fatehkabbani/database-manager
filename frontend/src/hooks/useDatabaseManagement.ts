import { useState, useEffect } from 'react'
import type { DatabaseItem } from '@/types'
import { getTables } from '@/services/api'
import { createMockDatabases } from '../utils/mockData'

export function useDatabaseManagement() {
  const [databases, setDatabases] = useState<DatabaseItem[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState<string>("ecommerce")
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set(["ecommerce"]))

  useEffect(() => {
    const loadDatabases = async () => {
      const tablesData = await getTables()
      const processedDatabases = createMockDatabases(tablesData)
      setDatabases(processedDatabases)
    }

    loadDatabases()
  }, [])

  const toggleDatabase = (dbName: string) => {
    const newExpanded = new Set(expandedDatabases)
    if (newExpanded.has(dbName)) {
      newExpanded.delete(dbName)
    } else {
      newExpanded.add(dbName)
    }
    setExpandedDatabases(newExpanded)
  }

  return {
    databases,
    selectedDatabase,
    expandedDatabases,
    setSelectedDatabase,
    toggleDatabase,
  }
}
