import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'

import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans", });

export const metadata: Metadata = {
  title: "Craft Motion",
  description: "Craft your animations with care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          "min-h-screen bg-background font-fontSans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
