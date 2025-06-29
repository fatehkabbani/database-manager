import React from 'react'
import { useState } from 'react';
import { X } from "lucide-react";
interface QueryFileProps {
  queryNumber: number;
  isActive?: boolean;
  onClose?: (queryNumber: number) => void;
  onClick?: () => void;
}

function QueryFile({ queryNumber, isActive = false, onClose, onClick }: QueryFileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex flex-row justify-between items-center text-sm p-2 rounded-lg cursor-pointer  ${
        isActive
          ? 'text-white bg-blue-600'
          : 'text-white border-t-transparent'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Query {queryNumber}
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClose?.(queryNumber);
        }}
        className={`hover:bg-gray-500 rounded p-1 transition-colors ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <X size={16} />
      </span>
    </div>
  );
}
export  {QueryFile};
