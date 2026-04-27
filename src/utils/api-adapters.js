/**
 * Calculadora de tiempo de entrenamiento (solo ejercicios, sin calentamiento/estiramientos)
 * Maneja tanto circuitos como entrenamientos tradicionales (no-circuito).
 * Devuelve objeto { min, max } en minutos.
 */
// Parsear tiempos de descanso (convertir "30s", "2 min" o "2 min 30s" a segundos)
function parseTime(timeStr) {
  if (!timeStr) return 0
  let total = 0
  const minMatch = String(timeStr).match(/(\d+)\s*min/)
  const sMatch = String(timeStr).match(/(\d+)\s*s/)
  if (minMatch) total += parseInt(minMatch[1]) * 60
  if (sMatch) total += parseInt(sMatch[1])
  return total
}

// Calcular tiempo por ejercicio basado en reps/tiempo
function calculateExerciseTime(exercise) {
  const reps = exercise.reps

  // Si es tiempo (ej: "20-30s"), usar eso directamente
  if (reps && reps.includes('s')) {
    const timeMatch = reps.match(/(\d+)(?:-(\d+))?s/)
    if (timeMatch) {
      const min = parseInt(timeMatch[1])
      const max = timeMatch[2] ? parseInt(timeMatch[2]) : min
      return { min, max }
    }
  }

  // Si es repeticiones (ej: "8-12"), estimar tiempo por rep
  const repMatch = reps ? reps.match(/(\d+)(?:-(\d+))?/) : null
  if (repMatch) {
    const minReps = parseInt(repMatch[1])
    const maxReps = repMatch[2] ? parseInt(repMatch[2]) : minReps

    // Tiempo por repetición: 3-5 segundos (incluyendo transición)
    return {
      min: minReps * 3,
      max: maxReps * 5,
    }
  }

  return { min: 30, max: 45 }
}

function calculateBlockTime(block) {
  const { exercises, circuitConfig, isCircuit } = block
  if (!exercises || !exercises.length || !circuitConfig) {
    return { min: 0, max: 0 }
  }

  const { rounds, restBetweenRounds, restBetweenExercises } = circuitConfig
  const restBetweenExercisesSec = parseTime(restBetweenExercises)
  const restBetweenRoundsSec = parseTime(restBetweenRounds)

  let totalTimeMin = 0
  let totalTimeMax = 0

  if (isCircuit) {
    let timePerRoundMin = 0
    let timePerRoundMax = 0

    exercises.forEach((ex, index) => {
      const exTime = calculateExerciseTime(ex)
      timePerRoundMin += exTime.min
      timePerRoundMax += exTime.max

      if (index < exercises.length - 1) {
        timePerRoundMin += restBetweenExercisesSec
        timePerRoundMax += restBetweenExercisesSec
      }
    })

    for (let i = 0; i < rounds; i++) {
      totalTimeMin += timePerRoundMin
      totalTimeMax += timePerRoundMax

      if (i < rounds - 1) {
        totalTimeMin += restBetweenRoundsSec
        totalTimeMax += restBetweenRoundsSec
      }
    }
  } else {
    exercises.forEach((ex, index) => {
      const exTime = calculateExerciseTime(ex)
      const sets = ex.sets || 1
      const restBetweenSetsSec = parseTime(ex.restBetweenSets || '30s')

      for (let i = 0; i < sets; i++) {
        totalTimeMin += exTime.min
        totalTimeMax += exTime.max

        if (i < sets - 1) {
          totalTimeMin += restBetweenSetsSec
          totalTimeMax += restBetweenSetsSec
        }
      }

      if (index < exercises.length - 1) {
        totalTimeMin += restBetweenExercisesSec
        totalTimeMax += restBetweenExercisesSec
      }
    })
  }

  return { min: totalTimeMin, max: totalTimeMax }
}

/**
 * Calcula el tiempo total de un entrenamiento con múltiples bloques.
 * @param {Object} session - Objeto con blocks[] o legacy {exercises, circuitConfig, isCircuit}
 * @returns {Object} {min, max} en minutos
 */
export function calculateWorkoutTime(session) {
  if (!session) return { min: 0, max: 0 }

  // Soporte multi-bloque
  if (session.blocks && session.blocks.length > 0) {
    let totalMin = 0
    let totalMax = 0
    session.blocks.forEach((block) => {
      const t = calculateBlockTime(block)
      totalMin += t.min
      totalMax += t.max
    })
    return {
      min: Math.ceil(totalMin / 60),
      max: Math.ceil(totalMax / 60),
    }
  }

  // Fallback legacy: un solo bloque implícito
  return calculateBlockTime(session)
}

function mapConfigToExercise(cfg, isCircuit, blockRounds) {
  return {
    id: cfg.exercise?.id,
    name: cfg.exercise?.name,
    reps: cfg.reps ? String(cfg.reps) : cfg.maxTimeForReps ? `${cfg.maxTimeForReps}s` : '',
    sets: isCircuit ? blockRounds : (cfg.setsForExercise ?? 1),
    restBetweenSets: formatSeconds(cfg.restBetweenSets),
    difficulty: cfg.exercise?.difficultyRating || 1,
    notes: cfg.notes || '',
    videoSearch: null,
  }
}

function mapRoundToBlock(round, isCircuit, blockIndex) {
  const configs = round?.trainingExerciseConfigurations || []
  const blockRounds = round?.setsForRound ?? 1

  const exercises = configs.map((cfg) => mapConfigToExercise(cfg, isCircuit, blockRounds))

  const circuitConfig = {
    rounds: blockRounds,
    restBetweenRounds: formatSeconds(round?.restBetweenRounds),
    restBetweenExercises: formatSeconds(
      configs[0]?.restBetweenExercises || configs[0]?.restBetweenSets || 30
    ),
  }

  return {
    name: `Bloque ${blockIndex + 1}`,
    isCircuit,
    circuitConfig,
    exercises,
  }
}

function mergeSession(apiSession) {
  // La API puede devolver trainingRounds como array u omitirlo por referencia circular
  const hasRounds = Array.isArray(apiSession.trainingRounds) && apiSession.trainingRounds.length > 0
  const rounds = hasRounds ? apiSession.trainingRounds : []

  // Fallback robusto: Symfony Serializer puede devolver 'circuit' en lugar de 'isCircuit'
  const isCircuit = apiSession.isCircuit ?? apiSession.circuit ?? (apiSession.rounds > 1 || hasRounds || false)

  // Construir bloques a partir de todas las rondas
  const blocks = rounds.map((round, index) => mapRoundToBlock(round, isCircuit, index))

  // --- Compatibilidad legacy: mantener exercises/circuitConfig planos (primera ronda) ---
  const firstBlock = blocks[0]
  const legacyExercises = firstBlock?.exercises || []
  const legacyCircuitConfig = firstBlock?.circuitConfig || null

  // Usar duración calculada del backend si existe, si no calcular al vuelo
  let duration = ''
  if (apiSession.estimatedDurationMin != null && apiSession.estimatedDurationMax != null) {
    const minMin = Math.ceil(apiSession.estimatedDurationMin / 60)
    const maxMin = Math.ceil(apiSession.estimatedDurationMax / 60)
    duration = minMin === maxMin ? `${minMin} min` : `${minMin}-${maxMin} min`
  } else if (blocks.length > 0) {
    const time = calculateWorkoutTime({ blocks })
    if (time.min > 0) {
      duration = `${time.min}-${time.max} min`
    }
  }

  return {
    name: apiSession.name,
    goal: inferGoal(apiSession.dayKey),
    muscleGroups: inferMuscleGroups(apiSession.dayKey),
    duration,
    isCircuit,
    circuitConfig: legacyCircuitConfig,
    exercises: legacyExercises,
    blocks: blocks.length > 1 ? blocks : undefined, // Solo exponer blocks si hay más de 1
  }
}

/**
 * Adapta los datos de un TrainingLevel desde la API al formato legacy
 * que esperan los componentes LevelDetail y WeekPanel.
 */
export function adaptApiLevelToLegacy(apiLevel) {
  const apiTrainings = apiLevel.trainings || []

  if (!apiTrainings.length) {
    return null
  }

  const weeks = {}

  apiTrainings.forEach((t) => {
    const weekNum = t.weekNumber ?? 0
    if (!weeks[weekNum]) weeks[weekNum] = {}
    weeks[weekNum][t.dayKey] = mergeSession(t)
  })

  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b)
  const maxWeek = weekNumbers.length ? Math.max(...weekNumbers) : 0
  const durationWeeks = maxWeek > 0 ? maxWeek + 2 : apiLevel.estimatedDurationWeeks || 5

  // Construir testWeek desde requirements de la API
  let testWeek = null
  if (apiLevel.requirements && apiLevel.requirements.length > 0) {
    testWeek = buildTestWeekFromRequirements(apiLevel.requirements, apiLevel.name, apiLevel.levelNumber, durationWeeks)
  }

  // Usar weekInfos de la API si existen, si no generar genéricos
  const apiWeekInfos = apiLevel.weekInfos || []
  const trainingWeeks = weekNumbers.map((w) => {
    const info = apiWeekInfos.find((i) => i.weekNumber === w)
    return {
      week: w,
      name: info?.name || `Semana ${w}`,
      focus: info?.focus || '',
      note: info?.note || '',
      intensity: info?.intensity || `${Math.min(50 + w * 15, 100)}%`,
    }
  })

  return {
    name: apiLevel.name,
    durationWeeks,
    sessionsPerWeek: 4,
    difficulty: inferDifficulty(apiLevel.difficultyRating),
    description: apiLevel.description || apiLevel.objective || '',
    weeks,
    trainingWeeks,
    progression: {},
    testWeek,
    tips: apiLevel.tips || [],
  }
}

function buildTestWeekFromRequirements(requirements, levelName, levelNumber, durationWeeks) {
  const mapped = requirements
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((req) => {
      const target = req.targetValue ?? req.target_value ?? 0
      const min = req.minValue ?? req.min_value ?? Math.max(1, Math.floor(target * 0.6))
      let unit = req.unit || ''
      if (unit === 'reps') unit = 'repeticiones'
      else if (unit === 'seconds') unit = 'segundos'

      return {
        name: req.description || req.name || 'Requisito',
        minimum: min,
        target: target,
        unit: unit,
      }
    })

  return {
    week: durationWeeks - 1,
    name: `Semana ${durationWeeks - 1}: Tests de ${levelName || 'Nivel ' + levelNumber}`,
    description: `Evalua si estas listo para el siguiente nivel`,
    preparation: [
      { session: '2-3 dias antes', activities: ['Descanso completo', 'Movilidad suave', 'Dormir bien', 'Hidratacion'] }
    ],
    tests: {
      name: `TESTS NIVEL ${levelNumber}`,
      description: `Debes superar los ${mapped.length} tests para avanzar al siguiente nivel`,
      requirements: mapped,
    },
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
