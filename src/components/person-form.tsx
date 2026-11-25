'use client'

import { useState, type SubmitEvent, useEffect } from 'react'
import { ErrorMessage } from './error-message'
import { Button } from './ui/button'
import { Label } from './ui/label'
import {
  ErrorDetail,
  getErrorDetails,
  getErrorMessage,
  getTeams,
} from '@/lib/api'
import { PersonInput, Position, Team } from '@/lib/types'
import { Input } from './ui/input'
import { NativeSelect } from './native-select'
import { positionLabels } from '@/lib/labels'
import Link from 'next/link'
import { FieldErrors } from './field-errors'

type PersonFormProps = {
  initial?: PersonInput
  submitLabel: string
  onSubmit: (data: PersonInput) => Promise<void>
}

export function PersonForm({
  initial,
  submitLabel,
  onSubmit,
}: PersonFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [surname, setSurname] = useState(initial?.surname ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [position, setPosition] = useState<Position>(
    initial?.position ?? 'developer',
  )
  const [teamId, setTeamId] = useState(initial ? String(initial.teamId) : '')
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoaded, setTeamsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [details, setDetails] = useState<ErrorDetail[]>([])

  useEffect(() => {
    getTeams()
      .then((loaded) => {
        setTeams(loaded)
        setTeamsLoaded(true)
      })
      .catch((error) => setError(getErrorMessage(error)))
  }, [])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setDetails([])

    try {
      await onSubmit({ name, surname, email, position, teamId: Number(teamId) })
    } catch (error) {
      setError(getErrorMessage(error))
      setDetails(getErrorDetails(error))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Jméno</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={200}
          pattern=".*\S.*"
          title="Pole nesmí obsahovat jen mezery"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="surname">Příjmení</Label>
        <Input
          id="surname"
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
          required
          maxLength={200}
          pattern=".*\S.*"
          title="Pole nesmí obsahovat jen mezery"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={200}
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          title="E-mail musí mít doménu s koncovkou, například jana.novakova@example.cz"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Pozice</Label>
        <NativeSelect
          id="position"
          value={position}
          onChange={(event) => setPosition(event.target.value as Position)}
        >
          {Object.entries(positionLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamId">Tým</Label>
        <NativeSelect
          id="teamId"
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
          required
        >
          <option value="" disabled>
            Vyberte tým
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </NativeSelect>
        {teamsLoaded && teams.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Zatím neexistuje žádný tým.{' '}
            <Link href="/teams/new" className="underline">
              Založit tým
            </Link>
          </p>
        )}
      </div>

      {error && <ErrorMessage message={error} />}
      <FieldErrors
        details={details}
        labels={{
          name: 'Jméno',
          surname: 'Příjmení',
          email: 'Email',
          position: 'Pozice',
          teamId: 'Tým',
        }}
      />

      <Button type="submit" disabled={saving}>
        {saving ? 'Ukládám…' : submitLabel}
      </Button>
    </form>
  )
}
