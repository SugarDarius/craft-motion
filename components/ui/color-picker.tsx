'use client'

import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ColorPicker({ value }: { value: string }) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button size='icon' variant='outline' className='shrink-0 p-2'>
            <div
              className='h-full w-full rounded-sm'
              style={{ backgroundColor: value }}
            ></div>
          </Button>
        </PopoverTrigger>
        <PopoverContent></PopoverContent>
      </Popover>
      <Input type='text' value={value} />
    </div>
  )
}
