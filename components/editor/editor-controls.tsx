'use client'

import {
  CursorArrowIcon,
  SquareIcon,
  CircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleBackslashIcon,
  Crosshair1Icon,
} from '@radix-ui/react-icons'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { ControlTooltip } from './control-tooltip'

export function EditorControls({
  canControl,
  activeControl,
  onChangeActiveControl,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  canDelete,
  onDeleteObject,
  canDeleteAll,
  onDeleteAllObjects,
  onReCenter,
}: {
  canControl: boolean
  activeControl: string | null
  onChangeActiveControl: (value: string) => void
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
  canDelete: boolean
  onDeleteObject: () => void
  canDeleteAll: boolean
  onDeleteAllObjects: () => void
  onReCenter: () => void
}) {
  return (
    <div className='flex flex-row gap-1 rounded-2xl border-2 bg-background p-2'>
      <ToggleGroup
        type='single'
        value={activeControl ?? undefined}
        onValueChange={onChangeActiveControl}
      >
        <ControlTooltip text='Select shape' sideOffset={16} shortcut='⌘+1'>
          <div className='h-fit w-fit'>
            <ToggleGroupItem value='select' disabled={!canControl}>
              <CursorArrowIcon className='h-4 w-4' />
            </ToggleGroupItem>
          </div>
        </ControlTooltip>
        <ControlTooltip
          text='Create rectangle shape'
          shortcut='⌘+2'
          sideOffset={16}
        >
          <div className='h-fit w-fit'>
            <ToggleGroupItem value='rectangle' disabled={!canControl}>
              <SquareIcon className='h-4 w-4' />
            </ToggleGroupItem>
          </div>
        </ControlTooltip>
        <ControlTooltip text='Create circle shape' shortcut='⌘+3'>
          <div className='h-fit w-fit'>
            <ToggleGroupItem value='circle' disabled={!canControl}>
              <CircleIcon className='h-4 w-4' />
            </ToggleGroupItem>
          </div>
        </ControlTooltip>
      </ToggleGroup>
      <ControlTooltip text='Delete shape' shortcut='⌫'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDeleteObject}
          disabled={!canDelete}
        >
          <TrashIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Clear canvas'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDeleteAllObjects}
          disabled={!canDeleteAll}
        >
          <CircleBackslashIcon className='h-4 w-4' />
        </Button>
      </ControlTooltip>
      <ControlTooltip text='Re-center canvas'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onReCenter}
          disabled={!canControl}
        >
          <Crosshair1Icon className='h-4 w-4' />
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
