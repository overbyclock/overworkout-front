import { useAuthStore } from '@/stores/auth'
import { USER_ROLES } from '@/utils/constants'

export const authGuard = (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo al login')
      return { name: 'login' }
    }

    if (to.meta.requiresRole) {
      const userRoles = authStore.user?.roles || []
      const requiredRole = to.meta.requiresRole

      if (!userRoles.includes(requiredRole)) {
        console.log(`Usuario sin permisos. Rol requerido: ${requiredRole}`)

        if (userRoles.includes(USER_ROLES.ADMIN)) {
          return { name: 'admin-dashboard' }
        } else {
          return { name: 'user-home' }
        }
      }
    }
  }
}

export const roleRedirectGuard = () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return { name: 'login' }
  }

  const userRoles = authStore.user?.roles || []

  if (userRoles.includes(USER_ROLES.ADMIN)) {
    console.log('Usuario admin detectado, redirigiendo a dashboard admin')
    return { name: 'admin-dashboard' }
  } else {
    console.log('Usuario normal detectado, redirigiendo a home usuario')
    return { name: 'user-home' }
  }
}

export const guestOnlyGuard = () => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    const userRoles = authStore.user?.roles || []

    if (userRoles.includes(USER_ROLES.ADMIN)) {
      return { name: 'admin-dashboard' }
    } else {
      return { name: 'user-home' }
    }
  }
}
