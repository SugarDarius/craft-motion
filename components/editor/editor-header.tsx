'use client'

import React from 'react'

export function EditorHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex h-fit w-full flex-row justify-between px-4 py-6'>
      {React.Children.map(children, (child) => {
        return <div className='flex h-fit w-fit'>{child}</div>
      })}
    </div>
  )
}
