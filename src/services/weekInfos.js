import apiClient from './api'

const BASE_URL = '/training-week-infos'

export const weekInfoService = {
  async getAll(params = {}) {
    const response = await apiClient.get(BASE_URL, { params })
    return response.data
  },

  async getById(id) {
    const response = await apiClient.get(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(data) {
    const response = await apiClient.post(BASE_URL, data)
    return response.data
  },

  async update(id, data) {
    const response = await apiClient.patch(`${BASE_URL}/${id}`, data)
    return response.data
  },

  async delete(id) {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
