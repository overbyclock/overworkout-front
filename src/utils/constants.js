export const API_BASE_URL = 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },

  // Usuarios
  USERS: {
    LIST: '/users',
    SHOW: '/user/{id}',
    CREATE: '/register',
    UPDATE: '/user/{id}',
    DELETE: '/user/{id}',
  },

  // Ejercicios
  EXERCISES: {
    LIST: '/exercises',
    SHOW: '/exercises/{id}',
    CREATE: '/exercises',
    UPDATE: '/exercises/{id}',
    DELETE: '/exercises/{id}',
  },

  // Entrenamientos
  TRAININGS: {
    LIST: '/trainings',
    PUBLIC: '/trainings/public',
    USER_TRAININGS: '/trainings/user/{userId}',
    SHOW: '/trainings/{id}',
    CREATE: '/trainings',
    UPDATE: '/trainings/{id}',
    DELETE: '/trainings/{id}',
  },

  // Equipamiento
  EQUIPMENTS: {
    LIST: '/equipments',
    SHOW: '/equipments/{id}',
    CREATE: '/equipments',
    UPDATE: '/equipments/{id}',
    DELETE: '/equipments/{id}',
  },

  // Benchmarks
  BENCHMARKS: {
    LIST: '/benchmarks',
    SHOW: '/benchmarks/{id}',
    CREATE: '/benchmarks',
    UPDATE: '/benchmarks/{id}',
    DELETE: '/benchmarks/{id}',
    START_ATTEMPT: '/benchmarks/{id}/start',
    LOG_EXERCISE: '/benchmarks/attempts/{id}/log-exercise',
    FINISH_ATTEMPT: '/benchmarks/attempts/{id}/finish',
  },

  // Progreso del usuario
  USER_PROGRESS: {
    GET: '/user/progress',
    GET_ACTIVE: '/user/progress/active',
    GET_ACTIVE_PROGRAMS: '/user/programs/active',
    INIT: '/user/progress/init/{programId}',
    SWITCH: '/user/programs/{programId}/switch',
    ABANDON_ACTIVE: '/user/programs/active/{programId}',
    TEST: '/user/progress/{levelId}/test',
    ADVANCE_WEEK: '/user/progress/{levelId}/advance-week',
  },

  // Perfil y setup del usuario
  USER_PROFILE: {
    SETUP: '/user/profile/setup',
    ASSESSMENT: '/user/profile/assessment',
  },

  // Estadísticas del usuario
  USER_STATS: {
    DASHBOARD: '/user/stats',
    COMPLETE_TRAINING: '/user/trainings/{trainingId}/complete',
  },

  // Favoritos
  FAVORITES: {
    LIST: '/user/favorites',
    ADD_TRAINING: '/user/favorites/trainings/{trainingId}',
    REMOVE_TRAINING: '/user/favorites/trainings/{favoriteId}',
    ADD_PROGRAM: '/user/favorites/programs/{programId}',
    REMOVE_PROGRAM: '/user/favorites/programs/{favoriteId}',
  },
}

export const STORAGE_KEYS = {
  TOKEN: 'overworkout_token',
  USER: 'overworkout_user',
  EXPIRES_AT: 'overworkout_expires_at',
  ONBOARDING_SKIPPED: 'overworkout_onboarding_skipped',
}

export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
}

// Objetivos de entrenamiento para onboarding
export const TRAINING_GOALS = [
  {
    value: 'strength',
    label: 'Ganar fuerza',
    icon: 'fitness_center',
    desc: 'Aumentar tu fuerza base y progresar en ejercicios fundamentales',
  },
  {
    value: 'muscle',
    label: 'Ganar músculo',
    icon: 'sports_gymnastics',
    desc: 'Hipertrofia y desarrollo muscular equilibrado',
  },
  {
    value: 'skills',
    label: 'Dominar skills',
    icon: 'stars',
    desc: 'Handstand, muscle-up, front lever, planche...',
  },
  {
    value: 'fat_loss',
    label: 'Pérdida de grasa',
    icon: 'local_fire_department',
    desc: 'Entrenamientos de alta intensidad y quema de calorías',
  },
  {
    value: 'general',
    label: 'Mejorar general',
    icon: 'health_and_safety',
    desc: 'Condición física completa y salud',
  },
]

// Niveles estimados para onboarding
export const ESTIMATED_LEVELS = [
  {
    value: 'beginner',
    label: 'Principiante',
    icon: 'seedling',
    desc: 'Pocos meses entrenando o empezando de cero',
  },
  {
    value: 'intermediate',
    label: 'Intermedio',
    icon: 'trending_up',
    desc: 'Llevo 1-2 años entrenando con constancia',
  },
  {
    value: 'advanced',
    label: 'Avanzado',
    icon: 'military_tech',
    desc: 'Varios años de experiencia y buena base',
  },
]

// Tests de evaluación diagnóstica
export const ASSESSMENT_TESTS = [
  {
    id: 'max_pullups',
    name: 'Máximo dominadas',
    unit: 'reps',
    minimum: { beginner: 1, intermediate: 8, advanced: 15 },
  },
  {
    id: 'max_pushups',
    name: 'Máximo flexiones',
    unit: 'reps',
    minimum: { beginner: 5, intermediate: 25, advanced: 50 },
  },
  {
    id: 'squat_test',
    name: 'Sentadillas en 1 min',
    unit: 'reps',
    minimum: { beginner: 15, intermediate: 30, advanced: 50 },
  },
  {
    id: 'plank_hold',
    name: 'Plancha frontal',
    unit: 'seconds',
    minimum: { beginner: 20, intermediate: 60, advanced: 120 },
  },
]

// Campos del perfil editable por el usuario
export const USER_PROFILE_FIELDS = {
  nick: 'nick',
  avatar: 'avatar',
  birthDate: 'birthDate',
  gender: 'gender',
  weightKg: 'weightKg',
  heightCm: 'heightCm',
  trainingGoal: 'trainingGoal',
  trainingLocation: 'trainingLocation',
  estimatedLevel: 'estimatedLevel',
}
