import React from 'react'
import { Zap, Play } from "lucide-react"
import type { QueryResult } from '../types'

interface QueryResultsProps {
  queryResults: QueryResult | null
  isExecuting: boolean
  onExecuteQuery: () => void
  canExecute: boolean
}

export function QueryResults({ queryResults, isExecuting, onExecuteQuery, canExecute }: QueryResultsProps) {
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
                {queryResults.executionTime}
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
            <p className="text-sm">Execute a sql query to view the results here</p>
          </div>
        )}
      </div>
    </div>
  )
}
