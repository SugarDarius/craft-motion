'use client'

import React from 'react'

import { type ThemeProviderProps } from 'next-themes/dist/types'
import { ThemeProvider as NxThemeProvider } from 'next-themes'

export function ThemeProvider({ children, ...rest }: ThemeProviderProps) {
  return <NxThemeProvider {...rest}>{children}</NxThemeProvider>
}
