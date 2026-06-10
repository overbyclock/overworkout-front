<template>
  <div class="mobile-view mobile-view--no-nav onboarding-view">
    <div class="onboarding-header">
      <div class="onboarding-progress">
        <div class="onboarding-progress__bar">
          <div class="onboarding-progress__fill" style="width: 25%"></div>
        </div>
        <span class="onboarding-progress__text">Paso 1 de 4</span>
      </div>
      <button class="onboarding-skip" @click="skip">Saltar</button>
    </div>

    <div class="onboarding-content animate-fadeInUp">
      <h1 class="mobile-h2">¿Cuál es tu objetivo principal?</h1>
      <p class="mobile-body" style="margin-bottom: var(--space-8)">
        Elige el que mejor describa lo que buscas. Podrás cambiarlo más adelante.
      </p>

      <div class="options-list animate-stagger">
        <button
          v-for="goal in TRAINING_GOALS"
          :key="goal.value"
          class="mobile-option"
          :class="{ 'mobile-option--selected': selectedGoal === goal.value }"
          @click="selectGoal(goal.value)"
        >
          <div class="mobile-option__icon">
            <q-icon :name="goal.icon" size="24px" />
          </div>
          <div class="mobile-option__content">
            <p class="mobile-option__title">{{ goal.label }}</p>
            <p class="mobile-option__desc">{{ goal.desc }}</p>
          </div>
        </button>
      </div>
    </div>

    <div class="onboarding-actions">
      <button
        class="btn-mobile btn-mobile--large btn-mobile--primary"
        :disabled="!selectedGoal"
        @click="continueToNext"
      >
        Continuar
        <q-icon name="arrow_forward" size="20px" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { TRAINING_GOALS, STORAGE_KEYS } from '@/utils/constants'
import { useUserProfileStore } from '@/stores/userProfile'

const router = useRouter()
const userProfileStore = useUserProfileStore()

const selectedGoal = ref(userProfileStore.profile?.trainingGoal || '')

const selectGoal = (value) => {
  selectedGoal.value = value
}

const continueToNext = () => {
  userProfileStore.setProfile({
    ...userProfileStore.profile,
    trainingGoal: selectedGoal.value,
  })
  router.push({ name: 'user-onboarding-level' })
}

const skip = () => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_SKIPPED, 'true')
  router.push({ name: 'user-home' })
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
  margin-bottom: var(--space-8);
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
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.onboarding-actions {
  margin-top: var(--space-6);
}
</style>
