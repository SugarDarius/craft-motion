'use client'

import { useEffect, useState } from 'react'
import { PlayIcon } from '@radix-ui/react-icons'
import useEvent from 'react-use-event-hook'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { inputValuesFixer } from '@/lib/inspector'
import { EaseComboBox } from './ease-combo-box'

export function EditorInspector({
  isPlaying,
  duration,
  onChangeDuration,
  ease,
  onSelectEase,
  onPlay,
  children,
}: {
  isPlaying: boolean
  duration: number
  onChangeDuration: (duration: number) => void
  ease: string
  onSelectEase: (ease: string) => void
  onPlay: () => void
  children: React.ReactNode
}) {
  const [durationValue, setDurationValue] = useState<string>(String(duration))

  const handleDurationValueChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setDurationValue(e.target.value)
    }
  )

  const handleDurationChange = useEvent((): void => {
    const durationAsNumber = parseInt(durationValue)
    const [fixedDuration] = inputValuesFixer([durationAsNumber])

    onChangeDuration(fixedDuration)
  })

  const handleKeyDown = useEvent(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleDurationChange()
      }
    }
  )

  useEffect(() => {
    setDurationValue(String(duration))
  }, [duration])

  return (
    <div className='absolute bottom-0 right-8 top-0 z-10 mx-0 my-auto h-[80%] w-72'>
      <div className='flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-background'>
        <div className='w-full flex-shrink-0 border-b-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>
            Inspector
          </span>
        </div>
        <div className='flex w-full flex-grow flex-col overflow-y-auto'>
          {!isPlaying ? children : null}
        </div>
        <div className='w-full flex-shrink-0 border-b-2 border-t-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>
            Animation
          </span>
        </div>
        <div className='flex w-full flex-shrink-0 flex-col gap-2 px-4 pb-4 pt-2'>
          <div className='grid gap-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='duration'>
                Duration{' '}
                <span className='text-xs text-slate-500'>(seconds)</span>
              </Label>
            </div>
            <Input
              value={durationValue}
              defaultValue={1}
              onChange={handleDurationValueChange}
              onBlur={handleDurationChange}
              onKeyDown={handleKeyDown}
              className='input-ring h-6 w-full px-2'
            />
          </div>
          <div className='mt-1.5 flex w-full flex-col gap-2'>
            <Label>Ease</Label>
            <EaseComboBox
              value={ease}
              onSelect={onSelectEase}
              isDisabled={isPlaying}
            />
          </div>
        </div>
        <div className='w-full flex-shrink-0 border-t-2 px-4 py-2'>
          <Button className='w-full' disabled={isPlaying} onClick={onPlay}>
            <PlayIcon
              className={`${isPlaying ? 'animate-shake' : ''} mr-2 h-4 w-4`}
            />
            Play
          </Button>
        </div>
      </div>
    </div>
  )
}
