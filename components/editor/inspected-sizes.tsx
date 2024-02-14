'use client'

import { useEffect, useState } from 'react'
import useEvent from 'react-use-event-hook'

import { inputValuesFixer } from '@/lib/inspector'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function InspectedSizes({
  width,
  height,
  onSizesChange,
}: {
  width: number
  height: number
  onSizesChange: (width: number, height: number) => void
}) {
  const [widthValue, setWidthValue] = useState<string>(String(width))
  const [heightValue, setHeightValue] = useState<string>(String(height))

  const handleXChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setWidthValue(e.target.value)
    }
  )

  const handleYChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setHeightValue(e.target.value)
    }
  )

  const handleSizesChange = useEvent((): void => {
    const widthValueAsNumber = parseFloat(widthValue)
    const heightValueAsNumber = parseFloat(heightValue)

    const [fixedWidth, fixedHeight] = inputValuesFixer([
      widthValueAsNumber,
      heightValueAsNumber,
    ])

    onSizesChange(fixedWidth, fixedHeight)
  })

  const handleKeyDown = useEvent(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSizesChange()
      }
    }
  )

  useEffect(() => {
    setWidthValue(String(width))
  }, [width])

  useEffect(() => {
    setHeightValue(String(height))
  }, [height])

  return (
    <div className='flex w-full flex-col gap-1.5'>
      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <Label htmlFor='width' className='shrink-0 text-[10px] font-bold'>
          Width (px)
        </Label>
        <Input
          id='width'
          className='input-ring h-6 w-[70%] px-2'
          value={widthValue}
          onChange={handleXChange}
          onBlur={handleSizesChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <Label htmlFor='height' className='shrink-0 text-[10px] font-bold'>
          Height (px)
        </Label>
        <Input
          id='height'
          className='input-ring h-6 w-[70%] px-2'
          value={heightValue}
          onChange={handleYChange}
          onBlur={handleSizesChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
