import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-5">
        <h1 className="border-r pr-5 text-2xl font-medium">404</h1>
        <p className="text-sm">Stránka nebyla nalezena</p>
      </div>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm underline"
      >
        Zpět na domovskou stránku
      </Link>
    </div>
  )
}
