'use client'

import { useRouter } from 'next/navigation'
import { PersonForm } from '@/components/person-form'
import { createPerson } from '@/lib/api'
import type { PersonInput } from '@/lib/types'
import { toast } from 'sonner'
import { BackLink } from '@/components/back-link'

export default function NewPersonPage() {
  const router = useRouter()

  async function handleCreate(data: PersonInput) {
    await createPerson(data)
    toast.success('Osoba byla úspěšně vytvořena')
    router.push('/persons')
  }

  return (
    <div className="space-y-4">
      <BackLink href="/persons" label="Seznam osob" />
      <h1 className="text-2xl font-semibold">Nová osoba</h1>
      <PersonForm submitLabel="Vytvořit" onSubmit={handleCreate} />
    </div>
  )
}
