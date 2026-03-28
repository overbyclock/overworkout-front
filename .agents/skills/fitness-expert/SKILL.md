---
name: fitness-expert
description: Experto en entrenamiento físico con especialización en calistenia, CrossFit y fitness general. Usar cuando se necesite diseñar planes de entrenamiento, estructurar ejercicios, definir progresiones, crear rutinas para diferentes objetivos (fuerza, hipertrofia, resistencia, pérdida de grasa), o validar la correcta estructura de entrenamientos. Conocedor de biomecánica, periodización y adaptaciones fisiológicas.
---

# Fitness Expert - Calistenia, CrossFit & Fitness

Guía para diseñar entrenamientos efectivos basados en evidencia científica y metodologías probadas.

## Fundamentos del Entrenamiento

### Principios Generales (SAID)

- **Specificity**: Adaptación específica al tipo de entrenamiento
- **Overload**: Sobrecarga progresiva para continuar mejorando
- **Individuality**: Cada persona responde diferente
- **Reversibility**: Las ganancias se pierden sin estímulo

### Variables de Entrenamiento (FITT)

| Variable | Descripción | Ejemplos |
|----------|-------------|----------|
| **F**requency | Días por semana | 3-6 días/semana |
| **I**ntensity | Esfuerzo relativo | %1RM, RPE, RIR |
| **T**ime | Duración | 30-90 minutos |
| **T**ype | Modalidad | Fuerza, cardio, mixto |

## Modalidades de Entrenamiento

### Calistenia (Control Corporal)

#### Niveles de Dificultad

```
PRINCIPIANTE          INTERMEDIO            AVANZADO
├── Sentadillas       ├── Pistol squats     ├── Shrimp squats
├── Flexiones         ├── Flexiones arco    ├── Planche
├── Dominadas         ├── Muscle-ups        ├── Front lever
├── Planchas          ├── Handstand pushups ├── One arm pull-up
└── Lunges            └── L-sit             └── Iron cross
```

#### Progresiones Fundamentales

**Flexiones (Push)**
1. Flexiones pared → Rodillas → Estándar → Diamond → Arch → Planche

**Dominadas (Pull)**
1. Escapular reps → Negativas → Estándar → Peso → Muscle-up → One-arm

**Sentadillas (Legs)**
1. Air squats → Bulgarian → Pistol → Shrimp → Dragon

**Core**
1. Dead bug → Plancha → L-sit → Dragon flag → Front lever

### CrossFit (Fitness Funcional)

#### Dominios del Fitness (10 Capacidades)

1. Cardiovascular/Respiratorio
2. Resistencia
3. Fuerza
4. Flexibilidad
5. Potencia
6. Velocidad
7. Coordinación
8. Agilidad
9. Balance
10. Precisión

#### Tipos de WODs

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **AMRAP** | As Many Rounds As Possible | 20min AMRAP: 5 pull-ups, 10 push-ups, 15 squats |
| **EMOM** | Every Minute On the Minute | 10min EMOM: Min 1: 10 burpees, Min 2: Rest |
| **For Time** | Completar en el menor tiempo | Fran: 21-15-9 thrusters/pull-ups |
| **Chipper** | Gran volumen, una vuelta | 100 pull-ups, 100 push-ups... |
| **Tabata** | 20s trabajo / 10s descanso | 8 rondas de air squats |

#### Movimientos Fundamentales

**Weightlifting**
- Snatch (Arranque)
- Clean & Jerk (Dos tiempos)
- Deadlift (Peso muerto)
- Squat (Sentadilla)
- Press (Empuje)

**Gimnásticos**
- Pull-up / Chest-to-bar / Bar muscle-up
- Toes-to-bar / Knees-to-elbows
- Handstand push-ups
- Box jumps / Burpees

**Monostructural (Cardio)**
- Running / Rowing / Bike / Ski / Jump rope

### Fitness / Musculación

#### Objetivos y Rangos de Repeticiones

| Objetivo | Repeticiones | Series | Descanso |
|----------|--------------|--------|----------|
| **Fuerza máxima** | 1-5 | 3-6 | 3-5 min |
| **Hipertrofia** | 6-12 | 3-4 | 60-90s |
| **Resistencia muscular** | 12-20+ | 2-3 | 30-60s |
| **Potencia** | 1-3 (explosivo) | 3-5 | 2-3 min |

#### Divisiones de Entrenamiento (Splits)

```
3 DÍAS - Full Body
├── Lunes: Push (Pecho, Hombros, Tríceps, Cuádriceps)
├── Miércoles: Pull (Espalda, Bíceps, Isquios, Core)
└── Viernes: Legs + Full Body (Piernas + Compuestos)

4 DÍAS - Upper/Lower
├── Lunes: Upper A
├── Martes: Lower A
├── Jueves: Upper B
└── Viernes: Lower B

5 DÍAS - Push/Pull/Legs
├── Lunes: Push
├── Martes: Pull
├── Miércoles: Legs
├── Jueves: Push
└── Viernes: Pull

6 DÍAS - PPL x2
├── Push/Pull/Legs → Repeat
```

## Estructura de un Entrenamiento

### Plantilla General

```
1. CALENTAMIENTO (10-15 min)
   ├── Cardio ligero (5 min)
   ├── Movilidad dinámica
   ├── Activación específica
   └── Progresión hacia trabajo principal

2. TRABAJO PRINCIPAL (30-50 min)
   ├── Ejercicio compuesto principal (4-6 series)
   ├── Ejercicios complementarios (2-4 series c/u)
   └── Aislamiento opcional (2-3 series)

3. FINISHER / CONDICIONAMIENTO (5-10 min)
   ├── Circuito de alta intensidad
   ├── Cardio opcional
   └── Core work

4. ENFRIAMIENTO (5-10 min)
   ├── Estiramientos estáticos
   ├── Respiración
   └── Foam rolling opcional
```

## Modelado de Datos para OverWorkout

### Ejercicio (Exercise)

```
{
  id: UUID,
  name: string,           // "Dominadas pronas"
  nameEn: string,         // "Pull-ups"
  description: text,
  category: enum [        // Para filtrado
    STRENGTH,             // Fuerza
    CARDIO,               // Cardio
    FLEXIBILITY,          // Flexibilidad
    BALANCE,              // Equilibrio
    PLYOMETRIC            // Pliometría
  ],
  muscleGroups: [         // Músculos principales
    BACK, LATS, BICEPS
  ],
  secondaryMuscles: [     // Músculos secundarios
    CORE, FOREARMS
  ],
  equipment: [            // Equipamiento necesario
    PULL_UP_BAR
  ],
  difficulty: enum [      // Nivel
    BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  ],
  type: enum [            // Tipo de ejercicio
    COMPOUND,             // Compuesto (multi-articular)
    ISOLATION             // Aislado (mono-articular)
  ],
  metrics: {
    trackReps: boolean,   // Registrar repeticiones
    trackWeight: boolean, // Registrar peso
    trackTime: boolean,   // Registrar tiempo
    trackDistance: boolean // Registrar distancia
  },
  variations: [UUID],     // IDs de ejercicios relacionados
  instructions: [string], // Pasos detallados
  tips: [string],         // Consejos de ejecución
  videoUrl: string,
  imageUrl: string
}
```

### Entrenamiento (Training/Workout)

```
{
  id: UUID,
  name: string,
  description: text,
  type: enum [
    STRENGTH,             // Fuerza
    HYPERTROPHY,          // Hipertrofia
    ENDURANCE,            // Resistencia
    CARDIO,               // Cardio
    HIIT,                 // Alta intensidad
    CIRCUIT,              // Circuito
    SKILL                 // Habilidad/técnica
  ],
  duration: number,       // Minutos estimados
  difficulty: enum,
  targetMuscleGroups: [MuscleGroup],
  exercises: [
    {
      exerciseId: UUID,
      order: number,
      sets: number,
      reps: string,        // "8-12" o "MAX" o "30s"
      restSeconds: number, // Descanso entre series
      weight: string,      // "Bodyweight" o "%1RM"
      notes: string,       // Notas específicas
      alternatives: [UUID] // Ejercicios alternativos
    }
  ],
  warmup: {
    duration: number,
    description: text,
    exercises: [UUID]
  },
  cooldown: {
    duration: number,
    description: text
  },
  tags: [string],
  estimatedCalories: number
}
```

### Plan de Entrenamiento (Training Plan)

```
{
  id: UUID,
  name: string,
  description: text,
  goal: enum [            // Objetivo principal
    BUILD_MUSCLE,         // Ganar músculo
    LOSE_FAT,             // Perder grasa
    BUILD_STRENGTH,       // Ganar fuerza
    ENDURANCE,            // Resistencia
    SKILL_PROGRESSION,    // Progresión de habilidad
    GENERAL_FITNESS       // Fitness general
  ],
  duration: number,       // Semanas
  sessionsPerWeek: number,
  difficulty: enum,
  weeks: [
    {
      weekNumber: number,
      focus: string,       // Enfoque de la semana
      sessions: [
        {
          dayOfWeek: number, // 1=Lunes, 7=Domingo
          trainingId: UUID,
          optional: boolean
        }
      ]
    }
  ],
  progression: {
    type: enum [LINEAR, UNDULATING, BLOCK],
    description: text
  },
  prerequisites: {
    fitnessLevel: enum,
    equipment: [Equipment]
  }
}
```

## Progresiones y Periodización

### Periodización Lineal

```
Semana 1: Adaptación    (Sets: 3, Reps: 12, Intensidad: 70%)
Semana 2: Acumulación 1 (Sets: 3, Reps: 10, Intensidad: 75%)
Semana 3: Acumulación 2 (Sets: 4, Reps: 8,  Intensidad: 80%)
Semana 4: Intensificación(Sets: 4, Reps: 6,  Intensidad: 85%)
Semana 5: Realización    (Sets: 3, Reps: 3,  Intensidad: 90%)
Semana 6: Descarga      (Sets: 2, Reps: 10, Intensidad: 60%)
```

### Progresión de Habilidades (Calistenia)

```
HANDSTAND
├── Fase 1: Pike push-ups + Crow pose
├── Fase 2: Wall handstand hold
├── Fase 3: Wall handstand push-ups
├── Fase 4: Free handstand hold
└── Fase 5: Free handstand push-ups

PLANCHE
├── Fase 1: Planche lean (proyección hombros)
├── Fase 2: Tuck planche
├── Fase 3: Advanced tuck planche
├── Fase 4: Straddle planche
└── Fase 5: Full planche
```

## Registro de Progreso

### Métricas a Trackear

- **Fuerza**: Peso máximo levantado (1RM estimado)
- **Volumen**: Sets × Reps × Peso total
- **Hipertrofia**: Medidas corporales / Fotos
- **Resistencia**: Tiempo / Distancia / Ritmo
- **Calistenia**: Progresión de habilidades
- **Carga**: Percepción de esfuerzo (RPE 1-10)

### Fórmula 1RM Estimada (Epley)

```
1RM = Peso × (1 + Reps/30)

Ejemplo: 100kg × 8 reps
1RM = 100 × (1 + 8/30) = 126.6kg
```

## Checklist de Diseño de Entrenamiento

- [ ] ¿El objetivo está claro (fuerza, hipertrofia, etc.)?
- [ ] ¿Hay balance push/pull/legs/core?
- [ ] ¿La intensidad es apropiada al nivel?
- [ ] ¿Hay progresión semana a semana?
- [ ] ¿El volumen es recuperable?
- [ ] ¿Hay suficiente variedad para evitar aburrimiento?
- [ ] ¿Los ejercicios son apropiados al equipamiento disponible?
- [ ] ¿El calentamiento prepara para el trabajo específico?
- [ ] ¿Hay ejercicios alternativas para limitaciones?
