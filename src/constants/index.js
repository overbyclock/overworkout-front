/**
 * Constantes de dominio centralizadas
 * 
 * Este módulo exporta todas las constantes de negocio para evitar
 * hardcodeo de valores en las vistas y componentes.
 */

// Muscle Groups
export {
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  MUSCLE_GROUP_OPTIONS,
  getMuscleGroupLabel,
} from './muscleGroups'

// Levels
export {
  LEVELS,
  LEVEL_LABELS,
  LEVEL_COLORS,
  LEVEL_ORDER,
  LEVEL_OPTIONS,
  getLevelLabel,
  getLevelColor,
  compareLevels,
} from './levels'

// Disciplines
export {
  DISCIPLINES,
  DISCIPLINE_LABELS,
  DISCIPLINE_ICONS,
  DISCIPLINE_GRADIENTS,
  DISCIPLINE_OPTIONS,
  getDisciplineLabel,
  getDisciplineIcon,
  getDisciplineGradient,
} from './disciplines'
