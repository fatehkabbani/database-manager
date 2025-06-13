import React from 'react'
import { Panel, PanelGroup ,  PanelResizeHandle} from 'react-resizable-panels'
import { IconFolder , IconClock,IconPlus} from '@tabler/icons-react';

import ActionBar from '@/components/ActionBar'
import QueryFile  from '@/components/items/queryFile'
function setActiveQuery(QueryNumber : number ) {
  // Logic to set the active query
  console.log(`Setting query ${QueryNumber} as active`);

}
function SideBar() {
  return (
    <PanelGroup direction="horizontal" className="h-full bg-background">
      <Panel defaultSize={15}
        minSize={15}
        maxSize={15} className="h-full">
          <ActionBar />
      </Panel>
      <PanelResizeHandle disabled className=" w-0.5 cursor-default bg-gray-900 transition-colors duration-200 " />
      <Panel defaultSize={100} className="h-full pt-[2px]">
        <div className="h-[calc(100%-20px)] w-[calc(100%-5px)] bg-transparent flex flex-col rounded-xl ring-1 ring-gray-800">
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold items-center">Queries</h2>
              <IconPlus size="16" className='cursor-pointer'/>
            </div>


            <div className="space-y-1">
              <QueryFile queryNumber={1} isActive={true}  onClose={() => {}} onClick={() => setActiveQuery(1)} />
              <QueryFile queryNumber={2} isActive={false} onClose={() => {}} onClick={() => setActiveQuery(2)} />
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="space-y-1">
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer p-2 rounded flex items-center select-none">
                <span className="mr-2"><IconFolder /></span>
                Saved queries
                <span className="ml-auto"></span>
              </div>
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer p-2 rounded flex items-center select-none">
                <span className="mr-2"><IconClock /></span>
                Query history
                <span className="ml-auto"></span>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  )
}
export default SideBar
