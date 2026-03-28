export const API_BASE_URL = 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register'
  },

  // Usuarios
  USERS: {
    LIST: '/users',
    SHOW: '/user/{id}',
    CREATE: '/register',
    UPDATE: '/user/{id}',
    DELETE: '/user/{id}'
  },

  // Ejercicios
  EXERCISES: {
    LIST: '/exercises',
    SHOW: '/exercises/{id}',
    CREATE: '/exercises',
    UPDATE: '/exercises/{id}',
    DELETE: '/exercises/{id}'
  },

  // Entrenamientos
  TRAININGS: {
    LIST: '/trainings',
    PUBLIC: '/trainings/public',
    USER_TRAININGS: '/trainings/user/{userId}',
    SHOW: '/trainings/{id}',
    CREATE: '/trainings',
    UPDATE: '/trainings/{id}',
    DELETE: '/trainings/{id}'
  },

  // Equipamiento
  EQUIPMENTS: {
    LIST: '/equipments',
    SHOW: '/equipments/{id}',
    CREATE: '/equipments',
    UPDATE: '/equipments/{id}',
    DELETE: '/equipments/{id}'
  },
}

export const STORAGE_KEYS = {
  TOKEN: 'overworkout_token',
  USER: 'overworkout_user',
  EXPIRES_AT: 'overworkout_expires_at',
}

export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
}
