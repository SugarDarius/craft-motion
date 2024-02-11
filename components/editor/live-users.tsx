'use client'

import { getRandomUsername } from '@/lib/random-names'
import { useOthers, useSelf } from '@/liveblocks.config'

import { LiveUserAvatar } from './live-user-avatar'

export function LiveUsers() {
  const others = useOthers()
  const currentUser = useSelf()

  const hasMoreThanTwoUsers = others.length > 2
  const firstTwoUsers = others.slice(0, 2)

  return (
    <div className='flex flex-row items-center gap-2'>
      {currentUser ? (
        <LiveUserAvatar
          name='me'
          twClassNames='border-green-600 border-[2px]'
        />
      ) : null}
      {firstTwoUsers.map((user) => {
        return (
          <LiveUserAvatar
            key={user.connectionId}
            name={getRandomUsername()}
            twClassNames='-ml-2'
          />
        )
      })}
      {hasMoreThanTwoUsers ? (
        <span className='relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] border-blue-600 bg-gray-700'>
          +{others.length - 2}
        </span>
      ) : null}
    </div>
  )
}
