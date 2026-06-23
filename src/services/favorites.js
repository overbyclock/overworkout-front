import { API_ENDPOINTS } from '@/utils/constants'
import apiClient from './api'

export const favoritesService = {
  async getFavorites() {
    const response = await apiClient.get(API_ENDPOINTS.FAVORITES.LIST)
    return response.data
  },

  async addTrainingFavorite(trainingId) {
    const url = API_ENDPOINTS.FAVORITES.ADD_TRAINING.replace('{trainingId}', trainingId)
    const response = await apiClient.post(url)
    return response.data
  },

  async removeTrainingFavorite(favoriteId) {
    const url = API_ENDPOINTS.FAVORITES.REMOVE_TRAINING.replace('{favoriteId}', favoriteId)
    await apiClient.delete(url)
  },

  async addProgramFavorite(programId) {
    const url = API_ENDPOINTS.FAVORITES.ADD_PROGRAM.replace('{programId}', programId)
    const response = await apiClient.post(url)
    return response.data
  },

  async removeProgramFavorite(favoriteId) {
    const url = API_ENDPOINTS.FAVORITES.REMOVE_PROGRAM.replace('{favoriteId}', favoriteId)
    await apiClient.delete(url)
  },
}
