'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { buttonVariants, Button } from '@/components/ui/button'
import { getErrorMessage, getPerson, deletePerson } from '@/lib/api'
import type { PersonDetail } from '@/lib/types'
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

export default function PersonDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [person, setPerson] = useState<PersonDetail | null>(null)
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
      await deletePerson(id)
      toast.success('Osoba byla smazána')
      router.push('/persons')
    } catch (error) {
      setDeleteError(getErrorMessage(error))
      setDeleting(false)
    }
  }

  useEffect(() => {
    getPerson(id)
      .then((loaded) => setPerson(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!person) return null

  return (
    <div className="space-y-6">
      <BackLink href="/persons" label="Seznam osob" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">
          {person.name} {person.surname}
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/persons/${person.id}/edit`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Upravit
          </Link>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Smazat
          </Button>
        </div>
      </div>

      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
        <dt className="text-muted-foreground">E-mail</dt>
        <dd>{person.email}</dd>
        <dt className="text-muted-foreground">Pozice</dt>
        <dd>{positionLabels[person.position]}</dd>
        <dt className="text-muted-foreground">Tým</dt>
        <dd>
          <Link href={`/teams/${person.team.id}`} className="underline">
            {person.team.name}
          </Link>
        </dd>
      </dl>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Projekty</h2>
        {person.projects.length === 0 ? (
          <p className="text-muted-foreground">
            Osoba není přiřazena k žádnému projektu.
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {person.projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:bg-muted flex flex-wrap items-center justify-between gap-x-4 px-4 py-3"
                >
                  <span>{project.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {projectStateLabels[project.state]}
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
            <AlertDialogTitle>Smazat osobu?</AlertDialogTitle>
            <AlertDialogDescription>
              Osoba {person.name} {person.surname} bude trvale smazána.
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
