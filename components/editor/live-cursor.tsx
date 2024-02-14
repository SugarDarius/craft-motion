'use client'

import { useMemo } from 'react'
import { PresenceCursor } from './presence-cursor'

const colors = [
  '#E57373',
  '#9575CD',
  '#4FC3F7',
  '#81C784',
  '#FFF176',
  '#FF8A65',
  '#F06292',
  '#7986CB',
]

export function LiveCursor({
  connectionId,
  cursor,
}: {
  connectionId: number
  cursor: { x: number; y: number }
}) {
  const fill = useMemo(
    () => colors[connectionId % colors.length],
    [connectionId]
  )
  return <PresenceCursor x={cursor.x} y={cursor.y} fill={fill} />
}
