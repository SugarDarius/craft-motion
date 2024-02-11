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
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'

function ControlTooltip({
  text,
  sideOffset,
  children,
}: {
  text: string
  sideOffset?: number
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side='bottom' sideOffset={sideOffset}>
        <span>{text}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export function EditorControls() {
  return (
    <div className='flex flex-row gap-1 rounded-2xl border-2 bg-background p-2'>
      <ToggleGroup
        type='single'
        onValueChange={(value) => console.log('value', value)}
      >
        <ToggleGroupItem value='select'>
          <ControlTooltip text='Select shape' sideOffset={16}>
            <CursorArrowIcon className='h-4 w-4' />
          </ControlTooltip>
        </ToggleGroupItem>
        <ToggleGroupItem value='rectangle'>
          <ControlTooltip text='Create rectangle shape' sideOffset={16}>
            <SquareIcon className='h-4 w-4' />
          </ControlTooltip>
        </ToggleGroupItem>
        <ToggleGroupItem value='circle' disabled>
          <ControlTooltip text='Create circle shape'>
            <CircleIcon className='h-4 w-4' />
          </ControlTooltip>
        </ToggleGroupItem>
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
