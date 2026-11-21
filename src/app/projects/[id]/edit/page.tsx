'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BackLink } from '@/components/back-link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { getErrorMessage, getProject, updateProject } from '@/lib/api'
import type { ProjectDetail, ProjectInput } from '@/lib/types'
import { ProjectForm } from '@/components/project-form'

export default function EditProjectPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const router = useRouter()

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProject(id)
      .then((loaded) => setProject(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [id])

  async function handleUpdate(data: ProjectInput) {
    await updateProject(id, data)
    toast.success('Projekt byl aktualizován')
    router.push(`/projects/${id}`)
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!project) return null

  return (
    <div className="space-y-4">
      <BackLink href={`/projects/${id}`} label="Detail projektu" />
      <h1 className="text-2xl font-semibold">Úprava projektu</h1>
      <ProjectForm
        initial={project}
        submitLabel="Uložit"
        onSubmit={handleUpdate}
      />
    </div>
  )
}
