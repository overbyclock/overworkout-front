import nivel1Fundamentos from '@/data/calistenia-master-program'
import nivel2Intermedio from '@/data/calistenia-master-level2'

const staticLevels = {
  1: nivel1Fundamentos,
  2: nivel2Intermedio,
}

/**
 * Normaliza los datos estáticos legacy (weeks01, week2, week3...)
 * a la estructura weeks[weekNum][dayKey]
 */
function normalizeStaticWeeks(staticLevel) {
  const weeks = {}

  if (staticLevel.weeks01) {
    weeks[0] = staticLevel.weeks01
    weeks[1] = staticLevel.weeks01
  }

  Object.keys(staticLevel).forEach((key) => {
    if (key.startsWith('week') && key !== 'weeks01') {
      const weekNum = parseInt(key.replace('week', ''), 10)
      if (!Number.isNaN(weekNum)) {
        weeks[weekNum] = staticLevel[key]
      }
    }
  })

  return weeks
}

function findStaticExercise(staticSession, exerciseId) {
  if (!staticSession?.exercises) return null
  return staticSession.exercises.find((ex) => ex.id === exerciseId) || null
}

function mergeSession(apiSession, staticSession) {
  const round = apiSession.trainingRounds?.[0]
  const configs = round?.trainingExerciseConfigurations || []

  const exercises = configs.map((cfg) => {
    const staticEx = findStaticExercise(staticSession, cfg.exercise?.id)
    return {
      id: cfg.exercise?.id,
      name: cfg.exercise?.name,
      reps: cfg.reps ? String(cfg.reps) : cfg.maxTimeForReps ? `${cfg.maxTimeForReps}s` : '',
      difficulty: cfg.exercise?.difficultyRating || 1,
      notes: staticEx?.notes || '',
      videoSearch: staticEx?.videoSearch || null,
    }
  })

  return {
    name: staticSession?.name || apiSession.name,
    goal: staticSession?.goal || inferGoal(apiSession.dayKey),
    muscleGroups: staticSession?.muscleGroups || inferMuscleGroups(apiSession.dayKey),
    duration: staticSession?.duration || '',
    isCircuit: apiSession.isCircuit ?? false,
    circuitConfig: round
      ? {
          rounds: round.setsForRound ?? apiSession.rounds ?? 3,
          restBetweenRounds: formatSeconds(round.restBetweenRounds),
          restBetweenExercises: formatSeconds(
            configs[0]?.restBetweenExercises || configs[0]?.restBetweenSets || 30
          ),
        }
      : null,
    exercises,
  }
}

/**
 * Adapta los datos de un TrainingLevel desde la API al formato legacy
 * que esperan los componentes LevelDetail y WeekPanel.
 * Hace merge con datos estáticos de enriquecimiento (notes, tips, tests, etc.)
 */
export function adaptApiLevelToLegacy(apiLevel) {
  const staticLevel = staticLevels[apiLevel.levelNumber]
  const staticWeeks = staticLevel ? normalizeStaticWeeks(staticLevel) : {}
  const apiTrainings = apiLevel.trainings || []

  // Si no hay datos ni de API ni estáticos, retornar null
  if (!apiTrainings.length && !staticLevel) {
    return null
  }

  const weeks = {}

  // 1. Poblar con datos de la API (mergeados con estático)
  apiTrainings.forEach((t) => {
    const weekNum = t.weekNumber ?? 0
    if (!weeks[weekNum]) weeks[weekNum] = {}
    const staticSession = staticWeeks[weekNum]?.[t.dayKey]
    weeks[weekNum][t.dayKey] = mergeSession(t, staticSession)
  })

  // 2. Para niveles sin datos en API (2+), usar estático como fallback completo
  if (staticLevel) {
    Object.keys(staticWeeks).forEach((weekNumStr) => {
      const weekNum = Number(weekNumStr)
      if (!weeks[weekNum]) weeks[weekNum] = {}
      Object.keys(staticWeeks[weekNum]).forEach((dayKey) => {
        if (!weeks[weekNum][dayKey]) {
          weeks[weekNum][dayKey] = staticWeeks[weekNum][dayKey]
        }
      })
    })
  }

  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b)
  const maxWeek = weekNumbers.length ? Math.max(...weekNumbers) : 0
  const durationWeeks = staticLevel?.durationWeeks || (maxWeek > 0 ? maxWeek + 2 : apiLevel.estimatedDurationWeeks || 5)

  return {
    name: staticLevel?.name || apiLevel.name,
    durationWeeks,
    sessionsPerWeek: staticLevel?.sessionsPerWeek || 4,
    difficulty: staticLevel?.difficulty || inferDifficulty(apiLevel.difficultyRating),
    description: apiLevel.description || apiLevel.objective || staticLevel?.description || '',
    weeks,
    trainingWeeks: staticLevel?.trainingWeeks || weekNumbers.map((w) => ({
      week: w,
      name: `Semana ${w}`,
      focus: '',
      note: '',
      intensity: `${Math.min(50 + w * 15, 100)}%`,
    })),
    progression: staticLevel?.progression || {},
    testWeek: staticLevel?.testWeek || null,
    tips: staticLevel?.tips || [],
  }
}

function inferMuscleGroups(dayKey) {
  if (!dayKey) return []
  if (dayKey.includes('push')) return ['chest', 'shoulders', 'triceps']
  if (dayKey.includes('pull')) return ['back', 'biceps', 'forearms']
  if (dayKey.includes('legs')) return ['legs', 'glutes', 'calves']
  if (dayKey.includes('core')) return ['core']
  return []
}

function inferGoal(dayKey) {
  if (!dayKey) return 'Entrenamiento'
  if (dayKey.includes('push')) return 'Desarrollar empuje'
  if (dayKey.includes('pull')) return 'Desarrollar tracción'
  if (dayKey.includes('legs')) return 'Fortalecer piernas'
  if (dayKey.includes('core')) return 'Core estable'
  return 'Entrenamiento general'
}

function inferDifficulty(rating) {
  if (!rating) return 'beginner'
  if (rating <= 2) return 'beginner'
  if (rating <= 4) return 'intermediate'
  return 'advanced'
}

function formatSeconds(seconds) {
  if (!seconds) return '30s'
  if (seconds >= 60) {
    const min = Math.floor(seconds / 60)
    const rem = seconds % 60
    return rem ? `${min} min ${rem}s` : `${min} min`
  }
  return `${seconds}s`
}
