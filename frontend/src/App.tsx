import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
function App() {
 const [query, setQuery] = useState('');
  return (
    <>
  <div className="h-screen bg-gray-900 text-white flex flex-col ">
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar Panel */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
        >
          <div className="h-full bg-gray-800 flex flex-col">
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold items-center">Queries</h2>
                <button className="text-gray-400 hover:text-white">
                  <span className="text-xl m-0 p-0">+</span>
                </button>
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg mb-6 flex items-center justify-center font-medium">
                <span className="mr-2">⚡</span>
                New query
              </button>

              <div className="space-y-1">
                <div className="text-sm text-white bg-gray-700 p-2 rounded cursor-pointer">
                  Query 1
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="space-y-1">
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer p-2 rounded flex items-center">
                  <span className="mr-2">📁</span>
                  Saved queries
                  <span className="ml-auto"></span>
                </div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer p-2 rounded flex items-center">
                  <span className="mr-2">🕒</span>
                  Query history
                  <span className="ml-auto"></span>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Resize Handle - this is the draggable edge */}
        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-purple-500 transition-colors duration-200 cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel defaultSize={80}>
          <div className="h-full flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-white p-1">
                    <span className="text-lg">‹</span>
                  </button>
                  <button className="text-gray-400 hover:text-white p-1">
                    <span className="text-lg">+</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">📄</span>
                    <span className="text-gray-300">New query</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-white p-1">⭐</button>
                  <button className="text-gray-400 hover:text-white p-1">☰</button>
                  <button className="text-gray-400 hover:text-white p-1">⚡</button>
                  <button className="text-gray-400 hover:text-white p-1">$</button>
                </div>
              </div>
            </div>

            {/* Query Editor Area */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <div className="flex">
                  <span className="text-gray-500 mr-4 font-mono text-sm mt-1">1</span>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="sql here but changing it later for the vscode one..."
                    className="flex-1 bg-transparent text-white resize-none outline-none font-mono"
                    rows={3}
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300 flex items-center">
                      <span className="mr-2">⚡</span>
                      Results
                    </span>
                    <span className="text-gray-500 text-sm">0 responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">
                      📊 SurrealQL
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">
                      🔗 Combined
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm flex items-center">
                      Run query
                      <span className="ml-1">▼</span>
                    </button>
                  </div>
                </div>

                <div className="text-center text-gray-400 py-16">
                  <div className="text-5xl mb-4 opacity-50">⚡</div>
                  <div className="text-lg">Execute a SurrealQL query to view the results here</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
    </>
  )
}

export default App
