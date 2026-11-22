import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getTeams } from '@/lib/api'
import { PersonForm } from './person-form'

// Formulář si týmy načítá sám. V testu backend neběží, proto se getTeams
// nahrazuje podvrženou funkcí.

vi.mock('@/lib/api', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/api')>()
  return { ...original, getTeams: vi.fn() }
})

const teams = [
  { id: 1, name: 'Victor' },
  { id: 2, name: 'Whisky' },
]

beforeEach(() => {
  vi.mocked(getTeams).mockResolvedValue(teams)
})

describe('PersonForm', () => {
  it('nabídne ve výběru načtené týmy', async () => {
    render(<PersonForm submitLabel="Vytvořit" onSubmit={vi.fn()} />)

    expect(
      await screen.findByRole('option', { name: 'Victor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Whisky' })).toBeInTheDocument()
  })
  it('odešle všechna pole a tým jako číslo', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<PersonForm submitLabel="Vytvořit" onSubmit={onSubmit} />)

    await screen.findByRole('option', { name: 'Whisky' })

    await user.type(screen.getByLabelText('Jméno'), 'Jana')
    await user.type(screen.getByLabelText('Příjmení'), 'Nováková')
    await user.type(screen.getByLabelText('Email'), 'jana.novakova@example.cz')
    await user.selectOptions(screen.getByLabelText('Pozice'), 'analyst')
    await user.selectOptions(screen.getByLabelText('Tým'), '2')
    await user.click(screen.getByRole('button', { name: 'Vytvořit' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jana',
      surname: 'Nováková',
      email: 'jana.novakova@example.cz',
      position: 'analyst',
      teamId: 2,
    })
  })
  it('předvyplní údaje při úpravě', async () => {
    render(
      <PersonForm
        initial={{
          name: 'Jana',
          surname: 'Nováková',
          email: 'jana.novakova@example.cz',
          position: 'tester',
          teamId: 2,
        }}
        submitLabel="Uložit"
        onSubmit={vi.fn()}
      />,
    )

    await screen.findByRole('option', { name: 'Whisky' })

    expect(screen.getByLabelText('Jméno')).toHaveValue('Jana')
    expect(screen.getByLabelText('Příjmení')).toHaveValue('Nováková')
    expect(screen.getByLabelText('Email')).toHaveValue(
      'jana.novakova@example.cz',
    )
    expect(screen.getByLabelText('Pozice')).toHaveValue('tester')
    expect(screen.getByLabelText('Tým')).toHaveValue('2')
  })
})
