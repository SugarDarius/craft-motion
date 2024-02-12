'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function EditorInspector() {
  return (
    <div className='absolute bottom-0 right-8 top-0 z-10 mx-0 my-auto h-[80%] w-72'>
      <div className='flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-background'>
        <div className='w-full flex-shrink-0 border-b-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>
            Inspector
          </span>
        </div>
        <div className='flex w-full flex-grow flex-col overflow-y-auto py-2'></div>
        <div className='w-full flex-shrink-0 border-b-2 border-t-2 px-4 py-2'>
          <span className='text-xl font-semibold tracking-tight'>
            Animation
          </span>
        </div>
        <div className='w-full flex-shrink-0 gap-2 px-4 py-2'>
          <div className='grid gap-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='duration'>Duration (s)</Label>
              <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                {10}
              </span>
            </div>
            <Slider
              id='duration'
              max={10}
              // defaultValue={10}
              step={1}
              // onValueChange={setValue}
              className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
              aria-label='Maximum Length'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
