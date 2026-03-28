/**
 * Constantes para niveles de dificultad
 */

export const LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  EXPERT: 'expert',
  NO_LEVEL: 'nolevel',
}

export const LEVEL_LABELS = {
  [LEVELS.BEGINNER]: 'Principiante',
  [LEVELS.INTERMEDIATE]: 'Intermedio',
  [LEVELS.EXPERT]: 'Experto',
  [LEVELS.NO_LEVEL]: 'Sin nivel',
}

export const LEVEL_COLORS = {
  [LEVELS.BEGINNER]: 'positive',
  [LEVELS.INTERMEDIATE]: 'warning',
  [LEVELS.EXPERT]: 'negative',
  [LEVELS.NO_LEVEL]: 'grey',
}

export const LEVEL_ORDER = [
  LEVELS.BEGINNER,
  LEVELS.INTERMEDIATE,
  LEVELS.EXPERT,
  LEVELS.NO_LEVEL,
]

export const LEVEL_OPTIONS = Object.entries(LEVEL_LABELS).map(([value, label]) => ({
  value,
  label,
}))

/**
 * Obtiene el label traducido de un nivel
 * @param {string} level - Valor del nivel
 * @returns {string} Label traducido
 */
export function getLevelLabel(level) {
  return LEVEL_LABELS[level] || level || 'Desconocido'
}

/**
 * Obtiene el color Quasar correspondiente a un nivel
 * @param {string} level - Valor del nivel
 * @returns {string} Nombre del color Quasar
 */
export function getLevelColor(level, isActive = true) {
  if (!isActive) return 'grey-6'
  return LEVEL_COLORS[level] || 'primary'
}

/**
 * Compara dos niveles para ordenamiento
 * @param {string} levelA - Primer nivel
 * @param {string} levelB - Segundo nivel
 * @returns {number} -1, 0, 1 para ordenamiento
 */
export function compareLevels(levelA, levelB) {
  const indexA = LEVEL_ORDER.indexOf(levelA)
  const indexB = LEVEL_ORDER.indexOf(levelB)
  return indexA - indexB
}
