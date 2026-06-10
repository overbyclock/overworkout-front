import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserProfileStore } from '../userProfile'

/**
 * Tests for UserProfile Store
 */
describe('UserProfile Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct default state', () => {
    const store = useUserProfileStore()

    expect(store.profile).toBeNull()
    expect(store.progress).toEqual([])
    expect(store.activeProgress).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.onboardingCompleted).toBe(false)
    expect(store.assessmentCompleted).toBe(false)
  })

  it('has required getters', () => {
    const store = useUserProfileStore()

    expect(store).toHaveProperty('hasActiveProgram')
    expect(store).toHaveProperty('currentLevel')
    expect(store).toHaveProperty('currentProgram')
    expect(store).toHaveProperty('streakDays')
    expect(store).toHaveProperty('userXp')
  })

  it('has required actions', () => {
    const store = useUserProfileStore()

    expect(typeof store.completeSetup).toBe('function')
    expect(typeof store.submitAssessment).toBe('function')
    expect(typeof store.fetchProgress).toBe('function')
    expect(typeof store.fetchActiveProgress).toBe('function')
    expect(typeof store.initProgram).toBe('function')
    expect(typeof store.reset).toBe('function')
  })

  it('setProfile updates profile state', () => {
    const store = useUserProfileStore()
    const mockProfile = { nick: 'Alex', trainingGoal: 'strength' }

    store.setProfile(mockProfile)

    expect(store.profile).toEqual(mockProfile)
  })
})
