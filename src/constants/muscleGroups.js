/**
 * Constantes para grupos musculares
 */

export const MUSCLE_GROUPS = {
  CHEST: 'chest',
  BACK: 'back',
  LEGS: 'legs',
  GLUTES: 'glutes',
  HAMSTRINGS: 'hamstrings',
  CALVES: 'calves',
  ADDUCTORS: 'adductors',
  SHOULDERS: 'shoulders',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  FOREARMS: 'forearms',
  CORE: 'core',
  HIIT: 'hiit',
  NONE: 'none',
}

export const MUSCLE_GROUP_LABELS = {
  [MUSCLE_GROUPS.CHEST]: 'Pecho',
  [MUSCLE_GROUPS.BACK]: 'Espalda',
  [MUSCLE_GROUPS.LEGS]: 'Piernas',
  [MUSCLE_GROUPS.GLUTES]: 'Glúteos',
  [MUSCLE_GROUPS.HAMSTRINGS]: 'Isquiotibiales',
  [MUSCLE_GROUPS.CALVES]: 'Gemelos',
  [MUSCLE_GROUPS.ADDUCTORS]: 'Aductores',
  [MUSCLE_GROUPS.SHOULDERS]: 'Hombros',
  [MUSCLE_GROUPS.BICEPS]: 'Bíceps',
  [MUSCLE_GROUPS.TRICEPS]: 'Tríceps',
  [MUSCLE_GROUPS.FOREARMS]: 'Antebrazos',
  [MUSCLE_GROUPS.CORE]: 'Core',
  [MUSCLE_GROUPS.HIIT]: 'HIIT/Cardio',
  [MUSCLE_GROUPS.NONE]: 'Ninguno',
}

export const MUSCLE_GROUP_OPTIONS = Object.entries(MUSCLE_GROUP_LABELS).map(([value, label]) => ({
  value,
  label,
}))

/**
 * Obtiene el label traducido de un grupo muscular
 * @param {string} group - Valor del grupo muscular
 * @returns {string} Label traducido
 */
export function getMuscleGroupLabel(group) {
  return MUSCLE_GROUP_LABELS[group] || group || 'Desconocido'
}
