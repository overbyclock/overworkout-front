import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    // No enviar token en el endpoint de login
    const isLoginRequest = config.url?.includes('/login')
    if (token && !isLoginRequest) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)

      const isLoginRequest = error.config?.url?.includes('/login')
      if (isLoginRequest) return Promise.reject(error)

      const baseUrl = import.meta.env.BASE_URL || '/'
      const loginPath = baseUrl.endsWith('/') ? baseUrl + 'login' : baseUrl + '/login'

      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
