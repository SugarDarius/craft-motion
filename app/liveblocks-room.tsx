'use client'

import { LiveMap, LiveObject } from '@liveblocks/client'
import { ClientSideSuspense } from '@liveblocks/react'

import { RoomProvider } from '@/liveblocks.config'
import { LiveblocksRoomSuspenseFallback } from './liveblocks-room-suspense-fallback'

const ROOM_ID = 'craft-motion-room'
export function LiveblocksRoom({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider
      id={ROOM_ID}
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
      initialStorage={{
        craftMotionData: new LiveObject({ canvasObjects: new LiveMap() }),
      }}
    >
      <ClientSideSuspense fallback={<LiveblocksRoomSuspenseFallback />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
