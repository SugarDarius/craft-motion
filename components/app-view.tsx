'use client'

import React from 'react'

export function AppView({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[url('/grid-light.svg')] dark:bg-[url('/grid-dark.svg')]">
      {children}
    </div>
  )
}
