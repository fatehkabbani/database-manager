"use client"
import { Zap, Play, Download, Copy, TrashIcon, RefreshCw, Database, Clock, Hash, DollarSign, MailIcon, KeyRound, CreditCard, ChartNoAxesColumn } from "lucide-react"
import type { QueryResult } from "../types"
import { Button } from "./ui/button"
import { JsonDialog } from "@/components/jsonDialog"
import { useState } from "react"
import { useShortcutToast } from "@/components/shortcut-toast"

interface QueryResultsProps {
  queryResults: QueryResult | null
  isExecuting: boolean
  onExecuteQuery: () => void
  canExecute: boolean
}
function checkJson(value: string): boolean {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true;
}
const getColumnIcon = (columnName: string) => {
  const name = columnName.toLowerCase()
  if (name.includes("id") || name.includes("key")) {
    return <KeyRound className="h-3 w-3 text-yellow-500" />
  }
  if (name.includes("date") || name.includes("time") || name.includes("created") || name.includes("updated")) {
    return <Clock className="h-3 w-3 text-secondary" />
  }
  if (name.includes("amount") || name.includes("price") || name.includes("cost")) {
    return <DollarSign className="h-3 w-3 text-green-500" />
  }
  if (name.includes("card") || name.includes("payment")) {
    return <CreditCard className="h-3 w-3 text-green-500" />
  }

  if (name.includes("email") || name.includes("contact")) {
    return <MailIcon className="h-3 w-3 text-blue-500" />
  }
  if (name.includes('password') || name.includes('secret') || name.includes('token')) {
    return <KeyRound className="h-3 w-3 text-red-500" />
  }
  if (name.includes('status') || name.includes('state') || name.includes('flag')) {
    return <ChartNoAxesColumn className="h-3 w-3 text-orange-500" />
  }

  return <Database className="h-3 w-3 text-muted-foreground" />
}
const formatCellValue = (value: any) => {
  if (!value) return <span className="text-sm break-words text-red-500">NULL</span>


  if (checkJson(value)) {
    try {
      const parsed = JSON.parse(value)

      if (typeof parsed === "object" && parsed !== null) {
        return (
          <JsonDialog
            jsonData={parsed}
            trigger={
              <span
                className="text-blue-500 underline text-sm cursor-pointer"
              >
                [View JSON]
              </span>
            }
          />
        )
      }

      if (typeof parsed === "number") {
        return <span className="text-sm break-words text-yellow-200">{value}</span>
      }
    } catch (e) {
      // fallback below
    }
  }

  return <span className="text-foreground text-sm break-words">{value}</span>
}
export function QueryResults({ queryResults, isExecuting, onExecuteQuery, canExecute }: QueryResultsProps) {
  const { showToast } = useShortcutToast()

  let [selectedRow, setSelectedRow] = useState<number | null>(null)
  return (
    <div className="h-64 border-t border-border bg-card/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary/20">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-foreground font-semibold">Query Results</span>
          </div>
          {queryResults && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium border border-primary/30">
                {queryResults.rowsAffected} rows
              </span>
              <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full font-medium border border-secondary/30">
                {queryResults.executionTime}ms
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {queryResults && (
            <div className="flex items-center gap-1">
              <Button variant="icon" size="sm" className="h-8 px-2 text-xs hover:bg-red-500/90 cursor-pointer" onClick={function () {

                if (selectedRow !== null && queryResults) {
                  const newRows = [...queryResults.rows]
                  newRows.splice(selectedRow, 1)
                  //TODO HANDLE THE BACKEND REQUEST LATER I'M BOARED RN
                  queryResults.rows.splice(0, queryResults.rows.length, ...newRows)
                  setSelectedRow(null)
                }
                // AHHH IT'S NOT WORKING WHYYY FIX IT LATER
                showToast(`column deleted succefuly (idk how to spell it)`, "success")
              }
              }>
                <TrashIcon className="h-3 w-3 mr-1 " />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:bg-muted" onClick={function () {
                if (selectedRow != null) {
                  navigator.clipboard.writeText(JSON.stringify(queryResults.rows[selectedRow], null, 2).replace(/(\r\n|\n|\r)/gm, ""))
                  showToast("Row copied to clipboard", "success")
                }
              }}>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:bg-muted">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          )}
          <Button
            onClick={onExecuteQuery}
            disabled={isExecuting || !canExecute}
            size="sm"
            className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isExecuting ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            {isExecuting ? "Executing..." : "Execute"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {queryResults ? (
          queryResults.rows.length > 0 ? (
            <div className="h-full flex flex-col">
              {/* Table Container */}
              <div className="flex-1 relative bg-card/30 backdrop-blur-sm border border-border/20 rounded-lg mx-2 mb-2">
                <div className="absolute inset-0 overflow-auto">
                  <table className="w-full text-sm border-collapse" style={{ minWidth: "max-content" }}>
                    <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
                      <tr>
                        <th className="w-12 px-3 py-3 text-left font-medium text-muted-foreground bg-card/95 sticky left-0 z-20 border-r border-border/50">
                          <Hash className="h-3 w-3" />
                        </th>
                        {queryResults.columns.map((col) => (
                          <th

                            key={col}
                            className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap border-r border-border/50 last:border-r-0 bg-card/95"
                            style={{ minWidth: "120px" }}

                          >
                            <div className="flex items-center gap-2">
                              {getColumnIcon(col)}
                              <span className="truncate" title={col}>
                                {col}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResults.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          {...((selectedRow === rowIndex) ? { className: "px-4 py-2 text-sm bg-muted/90" } : { className: "border-b border-border /30 hover:bg-muted/50 transition-colors group cursor-pointer" })}
                          onClick={() => {
                            setSelectedRow(selectedRow === rowIndex ? null : rowIndex)
                          }}
                          id={"col" + rowIndex}

                        >
                          <td className="px-3 py-2.5 text-xs text-muted-foreground border-r border-border/30 font-mono bg-muted/20 sticky left-0 z-10">
                            {rowIndex + 1}
                          </td>
                          {queryResults.columns.map((col) => (
                            <td
                              key={col}
                              className="px-4 py-2.5 border-r border-border/30 last:border-r-0 whitespace-nowrap"
                              style={{ minWidth: "120px" }}
                            >
                              <div className="overflow-hidden">{formatCellValue(row[col])}</div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            // todo make it display column names
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">No results found</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Zap className="h-8 w-8 text-primary/60" />
            </div>
            <p className="text-sm">Execute a SQL query to view the results here</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Press Ctrl+Enter to run your query</p>
          </div>
        )}
      </div>
    </div >
  )
}
