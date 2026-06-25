<template>
  <div class="mobile-view mobile-view--no-nav onboarding-view">
    <div class="onboarding-header">
      <div class="onboarding-progress">
        <div class="onboarding-progress__bar">
          <div class="onboarding-progress__fill" style="width: 100%"></div>
        </div>
        <span class="onboarding-progress__text">Paso 4 de 4</span>
      </div>
      <button class="onboarding-skip" @click="skipAssessment">Omitir</button>
    </div>

    <div v-if="!showResults" class="onboarding-content animate-fadeInUp">
      <h1 class="mobile-h2">Evaluación diagnóstica</h1>
      <p class="mobile-body" style="margin-bottom: var(--space-8)">
        Realiza cada test al máximo de tu capacidad. No hay respuestas incorrectas, solo tu punto de
        partida.
      </p>

      <div class="tests-list">
        <div
          v-for="(test, index) in tests"
          :key="test.id"
          class="test-card"
          :class="{ 'test-card--completed': test.value !== null }"
        >
          <div class="test-card__header">
            <span class="test-card__number">{{ index + 1 }}</span>
            <h3 class="test-card__name">{{ test.name }}</h3>
          </div>
          <p class="test-card__desc">
            Máximo de {{ test.unit === 'seconds' ? 'tiempo en segundos' : 'repeticiones' }}
          </p>

          <div class="test-card__input-group">
            <button
              type="button"
              class="test-card__adjust"
              @click="decrementValue(index)"
              :disabled="test.value === 0"
            >
              <q-icon name="remove" size="20px" />
            </button>
            <input
              v-model.number="test.value"
              type="number"
              class="test-card__input"
              :placeholder="test.unit === 'seconds' ? '0s' : '0'"
              min="0"
            />
            <button type="button" class="test-card__adjust" @click="incrementValue(index)">
              <q-icon name="add" size="20px" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div v-else class="onboarding-content animate-fadeInUp">
      <div class="assessment-results">
        <div class="results-icon">
          <q-icon name="analytics" size="64px" color="primary" />
        </div>
        <h1 class="mobile-h2">¡Evaluación completada!</h1>
        <p class="mobile-body" style="text-align: center; max-width: 300px">
          Basado en tus resultados, te recomendamos empezar con:
        </p>

        <div class="recommended-program">
          <h3 class="recommended-program__name">{{ recommendedProgram.name }}</h3>
          <p class="recommended-program__desc">{{ recommendedProgram.description }}</p>
          <div class="recommended-program__tags">
            <span class="program-tag">{{ recommendedProgram.level }}</span>
            <span class="program-tag">{{ recommendedProgram.duration }}</span>
          </div>
        </div>

        <div class="results-summary">
          <h4 class="results-summary__title">Tus resultados</h4>
          <div class="results-summary__list">
            <div v-for="test in tests" :key="test.id" class="result-row">
              <span>{{ test.name }}</span>
              <strong>
                {{ test.value || 0 }}
                <small>{{ test.unit === 'seconds' ? 's' : 'reps' }}</small>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="onboarding-actions">
      <button
        v-if="!showResults"
        class="btn-mobile btn-mobile--large btn-mobile--primary"
        :disabled="!allTestsAnswered"
        @click="submitAssessment"
      >
        Ver mi recomendación
      </button>
      <button
        v-else
        class="btn-mobile btn-mobile--large btn-mobile--primary"
        :disabled="accepting"
        @click="acceptRecommendation"
      >
        {{ accepting ? 'Iniciando...' : 'Empezar este programa' }}
      </button>
      <button v-if="showResults" class="btn-mobile btn-mobile--secondary" @click="goToCatalog">
        Ver todos los programas
      </button>
      <button v-if="showResults" class="btn-mobile btn-mobile--ghost" @click="skipAssessment">
        Decidir más tarde
      </button>
      <button v-if="!showResults" class="btn-mobile btn-mobile--ghost" @click="goBack">
        Atrás
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ASSESSMENT_TESTS, STORAGE_KEYS } from '@/utils/constants'
import { useUserProfileStore } from '@/stores/userProfile'

const router = useRouter()
const userProfileStore = useUserProfileStore()

const tests = ref(
  ASSESSMENT_TESTS.map((test) => ({
    ...test,
    value: null,
  })),
)

const showResults = ref(false)

const recommendedProgram = ref({
  name: 'Calistenia Master V1',
  description: 'Programa completo de calistenia progresiva desde los fundamentos.',
  level: 'Principiante-Intermedio',
  duration: '12 niveles',
})

const allTestsAnswered = computed(() => {
  return tests.value.every((test) => test.value !== null && test.value >= 0)
})

const incrementValue = (index) => {
  tests.value[index].value = (tests.value[index].value || 0) + 1
}

const decrementValue = (index) => {
  if ((tests.value[index].value || 0) > 0) {
    tests.value[index].value = tests.value[index].value - 1
  }
}

const submitAssessment = async () => {
  try {
    const payload = {
      results: tests.value.map((t) => ({
        id: t.id,
        value: t.value,
        unit: t.unit,
      })),
      estimatedLevel: userProfileStore.profile?.estimatedLevel,
      trainingGoal: userProfileStore.profile?.trainingGoal,
    }

    const response = await userProfileStore.submitAssessment(payload)
    if (response?.recommendedProgram) {
      recommendedProgram.value = response.recommendedProgram
    }
    showResults.value = true
  } catch {
    // Si el endpoint no existe todavía, mostramos resultados igual
    showResults.value = true
  }
}

const accepting = ref(false)

const acceptRecommendation = async () => {
  if (!recommendedProgram.value?.id) {
    router.push({ name: 'user-explore' })
    return
  }

  accepting.value = true
  try {
    await userProfileStore.switchProgram(recommendedProgram.value.id)
    router.push({ name: 'user-home' })
  } catch {
    accepting.value = false
  }
}

const goToCatalog = () => {
  router.push({ name: 'user-explore' })
}

const skipAssessment = () => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_SKIPPED, 'true')
  router.push({ name: 'user-home' })
}

const goBack = () => {
  router.push({ name: 'user-onboarding-stats' })
}
</script>

<style scoped>
.onboarding-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--space-5);
  padding-top: calc(var(--space-4) + var(--safe-top));
  padding-bottom: calc(var(--space-6) + var(--safe-bottom));
}

.onboarding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  gap: var(--space-4);
}

.onboarding-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.onboarding-progress__bar {
  height: 6px;
  background-color: var(--surface-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.onboarding-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-full);
  transition: width 0.4s var(--ease-out);
}

.onboarding-progress__text {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

.onboarding-skip {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: var(--font-sm);
  cursor: pointer;
  padding: var(--space-2);
}

.onboarding-skip:hover {
  color: var(--text-primary);
}

.onboarding-content {
  flex: 1;
  overflow-y: auto;
}

.tests-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.test-card {
  padding: var(--space-5);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: all 0.2s var(--ease-out);
}

.test-card--completed {
  border-color: rgba(255, 143, 56, 0.3);
}

.test-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.test-card__number {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--surface-tertiary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
}

.test-card--completed .test-card__number {
  background-color: var(--color-primary);
  color: #000;
}

.test-card__name {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.test-card__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4) 0;
}

.test-card__input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.test-card__adjust {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background-color: var(--surface-tertiary);
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.test-card__adjust:hover {
  background-color: var(--surface-elevated);
}

.test-card__adjust:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.test-card__input {
  width: 100px;
  text-align: center;
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  padding: var(--space-3);
  background-color: var(--surface-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}

.test-card__input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Resultados */
.assessment-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-5);
}

.results-icon {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.15) 0%, rgba(56, 178, 172, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommended-program {
  width: 100%;
  max-width: 360px;
  padding: var(--space-6);
  background: linear-gradient(145deg, var(--surface-secondary) 0%, var(--surface-tertiary) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  text-align: left;
}

.recommended-program__name {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.recommended-program__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4) 0;
}

.recommended-program__tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.program-tag {
  padding: 4px 12px;
  background-color: rgba(255, 143, 56, 0.1);
  color: var(--color-primary);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.results-summary {
  width: 100%;
  max-width: 360px;
  text-align: left;
}

.results-summary__title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.results-summary__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background-color: var(--surface-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.result-row strong {
  color: var(--text-primary);
  font-size: var(--font-base);
}

.result-row small {
  font-size: var(--font-xs);
  color: var(--text-muted);
  font-weight: var(--font-normal);
}

.onboarding-actions {
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
