import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/api'
import { TeamForm } from '../../src/components/team-form'

describe('TeamForm', () => {
  it('odešle vyplněný název', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TeamForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Název'), 'Romeo')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Romeo' })
  })
  it('předvyplní název při úpravě', async () => {
    render(
      <TeamForm
        initial={{ name: 'Sierra' }}
        submitLabel="Uložit"
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Název')).toHaveValue('Sierra')
  })
  it('zobrazí chybu z backendu', async () => {
    const user = userEvent.setup()
    const onSubmit = vi
      .fn()
      .mockRejectedValue(
        new ApiError(400, 'validation_error', 'Neplatný vstup'),
      )
    render(<TeamForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Název'), 'Tango')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Neplatný vstup')
  })
  it('během ukládání je tlačítko neaktivní', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(() => new Promise<void>(() => {}))
    render(<TeamForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Název'), 'Uniform')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(screen.getByRole('button', { name: /Ukládám/ })).toBeDisabled()
  })
})
