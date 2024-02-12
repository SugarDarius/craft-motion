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

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { ControlTooltip } from './control-tooltip'

export function EditorControls({
  activeControl,
  onChangeActiveControl,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  canDelete,
  onDeleteObject,
}: {
  activeControl: string | null
  onChangeActiveControl: (value: string) => void
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
  canDelete: boolean
  onDeleteObject: () => void
}) {
  return (
    <div className='flex flex-row gap-1 rounded-2xl border-2 bg-background p-2'>
      <ToggleGroup
        type='single'
        value={activeControl ?? undefined}
        onValueChange={onChangeActiveControl}
      >
        <ControlTooltip text='Select shape' sideOffset={16} shortcut='⌘+1'>
          <ToggleGroupItem value='select'>
            <CursorArrowIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ControlTooltip>
        <ControlTooltip
          text='Create rectangle shape'
          shortcut='⌘+2'
          sideOffset={16}
        >
          <ToggleGroupItem value='rectangle'>
            <SquareIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ControlTooltip>
        <ControlTooltip text='Create circle shape' shortcut='⌘+3'>
          <ToggleGroupItem value='circle'>
            <CircleIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ControlTooltip>
      </ToggleGroup>
      <ControlTooltip text='Delete shape'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDeleteObject}
          disabled={!canDelete}
        >
          <TrashIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Clean canvas'>
        <Button variant='ghost' size='icon' disabled>
          <CircleBackslashIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Undo' shortcut='⌘+Z'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onUndo}
          disabled={!canUndo}
        >
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Redo' shortcut='⇧+⌘+Z'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onRedo}
          disabled={!canRedo}
        >
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
    </div>
  )
}
