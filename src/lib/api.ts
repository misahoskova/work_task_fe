import type {
  Team,
  TeamDetail,
  TeamInput,
  Person,
  PersonDetail,
  PersonInput,
  Project,
  ProjectDetail,
  ProjectInput,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type ErrorDetail = {
  path: string
  message: string
}

export class ApiError extends Error {
  status: number
  code: string
  details?: {
    path: string
    message: string
  }[]

  constructor(
    status: number,
    code: string,
    message: string,
    details?: {
      path: string
      message: string
    }[],
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Nepodařilo se spojit se serverem'
}

export function getErrorDetails(error: unknown): ErrorDetail[] {
  if (error instanceof ApiError && error.details != null) {
    return error.details
  }

  return []
}

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, body.code, body.message, body.details)
  }

  return body as T
}

// Tým

export const getTeams = () => request<Team[]>('/teams')
export const getTeam = (id: number) => request<TeamDetail>(`/teams/${id}`)

export const createTeam = (data: TeamInput) =>
  request<Team>('/teams', { method: 'POST', body: JSON.stringify(data) })

export const updateTeam = (id: number, data: TeamInput) =>
  request<Team>(`/teams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteTeam = (id: number) =>
  request<void>(`/teams/${id}`, { method: 'DELETE' })

// Osoba

export const getPersons = () => request<Person[]>('/persons')
export const getPerson = (id: number) => request<PersonDetail>(`/persons/${id}`)

export const createPerson = (data: PersonInput) =>
  request<Person>('/persons', { method: 'POST', body: JSON.stringify(data) })

export const updatePerson = (id: number, data: Partial<PersonInput>) =>
  request<Person>(`/persons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deletePerson = (id: number) =>
  request<void>(`/persons/${id}`, { method: 'DELETE' })

// Projekt

export const getProjects = () => request<Project[]>('/projects')
export const getProject = (id: number) =>
  request<ProjectDetail>(`/projects/${id}`)

export const createProject = (data: ProjectInput) =>
  request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) })

export const updateProject = (id: number, data: Partial<ProjectInput>) =>
  request<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteProject = (id: number) =>
  request<void>(`/projects/${id}`, { method: 'DELETE' })

// Přiřazení

export const addPersonToProject = (projectId: number, personId: number) =>
  request<void>(`/projects/${projectId}/persons/${personId}`, { method: 'PUT' })

export const removePersonFromProject = (projectId: number, personId: number) =>
  request<void>(`/projects/${projectId}/persons/${personId}`, {
    method: 'DELETE',
  })

export const addTeamToProject = (projectId: number, teamsId: number) =>
  request<void>(`/projects/${projectId}/teams/${teamsId}`, { method: 'PUT' })

export const removeTeamFromProject = (projectId: number, teamId: number) =>
  request<void>(`/projects/${projectId}/teams/${teamId}`, { method: 'DELETE' })
