import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProjectForm } from './project-form'

describe('ProjectForm', () => {
  it('odešle všechna vyplněná pole', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProjectForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Název'), 'Web')
    await user.type(screen.getByLabelText('Popis'), 'Nový firemní web')
    await user.selectOptions(screen.getByLabelText('Stav'), 'In_progress')
    await user.type(screen.getByLabelText('Počáteční datum'), '2026-11-16')
    await user.type(screen.getByLabelText('Konečné datum'), '2026-12-31')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Web',
      description: 'Nový firemní web',
      state: 'In_progress',
      startDate: '2026-11-16',
      endDate: '2026-12-31',
    })
  })

  it('prázdný popis a prázdné konečné datum odešle jako null', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProjectForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Název'), 'Web')
    await user.type(screen.getByLabelText('Počáteční datum'), '2026-11-16')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Web',
      description: null,
      state: 'Planned',
      startDate: '2026-11-16',
      endDate: null,
    })
  })

  it('popis složený jen z mezer odešle jako null', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProjectForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Název'), 'Web')
    await user.type(screen.getByLabelText('Popis'), '   ')
    await user.type(screen.getByLabelText('Počáteční datum'), '2026-11-16')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    )
  })

  it('vymazané konečné datum odešle při úpravě jako null', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <ProjectForm
        initial={{
          name: 'Web',
          description: 'Nový firemní web',
          state: 'In_progress',
          startDate: '2026-11-16',
          endDate: '2026-12-31',
        }}
        submitLabel="Uložit"
        onSubmit={onSubmit}
      />,
    )

    expect(screen.getByLabelText('Konečné datum')).toHaveValue('2026-12-31')

    await user.clear(screen.getByLabelText('Konečné datum'))
    await user.click(screen.getByRole('button', { name: 'Uložit' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ endDate: null }),
    )
  })
})
