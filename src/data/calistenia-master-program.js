// Calistenia Master - Nivel 1: Fundamentos
// Estructura: 5 semanas (1 semana adaptación + 3 semanas entreno + 1 semana tests)
// Frecuencia: 4 sesiones por semana (usuario elige sus días)
// NOTA: Todos los ejercicios están vinculados a IDs reales de la BBDD

export const nivel1Fundamentos = {
  id: 'nivel-1-fundamentos',
  name: 'Nivel 1: Fundamentos',
  description: 'Construye la base de fuerza y técnica necesaria para tu progresión en calistenia',
  durationWeeks: 5,
  sessionsPerWeek: 4,
  difficulty: 'beginner',
  
  // Semanas 0-3: Entrenamiento (4 semanas + tests)
  trainingWeeks: [
    {
      week: 0,
      focus: 'Semana de Adaptación',
      sessions: ['Día 1: Push Básico', 'Día 2: Pull Básico', 'Día 3: Legs Básico', 'Día 4: Core Básico'],
      note: 'Aprende los movimientos sin presión, mitad de repeticiones'
    },
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
  
  // Progresión semanal
  progression: {
    week0: 'Aprende la técnica, haz solo la mitad de repeticiones, sin presión',
    week1: 'Enfoque en técnica perfecta, rango bajo-moderado de repeticiones',
    week2: 'Aumenta 1-2 repeticiones por ejercicio si la técnica es buena',
    week3: 'Busca el rango alto de repeticiones, mantén buena forma'
  },
  
  // Sesiones detalladas con ejercicios reales de la BBDD
  sessions: {
    day1_push: {
      name: 'Día 1: Push',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      duration: '45-60 min',
      isCircuit: true,
      circuitConfig: {
        rounds: 3,
        restBetweenRounds: '2 min',
        restBetweenExercises: '30s'
      },
      exercises: [
        {
          id: 10, // Wall Push Up (más fácil que knee push up)
          name: 'Wall Push Up',
          reps: '10-15',
          difficulty: 1, // 🔥
          notes: 'Manos en la pared, cuerpo inclinado. Controla todo el movimiento.',
          videoSearch: 'wall push up beginner'
        },
        {
          id: 11, // Knee Push Up
          name: 'Knee Push Up',
          reps: '6-10',
          difficulty: 1, // 🔥
          notes: 'Rodillas en el suelo, controla la bajada, pecho casi toca.',
          videoSearch: 'knee push up technique'
        },
        {
          id: 13, // Incline Push Up (más fácil que close grip)
          name: 'Incline Push Up',
          reps: '8-12',
          difficulty: 1, // 🔥
          notes: 'Manos en banco elevado, cuerpo recto. Excelente para empezar.',
          videoSearch: 'incline push up beginner'
        },
        {
          id: 232, // Bench Dips
          name: 'Bench Dips',
          reps: '6-10',
          difficulty: 1, // 🔥
          notes: 'Manos detrás en banco, baja controlado, codos hacia atrás.',
          videoSearch: 'bench dips proper form'
        },
        {
          id: 286, // Plank (sustituye wall handstand - más básico)
          name: 'Plank',
          reps: '20-30s',
          difficulty: 1, // 🔥
          notes: 'Apoyo en antebrazos, cuerpo recto como tabla. Respira normal.',
          videoSearch: 'plank proper form beginner'
        }
      ]
    },
    
    day2_pull: {
      name: 'Día 2: Pull',
      muscleGroups: ['back', 'biceps', 'forearms'],
      duration: '45-60 min',
      isCircuit: true,
      circuitConfig: {
        rounds: 3,
        restBetweenRounds: '2 min',
        restBetweenExercises: '30s'
      },
      exercises: [
        {
          id: 42, // Australian Pull Up - Wide (más fácil)
          name: 'Australian Pull Up - Wide Grip',
          reps: '8-12',
          difficulty: 1, // 🔥
          notes: 'Barra baja, agarre ancho, pecho a la barra. Cuerpo recto.',
          videoSearch: 'australian pull up wide beginner'
        },
        {
          id: 273, // Dead Hang (básico)
          name: 'Dead Hang',
          reps: '15-20s',
          difficulty: 1, // 🔥
          notes: 'Simplemente cuelga de la barra. Agarre cómodo, relaja hombros.',
          videoSearch: 'dead hang beginner'
        },
        {
          id: 20, // Australian Pull Up - Normal
          name: 'Australian Pull Up',
          reps: '6-10',
          difficulty: 1, // 🔥
          notes: 'Agarre normal, pecho a la barra, codos cerca del cuerpo.',
          videoSearch: 'australian pull up beginner'
        },
        {
          id: 298, // Superman Hold (más fácil que negative pull up)
          name: 'Superman Hold',
          reps: '15-20s',
          difficulty: 1, // 🔥
          notes: 'Boca abajo, eleva pecho y piernas ligeramente. Espalda baja.',
          videoSearch: 'superman hold beginner'
        },
        {
          id: 294, // Dead Bug
          name: 'Dead Bug',
          reps: '6-8',
          difficulty: 1, // 🔥
          notes: 'Boca arriba, baja brazo y pierna opuestos lentamente.',
          videoSearch: 'dead bug exercise beginner'
        }
      ]
    },
    
    day3_legs: {
      name: 'Día 3: Legs',
      muscleGroups: ['legs', 'glutes', 'calves'],
      duration: '45-60 min',
      isCircuit: true,
      circuitConfig: {
        rounds: 3,
        restBetweenRounds: '2 min',
        restBetweenExercises: '30s'
      },
      exercises: [
        {
          id: 148, // Sit To Stand (más fácil que air squat)
          name: 'Sit To Stand',
          reps: '10-12',
          difficulty: 1, // 🔥
          notes: 'Desde una silla, levántate sin impulso, vuelve a sentarte controlado.',
          videoSearch: 'sit to stand exercise beginner'
        },
        {
          id: 147, // Box Squat
          name: 'Box Squat',
          reps: '8-12',
          difficulty: 1, // 🔥
          notes: 'Sentadilla hasta una caja/silla, apoya glúteos, sube sin impulso.',
          videoSearch: 'box squat beginner proper form'
        },
        {
          id: 107, // Glute Bridge (más fácil que hip thrust)
          name: 'Glute Bridge',
          reps: '12-15',
          difficulty: 1, // 🔥
          notes: 'Espalda en el suelo, eleva caderas apretando glúteos.',
          videoSearch: 'glute bridge beginner'
        },
        {
          id: 188, // Standing Calf Raise
          name: 'Standing Calf Raise',
          reps: '12-15',
          difficulty: 1, // 🔥
          notes: 'De pie, sube en puntas, bája controlado. Puedes usar pared para apoyo.',
          videoSearch: 'standing calf raise beginner'
        },
        {
          id: 108, // Single Leg Glute Bridge (versión más fácil que side plank)
          name: 'Single Leg Glute Bridge',
          reps: '6-8',
          difficulty: 1, // 🔥
          notes: 'Glute bridge con una pierna estirada. Alterna piernas.',
          videoSearch: 'single leg glute bridge beginner'
        }
      ]
    },
    
    day4_fullbody: {
      name: 'Día 4: Full Body + Core',
      muscleGroups: ['full_body', 'core'],
      duration: '40-50 min',
      isCircuit: true,
      circuitConfig: {
        rounds: 3,
        restBetweenRounds: '2 min',
        restBetweenExercises: '30s'
      },
      exercises: [
        {
          id: 319, // Jumping Jack (más fácil que half burpee)
          name: 'Jumping Jack',
          reps: '30s',
          difficulty: 1, // 🔥
          notes: 'Salto abriendo piernas y brazos, vuelve. Ritmo cómodo.',
          videoSearch: 'jumping jack beginner'
        },
        {
          id: 320, // High Knees (más suave que mountain climbers)
          name: 'High Knees',
          reps: '20s',
          difficulty: 1, // 🔥
          notes: 'Marcha en el sitio llevando rodillas altas. Sin impacto fuerte.',
          videoSearch: 'high knees beginner exercise'
        },
        {
          id: 298, // Superman Hold
          name: 'Superman Hold',
          reps: '15-20s',
          difficulty: 1, // 🔥
          notes: 'Boca abajo, eleva pecho y piernas ligeramente. Espalda baja.',
          videoSearch: 'superman hold beginner'
        },
        {
          id: 288, // Reverse Plank (más fácil que plank normal)
          name: 'Reverse Plank',
          reps: '15-20s',
          difficulty: 1, // 🔥
          notes: 'Apoyo en manos mirando hacia arriba, eleva caderas.',
          videoSearch: 'reverse plank beginner'
        },
        {
          id: 290, // Plank with Leg Raise (más fácil que L-Sit)
          name: 'Plank with Leg Raise',
          reps: '6-8',
          difficulty: 1, // 🔥
          notes: 'En plank, levanta una pierna ligeramente. Alterna.',
          videoSearch: 'plank leg raise beginner'
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
          'Knee Push Up 3x5 (fácil)',
          'Australian Pull Up 3x5 (fácil)',
          'Estiramientos específicos'
        ]
      },
      {
        session: 'Sesión Preparatoria 2',
        focus: 'Activación específica',
        activities: [
          'Calentamiento 10 minutos',
          'Knee Push Up 3x5 (ritmo normal)',
          'Australian Pull Up 3x5',
          'Core suave: Plank 2x20s'
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
          name: 'Air Squats',
          minimum: 20,
          target: 25,
          unit: 'repeticiones',
          form: 'Caderas abajo de rodillas, sin perder lumbar'
        },
        {
          name: 'Plank',
          minimum: 45,
          target: 60,
          unit: 'segundos',
          form: 'Cuerpo recto, sin hundir caderas'
        },
        {
          name: 'Hollow Body Hold',
          minimum: 20,
          target: 30,
          unit: 'segundos',
          form: 'Lumbar pegado, piernas y hombros elevados'
        }
      ]
    }
  },
  
  // Consejos para el nivel
  tips: [
    'Prioriza la técnica sobre la cantidad de repeticiones',
    'Descansa al menos 48h entre sesiones de la misma musculatura',
    'Si no puedes completar las rondas, reduce repeticiones pero mantén forma',
    'Hidratación y sueño son clave para la recuperación',
    'Graba tus ejercicios para revisar tu técnica',
    'No compares tu progreso con otros, cada cuerpo es diferente'
  ]
}

// Export default para poder importar directamente
export default nivel1Fundamentos
