'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { buttonVariants, Button } from '@/components/ui/button'
import { getErrorMessage, getProject, deleteProject } from '@/lib/api'
import type { ProjectDetail } from '@/lib/types'
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
import { positionLabels, projectStateLabels } from '@/lib/labels'
import { formatDate } from '@/lib/format'

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [project, setProject] = useState<ProjectDetail | null>(null)
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
      await deleteProject(id)
      toast.success('Projekt byl smazán')
      router.push('/projects')
    } catch (error) {
      setDeleteError(getErrorMessage(error))
      setDeleting(false)
    }
  }

  useEffect(() => {
    getProject(id)
      .then((loaded) => setProject(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!project) return null

  return (
    <div className="space-y-6">
      <BackLink href="/projects" label="Seznam projektů" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}/edit`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Upravit
          </Link>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Smazat
          </Button>
        </div>
      </div>

      {project.description && <p>{project.description}</p>}

      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
        <dt className="text-muted-foreground">Stav</dt>
        <dd>{projectStateLabels[project.state]}</dd>
        <dt className="text-muted-foreground">Datum zahájení</dt>
        <dd>{formatDate(project.startDate)}</dd>
        <dt className="text-muted-foreground">Datum ukončení</dt>
        <dd>{project.endDate ? formatDate(project.endDate) : 'Neurčeno'}</dd>
      </dl>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Týmy</h2>
        {project.teams.length === 0 ? (
          <p className="text-muted-foreground">
            K projektu není přiřazen žádný tým.
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {project.teams.map((team) => (
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
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Účastníci</h2>
        {project.participants.length === 0 ? (
          <p className="text-muted-foreground">Projekt nemá žádné účastníky.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {project.participants.map((participant) => (
              <li key={participant.id}>
                <Link
                  href={`/persons/${participant.id}`}
                  className="hover:bg-muted flex flex-wrap items-center justify-between gap-x-4 px-4 py-3"
                >
                  <span>
                    {participant.name} {participant.surname}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {positionLabels[participant.position]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat projekt?</AlertDialogTitle>
            <AlertDialogDescription>
              Projekt {project.name} bude trvale smazán.
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
