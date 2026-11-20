'use client'

import { useState, type SubmitEvent } from 'react'
import { ErrorMessage } from './error-message'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { getErrorMessage } from '@/lib/api'
import { TeamInput } from '@/lib/types'
import { Input } from './ui/input'

type TeamFormProps = {
  initial?: TeamInput
  submitLabel: string
  onSubmit: (data: TeamInput) => Promise<void>
}

export function TeamForm({ initial, submitLabel, onSubmit }: TeamFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await onSubmit({ name })
    } catch (error) {
      setError(getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Název</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={200}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <Button type="submit" disabled={saving}>
        {saving ? 'Ukládám...' : submitLabel}
      </Button>
    </form>
  )
}
