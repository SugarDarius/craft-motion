'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ControlTooltip({
  text,
  shortcutNumber,
  sideOffset,
  children,
}: {
  text: string
  shortcutNumber?: number
  sideOffset?: number
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent
        side='bottom'
        sideOffset={sideOffset}
        className='flex flex-row items-center gap-2'
      >
        <span>{text}</span>
        {shortcutNumber ? (
          <kbd className='flex items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium leading-normal text-slate-100'>
            <span className='text-sm'>⌘</span>
            <span>+</span>
            <span>{shortcutNumber}</span>
          </kbd>
        ) : null}
      </TooltipContent>
    </Tooltip>
  )
}
