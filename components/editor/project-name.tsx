'use client'

import { useMemo } from 'react'
import { getRandomUsername } from '@/lib/random-names'

export function ProjectName() {
  const projectName = useMemo(() => getRandomUsername(), [])
  return (
    <h4 className='scroll-m-0 text-xl font-semibold tracking-tight'>
      {projectName}
    </h4>
  )
}
