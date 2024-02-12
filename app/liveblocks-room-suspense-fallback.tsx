'use client'

import { ReloadIcon } from '@radix-ui/react-icons'

export function LiveblocksRoomSuspenseFallback() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[url('/grid.svg')]">
      <div className='flex h-fit w-fit flex-row items-center gap-2'>
        <ReloadIcon className='animate-spin' />
        <h2 className='scroll-m-0 text-5xl font-extrabold tracking-tight'>
          <span className='bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent'>
            Craft Motion
          </span>
        </h2>
      </div>
    </div>
  )
}
