// Calistenia Master - Nivel 1: Fundamentos
// Estructura: 4 semanas (3 semanas entreno + 1 semana tests)
// Frecuencia: 4 sesiones por semana (usuario elige sus días)

export const nivel1Fundamentos = {
  id: 'nivel-1-fundamentos',
  name: 'Nivel 1: Fundamentos',
  description: 'Construye la base de fuerza y técnica necesaria para tu progresión en calistenia',
  durationWeeks: 4,
  sessionsPerWeek: 4,
  difficulty: 'beginner',
  
  // Semanas 1-3: Entrenamiento
  trainingWeeks: [
    {
      week: 1,
      focus: 'Adaptación técnica',
      sessions: ['Día 1: Push', 'Día 2: Pull', 'Día 3: Legs', 'Día 4: Full Body']
    },
    {
      week: 2,
      focus: 'Aumento de volumen',
      sessions: ['Día 1: Push', 'Día 2: Pull', 'Día 3: Legs', 'Día 4: Full Body']
    },
    {
      week: 3,
      focus: 'Intensificación',
      sessions: ['Día 1: Push', 'Día 2: Pull', 'Día 3: Legs', 'Día 4: Full Body']
    }
  ],
  
  // Sesiones detalladas
  sessions: {
    day1_push: {
      name: 'Día 1: Push',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '45-60 min',
      exercises: [
        {
          name: 'Push-ups asistidos (rodillas)',
          sets: 4,
          reps: '8-12',
          rest: '90s',
          notes: 'Controla la bajada, pecho casi toca el suelo. Mantén el core apretado.',
          videoSearch: 'knee push up technique'
        },
        {
          name: 'Pike push-ups',
          sets: 3,
          reps: '6-10',
          rest: '90s',
          notes: 'Cadera alta, cabeza toca el suelo entre manos. Preparación para handstand push-ups.',
          videoSearch: 'pike push up calisthenics'
        },
        {
          name: 'Diamond push-ups asistidos',
          sets: 3,
          reps: '5-8',
          rest: '90s',
          notes: 'Manos en forma de diamante, codos pegados al cuerpo. Foco en tríceps.',
          videoSearch: 'diamond push up beginner'
        },
        {
          name: 'Dips en banco',
          sets: 3,
          reps: '8-12',
          rest: '90s',
          notes: 'Manos detrás, baja controlado hasta 90° de codo. No descanses arriba.',
          videoSearch: 'bench dips proper form'
        },
        {
          name: 'Plank to push-up',
          sets: 3,
          reps: '6-10',
          rest: '60s',
          notes: 'Desde plank pasa a push-up posición alternando brazos. Core siempre activo.',
          videoSearch: 'plank push up transition'
        }
      ]
    },
    
    day2_pull: {
      name: 'Día 2: Pull',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '45-60 min',
      exercises: [
        {
          name: 'Australian pull-ups (barra baja)',
          sets: 4,
          reps: '8-12',
          rest: '90s',
          notes: 'Agarre prono, pecho a la barra. Cuerpo recto como tabla.',
          videoSearch: 'australian pull up inverted row'
        },
        {
          name: 'Flexiones inversas (remo inverso)',
          sets: 3,
          reps: '8-10',
          rest: '90s',
          notes: 'Boca arriba, empuja con codos hacia el suelo. Entre mesa o banco bajo.',
          videoSearch: 'reverse push up back exercise'
        },
        {
          name: 'Dead hang (colgado)',
          sets: 3,
          reps: '20-30s',
          rest: '60s',
          notes: 'Colgado activo, hombros alejados de orejas. Construye fuerza de agarre.',
          videoSearch: 'dead hang proper form'
        },
        {
          name: 'Scapular pull-ups',
          sets: 3,
          reps: '8-10',
          rest: '60s',
          notes: 'Desde colgado activo, baja omóplatos sin doblar brazos. Movimiento escápula.',
          videoSearch: 'scapular pull up activation'
        },
        {
          name: 'Hollow body hold',
          sets: 3,
          reps: '20-30s',
          rest: '60s',
          notes: 'Lumbar pegado al suelo, piernas y hombros elevados. Core fuerte.',
          videoSearch: 'hollow body hold gymnastics'
        }
      ]
    },
    
    day3_legs: {
      name: 'Día 3: Legs',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '45-60 min',
      exercises: [
        {
          name: 'Sentadillas bodyweight',
          sets: 4,
          reps: '12-15',
          rest: '90s',
          notes: 'Caderas abajo de las rodillas, espalda recta, talones en el suelo.',
          videoSearch: 'bodyweight squat proper form'
        },
        {
          name: 'Bulgarian split squat asistida',
          sets: 3,
          reps: '8-10',
          rest: '90s',
          notes: 'Pie trasero en silla/banco bajo. Baja controlado, rodilla casi toca suelo.',
          videoSearch: 'bulgarian split squat beginner'
        },
        {
          name: 'Hip thrust',
          sets: 3,
          reps: '12-15',
          rest: '90s',
          notes: 'Espalda en banco, eleva caderas contrayendo glúteos. Pausa arriba 1s.',
          videoSearch: 'bodyweight hip thrust'
        },
        {
          name: 'Elevación de talones (calf raises)',
          sets: 4,
          reps: '15-20',
          rest: '60s',
          notes: 'Borde de escalón, baja talones por debajo, sube lo máximo posible.',
          videoSearch: 'calf raises bodyweight'
        },
        {
          name: 'Plank lateral',
          sets: 3,
          reps: '20s',
          rest: '60s',
          notes: 'Por cada lado. Codo debajo de hombro, caderas alineadas.',
          videoSearch: 'side plank proper form'
        }
      ]
    },
    
    day4_fullbody: {
      name: 'Día 4: Full Body + Core',
      muscleGroups: ['full_body', 'core'],
      duration: '40-50 min',
      exercises: [
        {
          name: 'Burpees sin salto',
          sets: 3,
          reps: '6-8',
          rest: '90s',
          notes: 'Desde pie, manos al suelo, pies atrás, flexión, volver, subir sin saltar.',
          videoSearch: 'burpees no jump beginner'
        },
        {
          name: 'Mountain climbers',
          sets: 3,
          reps: '20-30s',
          rest: '60s',
          notes: 'Posición plank, rodillas alternas a pecho rápido. Core apretado.',
          videoSearch: 'mountain climbers exercise'
        },
        {
          name: 'Supermans',
          sets: 3,
          reps: '12-15',
          rest: '60s',
          notes: 'Boca abajo, eleva pecho y piernas simultáneamente. Espalda baja.',
          videoSearch: 'superman exercise back'
        },
        {
          name: 'Dead bug',
          sets: 3,
          reps: '8-10',
          rest: '60s',
          notes: 'Boca arriba, brazos y piernas arriba. Baja brazo y pierna opuestos sin arquear lumbar.',
          videoSearch: 'dead bug exercise core'
        },
        {
          name: 'L-sit tuck',
          sets: 3,
          reps: '10-15s',
          rest: '60s',
          notes: 'En paralelas o bancos, eleva rodillas al pecho. Mantén brazos rectos.',
          videoSearch: 'l sit tuck progression'
        }
      ]
    }
  },
  
  // Semana 4: Tests
  testWeek: {
    week: 4,
    name: 'Semana de Evaluación',
    description: 'Test para pasar al Nivel 2',
    
    preparation: [
      {
        session: 'Sesión Preparatoria 1',
        focus: 'Movilidad y técnica',
        activities: [
          'Movilidad general 20 minutos',
          'Push-ups técnicas 3x5 (fácil)',
          'Pull-ups asistidos 3x5 (fácil)',
          'Estiramientos específicos'
        ]
      },
      {
        session: 'Sesión Preparatoria 2',
        focus: 'Activación específica',
        activities: [
          'Calentamiento 10 minutos',
          'Push-ups 3x5 (ritmo normal)',
          'Australian pull-ups 3x5',
          'Core suave: plank 2x20s'
        ]
      }
    ],
    
    tests: {
      name: 'TESTS OFICIALES',
      description: 'Debes superar al menos 4 de 5 tests para pasar al Nivel 2',
      requirements: [
        {
          name: 'Push-ups',
          minimum: 10,
          target: 15,
          unit: 'repeticiones',
          form: 'Pecho al suelo, core apretado, brazos completos'
        },
        {
          name: 'Australian Pull-ups',
          minimum: 12,
          target: 15,
          unit: 'repeticiones',
          form: 'Pecho a la barra, cuerpo recto'
        },
        {
          name: 'Sentadillas Bodyweight',
          minimum: 20,
          target: 30,
          unit: 'repeticiones',
          form: 'Cadera debajo de rodilla, lumbar recto'
        },
        {
          name: 'Plank',
          minimum: 45,
          target: 60,
          unit: 'segundos',
          form: 'Cuerpo recto, sin caer cadera'
        },
        {
          name: 'Hollow Body Hold',
          minimum: 20,
          target: 30,
          unit: 'segundos',
          form: 'Lumbar pegado, piernas y hombros elevados'
        }
      ]
    },
    
    nextLevel: {
      name: 'Nivel 2: Fuerza Base',
      unlocks: [
        'Acceso a ejercicios más avanzados',
        'Skill: Hollow Body Hold (logrado)',
        'Mayor volumen de entrenamiento'
      ]
    }
  },
  
  // Progresión semanal
  progression: {
    week1: 'Aprende la técnica correcta. No busques velocidad, busca calidad.',
    week2: 'Aumenta 1-2 repeticiones por serie si puedes hacerlo con buena forma.',
    week3: 'Última semana dura antes de tests. Mantén la intensidad.',
    week4: 'Descansa adecuadamente entre tests. No entrenes duro esta semana.'
  },
  
  // Consejos generales
  tips: [
    'Descansa 48h entre sesiones del mismo grupo muscular',
    'Prioriza la técnica sobre las repeticiones',
    'Si fallas en un ejercicio, descansa 2 minutos e intenta la serie de nuevo',
    'Mantén un diario de entrenamiento anotando tus repeticiones',
    'Duerme 7-8 horas para recuperación óptima',
    'Hidrátate bien durante el entrenamiento'
  ]
}

export default nivel1Fundamentos
