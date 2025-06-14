import React from 'react'
import { QueryHeader } from './QueryHeader'
import { TextEditor } from './TextEditor'
export function Query() {
  return (
    <div>
        <div className="h-full flex flex-col bg-gray-900">
              {/* Header */}
              <QueryHeader />

              {/* Query Editor Area */}
              <div className="flex-1">
              <TextEditor />

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

    </div>
  )
}
