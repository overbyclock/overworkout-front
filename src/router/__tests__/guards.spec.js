import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { onboardingGuard } from '@/router/guards'
import { STORAGE_KEYS, USER_ROLES } from '@/utils/constants'

describe('onboardingGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('no redirige si el usuario no está autenticado', () => {
    const store = useAuthStore()
    store.$patch({ isAuthenticated: false, user: null })

    const result = onboardingGuard({ name: 'user-home' })

    expect(result).toBeUndefined()
  })

  it('no redirige si el usuario es administrador', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.ADMIN] },
    })

    const result = onboardingGuard({ name: 'user-home' })

    expect(result).toBeUndefined()
  })

  it('no redirige si el usuario ya completó el onboarding', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: {
        roles: [USER_ROLES.USER],
        trainingGoal: 'strength',
        estimatedLevel: 'beginner',
      },
    })

    const result = onboardingGuard({ name: 'some-protected-route' })

    expect(result).toBeUndefined()
  })

  it('no redirige si el usuario saltó el onboarding', () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SKIPPED, 'true')
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.USER] },
    })

    const result = onboardingGuard({ name: 'some-protected-route' })

    expect(result).toBeUndefined()
  })

  it('redirige a user-welcome si el onboarding está incompleto y la ruta no está permitida', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.USER] },
    })

    const result = onboardingGuard({ name: 'some-protected-route' })

    expect(result).toEqual({ name: 'user-welcome' })
  })

  it.each([
    'user-welcome',
    'user-onboarding-goal',
    'user-onboarding-level',
    'user-onboarding-stats',
    'user-assessment',
    'user-home',
    'user-programs',
    'user-explore',
    'user-achievements',
    'user-profile',
  ])('no redirige en la ruta permitida "%s" con onboarding incompleto', (routeName) => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.USER] },
    })

    const result = onboardingGuard({ name: routeName })

    expect(result).toBeUndefined()
  })
})
