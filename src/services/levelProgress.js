import apiClient from './api'

const BASE_URL = '/user/progress'

export const levelProgressService = {
  async getAll() {
    const response = await apiClient.get(BASE_URL)
    return response.data
  },

  async getActive() {
    const response = await apiClient.get(`${BASE_URL}/active`)
    return response.data
  },

  async submitTest(levelId, results, requirements, notes = '') {
    const response = await apiClient.post(`${BASE_URL}/${levelId}/test`, {
      results,
      requirements,
      notes,
    })
    return response.data
  },

  async advanceWeek(levelId) {
    const response = await apiClient.post(`${BASE_URL}/${levelId}/advance-week`)
    return response.data
  },

  async initialize(programId) {
    const response = await apiClient.post(`${BASE_URL}/init/${programId}`)
    return response.data
  },
}
