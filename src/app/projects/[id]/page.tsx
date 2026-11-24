'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { buttonVariants, Button } from '@/components/ui/button'
import {
  getErrorMessage,
  getProject,
  deleteProject,
  removeTeamFromProject,
  getTeams,
  addTeamToProject,
  removePersonFromProject,
  getPersons,
  addPersonToProject,
} from '@/lib/api'
import type { Person, ProjectDetail, Team } from '@/lib/types'
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
import { NativeSelect } from '@/components/native-select'

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

  const [version, setVersion] = useState(0)

  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [teamsLoaded, setTeamsLoaded] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState('')

  const [allPersons, setAllPersons] = useState<Person[]>([])
  const [personsLoaded, setPersonsLoaded] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState('')

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

  function reload() {
    setVersion((currenct) => currenct + 1)
  }

  async function handleRemoveTeam(teamId: number) {
    try {
      await removeTeamFromProject(id, teamId)
      toast.success('Tým byl odebrán')
      reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleAddTeam() {
    if (selectedTeamId === '') return

    try {
      await addTeamToProject(id, Number(selectedTeamId))
      toast.success('Tým byl přidán')
      setSelectedTeamId('')
      reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const availableTeams = allTeams.filter(
    (team) => !project?.teams.some((assigned) => assigned.id === team.id),
  )

  async function handleRemovePerson(personId: number) {
    try {
      await removePersonFromProject(id, personId)
      toast.success('Osoba byla odebrána')
      reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleAddPerson() {
    if (selectedPersonId === '') return

    try {
      await addPersonToProject(id, Number(selectedPersonId))
      toast.success('Osoba byla přidána')
      setSelectedPersonId('')
      reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const availablePersons = allPersons.filter(
    (person) =>
      !project?.participants.some((assigned) => assigned.id === person.id),
  )

  useEffect(() => {
    getPersons()
      .then((loaded) => {
        setAllPersons(loaded)
        setPersonsLoaded(true)
      })
      .catch((error) => toast.error(getErrorMessage(error)))
  }, [])

  useEffect(() => {
    getTeams()
      .then((loaded) => {
        setAllTeams(loaded)
        setTeamsLoaded(true)
      })
      .catch((error) => toast.error(getErrorMessage(error)))
  }, [])

  useEffect(() => {
    getProject(id)
      .then((loaded) => setProject(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id, version])

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
              <li
                key={team.id}
                className="flex items-center justify-between gap-2 px-4 py-2"
              >
                <Link href={`/teams/${team.id}`} className="hover:underline">
                  {team.name}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTeam(team.id)}
                >
                  Odebrat
                </Button>
              </li>
            ))}
          </ul>
        )}
        {availableTeams.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <NativeSelect
              aria-label="Tým k přiřazení"
              value={selectedTeamId}
              onChange={(event) => setSelectedTeamId(event.target.value)}
              className="w-auto flex-1 sm:max-w-xs"
            >
              <option value="">Vyberte tým</option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </NativeSelect>
            <Button onClick={handleAddTeam} disabled={selectedTeamId === ''}>
              Přidat tým
            </Button>
          </div>
        ) : teamsLoaded && allTeams.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Zatím neexistuje žádný tým.{' '}
            <Link href="/teams/new" className="underline">
              Založit tým
            </Link>
          </p>
        ) : teamsLoaded ? (
          <p className="text-muted-foreground text-sm">
            Všechny týmy už jsou k projektu přiřazeny.
          </p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Účastníci</h2>
        {project.participants.length === 0 ? (
          <p className="text-muted-foreground">Projekt nemá žádné účastníky.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {project.participants.map((participant) => (
              <li
                key={participant.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2"
              >
                <div>
                  <Link
                    href={`/persons/${participant.id}`}
                    className="hover:underline"
                  >
                    {participant.name} {participant.surname}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {positionLabels[participant.position]}
                  </p>
                </div>
                {participant.direct ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePerson(participant.id)}
                  >
                    Odebrat
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    přes tým{' '}
                    {
                      project.teams.find(
                        (team) => team.id === participant.teamId,
                      )?.name
                    }
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {availablePersons.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <NativeSelect
              aria-label="Osoba k přiřazení"
              value={selectedPersonId}
              onChange={(event) => setSelectedPersonId(event.target.value)}
              className="w-auto flex-1 sm:max-w-xs"
            >
              <option value="">Vyberte osobu</option>
              {availablePersons.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} {person.surname}
                </option>
              ))}
            </NativeSelect>
            <Button
              onClick={handleAddPerson}
              disabled={selectedPersonId === ''}
            >
              Přidat osobu
            </Button>
          </div>
        ) : personsLoaded && allPersons.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Zatím neexistuje žádná osoba.{' '}
            <Link href="/persons/new" className="underline">
              Přidat osobu
            </Link>
          </p>
        ) : personsLoaded ? (
          <p className="text-muted-foreground text-sm">
            Všechny osoby už jsou účastníky projektu.
          </p>
        ) : null}
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
