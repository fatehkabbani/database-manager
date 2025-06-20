import { useCallback, useEffect } from 'react'
import type { QueryFile } from '../types'
import { ShortcutToast } from "@/components/shortcut-toast"

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
  onSetQueryResults
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
          ShortcutToast({ message: "Query executed", type: "success" })
        } else if (!activeQuery?.content.trim()) {
          ShortcutToast({ message: "No query to execute", type: "warning" })
        }
        return
      }

      // Ctrl/Cmd + N: New query
      if (ctrlKey && event.key === "n") {
        event.preventDefault()
        onCreateNewQuery()
        ShortcutToast({ message: "New query created", type: "success" })
        return
      }

      // Ctrl/Cmd + S: Save query
      if (ctrlKey && event.key === "s") {
        event.preventDefault()
        ShortcutToast({ message: "Save functionality coming soon", type: "info" })
        return
      }

      // Ctrl/Cmd + W: Close current query tab
      if (ctrlKey && event.key === "w") {
        event.preventDefault()
        if (queryFiles.length > 1 && activeQueryFile) {
          const queryName = activeQuery?.name || "Query"
          onCloseQueryFile(activeQueryFile)
          ShortcutToast({ message: `${queryName} closed`, type: "info" })
        } else {
          ShortcutToast({ message: "Cannot close the last query", type: "warning" })
        }
        return
      }

      // Ctrl/Cmd + T: New query (alternative shortcut)
      if (ctrlKey && event.key === "t") {
        event.preventDefault()
        onCreateNewQuery()
        ShortcutToast({ message: "New query created", type: "success" })
        return
      }

      // Ctrl/Cmd + 1-9: Switch to query tab by number
      if (ctrlKey && event.key >= "1" && event.key <= "9") {
        event.preventDefault()
        const tabIndex = Number.parseInt(event.key) - 1
        if (tabIndex < queryFiles.length) {
          onSetActiveQueryFile(queryFiles[tabIndex].id)
          ShortcutToast({ message: `Switched to ${queryFiles[tabIndex].name}`, type: "info" })
        }
        return
      }

      // F5 or Ctrl/Cmd + R: Execute query (alternative)
      if (event.key === "F5" || (ctrlKey && event.key === "r")) {
        event.preventDefault()
        if (activeQuery?.content.trim() && !isExecuting) {
          onExecuteQuery()
          ShortcutToast({ message: "Query executed", type: "success" })
        }
        return
      }

      // Escape: Clear results
      if (event.key === "Escape") {
        if (queryResults) {
          onSetQueryResults(null)
          ShortcutToast({ message: "Results cleared", type: "info" })
        }
        return
      }
    },
    [activeQuery, isExecuting, queryFiles, activeQueryFile, queryResults, onExecuteQuery, onCreateNewQuery, onCloseQueryFile, onSetActiveQueryFile, onSetQueryResults, ShortcutToast],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
