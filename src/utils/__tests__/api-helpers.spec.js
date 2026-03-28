import { describe, it, expect } from 'vitest'
import {
  extractItems,
  extractTotalItems,
  extractErrorMessage,
  buildQueryString,
  extractIdFromIri,
} from '../api-helpers'

describe('API Helpers', () => {
  describe('extractItems', () => {
    it('extracts from hydra:member format', () => {
      const response = {
        '@context': '/api/contexts/Exercise',
        '@id': '/api/exercises',
        '@type': 'hydra:Collection',
        'hydra:member': [{ id: 1, name: 'Push Up' }, { id: 2, name: 'Squat' }],
        'hydra:totalItems': 2
      }
      expect(extractItems(response)).toHaveLength(2)
      expect(extractItems(response)[0].name).toBe('Push Up')
    })

    it('extracts from member format', () => {
      const response = {
        member: [{ id: 1, name: 'Item 1' }],
        totalItems: 1
      }
      expect(extractItems(response)).toHaveLength(1)
    })

    it('returns array if response is already array', () => {
      const response = [{ id: 1 }, { id: 2 }]
      expect(extractItems(response)).toHaveLength(2)
    })

    it('returns empty array for null/undefined', () => {
      expect(extractItems(null)).toEqual([])
      expect(extractItems(undefined)).toEqual([])
    })

    it('returns empty array for empty response', () => {
      expect(extractItems({})).toEqual([])
    })
  })

  describe('extractTotalItems', () => {
    it('extracts from hydra:totalItems', () => {
      const response = {
        'hydra:member': [1, 2, 3],
        'hydra:totalItems': 10
      }
      expect(extractTotalItems(response)).toBe(10)
    })

    it('extracts from totalItems', () => {
      const response = {
        member: [1, 2],
        totalItems: 5
      }
      expect(extractTotalItems(response)).toBe(5)
    })

    it('returns array length for plain arrays', () => {
      expect(extractTotalItems([1, 2, 3])).toBe(3)
    })

    it('returns 0 for null/undefined', () => {
      expect(extractTotalItems(null)).toBe(0)
      expect(extractTotalItems(undefined)).toBe(0)
    })
  })

  describe('extractErrorMessage', () => {
    it('extracts from string error', () => {
      expect(extractErrorMessage('Error message')).toBe('Error message')
    })

    it('extracts from hydra:description', () => {
      const error = { 'hydra:description': 'Validation failed' }
      expect(extractErrorMessage(error)).toBe('Validation failed')
    })

    it('extracts from message property', () => {
      const error = { message: 'Something went wrong' }
      expect(extractErrorMessage(error)).toBe('Something went wrong')
    })

    it('extracts from detail property', () => {
      const error = { detail: 'Not found' }
      expect(extractErrorMessage(error)).toBe('Not found')
    })

    it('extracts from response.data', () => {
      const error = {
        response: {
          data: { message: 'Server error' }
        }
      }
      expect(extractErrorMessage(error)).toBe('Server error')
    })

    it('returns default for null/undefined', () => {
      expect(extractErrorMessage(null)).toBe('Error desconocido')
      expect(extractErrorMessage(undefined)).toBe('Error desconocido')
    })

    it('returns default for empty object', () => {
      expect(extractErrorMessage({})).toBe('Error en la operación')
    })
  })

  describe('buildQueryString', () => {
    it('builds query string from object', () => {
      const params = { page: 1, limit: 10, search: 'test' }
      const query = buildQueryString(params)
      expect(query).toContain('page=1')
      expect(query).toContain('limit=10')
      expect(query).toContain('search=test')
    })

    it('ignores null and undefined values', () => {
      const params = { page: 1, limit: null, search: undefined, filter: '' }
      const query = buildQueryString(params)
      expect(query).toContain('page=1')
      expect(query).not.toContain('limit')
      expect(query).not.toContain('search')
      expect(query).not.toContain('filter')
    })

    it('returns empty string for empty params', () => {
      expect(buildQueryString({})).toBe('')
      expect(buildQueryString()).toBe('')
    })
  })

  describe('extractIdFromIri', () => {
    it('extracts ID from IRI string', () => {
      expect(extractIdFromIri('/api/exercises/123')).toBe('123')
      expect(extractIdFromIri('/api/users/456')).toBe('456')
    })

    it('handles IRIs without leading slash', () => {
      expect(extractIdFromIri('api/exercises/789')).toBe('789')
    })

    it('returns null for null/undefined', () => {
      expect(extractIdFromIri(null)).toBeNull()
      expect(extractIdFromIri(undefined)).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(extractIdFromIri('')).toBeNull()
    })
  })
})
