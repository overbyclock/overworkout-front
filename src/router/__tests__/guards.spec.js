import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authGuard, onboardingGuard, roleRedirectGuard, guestOnlyGuard } from '@/router/guards'
import { STORAGE_KEYS, USER_ROLES } from '@/utils/constants'

describe('authGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('redirige al login si el usuario no está autenticado en una ruta protegida', () => {
    const store = useAuthStore()
    store.$patch({ isAuthenticated: false, user: null })

    const result = authGuard({ name: 'protected', meta: { requiresAuth: true } })

    expect(result).toEqual({ name: 'login' })
  })

  it('no redirige si el usuario autenticado tiene el rol requerido', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.ADMIN] },
    })

    const result = authGuard({
      name: 'admin',
      meta: { requiresAuth: true, requiresRole: USER_ROLES.ADMIN },
    })

    expect(result).toBeUndefined()
  })

  it('redirige a admin-dashboard si el usuario autenticado no tiene el rol requerido y es admin', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.ADMIN] },
    })

    const result = authGuard({
      name: 'user-area',
      meta: { requiresAuth: true, requiresRole: USER_ROLES.USER },
    })

    expect(result).toEqual({ name: 'admin-dashboard' })
  })

  it('redirige a user-home si el usuario autenticado no tiene el rol requerido y es user', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.USER] },
    })

    const result = authGuard({
      name: 'admin',
      meta: { requiresAuth: true, requiresRole: USER_ROLES.ADMIN },
    })

    expect(result).toEqual({ name: 'user-home' })
  })

  it('no redirige en una ruta pública sin requiresAuth', () => {
    const store = useAuthStore()
    store.$patch({ isAuthenticated: false, user: null })

    const result = authGuard({ name: 'public', meta: {} })

    expect(result).toBeUndefined()
  })
})

describe('roleRedirectGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('redirige al login si el usuario no está autenticado', () => {
    const store = useAuthStore()
    store.$patch({ isAuthenticated: false, user: null })

    const result = roleRedirectGuard()

    expect(result).toEqual({ name: 'login' })
  })

  it('redirige a admin-dashboard si el usuario es admin', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.ADMIN] },
    })

    const result = roleRedirectGuard()

    expect(result).toEqual({ name: 'admin-dashboard' })
  })

  it('redirige a user-home si el usuario es user', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.USER] },
    })

    const result = roleRedirectGuard()

    expect(result).toEqual({ name: 'user-home' })
  })
})

describe('guestOnlyGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('no redirige si el usuario no está autenticado', () => {
    const store = useAuthStore()
    store.$patch({ isAuthenticated: false, user: null })

    const result = guestOnlyGuard()

    expect(result).toBeUndefined()
  })

  it('redirige a admin-dashboard si el usuario autenticado es admin', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.ADMIN] },
    })

    const result = guestOnlyGuard()

    expect(result).toEqual({ name: 'admin-dashboard' })
  })

  it('redirige a user-home si el usuario autenticado es user', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: { roles: [USER_ROLES.USER] },
    })

    const result = guestOnlyGuard()

    expect(result).toEqual({ name: 'user-home' })
  })
})

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

  it('redirige a user-welcome si solo tiene trainingGoal (onboarding parcial)', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: {
        roles: [USER_ROLES.USER],
        trainingGoal: 'strength',
      },
    })

    const result = onboardingGuard({ name: 'some-protected-route' })

    expect(result).toEqual({ name: 'user-welcome' })
  })

  it('redirige a user-welcome si solo tiene estimatedLevel (onboarding parcial)', () => {
    const store = useAuthStore()
    store.$patch({
      isAuthenticated: true,
      user: {
        roles: [USER_ROLES.USER],
        estimatedLevel: 'beginner',
      },
    })

    const result = onboardingGuard({ name: 'some-protected-route' })

    expect(result).toEqual({ name: 'user-welcome' })
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
