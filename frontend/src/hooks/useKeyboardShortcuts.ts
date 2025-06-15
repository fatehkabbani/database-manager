import { useCallback, useEffect } from 'react'
import type { QueryFile } from '../types'

interface UseKeyboardShortcutsProps {
  activeQuery: QueryFile | undefined
  isExecuting: boolean
  queryFiles: QueryFile[]
  activeQueryFile: string
  queryResults: any
  onExecuteQuery: () => void
  onCreateNewQuery: () => void
  onCloseQueryFile: (queryId: string) => void
  onSetActiveQueryFile: (queryId: string) => void
  onSetQueryResults: (results: any) => void
  showToast: (message: string, type: string) => void
}

export function useKeyboardShortcuts({
  activeQuery,
  isExecuting,
  queryFiles,
  activeQueryFile,
  queryResults,
  onExecuteQuery,
  onCreateNewQuery,
  onCloseQueryFile,
  onSetActiveQueryFile,
  onSetQueryResults,
  showToast
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey

      // Ctrl/Cmd + Enter: Execute query
      if (ctrlKey && event.key === "Enter") {
        event.preventDefault()
        if (activeQuery?.content.trim() && !isExecuting) {
          onExecuteQuery()
          showToast("Query executed", "success")
        } else if (!activeQuery?.content.trim()) {
          showToast("No query to execute", "warning")
        }
        return
      }

      // Ctrl/Cmd + N: New query
      if (ctrlKey && event.key === "n") {
        event.preventDefault()
        onCreateNewQuery()
        showToast("New query created", "success")
        return
      }

      // Ctrl/Cmd + S: Save query
      if (ctrlKey && event.key === "s") {
        event.preventDefault()
        showToast("Save functionality coming soon", "info")
        return
      }

      // Ctrl/Cmd + W: Close current query tab
      if (ctrlKey && event.key === "w") {
        event.preventDefault()
        if (queryFiles.length > 1 && activeQueryFile) {
          const queryName = activeQuery?.name || "Query"
          onCloseQueryFile(activeQueryFile)
          showToast(`${queryName} closed`, "info")
        } else {
          showToast("Cannot close the last query", "warning")
        }
        return
      }

      // Ctrl/Cmd + T: New query (alternative shortcut)
      if (ctrlKey && event.key === "t") {
        event.preventDefault()
        onCreateNewQuery()
        showToast("New query created", "success")
        return
      }

      // Ctrl/Cmd + 1-9: Switch to query tab by number
      if (ctrlKey && event.key >= "1" && event.key <= "9") {
        event.preventDefault()
        const tabIndex = Number.parseInt(event.key) - 1
        if (tabIndex < queryFiles.length) {
          onSetActiveQueryFile(queryFiles[tabIndex].id)
          showToast(`Switched to ${queryFiles[tabIndex].name}`, "info")
        }
        return
      }

      // F5 or Ctrl/Cmd + R: Execute query (alternative)
      if (event.key === "F5" || (ctrlKey && event.key === "r")) {
        event.preventDefault()
        if (activeQuery?.content.trim() && !isExecuting) {
          onExecuteQuery()
          showToast("Query executed", "success")
        }
        return
      }

      // Escape: Clear results
      if (event.key === "Escape") {
        if (queryResults) {
          onSetQueryResults(null)
          showToast("Results cleared", "info")
        }
        return
      }
    },
    [activeQuery, isExecuting, queryFiles, activeQueryFile, queryResults, onExecuteQuery, onCreateNewQuery, onCloseQueryFile, onSetActiveQueryFile, onSetQueryResults, showToast],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
