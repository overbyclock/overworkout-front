import { API_ENDPOINTS } from '@/utils/constants'
import apiClient from './api'

export const userService = {
  async getAll(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params })
    return response.data
  },

  async getById(id) {
    const response = await apiClient.get(
      API_ENDPOINTS.USERS.SHOW.replace('{id}', id)
    )
    return response.data
  },

  async create(data) {
    // Usamos el endpoint de registro para crear usuarios
    const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, data)
    return response.data
  },

  async update(id, data) {
    const response = await apiClient.patch(
      API_ENDPOINTS.USERS.UPDATE.replace('{id}', id),
      data
    )
    return response.data
  },

  async delete(id) {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE.replace('{id}', id))
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
