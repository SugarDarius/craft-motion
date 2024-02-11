'use client'

import useEvent from 'react-use-event-hook'
import { SquareIcon, CircleIcon } from '@radix-ui/react-icons'

import type { ShapeType } from '@/lib/codex/shape'
import { Button } from '@/components/ui/button'

export function LayerButton({
  objectId,
  type,
  isSelected,
  onClick,
}: {
  objectId: string
  type: ShapeType
  isSelected: boolean
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
      className={`w-full  items-center justify-start gap-2 rounded-none data-[selected=""]:bg-accent`}
      onClick={handleClick}
      data-selected={isSelected ? '' : undefined}
    >
      <Icon className='h-4 w-4' />
      {typeName}
      <span className='text-sm'>{objectId.slice(0, 3)}</span>
    </Button>
  )
}
