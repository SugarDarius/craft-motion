import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme-provider'

import { LiveblocksRoom } from './liveblocks-room'

import './globals.css'

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: ['Next.js', 'React', 'TailwindCSS', 'RadixUI', 'shadcn/ui'],
  authors: [
    {
      name: 'SugarDarius',
      url: 'https://aureliendupaysdexemple.com/',
    },
  ],
  creator: 'SugarDarius',
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImageUrl,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImageUrl],
    creator: '@azeldvin',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <LiveblocksRoom>{children}</LiveblocksRoom>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
