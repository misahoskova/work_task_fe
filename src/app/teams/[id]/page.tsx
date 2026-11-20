'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { buttonVariants, Button } from '@/components/ui/button'
import { getErrorMessage, getTeam, deleteTeam } from '@/lib/api'
import type { TeamDetail } from '@/lib/types'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)

    try {
      await deleteTeam(id)
      toast.success('Tým byl smazán')
      router.push('/teams')
    } catch (error) {
      setDeleteError(getErrorMessage(error))
      setDeleting(false)
    }
  }

  useEffect(() => {
    getTeam(id)
      .then((loaded) => setTeam(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!team) return null

  return (
    <div className="space-y-6">
      <BackLink href="/teams" label="Seznam týmů" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{team.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/teams/${team.id}/edit`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Upravit
          </Link>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Smazat
          </Button>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Členové</h2>
        {team.members.length === 0 ? (
          <p className="text-muted-foreground">Tým nemá žádné členy.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {team.members.map((member) => (
              <li key={member.id}>
                <Link
                  href={`/persons/${member.id}`}
                  className="hover:bg-muted block px-4 py-3"
                >
                  {member.name} {member.surname}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Smazat tým?</AlertDialogTitle>
      <AlertDialogDescription>
        Tým {team.name} bude trvale smazán.
      </AlertDialogDescription>
    </AlertDialogHeader>

    {deleteError && <ErrorMessage message={deleteError} />}

    <AlertDialogFooter>
      <AlertDialogCancel disabled={deleting}>Zrušit</AlertDialogCancel>
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? 'Mažu…' : 'Smazat'}
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}
