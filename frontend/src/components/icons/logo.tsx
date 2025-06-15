import React from 'react'
import image from '@/components/icons/logo.svg'
  function Logo() {
  return (
    <img src={image}
      alt="Logo"
      className="w-[24px] h-[24px] mt-1"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
    />
  )
}
export { Logo }
