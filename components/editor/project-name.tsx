'use client'

import { useMemo } from 'react'
import { getRandomUsername } from '@/lib/random-names'

export function ProjectName() {
  const projectName = useMemo(() => getRandomUsername(), [])
  return (
    <h4 className='scroll-m-0 text-3xl font-extrabold tracking-tight'>
      <span className='bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent'>
        {projectName}
      </span>
    </h4>
  )
}
