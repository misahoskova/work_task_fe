'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { getErrorMessage, getProjects } from '@/lib/api'
import type { Project } from '@/lib/types'
import { buttonVariants } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { projectStateLabels } from '@/lib/labels'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProjects()
      .then((loaded) => setProjects(loaded))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Projekty</h1>
        <Link href="/projects/new" className={buttonVariants()}>
          Založit nový projekt
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && projects.length === 0 && (
        <p className="text-muted-foreground">
          Zatím nebyl vytvořen žádný projekt.
        </p>
      )}

      {projects.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="hover:bg-muted flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3"
              >
                <span>{project.name}</span>
                <span className="text-muted-foreground text-sm">
                  {projectStateLabels[project.state]} &middot;{' '}
                  {formatDate(project.startDate)}
                  {project.endDate && `- ${formatDate(project.endDate)}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
