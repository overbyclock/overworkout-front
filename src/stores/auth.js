import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/auth'
import { USER_ROLES } from '@/utils/constants'
import { extractErrorMessage } from '@/utils/api-helpers'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAdmin = computed(() => {
    return user.value?.roles?.includes(USER_ROLES.ADMIN) || false
  })

  const userInitials = computed(() => {
    if (!user.value?.nick) return 'U'
    const names = user.value.nick.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  })

  const userDisplayName = computed(() => {
    return user.value?.nick || 'Usuario'
  })

  const hasRole = (role) => {
    return user.value?.roles?.includes(role) || false
  }

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      token.value = response.token
      // El backend devuelve el usuario anidado en response.user
      const userData = response.user || {}
      user.value = {
        id: userData.id || response.userId,
        nick: userData.nick || response.nick,
        avatar: userData.avatar || response.avatar,
        roles: userData.roles || response.roles,
      }
      isAuthenticated.value = true

      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    token.value = null
    isAuthenticated.value = false
    error.value = null
  }

  const initializeAuth = () => {
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        user.value = currentUser
        isAuthenticated.value = true
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Getters
    isAdmin,
    userInitials,
    userDisplayName,
    hasRole,
    
    // Actions
    login,
    logout,
    initializeAuth,
    clearError,
    updateUser,
  }
})
