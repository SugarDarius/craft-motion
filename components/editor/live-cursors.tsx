'use client'

import { useOthers } from '@/liveblocks.config'
import { LiveCursor } from './live-cursor'

export function LiveCursors() {
  const others = useOthers()

  return others.map(({ connectionId, presence }) => {
    if (presence.cursor === null) {
      return null
    }

    return (
      <LiveCursor
        key={connectionId}
        connectionId={connectionId}
        cursor={presence.cursor}
      />
    )
  })
}
