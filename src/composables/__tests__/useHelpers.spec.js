import { describe, it, expect } from 'vitest'
import { useHelpers, useFormatters } from '../useHelpers'

describe('useHelpers', () => {
  const helpers = useHelpers()

  describe('getInitials', () => {
    it('returns initials for two-word name', () => {
      expect(helpers.getInitials('John Doe')).toBe('JD')
    })

    it('returns first two letters for single name', () => {
      expect(helpers.getInitials('John')).toBe('JO')
    })

    it('handles names with extra spaces', () => {
      expect(helpers.getInitials('  John   Doe  ')).toBe('JD')
    })

    it('returns U for empty string', () => {
      expect(helpers.getInitials('')).toBe('U')
    })

    it('returns U for null/undefined', () => {
      expect(helpers.getInitials(null)).toBe('U')
      expect(helpers.getInitials(undefined)).toBe('U')
    })
  })

  describe('formatDate', () => {
    it('formats ISO date to Spanish locale', () => {
      const result = helpers.formatDate('2024-03-15')
      expect(result).toContain('2024')
      expect(result).toContain('mar')
    })

    it('returns N/A for null/undefined', () => {
      expect(helpers.formatDate(null)).toBe('N/A')
      expect(helpers.formatDate(undefined)).toBe('N/A')
    })

    it('returns N/A for empty string', () => {
      expect(helpers.formatDate('')).toBe('N/A')
    })

    it('handles invalid dates gracefully', () => {
      const result = helpers.formatDate('invalid-date')
      // Should return some form of error message (may vary by locale)
      expect(result).toMatch(/invalid|inválid/i)
    })
  })

  describe('formatDateTime', () => {
    it('formats date with time', () => {
      const result = helpers.formatDateTime('2024-03-15T14:30:00')
      expect(result).toContain('2024')
      expect(result).toContain('14:30')
    })

    it('returns N/A for null', () => {
      expect(helpers.formatDateTime(null)).toBe('N/A')
    })
  })

  describe('formatLastLogin', () => {
    it('returns "Hace un momento" for recent time', () => {
      const now = new Date()
      const justNow = new Date(now - 30000) // 30 seconds ago
      expect(helpers.formatLastLogin(justNow.toISOString())).toBe('Hace un momento')
    })

    it('returns minutes for recent activity', () => {
      const now = new Date()
      const minutesAgo = new Date(now - 5 * 60000) // 5 minutes ago
      expect(helpers.formatLastLogin(minutesAgo.toISOString())).toBe('Hace 5 min')
    })

    it('returns hours for activity within day', () => {
      const now = new Date()
      const hoursAgo = new Date(now - 3 * 3600000) // 3 hours ago
      expect(helpers.formatLastLogin(hoursAgo.toISOString())).toBe('Hace 3 h')
    })

    it('returns days for older activity', () => {
      const now = new Date()
      const daysAgo = new Date(now - 5 * 86400000) // 5 days ago
      expect(helpers.formatLastLogin(daysAgo.toISOString())).toBe('Hace 5 días')
    })

    it('returns "Nunca" for null/undefined', () => {
      expect(helpers.formatLastLogin(null)).toBe('Nunca')
      expect(helpers.formatLastLogin(undefined)).toBe('Nunca')
    })
  })

  describe('truncateText', () => {
    it('returns full text if shorter than limit', () => {
      expect(helpers.truncateText('Short', 50)).toBe('Short')
    })

    it('truncates long text with ellipsis', () => {
      const longText = 'This is a very long text that needs truncation'
      expect(helpers.truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('returns empty string for null/undefined', () => {
      expect(helpers.truncateText(null)).toBe('')
      expect(helpers.truncateText(undefined)).toBe('')
    })
  })

  describe('formatPercentage', () => {
    it('formats decimal to percentage', () => {
      expect(helpers.formatPercentage(0.85)).toBe('85%')
    })

    it('handles zero', () => {
      expect(helpers.formatPercentage(0)).toBe('0%')
    })

    it('returns 0% for null/undefined', () => {
      expect(helpers.formatPercentage(null)).toBe('0%')
      expect(helpers.formatPercentage(undefined)).toBe('0%')
    })

    it('respects decimal places', () => {
      expect(helpers.formatPercentage(0.8567, 2)).toBe('85.67%')
    })
  })

  describe('formatNumber', () => {
    it('formats with thousand separators', () => {
      expect(helpers.formatNumber(1000000)).toBe('1.000.000')
    })

    it('returns 0 for null/undefined', () => {
      expect(helpers.formatNumber(null)).toBe('0')
      expect(helpers.formatNumber(undefined)).toBe('0')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(helpers.capitalize('hello')).toBe('Hello')
    })

    it('lowercases rest of string', () => {
      expect(helpers.capitalize('HELLO')).toBe('Hello')
    })

    it('returns empty string for empty input', () => {
      expect(helpers.capitalize('')).toBe('')
    })
  })

  describe('toKebabCase', () => {
    it('converts camelCase to kebab-case', () => {
      expect(helpers.toKebabCase('helloWorld')).toBe('hello-world')
    })

    it('converts spaces to hyphens', () => {
      expect(helpers.toKebabCase('hello world')).toBe('hello-world')
    })

    it('converts underscores to hyphens', () => {
      expect(helpers.toKebabCase('hello_world')).toBe('hello-world')
    })
  })
})

describe('useFormatters', () => {
  const formatters = useFormatters()

  it('provides all helper functions', () => {
    expect(formatters.getInitials).toBeDefined()
    expect(formatters.formatDate).toBeDefined()
    expect(formatters.formatDateTime).toBeDefined()
    expect(formatters.formatLastLogin).toBeDefined()
    expect(formatters.formatNumber).toBeDefined()
    expect(formatters.formatPercentage).toBeDefined()
    expect(formatters.truncateText).toBeDefined()
  })
})
