import { authService } from '@/services/auth'
import { USER_ROLES } from '@/utils/constants'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
  getters: {
    isAdmin: (state) => {
      return state.user?.roles?.includes(USER_ROLES.ADMIN) || false
    },
    userInitials: (state) => {
      if (!state.user?.nick) return 'U'
      const names = state.user.nick.split(' ')
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase()
      }
      return names[0].substring(0, 2).toUpperCase()
    },
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(credentials)

        this.token = response.token
        this.user = {
          id: response.userId,
          nick: response.nick,
          avatar: response.avatar,
          roles: response.roles,
        }
        this.isAuthenticated = true

        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      authService.logout()
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
    },

    initializeAuth() {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser()
        if (user) {
          this.user = user
          this.isAuthenticated = true
        }
      }
    },
  },
})
