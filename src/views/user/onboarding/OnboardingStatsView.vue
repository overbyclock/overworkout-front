<template>
  <div class="mobile-view mobile-view--no-nav onboarding-view">
    <div class="onboarding-header">
      <div class="onboarding-progress">
        <div class="onboarding-progress__bar">
          <div class="onboarding-progress__fill" style="width: 75%"></div>
        </div>
        <span class="onboarding-progress__text">Paso 3 de 4</span>
      </div>
      <button class="onboarding-skip" @click="skip">Saltar</button>
    </div>

    <div class="onboarding-content animate-fadeInUp">
      <h1 class="mobile-h2">Cuéntanos sobre ti</h1>
      <p class="mobile-body" style="margin-bottom: var(--space-8)">
        Estos datos nos ayudan a personalizar tu experiencia y calcular estimaciones.
      </p>

      <form class="onboarding-form" @submit.prevent="continueToNext">
        <div class="form-group">
          <label class="form-label" for="nick">Tu nombre o apodo</label>
          <input
            id="nick"
            v-model="form.nick"
            type="text"
            class="mobile-input"
            placeholder="Ej: Alex"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="age">Edad</label>
            <input
              id="age"
              v-model.number="form.age"
              type="number"
              class="mobile-input"
              placeholder="25"
              min="12"
              max="100"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="gender">Género</label>
            <select id="gender" v-model="form.gender" class="mobile-input">
              <option value="">Selecciona</option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="other">Otro</option>
              <option value="prefer_not_to_say">Prefiero no decirlo</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="weight">Peso (kg)</label>
            <input
              id="weight"
              v-model.number="form.weightKg"
              type="number"
              class="mobile-input"
              placeholder="70"
              min="30"
              max="300"
              step="0.1"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="height">Altura (cm)</label>
            <input
              id="height"
              v-model.number="form.heightCm"
              type="number"
              class="mobile-input"
              placeholder="175"
              min="100"
              max="250"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">¿Dónde entrenas principalmente?</label>
          <div class="location-options">
            <button
              v-for="loc in locations"
              :key="loc.value"
              type="button"
              class="location-option"
              :class="{ 'location-option--selected': form.trainingLocation === loc.value }"
              @click="form.trainingLocation = loc.value"
            >
              <q-icon :name="loc.icon" size="24px" />
              <span>{{ loc.label }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="onboarding-actions">
      <button
        class="btn-mobile btn-mobile--large btn-mobile--primary"
        :disabled="!isFormValid"
        @click="continueToNext"
      >
        Continuar
        <q-icon name="arrow_forward" size="20px" />
      </button>
      <button class="btn-mobile btn-mobile--ghost" @click="goBack">Atrás</button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { STORAGE_KEYS } from '@/utils/constants'
import { useUserProfileStore } from '@/stores/userProfile'

const router = useRouter()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

const locations = [
  { value: 'gym', label: 'Gimnasio', icon: 'fitness_center' },
  { value: 'home', label: 'Casa', icon: 'home' },
  { value: 'park', label: 'Parque', icon: 'park' },
  { value: 'street', label: 'Calle', icon: 'sports_handball' },
]

const form = reactive({
  nick: authStore.user?.nick || '',
  age: null,
  gender: '',
  weightKg: null,
  heightCm: null,
  trainingLocation: userProfileStore.profile?.trainingLocation || '',
})

const isFormValid = computed(() => {
  return form.nick.trim().length >= 2
})

const continueToNext = () => {
  userProfileStore.setProfile({
    ...userProfileStore.profile,
    ...form,
  })
  router.push({ name: 'user-assessment' })
}

const goBack = () => {
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
  overflow-y: auto;
}

.onboarding-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-label {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.mobile-input option {
  background-color: var(--surface-secondary);
  color: var(--text-primary);
}

.location-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.location-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 2px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.location-option:hover {
  border-color: var(--border-default);
}

.location-option--selected {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.08);
  color: var(--text-primary);
}

.onboarding-actions {
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
