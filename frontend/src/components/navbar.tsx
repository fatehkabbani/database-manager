import React from 'react'
import Logo from '@/components/icons/logo'
import { Button } from '@/components/ui/button'
import { IconDatabase, IconPointFilled, IconRefresh, IconNews, IconArrowRight, IconHelp } from '@tabler/icons-react'
function Navbar() {

  return (
    <header className='flex p-4 bg-background text-white'>
      <nav className='flex items-center justify-between w-full'>
        <div className='flex flex-start space-x-4'>
          <Logo />
          <div className='flex space-x-1'>
            <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
              <IconDatabase /> Database <IconPointFilled className='text-green-500' />
            </Button>
            <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
              <IconRefresh />
            </Button>
          </div>

        </div>
        <div className='flex space-x-4'>
          <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
            <IconNews />
          </Button>
          <Button variant="ghost" size="sm" className='rounded-0 cursor-pointer ring-0'>
            <IconHelp />
          </Button>
          <Button  size="sm" className='rounded-0 bg-blue-600 cursor-pointer ring-0 '>
            sign in <IconArrowRight />
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
