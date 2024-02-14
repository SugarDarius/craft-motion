'use client'

import { SquareIcon, CircleIcon } from '@radix-ui/react-icons'
import useEvent from 'react-use-event-hook'

import type {
  InspectedObject,
  EditedInspectedProperties,
} from '@/lib/codex/inspector'

import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '@/components/ui/color-picker'

import { InspectedPosition } from './inspected-positon'

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

  const handleChangeRadius = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
      const valueAsNumber = parseFloat(value)
      if (
        !isNaN(valueAsNumber) &&
        type === 'circle' &&
        inspectedObject.radius !== valueAsNumber
      ) {
        onEditedObject({ ...inspectedObject, radius: valueAsNumber })
      }
    }
  )

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
        <div className='flex w-full flex-col gap-1.5'>
          {type === 'rectangle' ? (
            <>
              <div className='flex w-full flex-row items-center justify-between gap-2'>
                <Label
                  htmlFor='width'
                  className='shrink-0 text-[10px] font-bold'
                >
                  Width (px)
                </Label>
                <Input
                  id='width'
                  className='input-ring h-6 w-[70%] px-2'
                  value={inspectedObject.width}
                />
              </div>
              <div className='flex w-full flex-row items-center justify-between gap-2'>
                <Label
                  htmlFor='height'
                  className='shrink-0 text-[10px] font-bold'
                >
                  Height (px)
                </Label>
                <Input
                  id='height'
                  className='input-ring h-6 w-[70%] px-2 '
                  value={inspectedObject.height}
                />
              </div>
            </>
          ) : type === 'circle' ? (
            <div className='flex w-full flex-row items-center justify-between gap-2'>
              <Label
                htmlFor='radius'
                className='shrink-0 text-[10px] font-bold'
              >
                Radius (px)
              </Label>
              <Input
                id='radius'
                className='input-ring h-6 w-[70%] px-2'
                value={inspectedObject.radius}
                onChange={handleChangeRadius}
              />
            </div>
          ) : null}
        </div>
      </div>
      <Separator />
      <div className='flex w-full flex-col  gap-1 px-4 py-2'>
        <span className='text-[10px] font-semibold uppercase'>color</span>
        <ColorPicker color={fill} onChange={handleColorChange} />
      </div>
    </div>
  )
}
