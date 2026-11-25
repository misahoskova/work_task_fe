// Typy odpovídají backendu.
// Při změně API opravit ručně.

export type Position = 'developer' | 'analyst' | 'project_manager' | 'tester'
export type ProjectState = 'Planned' | 'In_progress' | 'Done'

export type Team = {
  id: number
  name: string
}

export type Person = {
  id: number
  name: string
  surname: string
  email: string
  position: Position
  teamId: number
}

export type Project = {
  id: number
  name: string
  description: string | null
  state: ProjectState

  /**
   * Datum ve formátu RRRR-MM-DD
   */

  startDate: string
  endDate: string | null
}

/** Účastník projektu je k projektu přiřazen přímo (true) nebo přes tým (false). */

export type Participant = Person & {
  direct: boolean
}

export type TeamDetail = Team & {
  members: Person[]
}

export type PersonDetail = Person & {
  team: Team
  projects: Project[]
}

export type ProjectDetail = Project & {
  teams: Team[]
  participants: Participant[]
}

/**
 * Data posílaná při vytvoření nebo úpravě týmu/osoby/projektu
 */

export type TeamInput = {
  name: string
}

export type PersonInput = {
  name: string
  surname: string
  email: string
  position: Position
  teamId: number
}

export type ProjectInput = {
  name: string
  description?: string | null
  state: ProjectState
  startDate: string
  endDate?: string | null
}
