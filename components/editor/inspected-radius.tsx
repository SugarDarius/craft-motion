'use client'

import { useEffect, useState } from 'react'
import useEvent from 'react-use-event-hook'

import { inputValuesFixer } from '@/lib/inspector'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function InspectedRadius({
  radius,
  onRadiusChange,
}: {
  radius: number
  onRadiusChange: (radius: number) => void
}) {
  const [radiusValue, setRadiusValue] = useState<string>(String(radius))

  const handleRadiusValueChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setRadiusValue(e.target.value)
    }
  )

  const handleRadiusChange = useEvent((): void => {
    const radiusValueAsNumber = parseFloat(radiusValue)

    const [fixedRadius] = inputValuesFixer([radiusValueAsNumber])

    onRadiusChange(fixedRadius)
  })

  const handleKeyDown = useEvent(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleRadiusChange()
      }
    }
  )

  useEffect(() => {
    setRadiusValue(String(radius))
  }, [radius])

  return (
    <div className='flex w-full flex-col gap-1.5'>
      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <Label htmlFor='radius' className='shrink-0 text-[10px] font-bold'>
          Radius (px)
        </Label>
        <Input
          id='radius'
          className='input-ring h-6 w-[70%] px-2'
          value={radiusValue}
          onChange={handleRadiusValueChange}
          onBlur={handleRadiusChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
