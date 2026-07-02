import { API_ENDPOINTS } from '@/utils/constants'
import apiClient from './api'

/**
 * Servicio para gestionar el perfil, onboarding y progreso del usuario.
 */
export const userProfileService = {
  /**
   * Completa el onboarding inicial del usuario.
   * @param {Object} data - Datos del perfil y preferencias
   */
  async completeSetup(data) {
    const response = await apiClient.post(API_ENDPOINTS.USER_PROFILE.SETUP, data)
    return response.data
  },

  /**
   * Envía los resultados de la evaluación diagnóstica.
   * @param {Object} data - Resultados de los tests
   */
  async submitAssessment(data) {
    const response = await apiClient.post(API_ENDPOINTS.USER_PROFILE.ASSESSMENT, data)
    return response.data
  },

  /**
   * Obtiene todo el progreso del usuario actual.
   */
  async getProgress() {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROGRESS.GET)
    return response.data
  },

  /**
   * Obtiene el progreso activo actual.
   */
  async getActiveProgress() {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROGRESS.GET_ACTIVE)
    return response.data
  },

  /**
   * Obtiene la lista de programas activos del usuario.
   */
  async getActivePrograms() {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROGRESS.GET_ACTIVE_PROGRAMS)
    return response.data
  },

  /**
   * Inicia el progreso en un programa.
   * @param {number} programId
   */
  async initProgress(programId) {
    const url = API_ENDPOINTS.USER_PROGRESS.INIT.replace('{programId}', programId)
    const response = await apiClient.post(url)
    return response.data
  },

  /**
   * Cambia el programa activo del usuario, abandonando el anterior.
   * @param {number} programId
   */
  async switchProgram(programId) {
    const url = API_ENDPOINTS.USER_PROGRESS.SWITCH.replace('{programId}', programId)
    const response = await apiClient.post(url)
    return response.data
  },

  /**
   * Abandona un programa activo del usuario sin iniciar uno nuevo.
   * @param {number} programId
   */
  async abandonActiveProgram(programId) {
    const url = API_ENDPOINTS.USER_PROGRESS.ABANDON_ACTIVE.replace('{programId}', programId)
    const response = await apiClient.delete(url)
    return response.data
  },

  /**
   * Envía los resultados de un test de nivel.
   * @param {number} levelId
   * @param {Object} results
   */
  async submitTestResults(levelId, results) {
    const url = API_ENDPOINTS.USER_PROGRESS.TEST.replace('{levelId}', levelId)
    const response = await apiClient.post(url, results)
    return response.data
  },

  /**
   * Avanza una semana en el nivel actual.
   * @param {number} levelId
   */
  async advanceWeek(levelId) {
    const url = API_ENDPOINTS.USER_PROGRESS.ADVANCE_WEEK.replace('{levelId}', levelId)
    const response = await apiClient.post(url)
    return response.data
  },

  /**
   * Obtiene el siguiente entrenamiento pendiente o el que se puede continuar.
   */
  async getNextTraining() {
    const response = await apiClient.get(API_ENDPOINTS.TRAININGS.NEXT)
    return response.data
  },
}
