'use client'

import Link from 'next/link'

import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'

import { XIcon } from '@/components/ui/x-icon'
import { buttonVariants } from '@/components/ui/button'

export function SocialLinks() {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Link
        href={siteConfig.socialLinks.twitter}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'text-white'
          )}
        >
          <XIcon className='white h-4 w-4' />
        </div>
      </Link>
    </div>
  )
}
