import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function NativeSelect({
  className,
  ...props
}: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-3 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
