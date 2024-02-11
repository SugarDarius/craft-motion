'use client'

import {
  CursorArrowIcon,
  SquareIcon,
  CircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'

export function EditorControls() {
  return (
    <div className='flex flex-row gap-1 rounded-2xl border-2 bg-background p-2'>
      <ToggleGroup type='single'>
        <ToggleGroupItem value='select'>
          <CursorArrowIcon className='h-4 w-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='rectangle'>
          <SquareIcon className='h-4 w-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='circle' disabled>
          <CircleIcon className='h-4 w-4' />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button variant='ghost' size='icon' disabled>
        <TrashIcon className='h-4 w-4' />
      </Button>
      <Button variant='ghost' size='icon'>
        <ChevronLeftIcon className='h-4 w-4' />
      </Button>
      <Button variant='ghost' size='icon'>
        <ChevronRightIcon className='h-4 w-4' />
      </Button>
    </div>
  )
}
