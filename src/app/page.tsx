import Link from 'next/link'

const section = [
  {
    href: '/projects',
    title: 'Projekty',
    text: 'Přehled projektů, jejich stavu a účastníků.',
  },
  {
    href: '/persons',
    title: 'Osoby',
    text: 'Přehled osob, jejich pozic a týmů.',
  },
  {
    href: '/teams',
    title: 'Týmy',
    text: 'Přehled týmů a jejich členů.',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Evidence projektů</h1>
        <p className="text-muted-foreground">Správa projektů, osob a týmů.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {section.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="hover:bg-muted rounded-lg border p-4"
          >
            <h2 className="font-medium">{section.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{section.text}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
