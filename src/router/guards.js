import { useAuthStore } from '@/stores/auth'
import { STORAGE_KEYS, USER_ROLES } from '@/utils/constants'

/**
 * Devuelve la ruta por defecto según los roles del usuario.
 */
const getDefaultRoute = (roles) => {
  return roles.includes(USER_ROLES.ADMIN) ? { name: 'admin-dashboard' } : { name: 'user-home' }
}

/**
 * Verifica si el usuario ha completado el onboarding básico.
 * Usamos trainingGoal como indicador principal.
 * También permite usuarios que hayan elegido saltarlo.
 */
const hasCompletedOnboarding = (authStore) => {
  if (!authStore.isAuthenticated) return false

  // Si el usuario explícitamente saltó el onboarding, respetamos su decisión
  const skipped = localStorage.getItem(STORAGE_KEYS.ONBOARDING_SKIPPED)
  if (skipped === 'true') return true

  const user = authStore.user
  if (!user) return false
  // Si no tiene trainingGoal ni estimatedLevel, no ha completado onboarding
  return !!(user.trainingGoal && user.estimatedLevel)
}

/**
 * Lista de rutas de onboarding (para no redirigir en bucle).
 */
const ONBOARDING_ROUTES = [
  'user-welcome',
  'user-onboarding-goal',
  'user-onboarding-level',
  'user-onboarding-stats',
  'user-assessment',
]

export const authGuard = (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Usuario no autenticado, redirigir al login
      return { name: 'login' }
    }

    if (to.meta.requiresRole) {
      const userRoles = authStore.user?.roles || []
      const requiredRole = to.meta.requiresRole

      if (!userRoles.includes(requiredRole)) {
        // Usuario sin permisos. Rol requerido: requiredRole
        return getDefaultRoute(userRoles)
      }
    }
  }
}

/**
 * Redirige a onboarding si el usuario no ha completado su perfil inicial.
 * Solo aplica a usuarios con ROLE_USER que intenten acceder a rutas normales.
 * Si ya completó onboarding pero no tiene programa, lo deja navegar libremente
 * (el Dashboard mostrará CTA al catálogo de programas).
 */
export const onboardingGuard = (to) => {
  const authStore = useAuthStore()

  // Solo aplicar a usuarios autenticados con rol USER
  if (!authStore.isAuthenticated) return
  const userRoles = authStore.user?.roles || []
  if (!userRoles.includes(USER_ROLES.USER)) return

  // No redirigir si ya está en una ruta de onboarding o en las rutas principales navegables
  const allowedRoutesWithoutOnboarding = [
    ...ONBOARDING_ROUTES,
    'user-home',
    'user-programs',
    'user-explore',
    'user-achievements',
    'user-profile',
  ]
  if (allowedRoutesWithoutOnboarding.includes(to.name)) return

  // Si no ha completado onboarding (ni siquiera lo saltó), redirigir a bienvenida
  if (!hasCompletedOnboarding(authStore)) {
    // Onboarding incompleto, redirigir a bienvenida
    return { name: 'user-welcome' }
  }
}

export const roleRedirectGuard = () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return { name: 'login' }
  }

  const userRoles = authStore.user?.roles || []

  // Usuario admin detectado, redirigir a dashboard admin
  // Usuario normal detectado, redirigir a home usuario
  return getDefaultRoute(userRoles)
}

export const guestOnlyGuard = () => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    const userRoles = authStore.user?.roles || []
    return getDefaultRoute(userRoles)
  }
}
