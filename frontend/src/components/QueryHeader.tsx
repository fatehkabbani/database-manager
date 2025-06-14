import React from 'react'
import { DollarSign, Menu , Star,Zap} from "lucide-react";
import { Button } from '@/components/ui/button';
export function QueryHeader() {
  return (
    <div className="bg-[#1a2236] p-4 border-y border-[#232c43] rounded-t-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300"><Menu size={16} /></span>
            <span className="text-gray-300">New query</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className='cursor-pointer'><Star size={16} /></Button>
          <Button variant="ghost" className='cursor-pointer'><Menu size={16} /></Button>
          <Button variant="ghost" className='cursor-pointer'><Zap size={16} /></Button>
          <Button variant="ghost" className='cursor-pointer'><DollarSign size={16} /></Button>
        </div>
      </div>
    </div>
  )
}
