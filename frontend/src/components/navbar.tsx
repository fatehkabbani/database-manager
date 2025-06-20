import React from 'react'
import {Logo} from '@/components/icons/logo'
import { Button } from '@/components/ui/button'
import { Database , RefreshCcw ,Info , CircleHelp , ArrowRight} from "lucide-react"

// import { IconDatabase, IconPointFilled, IconRefresh, IconNews, IconArrowRight, IconHelp } from '@tabler/icons-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
function Navbar() {
  return (
    <header className='flex p-4 background-primary text-white'>
      <nav className='flex items-center justify-between w-full'>
        <div className='flex flex-start space-x-4'>
          <Logo />

          <div className='flex space-x-1'>
            {/* todo fix this shit */}
            <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer gap-x-2 '>
              <div className='flex items-center gap-x-1'>
                <Database /> Database
              </div>
               <div className='w-2 h-2  rounded-full bg-green-500'></div>

            </Button>
            <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
              <RefreshCcw  />
            </Button>
          </div>

        </div>
        <div className='flex space-x-4'>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View information</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
                <CircleHelp />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
          <Button size="sm" className='rounded-0 bg-blue-600 cursor-pointer ring-0 '>
            sign in
            <ArrowRight />
          </Button>
        </div>
      </nav>
    </header>
  )
}

export { Navbar }
