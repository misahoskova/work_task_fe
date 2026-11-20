'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { getErrorMessage, getTeams } from '@/lib/api'
import type { Team } from '@/lib/types'
import { buttonVariants } from '@/components/ui/button'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTeams()
      .then((loaded) => setTeams(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Týmy</h1>
        <Link href="/teams/new" className={buttonVariants()}>
          Založit nový tým
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && teams.length === 0 && (
        <p className="text-muted-foreground">Zatím nebyl vytvořen žádný tým.</p>
      )}

      {teams.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {teams.map((team) => (
            <li key={team.id}>
              <Link
                href={`/teams/${team.id}`}
                className="hover:bg-muted block px-4 py-3"
              >
                {team.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
