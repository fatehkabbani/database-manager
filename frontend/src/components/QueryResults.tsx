"use client"
import { Zap, Play, Download, Copy, RefreshCw, Database, Clock, Hash } from "lucide-react"
import type { QueryResult } from "../types"

interface QueryResultsProps {
  queryResults: QueryResult | null
  isExecuting: boolean
  onExecuteQuery: () => void
  canExecute: boolean
}
// TODO make the backend return columns type + make a selection for columns for delete purpose
export function QueryResults({ queryResults, isExecuting, onExecuteQuery, canExecute }: QueryResultsProps) {
  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-white italic">NULL</span>
    }
    if (typeof value === "boolean") {
      return (
        <span
          className={`font-mono text-xs px-1.5 py-0.5 rounded ${value ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}
        >
          {value.toString()}
        </span>
      )
    }
    if (typeof value === "number") {
      return <span className="font-mono text-orange-500">{value}</span>
    }
    if (typeof value === "string" && value.length > 50) {
      return (
        <span className="text-white max-w-xs" title={value}>
          {value.slice(0, 25)}...
        </span>
      )
    }
    return <span className="font-mono text-white text-sm">{String(value)}</span>
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
    <div className="h-64 border-t border-border bg-[#101828] flex flex-col ">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-[#101828]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-white font-semibold">Query Results</span>
          </div>
          {queryResults && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                {queryResults.rowsAffected} rows
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                {queryResults.executionTime}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {queryResults && (
            <div>
              <button className="px-3 py-1.5 text-xs border border-border rounded-md text-white hover:bg-accent transition-colors flex items-center gap-1.5">
                <Copy className="h-3 w-3 " />
                Copy
              </button>
              <button className="px-3 py-1.5 text-xs border border-border rounded-md text-white hover:bg-accent transition-colors flex items-center gap-1.5">
                <Download className="h-3 w-3" />
                Export
              </button>
            </div>
          )}
          <button
            onClick={onExecuteQuery}
            disabled={isExecuting || !canExecute}
            className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isExecuting ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            {isExecuting ? "Executing..." : "Execute"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {queryResults ? (
          <div className="h-full flex flex-col">
            {/* Table Container */}
            <div className="flex-1 overflow-auto border-r border-l border-border bg-[#101828]">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-[#101828] sticky top-0 z-10 border-b-2 border-gray-200">
                  <tr>
                    <th className="w-12 px-3 py-3 text-left font-medium text-white  bg-[#101828]">
                      <Hash className="h-3 w-3" />
                    </th>
                    {queryResults.columns.map((col, index) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-semibold text-white  last:border-r-0 bg-[#101828] min-w-32"
                      >
                        <div className="flex items-center gap-2">
                          {getColumnIcon(col)}
                          <span className="truncate">{col}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-[#101828]">
                  {queryResults.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100 bg-[#101828] hover:bg-blue-50/50 transition-colors group cursor-pointer">
                      <td className="px-3 py-2.5 text-xs text-white border-r border-gray-100 bg-[#101828] font-mono">
                        {rowIndex + 1}
                      </td>
                      {queryResults.columns.map((col) => (
                        <td key={col} className="px-4 py-2.5 border-r bg-[#101828] border-white last:border-r-0 max-w-xs">
                          {formatCellValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Bar */}
            {/* <div className="h-8 bg-gray-50 border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  {queryResults.rowsAffected} rows returned
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Executed in {queryResults.executionTime}
                </span>
              </div>
              <div className="text-gray-500">Ready</div>
            </div> */}
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
