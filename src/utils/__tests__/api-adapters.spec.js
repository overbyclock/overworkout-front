import { describe, it, expect } from 'vitest'
import { adaptApiLevelToLegacy, calculateWorkoutTime } from '../api-adapters'

describe('api-adapters', () => {
  describe('adaptApiLevelToLegacy', () => {
    it('mapea sessionType desde la API', () => {
      const apiLevel = {
        name: 'Nivel 1',
        levelNumber: 1,
        difficultyRating: 1,
        estimatedDurationWeeks: 4,
        trainings: [
          {
            name: 'Día 1: Push',
            dayKey: 'day1_strength',
            weekNumber: 0,
            sessionType: 'strength',
            isCircuit: false,
            estimatedDurationMin: 1800,
            estimatedDurationMax: 2400,
            trainingRounds: [
              {
                setsForRound: 3,
                restBetweenRounds: 120,
                trainingExerciseConfigurations: [
                  {
                    reps: 10,
                    restBetweenSets: 30,
                    exercise: { id: 1, name: 'Push Up', difficultyRating: 1 }
                  }
                ]
              }
            ]
          },
          {
            name: 'Día 3: Circuit',
            dayKey: 'day3_circuit',
            weekNumber: 0,
            sessionType: 'circuit',
            isCircuit: true,
            estimatedDurationMin: 1200,
            estimatedDurationMax: 1500,
            trainingRounds: [
              {
                setsForRound: 3,
                restBetweenRounds: 60,
                trainingExerciseConfigurations: [
                  {
                    reps: 15,
                    restBetweenSets: 15,
                    exercise: { id: 2, name: 'Air Squat', difficultyRating: 1 }
                  }
                ]
              }
            ]
          }
        ]
      }

      const result = adaptApiLevelToLegacy(apiLevel)

      expect(result.weeks[0]['day1_strength'].sessionType).toBe('strength')
      expect(result.weeks[0]['day3_circuit'].sessionType).toBe('circuit')
      expect(result.weeks[0]['day1_strength'].isCircuit).toBe(false)
      expect(result.weeks[0]['day3_circuit'].isCircuit).toBe(true)
    })

    it('mapea skillFocus y programVersion desde la API', () => {
      const apiLevel = {
        name: 'Nivel 5',
        levelNumber: 5,
        difficultyRating: 5,
        estimatedDurationWeeks: 4,
        skillFocus: 'Tuck Planche',
        programVersion: 'v2',
        cyclesCompleted: 2,
        trainings: []
      }

      const result = adaptApiLevelToLegacy(apiLevel)

      expect(result.skillFocus).toBe('Tuck Planche')
      expect(result.programVersion).toBe('v2')
      expect(result.cyclesCompleted).toBe(2)
    })

    it('usa valores por defecto cuando no hay skillFocus ni programVersion', () => {
      const apiLevel = {
        name: 'Nivel 1',
        levelNumber: 1,
        difficultyRating: 1,
        estimatedDurationWeeks: 4,
        trainings: []
      }

      const result = adaptApiLevelToLegacy(apiLevel)

      expect(result.skillFocus).toBeNull()
      expect(result.programVersion).toBe('v1')
      expect(result.cyclesCompleted).toBe(0)
    })

    it('infierne goal correctamente para sesiones strength y circuit', () => {
      const apiLevel = {
        name: 'Nivel 7',
        levelNumber: 7,
        difficultyRating: 7,
        estimatedDurationWeeks: 4,
        trainings: [
          {
            name: 'Día 1: Push',
            dayKey: 'day1_strength',
            weekNumber: 0,
            sessionType: 'strength',
            isCircuit: false,
            estimatedDurationMin: 1800,
            estimatedDurationMax: 2400,
            trainingRounds: []
          },
          {
            name: 'Día 3: Legs',
            dayKey: 'day3_circuit',
            weekNumber: 0,
            sessionType: 'circuit',
            isCircuit: true,
            estimatedDurationMin: 1200,
            estimatedDurationMax: 1500,
            trainingRounds: []
          }
        ]
      }

      const result = adaptApiLevelToLegacy(apiLevel)

      expect(result.weeks[0]['day1_strength'].goal).toBe('Fuerza/Skill Push')
      expect(result.weeks[0]['day3_circuit'].goal).toBe('Piernas + Prehab')
    })
  })

  describe('calculateWorkoutTime', () => {
    it('calcula tiempo para sesión con múltiples bloques', () => {
      const session = {
        blocks: [
          {
            isCircuit: true,
            circuitConfig: { rounds: 3, restBetweenRounds: '60s', restBetweenExercises: '15s' },
            exercises: [
              { reps: '10' },
              { reps: '12' }
            ]
          },
          {
            isCircuit: true,
            circuitConfig: { rounds: 2, restBetweenRounds: '60s', restBetweenExercises: '15s' },
            exercises: [
              { reps: '8' }
            ]
          }
        ]
      }

      const result = calculateWorkoutTime(session)
      expect(result.min).toBeGreaterThan(0)
      expect(result.max).toBeGreaterThanOrEqual(result.min)
    })
  })
})
