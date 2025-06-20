

import { useState } from "react"
import { QueryResults } from "@/components/QueryResults"
import type { QueryResult } from "@/types"

export default function DatabaseDemo() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)

  const mockData: QueryResult = {
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

  const handleExecuteQuery = async () => {
    setIsExecuting(true)
    // Simulate query execution
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setQueryResults(mockData)
    setIsExecuting(false)
  }

  const handleClearResults = () => {
    setQueryResults(null)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm border">
 
        

        <QueryResults
          queryResults={queryResults}
          isExecuting={isExecuting}
          onExecuteQuery={handleExecuteQuery}
          canExecute={true}
        />
      </div>

      <div className="flex gap-2">
       
        <button
          onClick={handleClearResults}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-black hover:bg-gray-50 transition-colors"
        >
          Clear Results
        </button>
      </div>
    </div>
  )
}
