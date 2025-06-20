import { Zap, Play,Hash ,Clock,Database} from "lucide-react"
import type { QueryResult } from '../types'

interface QueryResultsProps {
    queryResults: QueryResult | null
    isExecuting: boolean
    onExecuteQuery: () => void
    canExecute: boolean
}

export function QueryResults({ queryResults, isExecuting, onExecuteQuery, canExecute }: QueryResultsProps) {
    const formatCellValue = (value: any) => {
        if (value === null || value === undefined) {
            return <span className="text-black italic">NULL</span>
        }
        if (typeof value === "boolean") {
            return (
                <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                    {value.toString()}
                </span>
            )
        }
        if (typeof value === "number") {
            return <span className="font-mono text-blue-600">{value}</span>
        }
        if (typeof value === "string" && value.length > 50) {
            return (
                <span className="text-black max-w-xs" title={value}>
                    {value.slice(0, 25)}...
                </span>
            )
        }
        return <span className="font-mono text-black text-sm">{String(value)}</span>
    }
    
    const getColumnIcon = (columnName: string) => {
        const name = columnName.toLowerCase()
        if (name.includes("id") || name.includes("key")) {
            return <Hash className="h-3 w-3 text-yellow-600" />
        }
        if (name.includes("date") || name.includes("time") || name.includes("created") || name.includes("updated")) {
            return <Clock className="h-3 w-3 text-blue-600" />
        }
        return <Database className="h-3 w-3 text-gray-500" />
    }
    return (
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
                        onClick={onExecuteQuery}
                        disabled={isExecuting || !canExecute}
                        className="px-4 py-1.5 text-xs bg-primary hover:bg-primary/90
                         text-primary-foreground rounded-md transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Play className="h-3 w-3" />
                        {isExecuting ? "Running..." : "Run query"}
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 h-full">
                {queryResults ? (
                     <div className="flex-1 overflow-auto border-r border-l border-border bg-white">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10 border-b-2 border-gray-200">
                  <tr>
                    <th className="w-12 px-3 py-3 text-left font-medium text-gray-600 border-r border-gray-200 bg-gray-100">
                      <Hash className="h-3 w-3" />
                    </th>
                    {queryResults.columns.map((col, index) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 bg-gray-50 min-w-32"
                      >
                        <div className="flex items-center gap-2">
                          {getColumnIcon(col)}
                          <span className="truncate">{col}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResults.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors group">
                      <td className="px-3 py-2.5 text-xs text-gray-500 border-r border-gray-100 bg-gray-50/50 font-mono">
                        {rowIndex + 1}
                      </td>
                      {queryResults.columns.map((col) => (
                        <td key={col} className="px-4 py-2.5 border-r border-gray-100 last:border-r-0 max-w-xs">
                          {formatCellValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Zap className="h-8 w-8 mb-3 opacity-50" />
                        <p className="text-sm">Execute a sql query to view the results here</p>
                    </div>
                )}
            </div>
        </div>
    )
}