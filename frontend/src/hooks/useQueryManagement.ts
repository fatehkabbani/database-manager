import { useState, useCallback } from 'react'
import { QueryFile } from '../types'

export function useQueryManagement() {
  const [queryFiles, setQueryFiles] = useState<QueryFile[]>([
    { id: "1", name: "New query", content: "", isUnsaved: false },
  ])
  const [activeQueryFile, setActiveQueryFile] = useState<string>("1")

  const activeQuery = queryFiles.find((q) => q.id === activeQueryFile)

  const createNewQuery = useCallback(() => {
    const newQuery: QueryFile = {
      id: Date.now().toString(),
      name: `Query ${queryFiles.length + 1}`,
      content: "",
      isUnsaved: false,
    }
    setQueryFiles([...queryFiles, newQuery])
    setActiveQueryFile(newQuery.id)
  }, [queryFiles])

  const closeQueryFile = useCallback(
    (queryId: string) => {
      const newFiles = queryFiles.filter((q) => q.id !== queryId)
      if (newFiles.length === 0) {
        createNewQuery()
      } else {
        setQueryFiles(newFiles)
        if (activeQueryFile === queryId) {
          setActiveQueryFile(newFiles[0].id)
        }
      }
    },
    [activeQueryFile, createNewQuery, queryFiles],
  )

  const updateQueryContent = useCallback((content: string) => {
    setQueryFiles((prev) =>
      prev.map((q) =>
        q.id === activeQueryFile
          ? { ...q, content, isUnsaved: true }
          : q
      )
    )
  }, [activeQueryFile])

  return {
    queryFiles,
    activeQueryFile,
    activeQuery,
    setActiveQueryFile,
    createNewQuery,
    closeQueryFile,
    updateQueryContent,
  }
}
