import { expect, test } from '@playwright/test'
import { uniqueName, uniqueEmail } from './helpers'

test('osoba je vidět na detailu týmu a tým se členem nejde smazat', async ({
  page,
}) => {
  const teamName = uniqueName('Tým')
  const personName = 'Jana'
  const personSurname = uniqueName('Nováková')
  const personEmail = uniqueEmail()
  const fullName = personName + ' ' + personSurname

  // Vytvoření týmu

  await page.goto('/teams')
  await page.getByRole('link', { name: 'Založit nový tým' }).click()
  await expect(page.getByRole('heading', { name: 'Nový tým' })).toBeVisible()

  await page.getByLabel('Název').fill(teamName)
  await page.getByRole('button', { name: 'Vytvořit' }).click()

  await expect(page.getByText('Tým byl úspěšně vytvořen')).toBeVisible()

  // Vytvoření osoby

  await page.goto('/persons')
  await page.getByRole('link', { name: 'Přidat novou osobu' }).click()
  await expect(page.getByRole('heading', { name: 'Nová osoba' })).toBeVisible()

  await page.getByLabel('Jméno').fill(personName)
  await page.getByLabel('Příjmení').fill(personSurname)
  await page.getByLabel('Email').fill(personEmail)
  await page.getByLabel('Tým').selectOption({ label: teamName })
  await page.getByRole('button', { name: 'Vytvořit' }).click()

  await expect(page.getByText('Osoba byla úspěšně vytvořena')).toBeVisible()
  await expect(page).toHaveURL(/\/persons$/)

  // Kontrola člena na detailu týmu

  await page.goto('/teams')
  await page.getByRole('link', { name: teamName, exact: true }).click()
  await expect(
    page.getByRole('heading', { name: teamName, level: 1 }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: fullName, exact: true }),
  ).toBeVisible()

  // Tým se členem nejde smazat

  await page.getByRole('button', { name: 'Smazat' }).click()
  const dialog = page.getByRole('alertdialog')
  await dialog.getByRole('button', { name: 'Smazat' }).click()

  await expect(dialog.getByRole('alert')).toBeVisible()
  await expect(page).toHaveURL(/\/teams\/\d+$/)

  await dialog.getByRole('button', { name: 'Zrušit' }).click()
  await expect(
    page.getByRole('heading', { name: teamName, level: 1 }),
  ).toBeVisible()
})
