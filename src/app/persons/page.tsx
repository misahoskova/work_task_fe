'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { getErrorMessage, getPersons } from '@/lib/api'
import type { Person } from '@/lib/types'
import { buttonVariants } from '@/components/ui/button'
import { positionLabels } from '@/lib/labels'

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPersons()
      .then((loaded) => setPersons(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Osoby</h1>
        <Link href="/persons/new" className={buttonVariants()}>
          Přidat novou osobu
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && persons.length === 0 && (
        <p className="text-muted-foreground">
          Zatím nebyla přidána žádná osoba.
        </p>
      )}

      {persons.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {persons.map((person) => (
            <li key={person.id}>
              <Link
                href={`/persons/${person.id}`}
                className="hover:bg-muted flex flex-wrap items-center justify-between gap-x-4 px-4 py-3"
              >
                <span>{`${person.name} ${person.surname}`}</span>
                <span className="text-muted-foreground text-sm">
                  {positionLabels[person.position]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
