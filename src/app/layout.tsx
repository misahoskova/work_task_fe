import type { Metadata } from 'next'
import { Geist, Geist_Mono, Figtree } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { Toaster } from '@/components/ui/sonner'
import { SiteFooter } from '@/components/site-footer'

const figtree = Figtree({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  title: 'Evidence projektů',
  description: 'Evidence projektů, osob a týmů',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="cs"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        figtree.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          {children}
          <Toaster richColors />
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
