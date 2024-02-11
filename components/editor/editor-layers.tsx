'use client'

import { useMemo } from 'react'
import useEvent from 'react-use-event-hook'
import { SquareIcon, CircleIcon } from '@radix-ui/react-icons'

import type { ShapeType } from '@/lib/codex/shape'
import type { CanvasObjects } from '@/lib/codex/liveblocks'

import { Button } from '@/components/ui/button'

function LayerButton({
  objectId,
  type,
  onClick,
}: {
  objectId: string
  type: ShapeType
  onClick: (objectId: string) => void
}) {
  const handleClick = useEvent((): void => {
    onClick(objectId)
  })
  const Icon = type === 'circle' ? CircleIcon : SquareIcon
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <Button
      variant='ghost'
      className='w-full items-center justify-start gap-2 rounded-none'
      onClick={handleClick}
    >
      <Icon className='h-4 w-4' />
      {typeName}
      <span className='text-sm'>{objectId.slice(0, 3)}</span>
    </Button>
  )
}

export function EditorLayer({
  canvasObjects,
  onLayerClick,
}: {
  activeObjectId: string | null
  canvasObjects: CanvasObjects
  onLayerClick: (objectId: string) => void
}) {
  const layers = useMemo(
    () => Array.from(canvasObjects.values()),
    [canvasObjects]
  )

  return (
    <div className='absolute bottom-0 left-8 top-0 z-10 mx-0 my-auto h-[80%] w-72'>
      <div className='flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-background'>
        <div className='w-full flex-shrink-0 border-b-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>Layers</span>
        </div>
        <div className='flex w-full flex-grow flex-col overflow-y-auto py-2'>
          {layers.map((layer) => (
            <LayerButton
              key={layer.objectId}
              objectId={layer.objectId}
              type={layer.type}
              onClick={onLayerClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
