// Calistenia Master - Nivel 2: Intermedio
// Estructura: 6 semanas (5 entrenamiento + 1 tests)
// OBJETIVO: Dominar movimientos intermedios y preparar para nivel avanzado
// NOTA: Ejercicios nivel 2 (🔥🔥) con algunos nivel 1 de transición

export const nivel2Intermedio = {
  id: 'nivel-2-intermedio',
  name: 'Nivel 2: Intermedio',
  description: 'Domina el push-up completo, pull-up, sentadillas avanzadas y core de nivel intermedio. Base para skills como muscle-up y handstand.',
  durationWeeks: 6,
  sessionsPerWeek: 4,
  difficulty: 'intermediate',
  
  // Tests a superar (semana 5)
  targetTests: [
    { 
      name: 'Push-ups', 
      minimum: 15, 
      target: 20, 
      unit: 'reps',
      description: 'Push-ups completos, pecho al suelo, extensión total'
    },
    { 
      name: 'Pull-ups', 
      minimum: 5, 
      target: 8, 
      unit: 'reps',
      description: 'Dominadas completas, mentón sobre la barra, bajada controlada'
    },
    { 
      name: 'Bulgarian Split Squat', 
      minimum: 10, 
      target: 12, 
      unit: 'reps por pierna',
      description: 'Pierna trasera en elevación, rodilla trasera casi toca el suelo'
    },
    { 
      name: 'Plank', 
      minimum: 60, 
      target: 90, 
      unit: 'segundos',
      description: 'Plank perfecto, cuerpo recto, sin hundir caderas'
    },
    { 
      name: 'L-Sit', 
      minimum: 10, 
      target: 15, 
      unit: 'segundos',
      description: 'En paralelas o suelo, piernas estiradas a 90°'
    }
  ],
  
  // Estructura semanal (5 semanas + tests)
  trainingWeeks: [
    {
      week: 0,
      name: 'Semana 0: Adaptación Nivel 2',
      focus: 'Introducción a ejercicios intermedios',
      note: 'Mitad de repeticiones, enfocado en técnica',
      intensity: '50%'
    },
    {
      week: 1,
      name: 'Semana 1: Base Intermedia',
      focus: 'Mismos ejercicios, aumentar volumen',
      note: 'Rango completo de repeticiones',
      intensity: '70%'
    },
    {
      week: 2,
      name: 'Semana 2: Progresión',
      focus: 'Nuevos ejercicios, más específicos',
      note: 'Variantes más cercanas a los tests',
      intensity: '80%'
    },
    {
      week: 3,
      name: 'Semana 3: Desarrollo',
      focus: 'Aumento de intensidad',
      note: 'Más series o más peso',
      intensity: '85%'
    },
    {
      week: 4,
      name: 'Semana 4: Intensificación',
      focus: 'Máximo volumen, preparación tests',
      note: 'Simulacro de tests',
      intensity: '95%'
    }
  ],
  
  // Progresión semanal
  progression: {
    week0: 'Aprende los nuevos ejercicios intermedios, mitad de reps, técnica perfecta',
    week1: 'Completa el rango de repeticiones, control total',
    week2: 'Introduce variantes más difíciles, aumenta estabilidad',
    week3: 'Añade volumen o dificultad, construye fuerza',
    week4: 'Simula los tests, máxima intensidad, descansa bien entre sesiones'
  },
  
  // SEMANAS 0 y 1: Mismos entrenamientos (adaptación y base)
  weeks01: {
    day1_push: {
      name: 'Día 1: Push Intermedio Base',
      goal: 'Preparar Push-up completo',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '18-25 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 13, name: 'Incline Push Up', reps: '12-15', difficulty: 1, 
          notes: 'Banco bajo, cuerpo recto, control total.' },
        { id: 14, name: 'Standard Push Up', reps: '5-10', difficulty: 2, 
          notes: 'Push-up completo, si fallas haz negativo.' },
        { id: 31, name: 'Pike Push Up', reps: '6-8', difficulty: 2, 
          notes: 'Cadera alta, hombros sobre manos.' },
        { id: 232, name: 'Bench Dips', reps: '10-12', difficulty: 1, 
          notes: 'Pies en otro banco, más rango.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Intermedio Base',
      goal: 'Preparar Pull-up completo',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '20-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 20, name: 'Australian Pull Up', reps: '12-15', difficulty: 1, 
          notes: 'Pies elevados si es posible, más difícil.' },
        { id: 22, name: 'Assisted Pull Up', reps: '5-8', difficulty: 2, 
          notes: 'Banda elástica o compañero, mentón sobre barra.' },
        { id: 21, name: 'Negative Pull Up', reps: '3-5', difficulty: 2, 
          notes: 'Sube de cualquier forma, baja en 3-5 segundos.' },
        { id: 274, name: 'Active Hang', reps: '30-45s', difficulty: 1, 
          notes: 'Omóplatos activados, agarre fuerte.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Intermedio Base',
      goal: 'Preparar Bulgarian Split Squat',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '20-26 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 154, name: 'Bulgarian Split Squat', reps: '6-8', difficulty: 2, 
          notes: 'Pie trasero en banco, baja controlado, rodilla casi suelo.' },
        { id: 146, name: 'Air Squat', reps: '15-20', difficulty: 1, 
          notes: 'Rápidas y explosivas, buena forma.' },
        { id: 149, name: 'Stationary Lunge', reps: '10-12', difficulty: 1, 
          notes: 'Zancada profunda, rodilla trasera casi toca.' },
        { id: 188, name: 'Single Leg Calf Raise', reps: '12-15', difficulty: 1, 
          notes: 'Por pierna, borde de escalón, rango completo.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Intermedio Base',
      goal: 'Preparar L-Sit y plank largo',
      muscleGroups: ['core'],
      duration: '15-20 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '90s', restBetweenExercises: '30s' },
      exercises: [
        { id: 303, name: 'Tuck L-Sit', reps: '10-15s', difficulty: 2, 
          notes: 'En paralelas o suelo, rodillas al pecho, brazos rectos.' },
        { id: 286, name: 'Plank', reps: '45-60s', difficulty: 1, 
          notes: 'Aguanta el tiempo, cuerpo perfectamente recto.' },
        { id: 287, name: 'Side Plank', reps: '30-40s', difficulty: 2, 
          notes: 'Por lado, caderas altas, sin rotar.' },
        { id: 296, name: 'Hollow Body Hold', reps: '20-30s', difficulty: 1, 
          notes: 'Lumbar pegada, piernas y hombros elevados.' }
      ]
    }
  },
  
  // SEMANA 2: Progresión
  week2: {
    day1_push: {
      name: 'Día 1: Push Progresión',
      goal: 'Aumentar reps en push-up completo',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '22-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 14, name: 'Standard Push Up', reps: '8-12', difficulty: 2, 
          notes: 'Ahora más reps, objetivo 15.' },
        { id: 16, name: 'Wide Push Up', reps: '8-10', difficulty: 2, 
          notes: 'Agarre ancho, más pecho.' },
        { id: 31, name: 'Pike Push Up', reps: '8-10', difficulty: 2, 
          notes: 'Más inclinación, más hombros.' },
        { id: 232, name: 'Bench Dips', reps: '12-15', difficulty: 1, 
          notes: 'Más reps o pies elevados.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Progresión',
      goal: 'Acercarse al pull-up libre',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '25-33 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '2 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 23, name: 'Standard Pull Up', reps: '3-5', difficulty: 2, 
          notes: 'Intenta libre, si no puedes usa asistencia mínima.' },
        { id: 21, name: 'Negative Pull Up', reps: '4-6', difficulty: 2, 
          notes: 'Bajada más lenta, 4-6 segundos.' },
        { id: 20, name: 'Australian Pull Up', reps: '12-15', difficulty: 1, 
          notes: 'Rápidas y explosivas.' },
        { id: 273, name: 'Dead Hang', reps: '45-60s', difficulty: 1, 
          notes: 'Agarre máximo tiempo, resistencia.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Progresión',
      goal: 'Mejorar Bulgarian Split Squat',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '22-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 154, name: 'Bulgarian Split Squat', reps: '8-10', difficulty: 2, 
          notes: 'Más reps, profundidad completa.' },
        { id: 153, name: 'Cossack Squat', reps: '6-8', difficulty: 2, 
          notes: 'Por lado, pierna estirada, profundidad máxima.' },
        { id: 146, name: 'Jump Squat', reps: '10-12', difficulty: 2, 
          notes: 'Explosivo, salta desde abajo, aterriza suave.' },
        { id: 188, name: 'Single Leg Calf Raise', reps: '15-20', difficulty: 1, 
          notes: 'Más reps, pausa arriba 2 segundos.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Progresión',
      goal: 'Aumentar tiempo L-Sit y plank',
      muscleGroups: ['core'],
      duration: '18-24 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 303, name: 'Tuck L-Sit', reps: '15-20s', difficulty: 2, 
          notes: 'Más tiempo, intenta extender una pierna.' },
        { id: 286, name: 'Plank', reps: '60-75s', difficulty: 1, 
          notes: 'Objetivo 90s, aguanta.' },
        { id: 287, name: 'Side Plank', reps: '40-50s', difficulty: 2, 
          notes: 'Más tiempo por lado.' },
        { id: 301, name: 'L-Sit', reps: '5-8s', difficulty: 3, 
          notes: 'Intenta L-Sit completa, piernas estiradas.' }
      ]
    }
  },
  
  // SEMANA 3: Desarrollo
  week3: {
    day1_push: {
      name: 'Día 1: Push Desarrollo',
      goal: 'Volumen máximo en push-ups',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '25-33 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 14, name: 'Standard Push Up', reps: '10-15', difficulty: 2, 
          notes: 'Objetivo 15 reps, buena forma.' },
        { id: 17, name: 'Decline Push Up', reps: '8-10', difficulty: 2, 
          notes: 'Pies elevados, más difícil.' },
        { id: 15, name: 'Diamond Push Up', reps: '5-8', difficulty: 2, 
          notes: 'Manos juntas, codos pegados, tríceps.' },
        { id: 286, name: 'Plank to Push-up', reps: '8-10', difficulty: 2, 
          notes: 'De plank a push-up, alterna brazos.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Desarrollo',
      goal: 'Aumentar reps en pull-ups',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '28-36 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 23, name: 'Standard Pull Up', reps: '5-8', difficulty: 2, 
          notes: 'Objetivo 8 reps, control total.' },
        { id: 24, name: 'Chin Up', reps: '5-8', difficulty: 2, 
          notes: 'Agarre supino, más bíceps.' },
        { id: 21, name: 'Negative Pull Up', reps: '5-8', difficulty: 2, 
          notes: 'Bajada de 5 segundos, perfecta.' },
        { id: 71, name: 'Ring Row', reps: '10-12', difficulty: 2, 
          notes: 'Si tienes anillas, control total.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Desarrollo',
      goal: 'Fuerza máxima en piernas',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '25-32 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 154, name: 'Bulgarian Split Squat', reps: '10-12', difficulty: 2, 
          notes: 'Objetivo 12 reps, profundidad máxima.' },
        { id: 182, name: 'Single Leg Hip Thrust', reps: '10-12', difficulty: 2, 
          notes: 'Por pierna, glúteo aislado fuerte.' },
        { id: 146, name: 'Jump Squat', reps: '12-15', difficulty: 2, 
          notes: 'Explosivo máximo, altura y velocidad.' },
        { id: 191, name: 'Calf Raise on Step', reps: '20-25', difficulty: 1, 
          notes: 'Rango completo, pausa arriba.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Desarrollo',
      goal: 'Desarrollar L-Sit completa',
      muscleGroups: ['core'],
      duration: '22-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '2 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 301, name: 'L-Sit', reps: '8-12s', difficulty: 3, 
          notes: 'Piernas estiradas, aguanta más tiempo.' },
        { id: 303, name: 'Tuck L-Sit', reps: '20-25s', difficulty: 2, 
          notes: 'Descanso activo entre intentos de L-Sit.' },
        { id: 286, name: 'Plank', reps: '75-90s', difficulty: 1, 
          notes: 'Objetivo 90s, aguanta todo.' },
        { id: 293, name: 'Mountain Climber', reps: '30-40s', difficulty: 2, 
          notes: 'Rápido y controlado, core activo.' }
      ]
    }
  },
  
  // SEMANA 4: Intensificación
  week4: {
    day1_push: {
      name: 'Día 1: Push Intensificación',
      goal: 'Simular test de Push-ups (20 reps)',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '28-35 min',
      isCircuit: true,
      circuitConfig: { rounds: 5, restBetweenRounds: '3 min', restBetweenExercises: '60s' },
      exercises: [
        { id: 14, name: 'Standard Push Up', reps: '15-20', difficulty: 2, 
          notes: 'Test simulation: busca las 20 reps.' },
        { id: 17, name: 'Decline Push Up', reps: '10-12', difficulty: 2, 
          notes: 'Más difícil, acumula volumen.' },
        { id: 31, name: 'Pike Push Up', reps: '10-12', difficulty: 2, 
          notes: 'Preparación para handstand push-up.' },
        { id: 232, name: 'Bench Dips', reps: '15-20', difficulty: 1, 
          notes: 'Máximo reps, tríceps fuerte.' }
      ]
    },
    day2_pull: {
      name: 'Día 2: Pull Intensificación',
      goal: 'Simular test de Pull-ups (8 reps)',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '30-38 min',
      isCircuit: true,
      circuitConfig: { rounds: 5, restBetweenRounds: '3 min', restBetweenExercises: '60s' },
      exercises: [
        { id: 23, name: 'Standard Pull Up', reps: '6-8', difficulty: 2, 
          notes: 'Test simulation: busca las 8 reps.' },
        { id: 24, name: 'Chin Up', reps: '6-8', difficulty: 2, 
          notes: 'Variante supino, más bíceps.' },
        { id: 21, name: 'Negative Pull Up', reps: '6-8', difficulty: 2, 
          notes: 'Bajada perfecta, 5 segundos.' },
        { id: 274, name: 'Active Hang', reps: '60s', difficulty: 1, 
          notes: 'Agarre máximo, resistencia.' }
      ]
    },
    day3_legs: {
      name: 'Día 3: Legs Intensificación',
      goal: 'Simular test Bulgarian Split Squat (12 reps)',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '28-35 min',
      isCircuit: true,
      circuitConfig: { rounds: 5, restBetweenRounds: '3 min', restBetweenExercises: '60s' },
      exercises: [
        { id: 154, name: 'Bulgarian Split Squat', reps: '10-12', difficulty: 2, 
          notes: 'Test simulation: 12 reps por pierna.' },
        { id: 153, name: 'Cossack Squat', reps: '8-10', difficulty: 2, 
          notes: 'Por lado, movilidad y fuerza.' },
        { id: 159, name: 'Box Jump', reps: '8-10', difficulty: 2, 
          notes: 'Explosivo, aterriza suave, control.' },
        { id: 188, name: 'Single Leg Calf Raise', reps: '20-25', difficulty: 1, 
          notes: 'Máximo reps, gemelos fuertes.' }
      ]
    },
    day4_core: {
      name: 'Día 4: Core Intensificación + Tests',
      goal: 'Simular tests de Plank y L-Sit',
      muscleGroups: ['core'],
      duration: '24-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '60s' },
      exercises: [
        { id: 286, name: 'Plank', reps: '90s', difficulty: 1, 
          notes: 'Test simulation: aguanta 90s.' },
        { id: 301, name: 'L-Sit', reps: '10-15s', difficulty: 3, 
          notes: 'Test simulation: objetivo 15s.' },
        { id: 287, name: 'Side Plank', reps: '60s', difficulty: 2, 
          notes: 'Por lado, máximo tiempo.' },
        { id: 296, name: 'Hollow Body Hold', reps: '45-60s', difficulty: 1, 
          notes: 'Core complementario, aguanta.' }
      ]
    }
  },
  
  // Función para obtener sesión según semana
  getSession(week, day) {
    if (week === 0 || week === 1) {
      return this.weeks01[day] || null
    }
    if (week === 2) {
      return this.week2[day] || null
    }
    if (week === 3) {
      return this.week3[day] || null
    }
    if (week === 4) {
      return this.week4[day] || null
    }
    return null
  },
  
  // Obtener todas las sesiones de una semana
  getWeekSessions(weekNum) {
    const days = ['day1_push', 'day2_pull', 'day3_legs', 'day4_core']
    return days.map(day => this.getSession(weekNum, day))
  },
  
  // SEMANA 5: Tests oficiales
  testWeek: {
    week: 5,
    name: 'Semana 5: Tests Oficiales',
    description: 'Evaluación para pasar al Nivel 3',
    preparation: [
      {
        session: '2-3 días antes',
        activities: ['Descanso completo', 'Movilidad suave', 'Visualización positiva', 'Dormir bien']
      }
    ],
    tests: {
      name: 'TESTS NIVEL 2',
      description: 'Debes superar al menos 4 de 5 tests para avanzar al Nivel 3 (Avanzado)',
      requirements: [
        {
          name: 'Push-ups',
          minimum: 15,
          target: 20,
          unit: 'repeticiones',
          form: 'Completos, pecho al suelo, extensión total, core apretado'
        },
        {
          name: 'Pull-ups',
          minimum: 5,
          target: 8,
          unit: 'repeticiones',
          form: 'Mentón sobre barra, bajada controlada, sin balanceo'
        },
        {
          name: 'Bulgarian Split Squat',
          minimum: 10,
          target: 12,
          unit: 'reps por pierna',
          form: 'Pierna trasera elevada, rodilla trasera casi toca, torso erguido'
        },
        {
          name: 'Plank',
          minimum: 60,
          target: 90,
          unit: 'segundos',
          form: 'Cuerpo recto, codos debajo hombros, caderas alineadas'
        },
        {
          name: 'L-Sit',
          minimum: 10,
          target: 15,
          unit: 'segundos',
          form: 'Piernas estiradas 90°, brazos rectos, escápulas elevadas'
        }
      ]
    }
  },
  
  // Consejos
  tips: [
    'Semana 0: Los ejercicios nivel 2 son más difíciles, tómate tu tiempo',
    'Semana 1: Aumenta volumen gradualmente, prioriza forma sobre reps',
    'Semana 2: Nuevos ejercicios, no temas usar asistencia si es necesario',
    'Semana 3: Añade dificultad, más series o variantes más difíciles',
    'Semana 4: Última semana dura, simula los tests, descansa bien',
    'Tests: Si no pasas alguno, no pasa nada, practica esa habilidad más',
    'El L-Sit es el más difícil, si no llegas a 10s, sigue practicando tuck'
  ]
}

// Export default
export default nivel2Intermedio
