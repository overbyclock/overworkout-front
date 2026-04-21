// Calistenia Master - Nivel 2: Principiante I
// Estructura: 5 semanas (0 adaptacion + 1 base + 1 progresion + 1 intensificacion + 1 tests)
// OBJETIVO: Dominar peso corporal basico. Eliminar ayudas del Nivel 1.
// NOTA: Ejercicios vinculados a IDs reales de la BBDD

export const nivel2PrincipianteI = {
  id: 'nivel-2-principiante-i',
  name: 'Nivel 2: Principiante I',
  description: 'Domina el push-up completo, prepara la dominada, sentadillas profundas y core solido. Base para todos los skills futuros.',
  durationWeeks: 5,
  sessionsPerWeek: 4,
  difficulty: 'beginner',

  // Tests a superar (semana 4)
  targetTests: [
    {
      name: 'Flexiones perfectas',
      minimum: 10,
      target: 15,
      unit: 'reps',
      description: 'Push-ups completos, pecho al suelo, extension total, core apretado'
    },
    {
      name: 'Plank',
      minimum: 45,
      target: 60,
      unit: 'segundos',
      description: 'Cuerpo recto, codos bajo hombros, caderas alineadas'
    },
    {
      name: 'Pike Push-ups',
      minimum: 5,
      target: 8,
      unit: 'reps',
      description: 'Cadera alta, hombros sobre manos, cabeza toca suelo'
    },
    {
      name: 'Sentadillas profundas',
      minimum: 15,
      target: 20,
      unit: 'reps',
      description: 'Talones en suelo, gluteos abajo de rodillas, torso erguido'
    }
  ],

  trainingWeeks: [
    {
      week: 0,
      name: 'Semana 0: Adaptacion',
      focus: 'Introduccion a peso corporal puro',
      note: 'Mitad de reps, enfocado en tecnica perfecta',
      intensity: '50%'
    },
    {
      week: 1,
      name: 'Semana 1: Base',
      focus: 'Consolidar ejercicios nuevos',
      note: 'Aumenta volumen gradualmente',
      intensity: '70%'
    },
    {
      week: 2,
      name: 'Semana 2: Progresion',
      focus: 'Nuevas variantes y mas reps',
      note: 'Introduce pike push-up y negativa de dominada',
      intensity: '80%'
    },
    {
      week: 3,
      name: 'Semana 3: Intensificacion',
      focus: 'Maximo volumen, evaluacion',
      note: 'Maxima intensidad, simulacro de tests. Descansa bien entre sesiones.',
      intensity: '95%'
    }
  ],

  progression: {
    week0: 'Aprende los ejercicios sin ayudas, mitad de reps, tecnica perfecta',
    week1: 'Completa el rango de repeticiones, control total',
    week2: 'Introduce variantes mas dificiles, aumenta estabilidad',
    week3: 'Maxima intensidad, simula los tests, descansa bien'
  },

  // SEMANAS 0 y 1
  weeks01: {
    day1_push: {
      name: 'Dia 1: Push Base',
      goal: 'Preparar push-up completo',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '18-25 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 14, name: 'Standard Push Up', reps: '5-10', difficulty: 2,
          notes: 'Push-up completo, cuerpo recto, pecho al suelo.' },
        { id: 13, name: 'Incline Push Up', reps: '10-12', difficulty: 1,
          notes: 'Banco bajo, cuerpo recto, control total.' },
        { id: 232, name: 'Bench Dips', reps: '10-12', difficulty: 1,
          notes: 'Pies en otro banco, mas rango.' },
        { id: 286, name: 'Plank', reps: '30-35s', difficulty: 1,
          notes: 'Cuerpo perfectamente recto, aguanta.' }
      ]
    },
    day2_pull: {
      name: 'Dia 2: Pull Base',
      goal: 'Preparar la dominada',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '20-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 43, name: 'Australian Pull Up - Normal', reps: '10-12', difficulty: 1,
          notes: 'Pecho a barra, escapulas juntas.' },
        { id: 274, name: 'Active Hang', reps: '20-25s', difficulty: 1,
          notes: 'Omoplatos activados, agarre fuerte.' },
        { id: 42, name: 'Australian Pull Up - Wide', reps: '8-10', difficulty: 1,
          notes: 'Agarre ancho, mas espalda.' },
        { id: 273, name: 'Dead Hang', reps: '20-25s', difficulty: 1,
          notes: 'Agarre pasivo, relaja hombros.' }
      ]
    },
    day3_legs: {
      name: 'Dia 3: Legs Base',
      goal: 'Fortalecer piernas sin ayudas',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '20-26 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 146, name: 'Air Squat', reps: '15-18', difficulty: 1,
          notes: 'Talones en suelo, gluteos abajo de rodillas.' },
        { id: 149, name: 'Stationary Lunge', reps: '8-10', difficulty: 1,
          notes: 'Zancada profunda, rodilla trasera casi toca.' },
        { id: 181, name: 'Hip Thrust', reps: '12-15', difficulty: 1,
          notes: 'Cadera alta, contraccion gluteo 2s arriba.' },
        { id: 108, name: 'Single Leg Glute Bridge', reps: '8-10', difficulty: 1,
          notes: 'Por pierna, cadera alta y estable.' }
      ]
    },
    day4_core: {
      name: 'Dia 4: Core Base',
      goal: 'Core estable para levers futuros',
      muscleGroups: ['core'],
      duration: '15-20 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '90s', restBetweenExercises: '20s' },
      exercises: [
        { id: 294, name: 'Dead Bug', reps: '10-12', difficulty: 1,
          notes: 'Lumbar pegada, movimiento lento y controlado.' },
        { id: 296, name: 'Hollow Body Hold', reps: '15-20s', difficulty: 1,
          notes: 'Lumbar pegada al suelo, piernas extendidas.' },
        { id: 287, name: 'Side Plank', reps: '15-20s', difficulty: 2,
          notes: 'Por lado, cadera alta, sin rotar.' },
        { id: 298, name: 'Superman Hold', reps: '20-25s', difficulty: 1,
          notes: 'Brazos y piernas elevadas, contraccion lumbar.' }
      ]
    }
  },

  // SEMANA 2: Progresion
  week2: {
    day1_push: {
      name: 'Dia 1: Push Progresion',
      goal: 'Aumentar reps y nuevas variantes',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '22-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 14, name: 'Standard Push Up', reps: '10-12', difficulty: 2,
          notes: 'Mas reps, objetivo 15.' },
        { id: 31, name: 'Pike Push Up', reps: '5-6', difficulty: 2,
          notes: 'Cadera alta, hombros sobre manos. Prepara HSPU.' },
        { id: 15, name: 'Diamond Push Up', reps: '6-8', difficulty: 2,
          notes: 'Manos en diamante, codos pegados, triceps.' },
        { id: 286, name: 'Plank', reps: '40-45s', difficulty: 1,
          notes: 'Aguanta el tiempo, cuerpo perfectamente recto.' }
      ]
    },
    day2_pull: {
      name: 'Dia 2: Pull Progresion',
      goal: 'Acercarse a la dominada libre',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '25-33 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 20, name: 'Australian Pull Up', reps: '12-15', difficulty: 1,
          notes: 'Rapidas y explosivas, pecho a barra.' },
        { id: 21, name: 'Negative Pull Up', reps: '3-5', difficulty: 2,
          notes: 'Sube de cualquier forma, baja en 5 segundos.' },
        { id: 43, name: 'Australian Pull Up - Normal', reps: '10-12', difficulty: 1,
          notes: 'Control total, escapulas juntas.' },
        { id: 274, name: 'Active Hang', reps: '30-35s', difficulty: 1,
          notes: 'Omoplatos activados, agarre fuerte.' }
      ]
    },
    day3_legs: {
      name: 'Dia 3: Legs Progresion',
      goal: 'Mas volumen en piernas',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '22-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 146, name: 'Air Squat', reps: '20-22', difficulty: 1,
          notes: 'Mas reps, manten forma perfecta.' },
        { id: 149, name: 'Stationary Lunge', reps: '10-12', difficulty: 1,
          notes: 'Zancada profunda, rodilla trasera casi toca.' },
        { id: 107, name: 'Glute Bridge', reps: '15-18', difficulty: 1,
          notes: 'Cadera alta, contraccion 2s arriba.' },
        { id: 108, name: 'Single Leg Glute Bridge', reps: '10-12', difficulty: 1,
          notes: 'Por pierna, estable, sin rotar cadera.' }
      ]
    },
    day4_core: {
      name: 'Dia 4: Core Progresion',
      goal: 'Aumentar tiempos, hollow body solido',
      muscleGroups: ['core'],
      duration: '18-24 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '25s' },
      exercises: [
        { id: 286, name: 'Plank', reps: '45-50s', difficulty: 1,
          notes: 'Aguanta, cuerpo recto.' },
        { id: 287, name: 'Side Plank', reps: '25-30s', difficulty: 2,
          notes: 'Por lado, cadera alta.' },
        { id: 294, name: 'Dead Bug', reps: '12-15', difficulty: 1,
          notes: 'Movimiento lento, lumbar pegada.' },
        { id: 296, name: 'Hollow Body Hold', reps: '20-25s', difficulty: 1,
          notes: 'Lumbar pegada, aguanta mas tiempo.' }
      ]
    }
  },

  // SEMANA 3: Intensificacion
  week3: {
    day1_push: {
      name: 'Dia 1: Push Intensificacion',
      goal: 'Simular test de flexiones',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '28-35 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 14, name: 'Standard Push Up', reps: '12-15', difficulty: 2,
          notes: 'Test simulation: busca las 15 reps.' },
        { id: 31, name: 'Pike Push Up', reps: '6-8', difficulty: 2,
          notes: 'Mas profundo, mas hombros.' },
        { id: 13, name: 'Incline Push Up', reps: '15-18', difficulty: 1,
          notes: 'Mas reps, acumula volumen.' },
        { id: 286, name: 'Plank', reps: '50-55s', difficulty: 1,
          notes: 'Test simulation: busca 60s.' }
      ]
    },
    day2_pull: {
      name: 'Dia 2: Pull Intensificacion',
      goal: 'Maximo volumen de traccion',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '30-38 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 20, name: 'Australian Pull Up', reps: '15-18', difficulty: 1,
          notes: 'Maximo reps, control total.' },
        { id: 21, name: 'Negative Pull Up', reps: '4-6', difficulty: 2,
          notes: 'Bajada perfecta, 5 segundos.' },
        { id: 274, name: 'Active Hang', reps: '35-40s', difficulty: 1,
          notes: 'Agarre maximo, resistencia.' },
        { id: 273, name: 'Dead Hang', reps: '35-40s', difficulty: 1,
          notes: 'Relaja hombros, agarre puro.' }
      ]
    },
    day3_legs: {
      name: 'Dia 3: Legs Intensificacion',
      goal: 'Simular test de sentadillas',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '28-35 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        { id: 146, name: 'Air Squat', reps: '22-25', difficulty: 1,
          notes: 'Test simulation: busca 25 reps seguidas.' },
        { id: 149, name: 'Stationary Lunge', reps: '12-15', difficulty: 1,
          notes: 'Zancada profunda, maximo reps.' },
        { id: 181, name: 'Hip Thrust', reps: '18-20', difficulty: 1,
          notes: 'Maximo reps, gluteo fuerte.' },
        { id: 108, name: 'Single Leg Glute Bridge', reps: '12-15', difficulty: 1,
          notes: 'Por pierna, estable.' }
      ]
    },
    day4_core: {
      name: 'Dia 4: Core Intensificacion',
      goal: 'Simular tests de plank y core',
      muscleGroups: ['core'],
      duration: '24-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '3 min', restBetweenExercises: '30s' },
      exercises: [
        { id: 286, name: 'Plank', reps: '55-60s', difficulty: 1,
          notes: 'Test simulation: aguanta 60s.' },
        { id: 296, name: 'Hollow Body Hold', reps: '25-30s', difficulty: 1,
          notes: 'Lumbar pegada, mas tiempo.' },
        { id: 294, name: 'Dead Bug', reps: '15-18', difficulty: 1,
          notes: 'Control total, sin prisa.' },
        { id: 287, name: 'Side Plank', reps: '30-35s', difficulty: 2,
          notes: 'Por lado, maximo tiempo.' }
      ]
    }
  },

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
    return null
  },

  getWeekSessions(weekNum) {
    const days = ['day1_push', 'day2_pull', 'day3_legs', 'day4_core']
    return days.map(day => this.getSession(weekNum, day))
  },

  // Tests oficiales
  testWeek: {
    week: 4,
    name: 'Semana 4: Tests Oficiales',
    description: 'Evaluacion para pasar al Nivel 3: Principiante II',
    preparation: [
      {
        session: '2-3 dias antes',
        activities: ['Descanso completo', 'Movilidad suave', 'Dormir bien', 'Hidratacion']
      }
    ],
    tests: {
      name: 'TESTS NIVEL 2',
      description: 'Debes superar los 4 tests para avanzar al Nivel 3 (Principiante II)',
      requirements: [
        {
          name: 'Flexiones perfectas',
          minimum: 10,
          target: 15,
          unit: 'repeticiones',
          form: 'Completos, pecho al suelo, extension total, core apretado'
        },
        {
          name: 'Plank',
          minimum: 45,
          target: 60,
          unit: 'segundos',
          form: 'Cuerpo recto, codos bajo hombros, caderas alineadas'
        },
        {
          name: 'Pike Push-ups',
          minimum: 5,
          target: 8,
          unit: 'repeticiones',
          form: 'Cadera alta, hombros sobre manos, cabeza toca suelo'
        },
        {
          name: 'Sentadillas profundas',
          minimum: 15,
          target: 20,
          unit: 'repeticiones',
          form: 'Talones en suelo, gluteos abajo de rodillas, torso erguido'
        }
      ]
    }
  },

  tips: [
    'Semana 0: Los ejercicios sin ayuda son mas dificiles, prioriza la tecnica',
    'Semana 1: Aumenta volumen gradualmente, no sacrifiques forma por reps',
    'Semana 2: Introduce pike push-up y negativa de dominada, se paciente',
    'Semana 3: Simula los tests, maxima intensidad, descansa bien entre sesiones',
    'Si no pasas algun test, no pasa nada, practica esa habilidad mas',
    'El hollow body hold es la base de todos los levers, dominalo bien'
  ]
}

export default nivel2PrincipianteI
