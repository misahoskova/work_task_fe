import { expect, test } from '@playwright/test'
import { uniqueName, createTeam } from './helpers'

test('tým lze vytvořit, upravit a smazat', async ({ page }) => {
  const teamName = uniqueName('Tým')
  const editedName = `${teamName}_edited`

  // Vytvoření týmu

  await page.goto('/teams')
  await page.getByRole('link', { name: 'Založit nový tým' }).click()
  await expect(page.getByRole('heading', { name: 'Nový tým' })).toBeVisible()

  await page.getByLabel('Název').fill(teamName)
  await page.getByRole('button', { name: 'Vytvořit' }).click()

  await expect(page.getByText('Tým byl úspěšně vytvořen')).toBeVisible()
  await expect(page).toHaveURL(/\/teams$/)

  // Úprava týmu

  await page.getByRole('link', { name: teamName, exact: true }).click()
  await expect(
    page.getByRole('heading', { name: teamName, level: 1 }),
  ).toBeVisible()
  await expect(page.getByText('Tým nemá žádné členy.')).toBeVisible()

  await page.getByRole('link', { name: 'Upravit' }).click()
  await expect(page.getByRole('heading', { name: 'Úprava týmu' })).toBeVisible()
  await expect(page.getByLabel('Název')).toHaveValue(teamName)

  await page.getByLabel('Název').fill(editedName)
  await page.getByRole('button', { name: 'Uložit' }).click()
  await expect(page.getByText('Tým byl aktualizován')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: editedName, level: 1 }),
  ).toBeVisible()

  // Smazání týmu

  await page.getByRole('button', { name: 'Smazat' }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText(
    'Tým' + ' ' + editedName + ' ' + 'bude trvale smazán.',
  )

  const listResponse = page.waitForResponse(
    (response) =>
      response.url() === 'http://localhost:3001/teams' &&
      response.request().method() === 'GET',
  )

  await dialog.getByRole('button', { name: 'Smazat' }).click()
  await expect(page.getByText('Tým byl smazán')).toBeVisible()

  await expect(page).toHaveURL(/\/teams$/)
  await listResponse
  await expect(
    page.getByRole('link', { name: editedName, exact: true }),
  ).toHaveCount(0)
})

test('název s HTML značkami se zobrazí jako text', async ({ page }) => {
  const teamName = uniqueName('<b>Tučný</b> tým')

  await createTeam(page, teamName)
  await page.getByRole('link', { name: teamName, exact: true }).click()
  await expect(
    page.getByRole('heading', { level: 1, name: teamName, exact: true }),
  ).toBeVisible()
  await expect(page.locator('main b')).toHaveCount(0)
})
