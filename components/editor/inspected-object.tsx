'use client'

import { SquareIcon, CircleIcon } from '@radix-ui/react-icons'
import useEvent from 'react-use-event-hook'

import type {
  InspectedObject,
  EditedInspectedProperties,
} from '@/lib/codex/inspector'

import { Separator } from '@/components/ui/separator'
import { ColorPicker } from '@/components/ui/color-picker'

import { InspectedPosition } from './inspected-position'
import { InspectedSizes } from './inspected-sizes'
import { InspectedRadius } from './inspected-radius'

export function InspectedOject({
  inspectedObject,
  onEditedObject,
}: {
  inspectedObject: InspectedObject
  onEditedObject: (editedInspectedProperties: EditedInspectedProperties) => void
}) {
  const { type, objectId, fill } = inspectedObject

  const Icon = type === 'circle' ? CircleIcon : SquareIcon
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)

  const handlePositionChange = useEvent((x: number, y: number): void => {
    onEditedObject({ ...inspectedObject, x, y })
  })

  const handleSizesChange = useEvent((width: number, height: number): void => {
    if (type === 'rectangle') {
      onEditedObject({ ...inspectedObject, width, height })
    }
  })

  const handleRadiusChange = useEvent((radius: number): void => {
    if (type === 'circle') {
      onEditedObject({ ...inspectedObject, radius })
    }
  })

  const handleColorChange = useEvent((color: string): void => {
    if (color !== inspectedObject.fill) {
      onEditedObject({ ...inspectedObject, fill: color })
    }
  })

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full flex-row items-center gap-1 px-4 py-2'>
        <Icon className='h-4 w-4' />
        <span className='text-sm'>
          {typeName} <span className='text-xs'>{objectId.slice(0, 4)}</span>
        </span>
      </div>
      <Separator />
      <div className='flex w-full flex-col  gap-1 px-4 py-2'>
        <span className='text-[10px] font-semibold uppercase'>position</span>
        <InspectedPosition
          x={inspectedObject.x}
          y={inspectedObject.y}
          onPositionChange={handlePositionChange}
        />
      </div>
      <Separator />
      <div className='flex w-full flex-col  gap-1 px-4 py-2'>
        <span className='text-[10px] font-semibold uppercase'>sizes</span>
        {type === 'rectangle' ? (
          <InspectedSizes
            width={inspectedObject.width}
            height={inspectedObject.height}
            onSizesChange={handleSizesChange}
          />
        ) : type === 'circle' ? (
          <InspectedRadius
            radius={inspectedObject.radius}
            onRadiusChange={handleRadiusChange}
          />
        ) : null}
      </div>
      <Separator />
      <div className='flex w-full flex-col  gap-1 px-4 py-2'>
        <span className='text-[10px] font-semibold uppercase'>color</span>
        <ColorPicker color={fill} onChange={handleColorChange} />
      </div>
    </div>
  )
}
