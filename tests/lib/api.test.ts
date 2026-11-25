import { describe, expect, it } from 'vitest'
import { ApiError, getErrorMessage, getErrorDetails } from '../../src/lib/api'

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

describe('getErrorDetails', () => {
  it('vrátí podrobnosti z ApiError', () => {
    const details = [{ path: 'name', message: 'Hodnota je příliš malá' }]
    const error = new ApiError(
      400,
      'validation_error',
      'Neplatný vstup',
      details,
    )

    expect(getErrorDetails(error)).toEqual(details)
  })

  it('vrátí prázdné pole pro chybu bez podrobností', () => {
    const apiError = new ApiError(404, 'error', 'Tým nebyl nalezen')

    expect(getErrorDetails(apiError)).toEqual([])
    expect(getErrorDetails(new Error('síť'))).toEqual([])
  })
})
