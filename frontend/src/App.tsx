import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideBar } from './components/sideBar';
import { Navbar } from './components/navbar';
import { Query } from '@/components/Query';
import { DatabaseManager } from './components/database-manager';
function App() {
  return (
    <>
      <div className="h-screen bg-gray-900 text-white flex flex-col ">
        <Navbar />
        <DatabaseManager />
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar Panel */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={20}
          >
            <SideBar />
          </Panel>
          <PanelResizeHandle className="w-1 bg-background hover:bg-purple-500 transition-colors duration-200 cursor-col-resize" />
          <Panel defaultSize={80}>
            <Query />
          </Panel>
        </PanelGroup>
      </div>
    </>
  )
}


export default App
