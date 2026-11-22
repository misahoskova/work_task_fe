import { describe, expect, it } from 'vitest'
import { ApiError, getErrorMessage } from './api'

describe('getErrorMessage', () => {
  it('vrátí zprávu z chyby API', () => {
    const error = new ApiError(409, 'error', 'Email už existuje')

    expect(getErrorMessage(error)).toBe('Email už existuje')
  })
  it('u jiné chyby vrátí text o spojení se serverem', () => {
    const error = new Error('Failed to fetch')

    expect(getErrorMessage(error)).toBe('Nepodařilo se spojit se serverem')
  })
})
