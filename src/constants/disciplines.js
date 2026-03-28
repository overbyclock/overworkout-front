/**
 * Constantes para disciplinas deportivas
 */

export const DISCIPLINES = {
  CALISTHENICS: 'calisthenics',
  CROSSFIT: 'crossfit',
  FITNESS: 'fitness',
  WEIGHTLIFTING: 'weightlifting',
  POWERLIFTING: 'powerlifting',
  GYMNASTICS: 'gymnastics',
  YOGA: 'yoga',
  RUNNING: 'running',
  SWIMMING: 'swimming',
  CYCLING: 'cycling',
  OTHER: 'other',
}

export const DISCIPLINE_LABELS = {
  [DISCIPLINES.CALISTHENICS]: 'Calistenia',
  [DISCIPLINES.CROSSFIT]: 'CrossFit',
  [DISCIPLINES.FITNESS]: 'Fitness',
  [DISCIPLINES.WEIGHTLIFTING]: 'Halterofilia',
  [DISCIPLINES.POWERLIFTING]: 'Powerlifting',
  [DISCIPLINES.GYMNASTICS]: 'Gimnasia',
  [DISCIPLINES.YOGA]: 'Yoga',
  [DISCIPLINES.RUNNING]: 'Running',
  [DISCIPLINES.SWIMMING]: 'Natación',
  [DISCIPLINES.CYCLING]: 'Ciclismo',
  [DISCIPLINES.OTHER]: 'Otro',
}

export const DISCIPLINE_ICONS = {
  [DISCIPLINES.CALISTHENICS]: 'self_improvement',
  [DISCIPLINES.CROSSFIT]: 'fitness_center',
  [DISCIPLINES.FITNESS]: 'sports_gymnastics',
  [DISCIPLINES.WEIGHTLIFTING]: 'sports_martial_arts',
  [DISCIPLINES.POWERLIFTING]: 'sports_martial_arts',
  [DISCIPLINES.GYMNASTICS]: 'sports_gymnastics',
  [DISCIPLINES.YOGA]: 'self_improvement',
  [DISCIPLINES.RUNNING]: 'directions_run',
  [DISCIPLINES.SWIMMING]: 'pool',
  [DISCIPLINES.CYCLING]: 'pedal_bike',
  [DISCIPLINES.OTHER]: 'sports',
}

export const DISCIPLINE_GRADIENTS = {
  [DISCIPLINES.CALISTHENICS]: 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
  [DISCIPLINES.CROSSFIT]: 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
  [DISCIPLINES.FITNESS]: 'linear-gradient(135deg, #9f7aea 0%, #ed64a6 100%)',
  [DISCIPLINES.WEIGHTLIFTING]: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
  [DISCIPLINES.POWERLIFTING]: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
}

export const DISCIPLINE_OPTIONS = Object.entries(DISCIPLINE_LABELS).map(([value, label]) => ({
  value,
  label,
}))

/**
 * Obtiene el label traducido de una disciplina
 * @param {string} discipline - Valor de la disciplina
 * @returns {string} Label traducido
 */
export function getDisciplineLabel(discipline) {
  return DISCIPLINE_LABELS[discipline] || discipline || 'Desconocido'
}

/**
 * Obtiene el icono correspondiente a una disciplina
 * @param {string} discipline - Valor de la disciplina
 * @returns {string} Nombre del icono
 */
export function getDisciplineIcon(discipline) {
  return DISCIPLINE_ICONS[discipline] || 'sports'
}

/**
 * Obtiene el gradient CSS de una disciplina
 * @param {string} discipline - Valor de la disciplina
 * @returns {string} Gradiente CSS
 */
export function getDisciplineGradient(discipline) {
  return DISCIPLINE_GRADIENTS[discipline] || DISCIPLINE_GRADIENTS[DISCIPLINES.FITNESS]
}
