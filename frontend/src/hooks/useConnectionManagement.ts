import { useState, useEffect } from 'react'
import type { Connection } from '@/types'
import { getConnections } from '@/services/api'
import { createMockConnections } from '../utils/mockData'

export function useConnectionManagement() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [activeConnection, setActiveConnection] = useState<string>("")

  useEffect(() => {
    const loadConnections = async () => {
      const connectionsData = await getConnections()
      const processedConnections = createMockConnections(connectionsData.connections)

      setConnections(processedConnections)
      if (connectionsData.activeConnection) {
        setActiveConnection(connectionsData.activeConnection)
      }
    }

    loadConnections()
  }, [])

  const activeConnectionData = connections.find((c) => c.id === activeConnection)

  return {
    connections,
    activeConnection,
    activeConnectionData,
    setActiveConnection,
  }
}
