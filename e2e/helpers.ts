export function uniqueName(base: string): string {
  return `${base} ${Date.now()}-${Math.floor(Math.random() * 1000)}`
}
