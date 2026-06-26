import { API_ENDPOINTS } from '@/utils/constants'
import apiClient from './api'

/**
 * Servicio para consultar y registrar estadísticas de entrenamiento del usuario.
 */
export const userStatsService = {
  /**
   * Obtiene las estadísticas del dashboard del usuario autenticado.
   * @returns {Promise<{streakDays: number, weeklyWorkouts: number, xp: number, totalWorkouts: number, athleteLevel: number}>}
   */
  async getDashboardStats() {
    const response = await apiClient.get(API_ENDPOINTS.USER_STATS.DASHBOARD)
    return response.data
  },

  /**
   * Marca un entrenamiento como completado y devuelve el log + stats actualizadas.
   *
   * @param {number|string} trainingId
   * @param {Object} payload - Datos opcionales (durationSeconds, source, xp, completedAt)
   */
  async completeTraining(trainingId, payload = {}) {
    const url = API_ENDPOINTS.USER_STATS.COMPLETE_TRAINING.replace('{trainingId}', trainingId)
    const response = await apiClient.post(url, payload)
    return response.data
  },
}
