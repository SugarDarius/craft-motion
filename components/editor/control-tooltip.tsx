'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ControlTooltip({
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
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side='bottom' sideOffset={sideOffset}>
        <span>{text}</span>
      </TooltipContent>
    </Tooltip>
  )
}
