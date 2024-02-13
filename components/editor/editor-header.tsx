'use client'
import React from 'react'

export function EditorHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className='absolute left-0 top-0 z-10 flex h-fit w-full flex-shrink-0 flex-row items-center px-[2rem] py-6'>
      {React.Children.map(children, (child) => {
        return <div className='flex h-fit w-fit flex-1'>{child}</div>
      })}
    </div>
  )
}
