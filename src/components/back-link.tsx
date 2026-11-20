import Link from 'next/link'

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
    >
      <span aria-hidden="true">&larr;</span>
      {label}
    </Link>
  )
}
