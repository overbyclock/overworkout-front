import { describe, it, expect } from 'vitest'
import {
  DISCIPLINES,
  DISCIPLINE_LABELS,
  DISCIPLINE_ICONS,
  DISCIPLINE_GRADIENTS,
  getDisciplineLabel,
  getDisciplineIcon,
  getDisciplineGradient,
} from '../disciplines'

describe('Disciplines Constants', () => {
  describe('DISCIPLINES', () => {
    it('has all expected disciplines', () => {
      expect(DISCIPLINES.CALISTHENICS).toBe('calisthenics')
      expect(DISCIPLINES.CROSSFIT).toBe('crossfit')
      expect(DISCIPLINES.FITNESS).toBe('fitness')
      expect(DISCIPLINES.WEIGHTLIFTING).toBe('weightlifting')
      expect(DISCIPLINES.YOGA).toBe('yoga')
      expect(DISCIPLINES.RUNNING).toBe('running')
    })
  })

  describe('DISCIPLINE_LABELS', () => {
    it('has Spanish labels for all disciplines', () => {
      expect(DISCIPLINE_LABELS[DISCIPLINES.CALISTHENICS]).toBe('Calistenia')
      expect(DISCIPLINE_LABELS[DISCIPLINES.CROSSFIT]).toBe('CrossFit')
      expect(DISCIPLINE_LABELS[DISCIPLINES.FITNESS]).toBe('Fitness')
      expect(DISCIPLINE_LABELS[DISCIPLINES.WEIGHTLIFTING]).toBe('Halterofilia')
      expect(DISCIPLINE_LABELS[DISCIPLINES.YOGA]).toBe('Yoga')
      expect(DISCIPLINE_LABELS[DISCIPLINES.RUNNING]).toBe('Running')
    })
  })

  describe('DISCIPLINE_ICONS', () => {
    it('has icon names for all main disciplines', () => {
      expect(DISCIPLINE_ICONS[DISCIPLINES.CALISTHENICS]).toBe('self_improvement')
      expect(DISCIPLINE_ICONS[DISCIPLINES.CROSSFIT]).toBe('fitness_center')
      expect(DISCIPLINE_ICONS[DISCIPLINES.FITNESS]).toBe('sports_gymnastics')
      expect(DISCIPLINE_ICONS[DISCIPLINES.RUNNING]).toBe('directions_run')
    })
  })

  describe('DISCIPLINE_GRADIENTS', () => {
    it('has CSS gradients for main disciplines', () => {
      expect(DISCIPLINE_GRADIENTS[DISCIPLINES.CALISTHENICS]).toContain('linear-gradient')
      expect(DISCIPLINE_GRADIENTS[DISCIPLINES.CROSSFIT]).toContain('linear-gradient')
      expect(DISCIPLINE_GRADIENTS[DISCIPLINES.FITNESS]).toContain('linear-gradient')
    })
  })

  describe('getDisciplineLabel', () => {
    it('returns Spanish label for valid discipline', () => {
      expect(getDisciplineLabel('calisthenics')).toBe('Calistenia')
      expect(getDisciplineLabel('crossfit')).toBe('CrossFit')
      expect(getDisciplineLabel('fitness')).toBe('Fitness')
    })

    it('returns original value for unknown discipline', () => {
      expect(getDisciplineLabel('unknown')).toBe('unknown')
    })

    it('returns "Desconocido" for null/undefined', () => {
      expect(getDisciplineLabel(null)).toBe('Desconocido')
      expect(getDisciplineLabel(undefined)).toBe('Desconocido')
    })
  })

  describe('getDisciplineIcon', () => {
    it('returns icon for valid discipline', () => {
      expect(getDisciplineIcon('calisthenics')).toBe('self_improvement')
      expect(getDisciplineIcon('crossfit')).toBe('fitness_center')
    })

    it('returns default icon for unknown discipline', () => {
      expect(getDisciplineIcon('unknown')).toBe('sports')
    })
  })

  describe('getDisciplineGradient', () => {
    it('returns gradient for valid discipline', () => {
      expect(getDisciplineGradient('calisthenics')).toContain('linear-gradient')
      expect(getDisciplineGradient('crossfit')).toContain('linear-gradient')
    })

    it('returns default gradient for unknown discipline', () => {
      const defaultGradient = getDisciplineGradient('unknown')
      expect(defaultGradient).toContain('linear-gradient')
    })
  })
})
