<template>
  <div class="mobile-view mobile-view--no-nav">
    <div class="train-view">
      <header class="train-view__header">
        <button class="train-view__close" @click="goBack">
          <q-icon name="close" size="28px" />
        </button>
        <div class="train-view__title">
          <h1>{{ sessionTitle }}</h1>
          <p>{{ sessionSubtitle }}</p>
        </div>
        <div class="train-view__timer">
          {{ formattedElapsedTime }}
        </div>
      </header>

      <main class="train-view__content">
        <div v-if="isLoading" class="train-start animate-fadeIn">
          <q-spinner color="primary" size="48px" />
          <p class="mobile-body q-mt-md">Cargando sesión...</p>
        </div>

        <div v-else-if="error" class="train-start animate-fadeIn">
          <q-icon name="error_outline" size="48px" color="negative" />
          <p class="mobile-body q-mt-md" style="text-align: center">{{ error }}</p>
          <button class="btn-mobile btn-mobile--primary" @click="fetchTraining">Reintentar</button>
          <button class="btn-mobile btn-mobile--ghost" @click="goBack">Volver</button>
        </div>

        <div v-else-if="!hasStarted" class="train-start animate-fadeIn">
          <div class="train-start__illustration">
            <q-icon name="fitness_center" size="80px" color="primary" />
          </div>
          <h2 class="mobile-h2">¿Listo para entrenar?</h2>
          <p class="mobile-body" style="text-align: center; max-width: 280px">
            Sesión: <strong>{{ sessionTitle }}</strong>
          </p>
          <ul class="train-start__summary">
            <li>
              <q-icon name="schedule" size="20px" /> ~{{
                Math.round(training?.estimatedDurationMin / 60) || 45
              }}
              minutos
            </li>
            <li>
              <q-icon name="sports_gymnastics" size="20px" /> {{ exercises.length }} ejercicios
            </li>
            <li>
              <q-icon name="whatshot" size="20px" />
              {{ training?.difficultyLabel || training?.difficulty || 'Dificultad variable' }}
            </li>
          </ul>
          <button
            class="btn-mobile btn-mobile--large btn-mobile--primary"
            :disabled="exercises.length === 0"
            @click="startTraining"
          >
            Empezar entrenamiento
          </button>
          <button class="btn-mobile btn-mobile--ghost" @click="goBack">Volver</button>
        </div>

        <div v-else-if="hasStarted" class="train-active animate-fadeIn">
          <div v-if="exercises.length === 0" class="train-start">
            <q-icon name="fitness_center" size="80px" color="primary" />
            <h2 class="mobile-h2">No hay ejercicios en esta sesión</h2>
            <button class="btn-mobile btn-mobile--ghost" @click="goBack">Volver</button>
          </div>

          <template v-else>
            <div class="exercise-card">
              <div class="exercise-card__header">
                <span class="exercise-card__count"
                  >Ejercicio {{ currentExerciseIndex + 1 }} de {{ exercises.length }}</span
                >
                <span v-if="currentExercise?.sets" class="exercise-card__round">
                  {{ currentExercise.sets }} sets
                </span>
              </div>

              <div class="exercise-card__body">
                <h2 class="exercise-card__name">{{ currentExercise?.name }}</h2>
                <p class="exercise-card__detail">{{ currentExercise?.detail }}</p>

                <div v-if="currentExercise?.hasTimer" class="timer-display">
                  <div class="timer-display__value">{{ exerciseTimerDisplay }}</div>
                  <div class="timer-display__label">segundos</div>
                </div>
              </div>

              <div class="exercise-card__actions">
                <button
                  v-if="currentExercise?.hasTimer && !timerRunning"
                  class="btn-mobile btn-mobile--primary"
                  @click="startTimer"
                >
                  Iniciar timer
                </button>
                <button
                  v-else-if="currentExercise?.hasTimer && timerRunning"
                  class="btn-mobile btn-mobile--secondary"
                  @click="stopTimer"
                >
                  Pausar
                </button>
                <button v-else class="btn-mobile btn-mobile--primary" @click="completeExercise">
                  Completar {{ currentExercise?.reps }}
                </button>
                <button class="btn-mobile btn-mobile--ghost" @click="skipExercise">Saltar</button>
                <button class="btn-mobile btn-mobile--ghost" @click="openGuide">
                  <q-icon name="help_outline" size="18px" class="q-mr-sm" />
                  Ver guía
                </button>
              </div>
            </div>

            <!-- Lista de ejercicios abajo -->
            <div class="exercise-list">
              <div
                v-for="(ex, index) in exercises"
                :key="ex.id ?? index"
                class="exercise-list__item"
                :class="{
                  'exercise-list__item--completed': index < currentExerciseIndex,
                  'exercise-list__item--current': index === currentExerciseIndex,
                }"
              >
                <q-icon
                  :name="
                    index < currentExerciseIndex
                      ? 'check'
                      : index === currentExerciseIndex
                        ? 'play_arrow'
                        : 'circle'
                  "
                  size="20px"
                />
                <span>{{ ex.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </main>

      <ExerciseGuideDrawer v-model="guideOpen" :exercise="selectedExercise" :loading="false" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { trainingService } from '@/services/trainings'
import ExerciseGuideDrawer from '@/components/common/ExerciseGuideDrawer.vue'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const sessionId = computed(() => Number(route.params.sessionId))
const isValidSessionId = computed(() => Number.isInteger(sessionId.value) && sessionId.value > 0)

const training = ref(null)
const isLoading = ref(true)
const error = ref('')
const guideOpen = ref(false)
const selectedExercise = ref(null)

const sessionTitle = computed(() => training.value?.name || 'Sesión de entrenamiento')
const sessionSubtitle = computed(() => {
  if (!training.value) return ''

  const parts = []
  if (training.value.weekNumber !== undefined && training.value.weekNumber !== null) {
    parts.push(`Fase ${training.value.weekNumber + 1}`)
  }
  if (training.value.trainingLevel) {
    parts.push(training.value.trainingLevel)
  } else if (training.value.sessionType) {
    parts.push(training.value.sessionType)
  }

  return parts.join(' · ') || 'Sesión de entrenamiento'
})

const hasStarted = ref(false)
const currentExerciseIndex = ref(0)
const elapsedTime = ref(0)
const exerciseTime = ref(0)
const timerRunning = ref(false)
let mainTimer = null
let exerciseTimerInterval = null

const exercises = computed(() => {
  if (!training.value?.trainingRounds) return []

  const list = []
  training.value.trainingRounds.forEach((round) => {
    round.trainingExerciseConfigurations?.forEach((config) => {
      const exercise = config.exercise
      if (!exercise) return

      const isTimeBased = config.reps === null && config.maxTimeForReps !== null

      list.push({
        id: config.id,
        name: exercise.name,
        detail: `${config.sets} sets x ${isTimeBased ? config.maxTimeForReps + ' seg' : config.reps + ' reps'}`,
        sets: config.sets,
        reps: isTimeBased ? config.maxTimeForReps : config.reps,
        hasTimer: isTimeBased,
        targetSeconds: isTimeBased ? config.maxTimeForReps : null,
        exercise,
      })
    })
  })

  return list
})

const currentExercise = computed(() => exercises.value[currentExerciseIndex.value] || null)

const formattedElapsedTime = computed(() => {
  const m = Math.floor(elapsedTime.value / 60)
    .toString()
    .padStart(2, '0')
  const s = (elapsedTime.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const exerciseTimerDisplay = computed(() => {
  return exerciseTime.value.toString().padStart(2, '0')
})

const fetchTraining = async () => {
  isLoading.value = true
  error.value = ''

  if (!isValidSessionId.value) {
    error.value = 'Sesión no válida'
    isLoading.value = false
    return
  }

  try {
    const data = await trainingService.getById(sessionId.value)
    training.value = data
  } catch (err) {
    error.value = err?.response?.data?.error || 'Error al cargar la sesión de entrenamiento'
    console.error('Error cargando training:', err)
    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTraining()
})

const startTraining = () => {
  if (exercises.value.length === 0 || mainTimer) return

  hasStarted.value = true
  mainTimer = setInterval(() => elapsedTime.value++, 1000)
}

const startTimer = () => {
  if (exerciseTimerInterval) return

  timerRunning.value = true
  exerciseTimerInterval = setInterval(() => exerciseTime.value++, 1000)
}

const stopTimer = () => {
  timerRunning.value = false
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null
}

const completeExercise = () => {
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null
  exerciseTime.value = 0
  timerRunning.value = false

  if (currentExerciseIndex.value < exercises.value.length - 1) {
    currentExerciseIndex.value++
  } else {
    finishTraining()
  }
}

const skipExercise = () => {
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null
  exerciseTime.value = 0
  timerRunning.value = false

  if (currentExerciseIndex.value < exercises.value.length - 1) {
    currentExerciseIndex.value++
  } else {
    finishTraining()
  }
}

const openGuide = () => {
  selectedExercise.value = currentExercise.value?.exercise || null
  if (selectedExercise.value) {
    guideOpen.value = true
  }
}

const finishTraining = () => {
  clearInterval(mainTimer)
  mainTimer = null
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null
  router.push({ name: 'user-home' })
}

const goBack = () => {
  clearInterval(mainTimer)
  mainTimer = null
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null
  router.back()
}

onUnmounted(() => {
  clearInterval(mainTimer)
  mainTimer = null
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null
})
</script>

<style scoped>
.train-view {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--surface-primary);
  display: flex;
  flex-direction: column;
}

.train-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  padding-top: calc(var(--space-4) + var(--safe-top));
  border-bottom: 1px solid var(--border-subtle);
}

.train-view__close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: var(--space-2);
  cursor: pointer;
}

.train-view__title h1 {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.train-view__title p {
  font-size: var(--font-xs);
  color: var(--text-muted);
  margin: 0;
}

.train-view__timer {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.train-view__content {
  flex: 1;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
}

.train-start {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
}

.train-start__illustration {
  width: 160px;
  height: 160px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.15) 0%, rgba(56, 178, 172, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.train-start__summary {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.train-start__summary li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.train-active {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.exercise-card {
  flex: 1;
  background: linear-gradient(145deg, var(--surface-secondary) 0%, var(--surface-tertiary) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
}

.exercise-card__header {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-6);
}

.exercise-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-3);
}

.exercise-card__name {
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.exercise-card__detail {
  font-size: var(--font-lg);
  color: var(--text-secondary);
  margin: 0;
}

.timer-display {
  margin-top: var(--space-6);
}

.timer-display__value {
  font-size: var(--font-4xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.timer-display__label {
  font-size: var(--font-sm);
  color: var(--text-muted);
}

.exercise-card__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.exercise-list {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;
}

.exercise-list__item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  color: var(--text-secondary);
  white-space: nowrap;
}

.exercise-list__item--current {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.exercise-list__item--completed {
  opacity: 0.6;
  text-decoration: line-through;
}
</style>
