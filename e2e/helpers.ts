import { expect, type Page } from '@playwright/test'

type NewPerson = {
  name: string
  surname: string
  email: string
  teamName: string
}

export function uniqueName(base: string): string {
  return `${base} ${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function uniqueEmail(): string {
  return `osoba-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.cz`
}

export async function createTeam(page: Page, teamName: string) {
  await page.goto('/teams/new')
  await page.getByLabel('Název').fill(teamName)
  await page.getByRole('button', { name: 'Vytvořit' }).click()
  await expect(page).toHaveURL(/\/teams$/)
}

export async function createPerson(page: Page, person: NewPerson) {
  await page.goto('/persons/new')
  await page.getByLabel('Jméno').fill(person.name)
  await page.getByLabel('Příjmení').fill(person.surname)
  await page.getByLabel('Email').fill(person.email)
  await page.getByLabel('Tým').selectOption({ label: person.teamName })
  await page.getByRole('button', { name: 'Vytvořit' }).click()
  await expect(page).toHaveURL(/\/persons$/)
}
