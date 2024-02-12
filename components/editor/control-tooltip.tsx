'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ControlTooltip({
  text,
  shortcut,
  sideOffset,
  children,
}: {
  text: string
  shortcut?: string
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
        {shortcut ? (
          <span className='flex items-center rounded border bg-muted px-1.5 text-[10px] text-xs font-medium tracking-widest text-slate-100 opacity-80'>
            {shortcut}
          </span>
        ) : null}
      </TooltipContent>
    </Tooltip>
  )
}
