import type { Position, ProjectState } from './types'

/** České názvy pozic a stavů projektu pro zobrazení na stránkách */

export const positionLabels: Record<Position, string> = {
  developer: 'Vývojář',
  analyst: 'Analytik',
  project_manager: 'Vedoucí projektu',
  tester: 'Tester',
}

export const projectStateLabels: Record<ProjectState, string> = {
  Planned: 'Naplánováno',
  In_progress: 'Probíhá',
  Done: 'Dokončeno',
}
