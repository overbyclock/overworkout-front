<template>
  <q-drawer
    :model-value="modelValue"
    side="right"
    bordered
    :width="480"
    :breakpoint="700"
    class="guide-drawer"
    dark
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="loading" class="drawer-loading">
      <q-spinner color="primary" size="48px" />
      <p class="q-mt-md text-grey-5">Cargando guía...</p>
    </div>

    <div v-else-if="exercise" class="drawer-content">
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-top">
          <div class="header-badges">
            <span class="level-badge-drawer" :class="exercise.level">
              {{ getLevelLabel(exercise.level) }}
            </span>
            <span v-if="exercise.difficultyRating" class="difficulty-badge">
              <q-icon
                v-for="n in exercise.difficultyRating"
                :key="n"
                name="local_fire_department"
                :color="getLevelColor(exercise.level, true)"
                size="14px"
              />
            </span>
          </div>
          <q-btn flat round icon="close" color="grey-5" @click="close" />
        </div>
        <h2 class="drawer-title">{{ normalizeName(exercise.name) }}</h2>
        <div class="header-muscles">
          <q-icon name="fitness_center" size="16px" color="primary" />
          <span>{{ getMuscleGroupLabel(exercise.primaryMuscleGroup) }}</span>
          <span v-if="exercise.secondaryMuscleGroup">
            + {{ getMuscleGroupLabel(exercise.secondaryMuscleGroup) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="exercise.description" class="guide-section">
        <div class="section-header">
          <q-icon name="description" size="20px" color="primary" />
          <h3>Descripción</h3>
        </div>
        <p class="section-text">{{ exercise.description }}</p>
      </div>

      <!-- Setup -->
      <div v-if="exercise.setupInstructions" class="guide-section">
        <div class="section-header">
          <q-icon name="build" size="20px" color="amber" />
          <h3>Preparación</h3>
        </div>
        <p class="section-text">{{ exercise.setupInstructions }}</p>
      </div>

      <!-- Execution -->
      <div v-if="exercise.executionInstructions" class="guide-section">
        <div class="section-header">
          <q-icon name="play_arrow" size="20px" color="green" />
          <h3>Ejecución</h3>
        </div>
        <p class="section-text">{{ exercise.executionInstructions }}</p>
      </div>

      <!-- Standards -->
      <div v-if="exercise.movementStandards" class="guide-section">
        <div class="section-header">
          <q-icon name="verified" size="20px" color="cyan" />
          <h3>Estándares del movimiento</h3>
        </div>
        <p class="section-text">{{ exercise.movementStandards }}</p>
      </div>

      <!-- Common Faults -->
      <div v-if="exercise.commonFaults?.length" class="guide-section">
        <div class="section-header">
          <q-icon name="warning" size="20px" color="negative" />
          <h3>Errores comunes</h3>
        </div>
        <ul class="faults-list">
          <li v-for="(fault, index) in exercise.commonFaults" :key="index">
            <q-icon name="cancel" size="16px" color="negative" />
            <span>{{ fault }}</span>
          </li>
        </ul>
      </div>

      <!-- Safety Tips -->
      <div v-if="exercise.safetyTips" class="guide-section">
        <div class="section-header">
          <q-icon name="health_and_safety" size="20px" color="positive" />
          <h3>Consejos de seguridad</h3>
        </div>
        <p class="section-text">{{ exercise.safetyTips }}</p>
      </div>

      <!-- External links -->
      <div class="guide-section external-links">
        <div class="section-header">
          <q-icon name="open_in_new" size="20px" color="grey-5" />
          <h3>Recursos externos</h3>
        </div>
        <div class="links-row">
          <q-btn
            flat
            dense
            icon="play_circle"
            label="Buscar en YouTube"
            color="negative"
            size="sm"
            no-caps
            @click="searchOn('youtube')"
          />
          <q-btn
            flat
            dense
            icon="search"
            label="Buscar en Google"
            color="primary"
            size="sm"
            no-caps
            @click="searchOn('google')"
          />
        </div>
      </div>

      <!-- Footer spacer -->
      <div class="drawer-footer-spacer" />
    </div>

    <div v-else class="drawer-empty">
      <q-icon name="fitness_center" size="48px" color="grey-7" />
      <p class="q-mt-md text-grey-5">No se pudo cargar la guía</p>
    </div>
  </q-drawer>
</template>

<script setup>
import { useHelpers } from '@/composables/useHelpers'
import { getMuscleGroupLabel, getLevelLabel, getLevelColor } from '@/constants'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  exercise: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { normalizeName } = useHelpers()

const close = () => {
  emit('update:modelValue', false)
}

const searchOn = (platform) => {
  if (!props.exercise?.name) return
  const query = encodeURIComponent(`${props.exercise.name} exercise tutorial`)
  const url =
    platform === 'youtube'
      ? `https://www.youtube.com/results?search_query=${query}`
      : `https://www.google.com/search?q=${query}&tbm=vid`
  window.open(url, '_blank')
}
</script>

<style scoped>
.guide-drawer {
  background: linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%);
}

.drawer-loading,
.drawer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 48px;
}

.drawer-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 100vh;
  overflow-y: auto;
}

/* Header */
.drawer-header {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-badge-drawer {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: capitalize;
}

.level-badge-drawer.beginner {
  background: rgba(63, 185, 80, 0.2);
  color: #3fb950;
}
.level-badge-drawer.intermediate {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}
.level-badge-drawer.expert {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.difficulty-badge {
  display: flex;
  gap: 2px;
}

.drawer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.header-muscles {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #8b949e;
}

/* Sections */
.guide-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.section-text {
  font-size: 0.95rem;
  color: #c9d1d9;
  line-height: 1.7;
  margin: 0;
  white-space: pre-line;
}

.faults-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faults-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #c9d1d9;
  line-height: 1.5;
}

.faults-list li .q-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.external-links .links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-footer-spacer {
  height: 24px;
}

/* Scrollbar styling */
.drawer-content::-webkit-scrollbar {
  width: 6px;
}
.drawer-content::-webkit-scrollbar-track {
  background: transparent;
}
.drawer-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
.drawer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
