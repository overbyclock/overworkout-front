# Entidades del Sistema

## User (Usuario)

```typescript
{
  id: UUID
  email: string          // único
  password: string       // hash bcrypt
  firstName: string
  lastName: string
  role: 'ADMIN' | 'USER'
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

Relaciones:
- `trainings[]` → Training (creados por el usuario)

## Exercise (Ejercicio)

```typescript
{
  id: UUID
  name: string
  description: string | null
  category: 'STRENGTH' | 'CARDIO' | 'FLEXIBILITY' | 'BALANCE' | 'PLYOMETRIC'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  muscleGroups: MuscleGroup[]
  equipment: Equipment[]
  imageUrl: string | null
  videoUrl: string | null
  instructions: string[]
  createdBy: User
  isPublic: boolean
}
```

Relaciones:
- `createdBy` → User
- `equipment[]` → Equipment (ManyToMany)

## Equipment (Equipamiento)

```typescript
{
  id: UUID
  name: string
  description: string | null
  imageUrl: string | null
}
```

Relaciones:
- `exercises[]` → Exercise (ManyToMany)

## Training (Entrenamiento/Rutina)

```typescript
{
  id: UUID
  name: string
  description: string | null
  type: 'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE' | 'HIIT' | 'CARDIO'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  durationMinutes: number
  targetMuscleGroups: MuscleGroup[]
  createdBy: User
  isPublic: boolean
  exercises: TrainingExercise[]
}
```

## TrainingExercise (Ejercicio en Entrenamiento)

```typescript
{
  id: UUID
  training: Training
  exercise: Exercise
  order: number           // Orden en la rutina
  sets: number
  reps: string           // "8-12" | "MAX" | "30s"
  restSeconds: number
  weight: string | null  // "Bodyweight" | "50kg" | "%1RM"
  notes: string | null
  alternatives: Exercise[] // Ejercicios alternativos
}
```

## MuscleGroup (Grupos Musculares)

Valores posibles:
- `CHEST` - Pecho
- `BACK` - Espalda
- `SHOULDERS` - Hombros
- `BICEPS` - Bíceps
- `TRICEPS` - Tríceps
- `LEGS` - Piernas
- `QUADRICEPS` - Cuádriceps
- `HAMSTRINGS` - Isquiotibiales
- `GLUTES` - Glúteos
- `CALVES` - Gemelos
- `ABS` - Abdominales
- `CORE` - Core
- `FOREARMS` - Antebrazos
- `CARDIO` - Cardio (general)

## Diagrama de Relaciones

```
User 1 ──────< N Training (created_by)
User 1 ──────< N Exercise (created_by)

Training 1 ──< N TrainingExercise
Exercise 1 ──< N TrainingExercise

Exercise N ──> N Equipment
TrainingExercise N ──> N Exercise (alternatives)
```

## Endpoints Relacionados

Ver: `src/utils/constants.js`

| Entidad | Base Endpoint |
|---------|---------------|
| User | `/api/users` |
| Exercise | `/api/exercises` |
| Training | `/api/trainings` |
| Equipment | `/api/equipments` |
