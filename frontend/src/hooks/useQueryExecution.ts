import { useState } from 'react'
import { QueryResult } from '../types'
import { createMockQueryResult } from '../utils/mockData'

export function useQueryExecution() {
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const executeQuery = async (queryContent?: string) => {
    if (!queryContent?.trim()) return

    setIsExecuting(true)

    // Simulate query execution with a delay
    setTimeout(() => {
      const mockResult = createMockQueryResult()
      setQueryResults(mockResult)
      setIsExecuting(false)
    }, 1000)
  }

  return {
    queryResults,
    isExecuting,
    executeQuery,
    setQueryResults,
  }
}
