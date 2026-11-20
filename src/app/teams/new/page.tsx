'use client'

import { useRouter } from 'next/navigation'
import { TeamForm } from '@/components/team-form'
import { createTeam } from '@/lib/api'
import type { TeamInput } from '@/lib/types'
import { toast } from 'sonner'
import { BackLink } from '@/components/back-link'

export default function NewTeamPage() {
  const router = useRouter()

  async function handleCreate(data: TeamInput) {
    await createTeam(data)
    toast.success('Tým byl úspěšně vytvořen')
    router.push('/teams')
  }

  return (
    <div className="space-y-4">
      <BackLink href="/teams" label="Seznam týmů" />
      <h1 className="text-2xl font-semibold">Nový tým</h1>
      <TeamForm submitLabel="Vytvořit" onSubmit={handleCreate} />
    </div>
  )
}
