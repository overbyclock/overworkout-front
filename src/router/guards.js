import { useAuthStore } from '@/stores/auth'
import { USER_ROLES } from '@/utils/constants'

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo al login')
      return next({ name: 'login' })
    }

    if (to.meta.requiresRole) {
      const userRoles = authStore.user?.roles || []
      const requiredRole = to.meta.requiresRole

      if (!userRoles.includes(requiredRole)) {
        console.log(`Usuario sin permisos. Rol requerido: ${requiredRole}`)

        if (userRoles.includes(USER_ROLES.ADMIN)) {
          return next({ name: 'admin-dashboard' })
        } else {
          return next({ name: 'user-home' })
        }
      }
    }
  }
  next()
}

export const roleRedirectGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  const userRoles = authStore.user?.roles || []

  if (userRoles.includes(USER_ROLES.ADMIN)) {
    console.log('Usuario admin detectado, redirigiendo a dashboard admin')
    next({ name: 'admin-dashboard' })
  } else {
    console.log('Usuario normal detectado, redirigiendo a home usuario')
    next({ name: 'user-home' })
  }
}

export const guestOnlyGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    const userRoles = authStore.user?.roles || []

    if (userRoles.includes(USER_ROLES.ADMIN)) {
      return next({ name: 'admin-dashboard' })
    } else {
      return next({ name: 'user-home' })
    }
  }
  next()
}
