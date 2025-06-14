import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SideBar } from './components/sideBar';
import { Navbar } from './components/navbar';
import { Query } from '@/components/Query';
function App() {
  return (
    <>
      <div className="h-screen bg-gray-900 text-white flex flex-col ">
        <Navbar />
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar Panel */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={20}
          >
            <SideBar />
          </Panel>

          {/* Resize Handle - this is the draggable edge */}
          <PanelResizeHandle className="w-1 bg-background hover:bg-purple-500 transition-colors duration-200 cursor-col-resize" />


          {/* Main Content Panel */}
          <Panel defaultSize={80}>
            <Query />
          </Panel>
        </PanelGroup>
      </div>
    </>
  )
}

export default App
