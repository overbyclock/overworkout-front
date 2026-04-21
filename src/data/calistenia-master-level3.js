// Calistenia Master - Nivel 3: Principiante II
// Estructura: 5 semanas (0 adaptacion + 1 base + 1 progresion + 1 intensificacion + 1 tests)
// OBJETIVO: Evolucionar desde peso corporal basico a primeros skills tecnicos.
// NOTA: Ejercicios vinculados a IDs reales de la BBDD

export const nivel3PrincipianteII = {
  id: 'nivel-3-principiante-ii',
  name: 'Nivel 3: Principiante II',
  description:
    'Consolida el peso corporal e introduce los primeros skills tecnicos: L-sit tuck, wall walks y proyeccion de hombros. Base para dominada completa y handstand.',
  durationWeeks: 5,
  sessionsPerWeek: 4,
  difficulty: 'beginner',

  // Tests a superar (semana 4)
  targetTests: [
    {
      name: 'Dominadas negativas',
      minimum: 3,
      target: 5,
      unit: 'reps',
      description: 'Sube de cualquier forma, bajada controlada de 5 segundos minimo'
    },
    {
      name: 'Flexiones diamante',
      minimum: 8,
      target: 12,
      unit: 'reps',
      description: 'Manos en diamante, codos pegados al cuerpo, pecho toca manos'
    },
    {
      name: 'L-sit tuck',
      minimum: 10,
      target: 15,
      unit: 'segundos',
      description: 'Manos en suelo/soportes, rodillas al pecho, piernas off ground'
    },
    {
      name: 'Wall walks',
      minimum: 3,
      target: 5,
      unit: 'reps',
      description: 'Desde plancha, camina manos hacia la pared hasta posicion vertical'
    }
  ],

  trainingWeeks: [
    {
      week: 0,
      name: 'Semana 0: Adaptacion',
      focus: 'Introduccion a skills tecnicos',
      note: 'Mitad de reps, enfocado en tecnica perfecta de wall walks y L-sit',
      intensity: '55%'
    },
    {
      week: 1,
      name: 'Semana 1: Base',
      focus: 'Consolidar nuevos ejercicios',
      note: 'Aumenta volumen gradualmente, controla la bajada en dominadas',
      intensity: '70%'
    },
    {
      week: 2,
      name: 'Semana 2: Progresion',
      focus: 'Nuevas variantes y mas reps',
      note: 'Introduce diamond push-up y band assisted pull-up',
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
    week0: 'Aprende wall walks y L-sit tuck, mitad de reps, tecnica perfecta',
    week1: 'Completa el rango de repeticiones, control total en negativas',
    week2: 'Introduce diamond push-up y band assisted pull-up, aumenta estabilidad',
    week3: 'Maxima intensidad, simula los tests, descansa bien'
  },

  // SEMANAS 0 y 1
  weeks01: {
    day1_push: {
      name: 'Dia 1: Push Base + Skill',
      goal: 'Preparar diamond push-up y proyeccion de hombros',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '20-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 14,
          name: 'Standard Push Up',
          reps: '8-10',
          difficulty: 2,
          notes: 'Push-up completo, cuerpo recto, pecho al suelo.'
        },
        {
          id: 15,
          name: 'Diamond Push Up',
          reps: '5-6',
          difficulty: 2,
          notes: 'Manos en diamante, codos pegados, triceps. Baja controlado.'
        },
        {
          id: 16,
          name: 'Wide Push Up',
          reps: '8-10',
          difficulty: 2,
          notes: 'Agarre ancho, enfocado en pecho, codos a 45 grados.'
        },
        {
          id: 402,
          name: 'Planche Lean',
          reps: '15-20s',
          difficulty: 2,
          notes: 'Manos en suelo, cuerpo inclinado adelante, proyeccion de hombros.'
        }
      ]
    },
    day2_pull: {
      name: 'Dia 2: Pull Base + Skill',
      goal: 'Acercarse a la dominada libre',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '22-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 21,
          name: 'Negative Pull Up',
          reps: '3-4',
          difficulty: 2,
          notes: 'Sube de cualquier forma, baja en 5 segundos minimo.'
        },
        {
          id: 519,
          name: 'Band Assisted Pull Up',
          reps: '5-6',
          difficulty: 2,
          notes: 'Banda en los pies, tirada completa, barbilla sobre barra.'
        },
        {
          id: 20,
          name: 'Australian Pull Up',
          reps: '10-12',
          difficulty: 1,
          notes: 'Pecho a barra, escapulas juntas, control total.'
        },
        {
          id: 274,
          name: 'Active Hang',
          reps: '25-30s',
          difficulty: 1,
          notes: 'Omoplatos activados, agarre fuerte, resistencia.'
        }
      ]
    },
    day3_legs: {
      name: 'Dia 3: Legs Base',
      goal: 'Fortalecer piernas con carga unilateral',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '22-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 154,
          name: 'Bulgarian Split Squat',
          reps: '6-8',
          difficulty: 2,
          notes: 'Pie trasero en banco, zancada profunda, torso erguido.'
        },
        {
          id: 146,
          name: 'Air Squat',
          reps: '20-22',
          difficulty: 1,
          notes: 'Talones en suelo, gluteos abajo de rodillas, rapido y controlado.'
        },
        {
          id: 149,
          name: 'Stationary Lunge',
          reps: '10-12',
          difficulty: 1,
          notes: 'Zancada profunda, rodilla trasera casi toca el suelo.'
        },
        {
          id: 108,
          name: 'Single Leg Glute Bridge',
          reps: '10-12',
          difficulty: 1,
          notes: 'Por pierna, cadera alta y estable, sin rotar.'
        }
      ]
    },
    day4_core: {
      name: 'Dia 4: Core + Skills',
      goal: 'Introducir L-sit tuck y wall walks',
      muscleGroups: ['core', 'shoulders'],
      duration: '18-25 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '90s', restBetweenExercises: '20s' },
      exercises: [
        {
          id: 303,
          name: 'Tuck L-Sit',
          reps: '5-8s',
          difficulty: 2,
          notes: 'Manos en suelo o soportes, rodillas al pecho, piernas off ground.'
        },
        {
          id: 286,
          name: 'Plank',
          reps: '40-45s',
          difficulty: 1,
          notes: 'Cuerpo perfectamente recto, codos bajo hombros, caderas alineadas.'
        },
        {
          id: 296,
          name: 'Hollow Body Hold',
          reps: '20-25s',
          difficulty: 1,
          notes: 'Lumbar pegada al suelo, piernas extendidas, brazos detras.'
        },
        {
          id: 487,
          name: 'Wall Walk',
          reps: '2-3',
          difficulty: 2,
          notes: 'Desde plancha, camina manos hacia pared. Baja controlado.'
        }
      ]
    }
  },

  // SEMANA 2: Progresion
  week2: {
    day1_push: {
      name: 'Dia 1: Push Progresion',
      goal: 'Aumentar reps y dificultad en push',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '24-32 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 14,
          name: 'Standard Push Up',
          reps: '10-12',
          difficulty: 2,
          notes: 'Mas reps, objetivo 15. Control en bajada.'
        },
        {
          id: 15,
          name: 'Diamond Push Up',
          reps: '7-8',
          difficulty: 2,
          notes: 'Manos en diamante, codos pegados. Objetivo 8 reps limpias.'
        },
        {
          id: 16,
          name: 'Wide Push Up',
          reps: '10-12',
          difficulty: 2,
          notes: 'Agarre ancho, enfocado en pecho. Control total.'
        },
        {
          id: 402,
          name: 'Planche Lean',
          reps: '20-25s',
          difficulty: 2,
          notes: 'Inclinacion maxima posible, proyeccion de hombros activa.'
        }
      ]
    },
    day2_pull: {
      name: 'Dia 2: Pull Progresion',
      goal: 'Aumentar volumen de traccion, preparar dominada',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '26-35 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 21,
          name: 'Negative Pull Up',
          reps: '4-5',
          difficulty: 2,
          notes: 'Bajada de 5 segundos, control absoluto.'
        },
        {
          id: 519,
          name: 'Band Assisted Pull Up',
          reps: '6-8',
          difficulty: 2,
          notes: 'Tirada completa, barbilla sobre barra, sin impulso.'
        },
        {
          id: 20,
          name: 'Australian Pull Up',
          reps: '12-15',
          difficulty: 1,
          notes: 'Rapidas y explosivas, pecho a barra.'
        },
        {
          id: 274,
          name: 'Active Hang',
          reps: '30-35s',
          difficulty: 1,
          notes: 'Omoplatos activados, agarre fuerte, maximo tiempo.'
        }
      ]
    },
    day3_legs: {
      name: 'Dia 3: Legs Progresion',
      goal: 'Mas volumen en piernas unilateral',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '24-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 154,
          name: 'Bulgarian Split Squat',
          reps: '8-10',
          difficulty: 2,
          notes: 'Por pierna, zancada profunda, torso erguido.'
        },
        {
          id: 146,
          name: 'Air Squat',
          reps: '22-25',
          difficulty: 1,
          notes: 'Mas reps, manten forma perfecta, ritmo constante.'
        },
        {
          id: 149,
          name: 'Stationary Lunge',
          reps: '12-15',
          difficulty: 1,
          notes: 'Zancada profunda, rodilla trasera casi toca.'
        },
        {
          id: 108,
          name: 'Single Leg Glute Bridge',
          reps: '12-15',
          difficulty: 1,
          notes: 'Por pierna, cadera alta, sin rotar.'
        }
      ]
    },
    day4_core: {
      name: 'Dia 4: Core + Skills Progresion',
      goal: 'Aumentar tiempos en L-sit tuck y wall walks',
      muscleGroups: ['core', 'shoulders'],
      duration: '20-28 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '2 min', restBetweenExercises: '25s' },
      exercises: [
        {
          id: 303,
          name: 'Tuck L-Sit',
          reps: '8-10s',
          difficulty: 2,
          notes: 'Rodillas al pecho, intenta enderezar espalda.'
        },
        {
          id: 286,
          name: 'Plank',
          reps: '45-50s',
          difficulty: 1,
          notes: 'Cuerpo recto, aguanta. Objetivo 60s.'
        },
        {
          id: 296,
          name: 'Hollow Body Hold',
          reps: '25-30s',
          difficulty: 1,
          notes: 'Lumbar pegada, aguanta mas tiempo.'
        },
        {
          id: 487,
          name: 'Wall Walk',
          reps: '3',
          difficulty: 2,
          notes: 'Intenta llegar lo mas vertical posible. Baja controlado.'
        }
      ]
    }
  },

  // SEMANA 3: Intensificacion
  week3: {
    day1_push: {
      name: 'Dia 1: Push Intensificacion',
      goal: 'Simular test de diamond push-up',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '28-35 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        {
          id: 14,
          name: 'Standard Push Up',
          reps: '12-15',
          difficulty: 2,
          notes: 'Maximo reps, control total, acumula volumen.'
        },
        {
          id: 15,
          name: 'Diamond Push Up',
          reps: '8-10',
          difficulty: 2,
          notes: 'Test simulation: busca las 8 reps limpias.'
        },
        {
          id: 16,
          name: 'Wide Push Up',
          reps: '12-15',
          difficulty: 2,
          notes: 'Maximo reps, pecho fuerte, control.'
        },
        {
          id: 402,
          name: 'Planche Lean',
          reps: '25-30s',
          difficulty: 2,
          notes: 'Maxima proyeccion, hombros activos.'
        }
      ]
    },
    day2_pull: {
      name: 'Dia 2: Pull Intensificacion',
      goal: 'Simular test de dominadas negativas',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '30-38 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        {
          id: 21,
          name: 'Negative Pull Up',
          reps: '5',
          difficulty: 2,
          notes: 'Test simulation: 5 segundos de bajada, control absoluto.'
        },
        {
          id: 519,
          name: 'Band Assisted Pull Up',
          reps: '8-10',
          difficulty: 2,
          notes: 'Maximo reps, barbilla sobre barra.'
        },
        {
          id: 20,
          name: 'Australian Pull Up',
          reps: '15-18',
          difficulty: 1,
          notes: 'Maximo reps, control total.'
        },
        {
          id: 274,
          name: 'Active Hang',
          reps: '35-40s',
          difficulty: 1,
          notes: 'Agarre maximo, resistencia.'
        }
      ]
    },
    day3_legs: {
      name: 'Dia 3: Legs Intensificacion',
      goal: 'Maximo volumen en piernas',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '26-33 min',
      isCircuit: true,
      circuitConfig: { rounds: 4, restBetweenRounds: '3 min', restBetweenExercises: '45s' },
      exercises: [
        {
          id: 154,
          name: 'Bulgarian Split Squat',
          reps: '10-12',
          difficulty: 2,
          notes: 'Por pierna, zancada profunda, maximo reps.'
        },
        {
          id: 146,
          name: 'Air Squat',
          reps: '25',
          difficulty: 1,
          notes: 'Maximo reps, ritmo constante, forma perfecta.'
        },
        {
          id: 149,
          name: 'Stationary Lunge',
          reps: '15',
          difficulty: 1,
          notes: 'Zancada profunda, maximo reps.'
        },
        {
          id: 108,
          name: 'Single Leg Glute Bridge',
          reps: '15',
          difficulty: 1,
          notes: 'Por pierna, estable, maximo reps.'
        }
      ]
    },
    day4_core: {
      name: 'Dia 4: Core + Skills Intensificacion',
      goal: 'Simular tests de L-sit tuck y wall walks',
      muscleGroups: ['core', 'shoulders'],
      duration: '24-30 min',
      isCircuit: true,
      circuitConfig: { rounds: 3, restBetweenRounds: '3 min', restBetweenExercises: '30s' },
      exercises: [
        {
          id: 303,
          name: 'Tuck L-Sit',
          reps: '10-12s',
          difficulty: 2,
          notes: 'Test simulation: busca 10s seguidos.'
        },
        {
          id: 286,
          name: 'Plank',
          reps: '50-60s',
          difficulty: 1,
          notes: 'Maximo tiempo, cuerpo recto.'
        },
        {
          id: 296,
          name: 'Hollow Body Hold',
          reps: '25-30s',
          difficulty: 1,
          notes: 'Lumbar pegada, maximo tiempo.'
        },
        {
          id: 487,
          name: 'Wall Walk',
          reps: '3-4',
          difficulty: 2,
          notes: 'Test simulation: busca 3 wall walks completos.'
        }
      ]
    }
  },

  // SEMANA 4: Tests de nivel
  testWeek: {
    week: 4,
    name: 'Semana 4: Tests de Nivel 3',
    description: 'Evalua si estas listo para el Nivel 4: Intermedio I',
    preparation: [
      {
        session: '2-3 dias antes',
        activities: ['Descanso completo', 'Movilidad suave', 'Dormir bien', 'Hidratacion']
      }
    ],
    tests: {
      name: 'TESTS NIVEL 3',
      description: 'Debes superar los 4 tests para avanzar al Nivel 4 (Intermedio I)',
      requirements: [
        {
          name: 'Dominadas negativas',
          minimum: 3,
          target: 5,
          unit: 'repeticiones',
          form: 'Sube de cualquier forma, bajada controlada de 5 segundos minimo'
        },
        {
          name: 'Flexiones diamante',
          minimum: 8,
          target: 12,
          unit: 'repeticiones',
          form: 'Manos en diamante, codos pegados al cuerpo, pecho toca manos'
        },
        {
          name: 'L-sit tuck',
          minimum: 10,
          target: 15,
          unit: 'segundos',
          form: 'Manos en suelo o soportes, rodillas al pecho, sin tocar el suelo'
        },
        {
          name: 'Wall walks',
          minimum: 3,
          target: 5,
          unit: 'repeticiones',
          form: 'Desde plancha, camina manos hacia la pared hasta posicion casi vertical'
        }
      ]
    }
  },

  tips: [
    'Los wall walks preparan tu cuerpo para el handstand. No te apoyes contra la pared, solo usala como guia.',
    'El L-sit tuck es la base del L-sit completo. Manten la espalda recta y los hombros bajados.',
    'Las diamond push-ups desarrollan triceps fuertes, necesarios para el handstand push-up futuro.',
    'El planche lean no es un ejercicio de reps, es de posicion. Inclinate todo lo que puedas sin doblar codos.',
    'Las band assisted pull-ups son la mejor forma de aprender la dominada. Usa una banda que te permita 5-8 reps.'
  ]
}

export default nivel3PrincipianteII
