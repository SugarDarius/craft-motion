'use client'

import Link from 'next/link'

import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'

import { XIcon } from '@/components/ui/x-icon'
import { buttonVariants } from '@/components/ui/button'

export function SocialLinks() {
  return (
    <div className='absolute bottom-6 right-6 flex flex-row items-center gap-2'>
      <Link
        href={siteConfig.socialLinks.twitter}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-6 w-6 p-0 text-white'
          )}
        >
          <XIcon className='h-2 w-2' />
        </div>
      </Link>
      <Link
        href={siteConfig.socialLinks.github}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-6 w-6 p-0 text-white'
          )}
        >
          <GitHubLogoIcon className='h-3 w-3' />
        </div>
      </Link>
    </div>
  )
}
