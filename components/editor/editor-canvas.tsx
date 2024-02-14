'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

export function EditorCanvas({
  canvasRef,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className='flex h-auto w-full flex-col'>
        <div
          id='canvas-box'
          className='flex h-full w-full flex-col items-center justify-center overflow-hidden'
        >
          <canvas ref={canvasRef} id='canvas' className='h-full w-full' />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-[180px]'>
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
