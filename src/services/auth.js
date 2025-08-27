import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants'
import { LocalStorage } from 'quasar'
import apiClient from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      const { token, userId, nick, avatar, roles, expiresAt } = response.data

      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString())
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({
          id: userId,
          nick,
          avatar,
          roles,
        }),
      )

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    LocalStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)
  },

  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT)

    if (!token || !expiresAt) {
      return false
    }

    const now = Math.floor(Date.now() / 1000)
    return parseInt(expiresAt) > now
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  },

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Error en el servidor'
      return new Error(message)
    } else if (error.request) {
      return new Error('Error de conexión. Verifica tu conexión a internet')
    } else {
      return new Error('Error inesperado')
    }
  },
}
