'use client'
import { CaretDownIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function FileMenu({
  canUndo,
  onUndo,
}: {
  canUndo: boolean
  onUndo: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Craft Motion
          <CaretDownIcon className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start' side='right'>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onUndo} disabled={!canUndo}>
            Undo
            <DropdownMenuShortcut>⌘+Z</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Redo
            <DropdownMenuShortcut>⇧+⌘+Z</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            Fullscreen
            <DropdownMenuShortcut>⇧+⌘+F</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
