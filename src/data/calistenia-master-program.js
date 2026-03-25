// Calistenia Master - Nivel 1: Fundamentos
// Estructura: 5 semanas (1 adaptación + 1 base + 2 progresivas + 1 tests)
// OBJETIVO: Preparar para superar los 5 tests de nivel
// NOTA: Todos los ejercicios están vinculados a IDs reales de la BBDD (nivel principiante)

// Calculadora de tiempo de entrenamiento (solo ejercicios, sin calentamiento/estiramientos)
// Devuelve objeto { min, max } en minutos
export function calculateWorkoutTime(session) {
  if (!session || !session.exercises || !session.circuitConfig) {
    return { min: 0, max: 0 }
  }
  
  const { exercises, circuitConfig } = session
  const { rounds, restBetweenRounds, restBetweenExercises } = circuitConfig
  
  // Parsear tiempos de descanso (convertir "30s" o "2 min" a segundos)
  const parseTime = (timeStr) => {
    if (!timeStr) return 0
    const match = timeStr.match(/(\d+)\s*(s|min)/)
    if (!match) return 0
    const value = parseInt(match[1])
    const unit = match[2]
    return unit === 'min' ? value * 60 : value
  }
  
  const restBetweenExercisesSec = parseTime(restBetweenExercises)
  const restBetweenRoundsSec = parseTime(restBetweenRounds)
  
  // Calcular tiempo por ejercicio basado en reps/tiempo
  // Rápido = tiempo mínimo, Lento = tiempo máximo (+50%)
  const calculateExerciseTime = (exercise) => {
    const reps = exercise.reps
    
    // Si es tiempo (ej: "20-30s"), usar eso directamente
    if (reps.includes('s')) {
      const timeMatch = reps.match(/(\d+)(?:-(\d+))?s/)
      if (timeMatch) {
        const min = parseInt(timeMatch[1])
        const max = timeMatch[2] ? parseInt(timeMatch[2]) : min
        return { min, max }
      }
    }
    
    // Si es repeticiones (ej: "8-12"), estimar tiempo por rep
    const repMatch = reps.match(/(\d+)(?:-(\d+))?/)
    if (repMatch) {
      const minReps = parseInt(repMatch[1])
      const maxReps = repMatch[2] ? parseInt(repMatch[2]) : minReps
      
      // Tiempo por repetición: 3-5 segundos (incluyendo transición)
      return {
        min: minReps * 3,  // 3 segundos por rep (rápido)
        max: maxReps * 5   // 5 segundos por rep (lento/controlado)
      }
    }
    
    return { min: 30, max: 45 } // Default
  }
  
  // Calcular tiempo total de una ronda
  let timePerRoundMin = 0
  let timePerRoundMax = 0
  
  exercises.forEach((ex, index) => {
    const exTime = calculateExerciseTime(ex)
    timePerRoundMin += exTime.min
    timePerRoundMax += exTime.max
    
    // Añadir descanso entre ejercicios (excepto después del último)
    if (index < exercises.length - 1) {
      timePerRoundMin += restBetweenExercisesSec
      timePerRoundMax += restBetweenExercisesSec
    }
  })
  
  // Calcular tiempo total de todas las rondas
  let totalTimeMin = 0
  let totalTimeMax = 0
  
  for (let i = 0; i < rounds; i++) {
    totalTimeMin += timePerRoundMin
    totalTimeMax += timePerRoundMax
    
    // Añadir descanso entre rondas (excepto después de la última)
    if (i < rounds - 1) {
      totalTimeMin += restBetweenRoundsSec
      totalTimeMax += restBetweenRoundsSec
    }
  }
  
  // Convertir a minutos y redondear
  return {
    min: Math.ceil(totalTimeMin / 60),
    max: Math.ceil(totalTimeMax / 60)
  }
}

export const nivel1Fundamentos = {
  id: 'nivel-1-fundamentos',
  name: 'Nivel 1: Fundamentos',
  description: 'Construye la base para superar los tests: Push-ups, Australian Pull-ups, Squats, Plank y Hollow Body',
  durationWeeks: 5,
  sessionsPerWeek: 4,
  difficulty: 'beginner',
  
  // Tests a superar (semana 4)
  targetTests: [
    { name: 'Push-ups', minimum: 10, target: 15, unit: 'reps' },
    { name: 'Australian Pull-ups', minimum: 12, target: 15, unit: 'reps' },
    { name: 'Air Squats', minimum: 20, target: 25, unit: 'reps' },
    { name: 'Plank', minimum: 45, target: 60, unit: 'segundos' },
    { name: 'Hollow Body Hold', minimum: 20, target: 30, unit: 'segundos' }
  ],
  
  // Progresión semanal
  progression: {
    week0: 'Aprende la técnica, haz solo la mitad de repeticiones, sin presión',
    week1: 'Enfoque en técnica perfecta, rango bajo-moderado de repeticiones',
    week2: 'Aumenta 1-2 repeticiones por ejercicio si la técnica es buena',
    week3: 'Busca el rango alto de repeticiones, mantén buena forma'
  },
  
  // Estructura semanal
  trainingWeeks: [
    {
      week: 0,
      name: 'Semana 0: Adaptación',
      focus: 'Aprender movimientos básicos',
      note: 'Mitad de repeticiones, enfoque en técnica perfecta',
      intensity: '50%'
    },
    {
      week: 1,
      name: 'Semana 1: Base',
      focus: 'Mismos ejercicios, aumentar volumen',
      note: 'Rango completo de repeticiones',
      intensity: '75%'
    },
    {
      week: 2,
      name: 'Semana 2: Progresión',
      focus: 'Nuevos ejercicios, más específicos',
      note: 'Variantes más cercanas a los tests',
      intensity: '85%'
    },
    {
      week: 3,
      name: 'Semana 3: Intensificación',
      focus: 'Máximo volumen, preparación tests',
      note: 'Ejercicios avanzados de nivel 1',
      intensity: '95%'
    }
  ],
  
  // SEMANAS 0 y 1: Mismos entrenamientos (adaptación y base)
  weeks01: {
    day1_push: {
      name: 'Día 1: Push Base',
      goal: 'Preparar Push-up test',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '14-19 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 10, name: 'Wall Push Up', reps: '10-15', difficulty: 1, 
          notes: 'Manos en pared, cuerpo inclinado. Control total.' },
        { id: 11, name: 'Knee Push Up', reps: '8-10', difficulty: 1, 
          notes: 'Rodillas en suelo, pecho toca el suelo.' },
        { id: 232, name: 'Bench Dips', reps: '8-10', difficulty: 1, 
          notes: 'Banco bajo, codos hacia atrás.' },
        { id: 286, name: 'Plank', reps: '20-30s', difficulty: 1, 
          notes: 'Cuerpo recto, aguanta posición.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Base',
      goal: 'Preparar Australian Pull-up test',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '12-15 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 42, name: 'Australian Pull Up - Wide', reps: '8-10', difficulty: 1, 
          notes: 'Barra baja, agarre ancho, pecho a barra.' },
        { id: 273, name: 'Dead Hang', reps: '15-20s', difficulty: 1, 
          notes: 'Simplemente cuelga, agarre cómodo.' },
        { id: 20, name: 'Australian Pull Up', reps: '6-8', difficulty: 1, 
          notes: 'Agarre normal, codos al cuerpo.' },
        { id: 298, name: 'Superman Hold', reps: '15-20s', difficulty: 1, 
          notes: 'Eleva pecho y piernas ligeramente.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Base',
      goal: 'Preparar Air Squat test',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '13-17 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 148, name: 'Sit To Stand', reps: '10-12', difficulty: 1, 
          notes: 'De silla, sin impulso, controlado.' },
        { id: 147, name: 'Box Squat', reps: '8-10', difficulty: 1, 
          notes: 'Sentadilla a caja, glúteos tocan, subes.' },
        { id: 107, name: 'Glute Bridge', reps: '12-15', difficulty: 1, 
          notes: 'Espalda en suelo, eleva caderas.' },
        { id: 188, name: 'Standing Calf Raise', reps: '12-15', difficulty: 1, 
          notes: 'De pie, sube en puntas.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Base',
      goal: 'Preparar Plank y Hollow Body tests',
      muscleGroups: ['core'],
      duration: '10-13 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '90s', restBetweenExercises: '20s' },
      exercises: [
        { id: 294, name: 'Dead Bug', reps: '8-10', difficulty: 1, 
          notes: 'Contralateral lento, lumbar pegada.' },
        { id: 288, name: 'Reverse Plank', reps: '15-20s', difficulty: 1, 
          notes: 'Apoyo en manos, eleva caderas.' },
        { id: 290, name: 'Plank with Leg Raise', reps: '6-8', difficulty: 1, 
          notes: 'En plank, levanta pierna alterna.' },
        { id: 298, name: 'Superman Hold', reps: '15-20s', difficulty: 1, 
          notes: 'Boca abajo, eleva todo.' }
      ]
    }
  },
  
  // SEMANA 2: Progresión (ejercicios diferentes, más específicos)
  week2: {
    day1_push: {
      name: 'Día 1: Push Progresión',
      goal: 'Acercarse al push-up completo',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '13-18 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 13, name: 'Incline Push Up', reps: '10-12', difficulty: 1, 
          notes: 'Manos en banco elevado, cuerpo recto.' },
        { id: 11, name: 'Knee Push Up', reps: '10-12', difficulty: 1, 
          notes: 'Ahora con más reps, más cerca del test.' },
        { id: 14, name: 'Standard Push Up (asistido)', reps: '3-5', difficulty: 2, 
          notes: 'Intenta completo, si falla haz negativo.' },
        { id: 286, name: 'Plank', reps: '30-40s', difficulty: 1, 
          notes: 'Aguanta más tiempo, prepara test.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Progresión',
      goal: 'Aumentar reps en Australian Pull-up',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '13-18 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 20, name: 'Australian Pull Up', reps: '10-12', difficulty: 1, 
          notes: 'Más reps, busca las 12 del test.' },
        { id: 274, name: 'Active Hang', reps: '20-30s', difficulty: 1, 
          notes: 'Omóplatos activados, agarre fuerte.' },
        { id: 43, name: 'Australian Pull Up - Normal', reps: '8-10', difficulty: 1, 
          notes: 'Variante agarre normal, más difícil.' },
        { id: 71, name: 'Ring Row - Feet on Ground', reps: '8-10', difficulty: 1, 
          notes: 'Si tienes anillas, alternativa a barra.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Progresión',
      goal: 'Llegar a 20 squats seguidos',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '14-19 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 146, name: 'Air Squat', reps: '15-18', difficulty: 1, 
          notes: 'Sin caja, caderas abajo, técnica pura.' },
        { id: 149, name: 'Stationary Lunge', reps: '8-10', difficulty: 1, 
          notes: 'Zancada fija, alterna piernas.' },
        { id: 181, name: 'Hip Thrust', reps: '12-15', difficulty: 1, 
          notes: 'Espalda en banco, más rango.' },
        { id: 108, name: 'Single Leg Glute Bridge', reps: '8-10', difficulty: 1, 
          notes: 'Una pierna, más intensidad.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Progresión',
      goal: 'Construir resistencia para plank 45s',
      muscleGroups: ['core'],
      duration: '14-19 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '25s' },
      exercises: [
        { id: 286, name: 'Plank', reps: '35-45s', difficulty: 1, 
          notes: 'Aguanta todo el tiempo objetivo.' },
        { id: 287, name: 'Side Plank', reps: '20-25s', difficulty: 1, 
          notes: 'Por lado, caderas altas.' },
        { id: 294, name: 'Dead Bug', reps: '10-12', difficulty: 1, 
          notes: 'Más reps, control total.' },
        { id: 296, name: 'Hollow Body Hold', reps: '15-20s', difficulty: 1, 
          notes: 'Preparando para test, lumbar pegada.' }
      ]
    }
  },
  
  // SEMANA 3: Intensificación (máximo volumen, simulacro de tests)
  week3: {
    day1_push: {
      name: 'Día 1: Push Intensificación',
      goal: 'Simular test de Push-ups',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '28-37 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 11, name: 'Knee Push Up', reps: '12-15', difficulty: 1, 
          notes: 'Máximo reps, acumula volumen.' },
        { id: 13, name: 'Incline Push Up', reps: '12-15', difficulty: 1, 
          notes: 'Inclinación baja, más difícil.' },
        { id: 232, name: 'Bench Dips', reps: '12-15', difficulty: 1, 
          notes: 'Tríceps fuertes para empuje final.' },
        { id: 286, name: 'Plank', reps: '45-60s', difficulty: 1, 
          notes: 'Aguanta el tiempo del test.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Intensificación',
      goal: 'Simular test de Australian Pull-ups',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '28-37 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 20, name: 'Australian Pull Up', reps: '12-15', difficulty: 1, 
          notes: 'Objetivo: 12 reps del test.' },
        { id: 42, name: 'Australian Pull Up - Wide', reps: '10-12', difficulty: 1, 
          notes: 'Variación ancha, más espalda.' },
        { id: 274, name: 'Active Hang', reps: '30-40s', difficulty: 1, 
          notes: 'Resistencia de agarre máxima.' },
        { id: 273, name: 'Dead Hang', reps: '30-40s', difficulty: 1, 
          notes: 'Agarre puro, aguanta.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Intensificación',
      goal: 'Simular test de Air Squats (20 reps)',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '29-38 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 146, name: 'Air Squat', reps: '18-20', difficulty: 1, 
          notes: 'Objetivo test: 20 reps seguidas.' },
        { id: 147, name: 'Box Squat', reps: '15-18', difficulty: 1, 
          notes: 'Control profundo, sin rebote.' },
        { id: 188, name: 'Standing Calf Raise', reps: '15-20', difficulty: 1, 
          notes: 'Gemelos fuertes para estabilidad.' },
        { id: 107, name: 'Glute Bridge', reps: '15-18', difficulty: 1, 
          notes: 'Glúteos activos, cadena posterior.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Intensificación + Tests',
      goal: 'Simular tests de Plank y Hollow Body',
      muscleGroups: ['core'],
      duration: '21-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '3 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 286, name: 'Plank', reps: '45-60s', difficulty: 1, 
          notes: 'Test simulation: aguanta 45s mínimo.' },
        { id: 296, name: 'Hollow Body Hold', reps: '20-30s', difficulty: 1, 
          notes: 'Test simulation: 20s mínimo.' },
        { id: 294, name: 'Dead Bug', reps: '12-15', difficulty: 1, 
          notes: 'Core estable, control perfecto.' },
        { id: 287, name: 'Side Plank', reps: '25-30s', difficulty: 1, 
          notes: 'Por lado, oblicuos fuertes.' }
      ]
    }
  },
  
  // Función para obtener sesión según semana
  getSession(week, day) {
    // Semanas 0 y 1 usan weeks01
    if (week === 0 || week === 1) {
      return this.weeks01[day] || null
    }
    // Semana 2 usa week2
    if (week === 2) {
      return this.week2[day] || null
    }
    // Semana 3 usa week3
    if (week === 3) {
      return this.week3[day] || null
    }
    return null
  },
  
  // Obtener todas las sesiones de una semana
  getWeekSessions(weekNum) {
    const days = ['day1_push', 'day2_pull', 'day3_legs', 'day4_core']
    return days.map(day => this.getSession(weekNum, day))
  },
  
  // SEMANA 4: Tests oficiales
  testWeek: {
    week: 4,
    name: 'Semana 4: Tests Oficiales',
    description: 'Evaluación para pasar al Nivel 2',
    preparation: [
      {
        session: '2-3 días antes',
        activities: ['Descanso completo', 'Movilidad suave', 'Visualización positiva']
      }
    ],
    tests: {
      name: 'TESTS NIVEL 1',
      description: 'Debes superar al menos 4 de 5 tests para avanzar al Nivel 2',
      requirements: [
        {
          name: 'Push-ups',
          minimum: 10,
          target: 15,
          unit: 'repeticiones',
          form: 'Pecho al suelo, core apretado, extensión completa'
        },
        {
          name: 'Australian Pull-ups',
          minimum: 12,
          target: 15,
          unit: 'repeticiones',
          form: 'Pecho a la barra, cuerpo recto, control total'
        },
        {
          name: 'Air Squats',
          minimum: 20,
          target: 25,
          unit: 'repeticiones',
          form: 'Caderas abajo de rodillas, sin perder lumbar, talones suelo'
        },
        {
          name: 'Plank',
          minimum: 45,
          target: 60,
          unit: 'segundos',
          form: 'Cuerpo recto, codos debajo hombros, sin hundir caderas'
        },
        {
          name: 'Hollow Body Hold',
          minimum: 20,
          target: 30,
          unit: 'segundos',
          form: 'Lumbar pegado al suelo, piernas y hombros elevados'
        }
      ]
    }
  },
  
  // Consejos
  tips: [
    'Semana 0: Aprende la técnica sin prisa, haz mitad de reps',
    'Semana 1: Aumenta volumen gradualmente, descansa entre sesiones',
    'Semana 2: Nuevos ejercicios, mantén buena forma siempre',
    'Semana 3: Última semana dura, acumula volumen para los tests',
    'Tests: Descansa 48h antes, hidratación y mentalidad positiva',
    'Si fallas un test, no pasa nada, repite el nivel con más ganas'
  ]
}

// Export default
export default nivel1Fundamentos
