import { expect, test } from '@playwright/test'
import { createPerson, createTeam, uniqueEmail, uniqueName } from './helpers'

test('projekt rozlišuje účastníky přiřazené přímo a přes tým', async ({
  page,
}) => {
  const assignedTeamName = uniqueName('Přiřazený tým')
  const otherTeamName = uniqueName('Jiný tým')
  const memberSurname = uniqueName('Členka')
  const memberFullName = `Jana ${memberSurname}`
  const directSurname = uniqueName('Přímý')
  const directFullName = `Petr ${directSurname}`
  const projectName = uniqueName('Projekt')

  // Příprava dvou týmů a osob

  await createTeam(page, assignedTeamName)
  await createTeam(page, otherTeamName)
  await createPerson(page, {
    name: 'Jana',
    surname: memberSurname,
    email: uniqueEmail(),
    teamName: assignedTeamName,
  })
  await createPerson(page, {
    name: 'Petr',
    surname: directSurname,
    email: uniqueEmail(),
    teamName: otherTeamName,
  })

  // Založení projektu

  await page.goto('/projects')
  await page.getByRole('link', { name: 'Založit nový projekt' }).click()
  await expect(
    page.getByRole('heading', { name: 'Nový projekt' }),
  ).toBeVisible()

  await page.getByLabel('Název').fill(projectName)
  await page.getByLabel('Počáteční datum').fill('2026-11-24')
  await page.getByRole('button', { name: 'Vytvořit' }).click()

  await expect(page.getByText('Projekt byl úspěšně vytvořen')).toBeVisible()
  await expect(page).toHaveURL(/\/projects$/)

  // Detail projektu a kontrola

  await page.getByRole('link', { name: projectName }).click()
  await expect(
    page.getByRole('heading', { name: projectName, level: 1 }),
  ).toBeVisible()
  await expect(
    page.getByText('K projektu není přiřazen žádný tým.'),
  ).toBeVisible()

  await expect(page.getByText('Projekt nemá žádné účastníky.')).toBeVisible()

  // Přiřazení týmu

  await page
    .getByLabel('Tým k přiřazení')
    .selectOption({ label: assignedTeamName })
  await page.getByRole('button', { name: 'Přidat tým' }).click()

  await expect(page.getByText('Tým byl přidán')).toBeVisible()
  await expect(
    page.getByRole('link', { name: assignedTeamName, exact: true }),
  ).toBeVisible()

  const memberRow = page
    .getByRole('listitem')
    .filter({ hasText: memberFullName })

  await expect(memberRow).toContainText(`přes tým ${assignedTeamName}`)
  await expect(memberRow.getByRole('button', { name: 'Odebrat' })).toHaveCount(
    0,
  )

  // Přiřazení osoby

  await page
    .getByLabel('Osoba k přiřazení')
    .selectOption({ label: directFullName })
  await page.getByRole('button', { name: 'Přidat osobu' }).click()
  await expect(page.getByText('Osoba byla přidána')).toBeVisible()

  const directRow = page
    .getByRole('listitem')
    .filter({ hasText: directFullName })

  await expect(directRow).not.toContainText('přes tým')
  await expect(directRow.getByRole('button', { name: 'Odebrat' })).toBeVisible()

  // Odebrání osoby a týmu

  await directRow.getByRole('button', { name: 'Odebrat' }).click()
  await expect(page.getByText('Osoba byla odebrána')).toBeVisible()
  await expect(directRow).toHaveCount(0)
  await expect(memberRow).toBeVisible()

  const teamRow = page.getByRole('listitem').filter({
    has: page.getByRole('link', { name: assignedTeamName, exact: true }),
  })
  await teamRow.getByRole('button', { name: 'Odebrat' }).click()
  await expect(page.getByText('Tým byl odebrán')).toBeVisible()
  await expect(page.getByText('Projekt nemá žádné účastníky.')).toBeVisible()
})
