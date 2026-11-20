'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { getErrorMessage, getTeam, updateTeam } from '@/lib/api'
import type { TeamDetail, TeamInput } from '@/lib/types'
import { TeamForm } from '@/components/team-form'

export default function EditTeamPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const router = useRouter()

  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTeam(id)
      .then((loaded) => setTeam(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id])

  async function handleUpdate(data: TeamInput) {
    await updateTeam(id, data)
    toast.success('Tým byl aktualizován')
    router.push(`/teams/${id}`)
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!team) return null

  return (
    <div className="space-y-4">
      <BackLink href={`/teams/${id}`} label="Detail týmu" />
      <h1 className="text-2xl font-semibold">Úprava týmu</h1>
      <TeamForm
        initial={{ name: team.name }}
        submitLabel="Uložit"
        onSubmit={handleUpdate}
      />
    </div>
  )
}
