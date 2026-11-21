'use client'

import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/project-form'
import { createProject } from '@/lib/api'
import type { ProjectInput } from '@/lib/types'
import { toast } from 'sonner'
import { BackLink } from '@/components/back-link'

export default function NewProjectPage() {
  const router = useRouter()

  async function handleCreate(data: ProjectInput) {
    await createProject(data)
    toast.success('Projekt byl úspěšně vytvořen')
    router.push('/projects')
  }

  return (
    <div className="space-y-4">
      <BackLink href="/projects" label="Seznam projektů" />
      <h1 className="text-2xl font-semibold">Nový projekt</h1>
      <ProjectForm submitLabel="Vytvořit" onSubmit={handleCreate} />
    </div>
  )
}
