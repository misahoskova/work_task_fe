'use client'

import { useState, type SubmitEvent } from 'react'
import { ErrorMessage } from './error-message'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { ErrorDetail, getErrorDetails, getErrorMessage } from '@/lib/api'
import { ProjectInput } from '@/lib/types'
import { Input } from './ui/input'
import { projectStateLabels } from '@/lib/labels'
import { ProjectState } from '@/lib/types'
import { NativeSelect } from './native-select'
import { Textarea } from './ui/textarea'
import { FieldErrors } from './field-errors'

type ProjectFormProps = {
  initial?: ProjectInput
  submitLabel: string
  onSubmit: (data: ProjectInput) => Promise<void>
}

export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
}: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [state, setState] = useState<ProjectState>(initial?.state ?? 'Planned')
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [details, setDetails] = useState<ErrorDetail[]>([])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setDetails([])

    try {
      await onSubmit({
        name,
        description: description.trim() === '' ? null : description,
        state,
        startDate,
        endDate: endDate === '' ? null : endDate,
      })
    } catch (error) {
      setError(getErrorMessage(error))
      setDetails(getErrorDetails(error))
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
          pattern=".*\S.*"
          title="Pole nesmí obsahovat jen mezery"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Popis</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={2000}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">Stav</Label>
        <NativeSelect
          id="state"
          value={state}
          onChange={(event) => setState(event.target.value as ProjectState)}
        >
          {Object.entries(projectStateLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Počáteční datum</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">Konečné datum</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
      </div>

      {error && <ErrorMessage message={error} />}
      <FieldErrors
        details={details}
        labels={{
          name: 'Název',
          description: 'Popis',
          state: 'Stav',
          startDate: 'Počáteční datum',
          endDate: 'Konečné datum',
        }}
      />

      <Button type="submit" disabled={saving}>
        {saving ? 'Ukládám...' : submitLabel}
      </Button>
    </form>
  )
}
