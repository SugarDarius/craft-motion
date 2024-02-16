'use client'

import useEvent from 'react-use-event-hook'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useUpdateMyPresence } from '@/liveblocks.config'

import { LiveCursors } from './live-cursors'

export function EditorCanvas({
  canvasRef,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  canPaste,
  onPaste,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
  canPaste: boolean
  onPaste: () => void
}) {
  const updateMyPresence = useUpdateMyPresence()

  const handlePointerMove = useEvent((e: React.PointerEvent): void => {
    updateMyPresence({
      cursor: {
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
      },
    })
  })

  const handlePointerLeave = useEvent((): void => {
    updateMyPresence({ cursor: null })
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          id='canvas-box'
          className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <canvas ref={canvasRef} id='canvas' className='h-full w-full' />
          <LiveCursors />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-[180px]'>
        {canPaste ? (
          <>
            <ContextMenuItem onClick={onPaste} disabled={!canPaste}>
              Paste
              <ContextMenuShortcut>⌘+V</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : null}
        <ContextMenuItem onClick={onUndo} disabled={!canUndo}>
          Undo
          <ContextMenuShortcut>⌘+Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onRedo} disabled={!canRedo}>
          Redo
          <ContextMenuShortcut>⇧+⌘+Z</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
