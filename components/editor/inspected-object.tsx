'use client'

import { SquareIcon, CircleIcon } from '@radix-ui/react-icons'
import type { InspectedObject } from '@/lib/codex/inspector'
import { Separator } from '@/components/ui/separator'

export function InspectedOject({
  inspectedObject,
}: {
  inspectedObject: InspectedObject
}) {
  const { type, objectId, fill, ...rest } = inspectedObject

  const Icon = type === 'circle' ? CircleIcon : SquareIcon
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)
  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full flex-row items-center gap-1 px-2 py-2'>
        <Icon className='h-4 w-4' />
        <span className='text-sm'>
          {typeName} <span className='text-xs'>{objectId.slice(0, 4)}</span>
        </span>
      </div>
      <Separator />
      <div className='flex w-full flex-row items-center gap-1 px-2 py-2'>
        <span className='text-[10px] font-semibold uppercase'>sizes</span>
      </div>
      <Separator />
      <div className='flex w-full flex-row items-center gap-1 px-2 py-2'>
        <span className='text-[10px] font-semibold uppercase'>color</span>
      </div>
    </div>
  )
}
