'use client'

import useEvent from 'react-use-event-hook'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

import { EaseComboBox } from './ease-combox-box'

export function EditorInspector({
  duration,
  onChangeDuration,
  ease,
  onSelectEase,
  children,
}: {
  duration: number
  onChangeDuration: (duration: number) => void
  ease: string
  onSelectEase: (ease: string) => void
  children: React.ReactNode
}) {
  const handleValueChange = useEvent((values: number[]): void => {
    onChangeDuration(values[0])
  })
  return (
    <div className='absolute bottom-0 right-8 top-0 z-10 mx-0 my-auto h-[80%] w-72'>
      <div className='flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-background'>
        <div className='w-full flex-shrink-0 border-b-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>
            Inspector
          </span>
        </div>
        <div className='flex w-full flex-grow flex-col overflow-y-auto'>
          {children}
        </div>
        <div className='w-full flex-shrink-0 border-b-2 border-t-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>
            Animation
          </span>
        </div>
        <div className='flex w-full flex-shrink-0 flex-col gap-2 px-4 pb-4 pt-2'>
          <div className='grid gap-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='duration'>Duration</Label>
              <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground'>
                {duration}s
              </span>
            </div>
            <Slider
              id='duration'
              max={10}
              min={1}
              defaultValue={[1]}
              value={[duration]}
              step={1}
              onValueChange={handleValueChange}
              className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
              aria-label='Duration'
            />
          </div>
          <div className='mt-1.5 flex w-full flex-col gap-2'>
            <Label>Ease</Label>
            <EaseComboBox value={ease} onSelect={onSelectEase} />
          </div>
        </div>
      </div>
    </div>
  )
}
