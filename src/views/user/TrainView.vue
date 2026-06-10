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
        <div v-if="!hasStarted" class="train-start animate-fadeIn">
          <div class="train-start__illustration">
            <q-icon name="fitness_center" size="80px" color="primary" />
          </div>
          <h2 class="mobile-h2">¿Listo para entrenar?</h2>
          <p class="mobile-body" style="text-align: center; max-width: 280px">
            Sesión de hoy: <strong>{{ sessionTitle }}</strong>
          </p>
          <ul class="train-start__summary">
            <li><q-icon name="schedule" size="20px" /> ~45 minutos</li>
            <li><q-icon name="sports_gymnastics" size="20px" /> 6 ejercicios</li>
            <li><q-icon name="whatshot" size="20px" /> Dificultad media</li>
          </ul>
          <button class="btn-mobile btn-mobile--large btn-mobile--primary" @click="startTraining">
            Empezar entrenamiento
          </button>
          <button class="btn-mobile btn-mobile--ghost" @click="goBack">Volver</button>
        </div>

        <div v-else class="train-active animate-fadeIn">
          <div class="exercise-card">
            <div class="exercise-card__header">
              <span class="exercise-card__count"
                >Ejercicio {{ currentExerciseIndex + 1 }} de {{ exercises.length }}</span
              >
              <span class="exercise-card__round">Round 1/3</span>
            </div>

            <div class="exercise-card__body">
              <h2 class="exercise-card__name">{{ currentExercise.name }}</h2>
              <p class="exercise-card__detail">{{ currentExercise.detail }}</p>

              <div v-if="currentExercise.hasTimer" class="timer-display">
                <div class="timer-display__value">{{ exerciseTimerDisplay }}</div>
                <div class="timer-display__label">segundos</div>
              </div>
            </div>

            <div class="exercise-card__actions">
              <button
                v-if="currentExercise.hasTimer && !timerRunning"
                class="btn-mobile btn-mobile--primary"
                @click="startTimer"
              >
                Iniciar timer
              </button>
              <button
                v-else-if="currentExercise.hasTimer && timerRunning"
                class="btn-mobile btn-mobile--secondary"
                @click="stopTimer"
              >
                Pausar
              </button>
              <button v-else class="btn-mobile btn-mobile--primary" @click="completeExercise">
                Completar {{ currentExercise.reps }}
              </button>
              <button class="btn-mobile btn-mobile--ghost" @click="skipExercise">Saltar</button>
            </div>
          </div>

          <!-- Lista de ejercicios abajo -->
          <div class="exercise-list">
            <div
              v-for="(ex, index) in exercises"
              :key="index"
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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const sessionTitle = 'Sesión A — Push + Core'
const sessionSubtitle = 'Nivel 3 · Semana 2'

const hasStarted = ref(false)
const currentExerciseIndex = ref(0)
const elapsedTime = ref(0)
const exerciseTime = ref(0)
const timerRunning = ref(false)
let mainTimer = null
let exerciseTimerInterval = null

const exercises = [
  { name: 'Flexiones', detail: '3 sets x 12 reps', reps: '3x12', hasTimer: false },
  {
    name: 'Plancha',
    detail: '3 sets x 45 segundos',
    reps: '3x45"',
    hasTimer: true,
    targetSeconds: 45,
  },
  { name: 'Fondos en paralelas', detail: '3 sets x 8 reps', reps: '3x8', hasTimer: false },
  {
    name: 'Hollow Body Hold',
    detail: '3 sets x 30 segundos',
    reps: '3x30"',
    hasTimer: true,
    targetSeconds: 30,
  },
]

const currentExercise = computed(() => exercises[currentExerciseIndex.value] || exercises[0])

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

const startTraining = () => {
  hasStarted.value = true
  mainTimer = setInterval(() => elapsedTime.value++, 1000)
}

const startTimer = () => {
  timerRunning.value = true
  exerciseTimerInterval = setInterval(() => exerciseTime.value++, 1000)
}

const stopTimer = () => {
  timerRunning.value = false
  clearInterval(exerciseTimerInterval)
}

const completeExercise = () => {
  if (currentExerciseIndex.value < exercises.length - 1) {
    currentExerciseIndex.value++
    exerciseTime.value = 0
    timerRunning.value = false
    clearInterval(exerciseTimerInterval)
  } else {
    finishTraining()
  }
}

const skipExercise = () => {
  if (currentExerciseIndex.value < exercises.length - 1) {
    currentExerciseIndex.value++
  }
}

const finishTraining = () => {
  clearInterval(mainTimer)
  clearInterval(exerciseTimerInterval)
  router.push({ name: 'user-home' })
}

const goBack = () => {
  clearInterval(mainTimer)
  clearInterval(exerciseTimerInterval)
  router.back()
}

onUnmounted(() => {
  clearInterval(mainTimer)
  clearInterval(exerciseTimerInterval)
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
