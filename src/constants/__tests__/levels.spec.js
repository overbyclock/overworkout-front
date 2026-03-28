import { describe, it, expect } from 'vitest'
import {
  LEVELS,
  LEVEL_LABELS,
  LEVEL_COLORS,
  LEVEL_ORDER,
  getLevelLabel,
  getLevelColor,
  compareLevels,
} from '../levels'

describe('Levels Constants', () => {
  describe('LEVELS', () => {
    it('has all expected levels', () => {
      expect(LEVELS.BEGINNER).toBe('beginner')
      expect(LEVELS.INTERMEDIATE).toBe('intermediate')
      expect(LEVELS.EXPERT).toBe('expert')
      expect(LEVELS.NO_LEVEL).toBe('nolevel')
    })
  })

  describe('LEVEL_LABELS', () => {
    it('has Spanish labels for all levels', () => {
      expect(LEVEL_LABELS[LEVELS.BEGINNER]).toBe('Principiante')
      expect(LEVEL_LABELS[LEVELS.INTERMEDIATE]).toBe('Intermedio')
      expect(LEVEL_LABELS[LEVELS.EXPERT]).toBe('Experto')
      expect(LEVEL_LABELS[LEVELS.NO_LEVEL]).toBe('Sin nivel')
    })
  })

  describe('LEVEL_COLORS', () => {
    it('has Quasar color names for all levels', () => {
      expect(LEVEL_COLORS[LEVELS.BEGINNER]).toBe('positive')
      expect(LEVEL_COLORS[LEVELS.INTERMEDIATE]).toBe('warning')
      expect(LEVEL_COLORS[LEVELS.EXPERT]).toBe('negative')
      expect(LEVEL_COLORS[LEVELS.NO_LEVEL]).toBe('grey')
    })
  })

  describe('LEVEL_ORDER', () => {
    it('has correct order for sorting', () => {
      expect(LEVEL_ORDER[0]).toBe(LEVELS.BEGINNER)
      expect(LEVEL_ORDER[1]).toBe(LEVELS.INTERMEDIATE)
      expect(LEVEL_ORDER[2]).toBe(LEVELS.EXPERT)
      expect(LEVEL_ORDER[3]).toBe(LEVELS.NO_LEVEL)
    })
  })

  describe('getLevelLabel', () => {
    it('returns Spanish label for valid level', () => {
      expect(getLevelLabel('beginner')).toBe('Principiante')
      expect(getLevelLabel('intermediate')).toBe('Intermedio')
      expect(getLevelLabel('expert')).toBe('Experto')
    })

    it('returns original value for unknown level', () => {
      expect(getLevelLabel('unknown')).toBe('unknown')
    })

    it('returns "Desconocido" for null/undefined', () => {
      expect(getLevelLabel(null)).toBe('Desconocido')
      expect(getLevelLabel(undefined)).toBe('Desconocido')
    })
  })

  describe('getLevelColor', () => {
    it('returns color for active level', () => {
      expect(getLevelColor('beginner', true)).toBe('positive')
      expect(getLevelColor('intermediate', true)).toBe('warning')
      expect(getLevelColor('expert', true)).toBe('negative')
    })

    it('returns grey-6 for inactive level', () => {
      expect(getLevelColor('beginner', false)).toBe('grey-6')
      expect(getLevelColor('expert', false)).toBe('grey-6')
    })

    it('defaults to primary for unknown level', () => {
      expect(getLevelColor('unknown', true)).toBe('primary')
    })
  })

  describe('compareLevels', () => {
    it('returns negative when first level is lower', () => {
      expect(compareLevels('beginner', 'expert')).toBeLessThan(0)
      expect(compareLevels('beginner', 'intermediate')).toBeLessThan(0)
    })

    it('returns positive when first level is higher', () => {
      expect(compareLevels('expert', 'beginner')).toBeGreaterThan(0)
      expect(compareLevels('intermediate', 'beginner')).toBeGreaterThan(0)
    })

    it('returns zero for same level', () => {
      expect(compareLevels('beginner', 'beginner')).toBe(0)
    })
  })
})
