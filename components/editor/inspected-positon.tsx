'use client'

import { useEffect, useState } from 'react'
import useEvent from 'react-use-event-hook'

import { inputValuesFixer } from '@/lib/inspector'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function InspectedPosition({
  x,
  y,
  onPositionChange,
}: {
  x: number
  y: number
  onPositionChange: (x: number, y: number) => void
}) {
  const [xValue, setXValue] = useState<string>(String(x))
  const [yValue, setYValue] = useState<string>(String(y))

  const handleXChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setXValue(e.target.value)
    }
  )

  const handleYChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setYValue(e.target.value)
    }
  )

  const handlePositionChange = useEvent((): void => {
    const xValueAsNumber = parseFloat(xValue)
    const yValueAsNumber = parseFloat(yValue)

    const [fixedX, fixedY] = inputValuesFixer([xValueAsNumber, yValueAsNumber])

    onPositionChange(fixedX, fixedY)
  })

  const handleKeyDown = useEvent(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handlePositionChange()
      }
    }
  )

  useEffect(() => {
    setXValue(String(x))
  }, [x])

  useEffect(() => {
    setYValue(String(y))
  }, [y])

  return (
    <div className='flex w-full flex-col gap-1.5'>
      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <Label htmlFor='left' className='shrink-0 text-[10px] font-bold'>
          X (px)
        </Label>
        <Input
          id='left'
          className='input-ring h-6 w-[70%] px-2'
          value={xValue}
          onChange={handleXChange}
          onBlur={handlePositionChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <Label htmlFor='top' className='shrink-0 text-[10px] font-bold'>
          Y (px)
        </Label>
        <Input
          id='top'
          className='input-ring h-6 w-[70%] px-2'
          value={yValue}
          onChange={handleYChange}
          onBlur={handlePositionChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
