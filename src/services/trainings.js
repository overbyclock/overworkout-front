import { API_ENDPOINTS } from '@/utils/constants'
import apiClient from './api'

export const trainingService = {
  async getAll(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.TRAININGS.LIST, { params })
    return response.data
  },

  async getPublic() {
    const response = await apiClient.get(API_ENDPOINTS.TRAININGS.PUBLIC)
    return response.data
  },

  async getByUser(userId) {
    const response = await apiClient.get(
      API_ENDPOINTS.TRAININGS.USER_TRAININGS.replace('{userId}', userId)
    )
    return response.data
  },

  async getById(id) {
    const response = await apiClient.get(
      API_ENDPOINTS.TRAININGS.SHOW.replace('{id}', id)
    )
    return response.data
  },

  async create(data) {
    const response = await apiClient.post(API_ENDPOINTS.TRAININGS.CREATE, data)
    return response.data
  },

  async update(id, data) {
    const response = await apiClient.patch(
      API_ENDPOINTS.TRAININGS.UPDATE.replace('{id}', id),
      data
    )
    return response.data
  },

  async delete(id) {
    await apiClient.delete(API_ENDPOINTS.TRAININGS.DELETE.replace('{id}', id))
  },

  async getBenchmarks() {
    const response = await apiClient.get(API_ENDPOINTS.TRAININGS.LIST, { 
      params: { isBenchmark: true } 
    })
    return response.data
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
