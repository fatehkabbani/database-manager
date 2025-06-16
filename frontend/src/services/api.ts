import { fetchApi } from "@/utils/fetchApi"

export async function getTables() {
  try {
    const response = await fetchApi({ url: '/list_tables', method: 'POST' })
    return response.data
  } catch (error) {
    console.error("Error fetching tables:", error)
    return []
  }
}
export async function executeQuery(query: string) {
  try {
    const response = await fetchApi({
      url: '/execute_query',
      method: 'POST',
      body: {
        'query': query,
      }
    })
    return response.data
  } catch (error) {
    console.error("Error executing query:", error)
    return null
  }
}
export async function getConnections() {
  try {
    const response = await fetchApi({
      url: '/connection',
      method: 'POST',
      body: {
        action: "list",
        data: {},
      }
    })
    if (!response.data || typeof response.data !== 'object') {
      console.error("Invalid response format:", response.data)
      return { connections: [], activeConnection: null }
    }

    const connectionsArray = Object.values(response.data.connections || {})
    return {
      connections: connectionsArray,
      activeConnection: response.data.active_connection
    }
  } catch (error) {
    console.error("Error fetching connections:", error)
    return { connections: [], activeConnection: null }
  }
}
