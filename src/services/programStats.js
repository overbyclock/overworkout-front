import apiClient from './api'

const BASE_URL = '/training-programs'

export const programStatsService = {
  async getStats(programId) {
    const response = await apiClient.get(`${BASE_URL}/${programId}/stats`)
    return response.data
  },
}
