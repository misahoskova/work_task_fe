/** Převod data na text pro zobrazení */

export function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${Number(day)}. ${Number(month)}. ${Number(year)}`
}
