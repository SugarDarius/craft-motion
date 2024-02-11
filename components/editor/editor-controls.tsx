'use client'

import {
  CursorArrowIcon,
  SquareIcon,
  CircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleBackslashIcon,
} from '@radix-ui/react-icons'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'

function ControlTooltip({
  text,
  children,
}: {
  text: string
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side='bottom'>
          <span>{text}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function EditorControls() {
  return (
    <div className='flex flex-row gap-1 rounded-2xl border-2 bg-background p-2'>
      <ToggleGroup type='single'>
        <ControlTooltip text='Select shape'>
          <ToggleGroupItem value='select'>
            <CursorArrowIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ControlTooltip>
        <ControlTooltip text='Create rectangle shape'>
          <ToggleGroupItem value='rectangle'>
            <SquareIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ControlTooltip>
        <ControlTooltip text='Create circle shape'>
          <ToggleGroupItem value='circle' disabled>
            <CircleIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ControlTooltip>
      </ToggleGroup>
      <ControlTooltip text='Delete shape'>
        <Button variant='ghost' size='icon' disabled>
          <TrashIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Clean canvas'>
        <Button variant='ghost' size='icon' disabled>
          <CircleBackslashIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Undo'>
        <Button variant='ghost' size='icon'>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Redo'>
        <Button variant='ghost' size='icon'>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
    </div>
  )
}
