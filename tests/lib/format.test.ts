import { describe, expect, it } from 'vitest'
import { formatDate } from '../../src/lib/format'

describe('formatDate', () => {
  it('převede datum na text', () => {
    expect(formatDate('2026-11-16')).toBe('16. 11. 2026')
  })
  it('odstraní úvodní nuly', () => {
    expect(formatDate('2026-01-06')).toBe('6. 1. 2026')
  })
})
