'use client'

import { useState, type SubmitEvent, useEffect } from 'react'
import { ErrorMessage } from './error-message'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { getErrorMessage, getTeams } from '@/lib/api'
import { PersonInput, Position, Team } from '@/lib/types'
import { Input } from './ui/input'
import { NativeSelect } from './native-select'
import { positionLabels } from '@/lib/labels'

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
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getTeams()
      .then((loaded) => setTeams(loaded))
      .catch((error) => setError(getErrorMessage(error)))
  }, [])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await onSubmit({ name, surname, email, position, teamId: Number(teamId) })
    } catch (error) {
      setError(getErrorMessage(error))
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
      </div>

      {error && <ErrorMessage message={error} />}

      <Button type="submit" disabled={saving}>
        {saving ? 'Ukládám…' : submitLabel}
      </Button>
    </form>
  )
}
