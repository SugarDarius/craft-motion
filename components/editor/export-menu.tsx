'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ExportMenu({
  canExport,
  onExportJSON,
}: {
  canExport: boolean
  onExportJSON: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' side='bottom'>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onExportJSON} disabled={!canExport}>
            Download JSON
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Export to .GIF</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
