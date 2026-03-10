export const API_BASE_URL = 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register'
  },

  // Usuarios
  USERS: {
    LIST: '/api/users',
    SHOW: '/api/user/{id}',
    CREATE: '/register',  // Usamos el endpoint de registro para crear usuarios
    UPDATE: '/api/user/{id}',
    DELETE: '/api/user/{id}'
  },

  // Ejercicios
  EXERCISES: {
    LIST: '/api/exercises',
    SHOW: '/api/exercises/{id}',
    CREATE: '/api/exercises',
    UPDATE: '/api/exercises/{id}',
    DELETE: '/api/exercises/{id}'
  },

  // Entrenamientos
  TRAININGS: {
    LIST: '/api/trainings',
    PUBLIC: '/api/trainings/public',
    USER_TRAININGS: '/api/trainings/user/{userId}',
    SHOW: '/api/trainings/{id}',
    CREATE: '/api/trainings',
    UPDATE: '/api/trainings/{id}',
    DELETE: '/api/trainings/{id}'
  },

  // Equipamiento
  EQUIPMENTS: {
    LIST: '/api/equipments',
    SHOW: '/api/equipments/{id}',
    CREATE: '/api/equipments',
    UPDATE: '/api/equipments/{id}',
    DELETE: '/api/equipments/{id}'
  },

  // API Platform específicos
  API_PLATFORM: {
    DOCS: '/api/docs.{_format}',
    ENTRYPOINT: '/api/{index}.{_format}',
    CONTEXTS: '/api/contexts/{shortName}.{_format}'
  }
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
