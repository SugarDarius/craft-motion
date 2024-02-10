'use client'

import React from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { ClientSideSuspense } from '@liveblocks/react'

import { RoomProvider } from '@/liveblocks.config'

function LiveblocksRoomSuspenseFallback() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[url('/grid.svg')]">
      <div className='flex h-fit w-fit flex-row items-center gap-2'>
        <ReloadIcon className='animate-spin' />
        <h2 className='scroll-m-0 text-3xl font-semibold tracking-tight'>
          Craft Motion
        </h2>
      </div>
    </div>
  )
}

const ROOM_ID = 'craft-motion-room'
export function LiveblocksRoom({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider
      id={ROOM_ID}
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
    >
      <ClientSideSuspense fallback={<LiveblocksRoomSuspenseFallback />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
