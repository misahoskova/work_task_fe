'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { getErrorMessage, getPerson, updatePerson } from '@/lib/api'
import type { PersonDetail, PersonInput } from '@/lib/types'
import { PersonForm } from '@/components/person-form'

export default function EditPersonPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const router = useRouter()

  const [person, setPerson] = useState<PersonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPerson(id)
      .then((loaded) => setPerson(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id])

  async function handleUpdate(data: PersonInput) {
    await updatePerson(id, data)
    toast.success('Osoba byla aktualizována')
    router.push(`/persons/${id}`)
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!person) return null

  return (
    <div className="space-y-4">
      <BackLink href={`/persons/${id}`} label="Detail osoby" />
      <h1 className="text-2xl font-semibold">Úprava osoby</h1>
      <PersonForm
        initial={person}
        submitLabel="Uložit"
        onSubmit={handleUpdate}
      />
    </div>
  )
}
