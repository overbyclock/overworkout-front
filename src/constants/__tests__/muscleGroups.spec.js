import { describe, it, expect } from 'vitest'
import {
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  MUSCLE_GROUP_OPTIONS,
  getMuscleGroupLabel,
} from '../muscleGroups'

describe('Muscle Groups Constants', () => {
  describe('MUSCLE_GROUPS', () => {
    it('has all expected muscle groups', () => {
      expect(MUSCLE_GROUPS.CHEST).toBe('chest')
      expect(MUSCLE_GROUPS.BACK).toBe('back')
      expect(MUSCLE_GROUPS.LEGS).toBe('legs')
      expect(MUSCLE_GROUPS.SHOULDERS).toBe('shoulders')
      expect(MUSCLE_GROUPS.BICEPS).toBe('biceps')
      expect(MUSCLE_GROUPS.TRICEPS).toBe('triceps')
      expect(MUSCLE_GROUPS.CORE).toBe('core')
    })
  })

  describe('MUSCLE_GROUP_LABELS', () => {
    it('has Spanish labels for all groups', () => {
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.CHEST]).toBe('Pecho')
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.BACK]).toBe('Espalda')
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.LEGS]).toBe('Piernas')
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.SHOULDERS]).toBe('Hombros')
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.BICEPS]).toBe('Bíceps')
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.TRICEPS]).toBe('Tríceps')
      expect(MUSCLE_GROUP_LABELS[MUSCLE_GROUPS.CORE]).toBe('Core')
    })
  })

  describe('MUSCLE_GROUP_OPTIONS', () => {
    it('is an array of option objects', () => {
      expect(Array.isArray(MUSCLE_GROUP_OPTIONS)).toBe(true)
      expect(MUSCLE_GROUP_OPTIONS.length).toBeGreaterThan(0)
    })

    it('each option has value and label', () => {
      MUSCLE_GROUP_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('value')
        expect(option).toHaveProperty('label')
        expect(typeof option.value).toBe('string')
        expect(typeof option.label).toBe('string')
      })
    })
  })

  describe('getMuscleGroupLabel', () => {
    it('returns Spanish label for valid group', () => {
      expect(getMuscleGroupLabel('chest')).toBe('Pecho')
      expect(getMuscleGroupLabel('back')).toBe('Espalda')
      expect(getMuscleGroupLabel('legs')).toBe('Piernas')
    })

    it('returns original value for unknown group', () => {
      expect(getMuscleGroupLabel('unknown')).toBe('unknown')
    })

    it('returns "Desconocido" for null/undefined', () => {
      expect(getMuscleGroupLabel(null)).toBe('Desconocido')
      expect(getMuscleGroupLabel(undefined)).toBe('Desconocido')
    })

    it('returns "Desconocido" for empty string', () => {
      expect(getMuscleGroupLabel('')).toBe('Desconocido')
    })
  })
})
