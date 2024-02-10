'use client'

import React from 'react'
import { ClientSideSuspense } from '@liveblocks/react'
import { RoomProvider } from '@/liveblocks.config'

const ROOM_ID = 'craft-motion-room'
export function LiveblocksRoom({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider id={ROOM_ID} initialPresence={{}}>
      <ClientSideSuspense fallback={<h1>loading room...</h1>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
