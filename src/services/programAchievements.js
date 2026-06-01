import apiClient from './api'

const BASE_URL = '/training-programs'

export const programAchievementService = {
  async getByProgram(programId) {
    const response = await apiClient.get(`${BASE_URL}/${programId}/achievements`)
    return response.data
  },
}
