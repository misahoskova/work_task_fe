import Link from 'next/link'

const links = [
  { href: '/projects', label: 'Projekty' },
  { href: '/persons', label: 'Osoby' },
  { href: '/teams', label: 'Týmy' },
]

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          Evidence projektů
        </Link>
        <nav className="flex gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
