'use client'

import { useMemo } from 'react'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

export function LiveUserAvatar({
  name,
  twClassNames,
}: {
  name: string
  twClassNames?: string
}) {
  const src = useMemo(
    () =>
      `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`,
    []
  )
  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar className={cn(twClassNames)}>
          <AvatarImage src={src} />
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        <span>{name}</span>
      </TooltipContent>
    </Tooltip>
  )
}
