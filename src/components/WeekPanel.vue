<template>
  <div class="week-panel">
    <!-- Encabezado de la fase -->
    <div class="week-hero">
      <div class="week-hero__icon">{{ weekIcon }}</div>
      <div class="week-hero__text">
        <h4 class="week-hero__title">{{ weekData?.info?.name }}</h4>
        <p v-if="weekData?.progression || weekData?.info?.focus" class="week-hero__tip">
          {{ weekData.progression || weekData.info.focus }}
        </p>
      </div>
      <q-badge v-if="weekData?.info?.intensity" color="dark" class="intensity-badge">
        Intensidad {{ weekData.info.intensity }}
      </q-badge>
    </div>

    <q-banner
      v-if="weekNum === 0 && weekData?.info?.note"
      class="info-banner info-banner--amber"
      dense
      rounded
    >
      <template #avatar>
        <q-icon name="info" color="amber" />
      </template>
      {{ weekData.info.note }}
    </q-banner>
    <q-banner
      v-else-if="weekNum === 2 && weekData?.info?.note"
      class="info-banner info-banner--blue"
      dense
      rounded
    >
      <template #avatar>
        <q-icon name="trending_up" color="blue" />
      </template>
      {{ weekData.info.note }}
    </q-banner>
    <q-banner
      v-else-if="(weekNum === 3 || weekNum === 4) && weekData?.info?.note"
      class="info-banner info-banner--red"
      dense
      rounded
    >
      <template #avatar>
        <q-icon name="local_fire_department" color="red" />
      </template>
      {{ weekData.info.note }}
    </q-banner>

    <!-- Grid de sesiones -->
    <div class="sessions-grid">
      <div
        v-for="sessionKey in sessionKeys"
        :key="sessionKey"
        class="session-card"
        :class="[`session-card--${sessionTheme(sessionKey)}`]"
      >
        <!-- Header de sesión -->
        <div class="session-card__header">
          <div class="session-card__icon">{{ sessionIcon(sessionKey) }}</div>
          <div class="session-card__title-block">
            <h5 class="session-card__title">{{ weekData?.data?.[sessionKey]?.name }}</h5>
            <div class="session-card__meta">
              <span class="meta-item">
                <q-icon name="schedule" size="14px" />
                {{ weekData?.data?.[sessionKey]?.duration }}
              </span>
              <span class="meta-divider">•</span>
              <q-badge
                v-if="weekData?.data?.[sessionKey]?.sessionType"
                :color="sessionTypeColor(weekData.data[sessionKey].sessionType)"
                class="session-type-badge"
                outline
              >
                {{ sessionTypeLabel(weekData.data[sessionKey].sessionType) }}
              </q-badge>
              <span
                class="meta-divider"
                v-if="
                  weekData?.data?.[sessionKey]?.sessionType &&
                  weekData?.data?.[sessionKey]?.muscleGroups?.length
                "
                >•</span
              >
              <div class="muscle-tags">
                <span
                  v-for="mg in weekData?.data?.[sessionKey]?.muscleGroups"
                  :key="mg"
                  class="muscle-tag"
                >
                  {{ mg }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Meta / Objetivo -->
        <div class="session-goal">
          <q-icon name="sports" size="16px" class="session-goal__icon" />
          <span class="session-goal__text">{{ weekData?.data?.[sessionKey]?.goal }}</span>
        </div>

        <!-- Bloques de entrenamiento: tabs si hay múltiples, directo si es uno -->
        <template v-if="hasMultipleBlocks(sessionKey)">
          <q-tabs
            :model-value="blockTabs[sessionKey]"
            @update:model-value="(val) => (blockTabs[sessionKey] = val)"
            dense
            dark
            class="block-tabs"
            align="left"
            narrow-indicator
          >
            <q-tab
              v-for="(block, blockIdx) in weekData?.data?.[sessionKey]?.blocks"
              :key="blockIdx"
              :name="`block-${sessionKey}-${blockIdx}`"
              :label="block.name"
            />
          </q-tabs>

          <q-tab-panels
            :model-value="blockTabs[sessionKey]"
            @update:model-value="(val) => (blockTabs[sessionKey] = val)"
            dark
            animated
            class="block-panels"
          >
            <q-tab-panel
              v-for="(block, blockIdx) in weekData?.data?.[sessionKey]?.blocks"
              :key="blockIdx"
              :name="`block-${sessionKey}-${blockIdx}`"
              class="q-pa-none"
            >
              <SessionBlock :block="block" />
            </q-tab-panel>
          </q-tab-panels>
        </template>

        <template v-else>
          <SessionBlock
            :block="weekData?.data?.[sessionKey]?.blocks?.[0] || weekData?.data?.[sessionKey]"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import SessionBlock from '@/components/admin/program/SessionBlock.vue'

const props = defineProps({
  weekData: Object,
  weekNum: Number,
  levelNum: Number,
})

const blockTabs = ref({})

const hasMultipleBlocks = (sessionKey) => {
  return (props.weekData?.data?.[sessionKey]?.blocks?.length || 0) > 1
}

watch(
  () => props.weekData,
  (newData) => {
    if (!newData?.data) return
    const tabs = {}
    Object.keys(newData.data).forEach((key) => {
      const blocks = newData.data[key]?.blocks
      if (blocks && blocks.length > 1) {
        tabs[key] = `block-${key}-0`
      }
    })
    blockTabs.value = tabs
  },
  { immediate: true },
)

const sessionKeys = computed(() => {
  // Detectar automáticamente las session keys disponibles en los datos
  // Soporta tanto v1 (day1_push, day2_pull...) como v2 (day1_strength, day2_strength...)
  const data = props.weekData?.data || {}
  const keys = Object.keys(data)
  if (keys.length === 0) return ['day1_push', 'day2_pull', 'day3_legs', 'day4_core']
  // Ordenar para mantener consistencia: day1, day2, day3, day4
  return keys.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || 0)
    const numB = parseInt(b.match(/\d+/)?.[0] || 0)
    return numA - numB
  })
})

const weekIcon = computed(() => {
  if (props.weekNum === 0) return '🌱'
  if (props.weekNum === 1) return '📚'
  if (props.weekNum === 2) return '📈'
  if (props.weekNum === 3) return '🔥'
  return '💪'
})

const sessionTheme = (key) => {
  if (key.includes('push')) return 'push'
  if (key.includes('pull')) return 'pull'
  if (key.includes('legs')) return 'legs'
  if (key.includes('core')) return 'core'
  // v2 day keys
  if (key === 'day1_strength') return 'push'
  if (key === 'day2_strength') return 'pull'
  if (key === 'day3_circuit') return 'legs'
  if (key === 'day4_circuit') return 'core'
  // Handstand Balance Mastery sessions
  if (key === 'session_a') return 'push'
  if (key === 'session_b') return 'core'
  if (key === 'session_c') return 'legs'
  if (key === 'session_d') return 'core'
  return 'core'
}

const sessionTypeLabel = (type) => {
  if (type === 'strength') return 'FUERZA/SKILL'
  if (type === 'circuit') return 'CIRCUITO'
  if (type === 'skill') return 'SKILL'
  if (type === 'mobility') return 'MOVILIDAD'
  return type
}

const sessionTypeColor = (type) => {
  if (type === 'strength') return 'orange'
  if (type === 'circuit') return 'green'
  if (type === 'skill') return 'purple'
  if (type === 'mobility') return 'teal'
  return 'grey'
}

const sessionIcon = (key) => {
  if (key.includes('push')) return '💪'
  if (key.includes('pull')) return '🏋️'
  if (key.includes('legs')) return '🦵'
  if (key.includes('core')) return '🧘'
  // v2 day keys
  if (key === 'day1_strength') return '💪'
  if (key === 'day2_strength') return '🏋️'
  if (key === 'day3_circuit') return '🦵'
  if (key === 'day4_circuit') return '🧘'
  // Handstand Balance Mastery sessions
  if (key === 'session_a') return '💪'
  if (key === 'session_b') return '🤸'
  if (key === 'session_c') return '🧘'
  if (key === 'session_d') return '🎯'
  return '🎯'
}
</script>

<style scoped>
/* ===== Variables locales ===== */
:root {
  --wp-push: #ff8f38;
  --wp-push-soft: rgba(255, 143, 56, 0.12);
  --wp-pull: #38b2ac;
  --wp-pull-soft: rgba(56, 178, 172, 0.12);
  --wp-legs: #21ba45;
  --wp-legs-soft: rgba(33, 186, 69, 0.12);
  --wp-core: #9b59b6;
  --wp-core-soft: rgba(155, 89, 182, 0.12);
}

/* ===== Encabezado de semana ===== */
.week-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.08) 0%, rgba(255, 143, 56, 0.02) 100%);
  border: 1px solid rgba(255, 143, 56, 0.15);
  border-radius: 16px;
}

.week-hero__icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

.week-hero__text {
  flex: 1;
  min-width: 0;
}

.week-hero__title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
  line-height: 1.3;
}

.week-hero__tip {
  font-size: 14px;
  color: #b0b8c4;
  margin: 0;
  line-height: 1.5;
}

.intensity-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 143, 56, 0.3);
  color: #ff8f38;
  flex-shrink: 0;
}

/* ===== Banners informativos ===== */
.info-banner {
  margin-bottom: 20px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.info-banner :deep(.q-banner__avatar) {
  align-self: center;
}

.info-banner--amber {
  background: rgba(245, 158, 11, 0.1) !important;
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24 !important;
}

.info-banner--blue {
  background: rgba(59, 130, 246, 0.1) !important;
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #60a5fa !important;
}

.info-banner--red {
  background: rgba(239, 68, 68, 0.1) !important;
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171 !important;
}

/* ===== Grid de sesiones ===== */
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .sessions-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Tarjeta de sesión ===== */
.session-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 24px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.session-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.8;
  transition: height 0.2s ease;
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.session-card:hover::before {
  height: 4px;
}

/* Temas por tipo de día */
.session-card--push::before {
  background: linear-gradient(90deg, #ff8f38, #ff6b6b);
}
.session-card--push {
  border-top-color: rgba(255, 143, 56, 0.3);
}

.session-card--pull::before {
  background: linear-gradient(90deg, #38b2ac, #3182ce);
}
.session-card--pull {
  border-top-color: rgba(56, 178, 172, 0.3);
}

.session-card--legs::before {
  background: linear-gradient(90deg, #21ba45, #10b981);
}
.session-card--legs {
  border-top-color: rgba(33, 186, 69, 0.3);
}

.session-card--core::before {
  background: linear-gradient(90deg, #9b59b6, #ec4899);
}
.session-card--core {
  border-top-color: rgba(155, 89, 182, 0.3);
}

/* Header */
.session-card__header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.session-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.session-card__title-block {
  flex: 1;
  min-width: 0;
}

.session-card__title {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
  line-height: 1.3;
}

.session-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  color: #8b949e;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meta-divider {
  color: rgba(255, 255, 255, 0.15);
}

.muscle-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.muscle-tag {
  display: inline-block;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #b0b8c4;
}

/* Objetivo */
.session-goal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 14px;
  background: rgba(255, 143, 56, 0.08);
  border: 1px solid rgba(255, 143, 56, 0.15);
  border-radius: 10px;
  font-size: 13px;
  color: #ff8f38;
  font-weight: 500;
}

.session-goal__icon {
  opacity: 0.9;
}

/* ===== Circuito banner ===== */
.circuit-banner {
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.circuit-banner__main {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #fff;
}

.circuit-banner__main strong {
  color: #ff8f38;
  font-weight: 700;
}

.circuit-banner__rest {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.strength-banner {
  background: rgba(96, 165, 250, 0.08);
  border: 1px dashed rgba(96, 165, 250, 0.25);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.strength-banner__rest {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rest-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  font-size: 12px;
  color: #8b949e;
}

/* ===== Lista de ejercicios ===== */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exercise-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background 0.2s ease;
}

.exercise-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.exercise-item__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.exercise-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff8f38, #ff6b6b);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.circuit-connector {
  color: #ff8f38;
  opacity: 0.6;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-item__body {
  flex: 1;
  min-width: 0;
}

.exercise-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.exercise-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.exercise-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}

.exercise-id {
  font-size: 11px;
  font-weight: 500;
  color: #555;
  font-family: 'SF Mono', Monaco, monospace;
  letter-spacing: 0.3px;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
}

.exercise-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.difficulty-flames {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.difficulty-flames :deep(.q-icon) {
  color: #555;
}

.difficulty-1 :deep(.q-icon:nth-child(-n + 1)) {
  color: #ff8f38;
}
.difficulty-2 :deep(.q-icon:nth-child(-n + 2)) {
  color: #ff8f38;
}
.difficulty-3 :deep(.q-icon:nth-child(-n + 3)) {
  color: #ff8f38;
}
.difficulty-4 :deep(.q-icon:nth-child(-n + 4)) {
  color: #ff8f38;
}
.difficulty-5 :deep(.q-icon:nth-child(-n + 5)) {
  color: #ff8f38;
}

.video-btn {
  color: #8b949e;
  transition: color 0.2s;
}

.video-btn:hover {
  color: #ff8f38;
}

.exercise-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.exercise-reps {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(255, 143, 56, 0.12);
  color: #ff8f38;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
}

.exercise-note {
  font-size: 12px;
  color: #6e7681;
  line-height: 1.4;
}

.exercise-rest {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
}

/* ===== Bloques de entrenamiento ===== */
.training-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  padding: 8px 12px;
  background: rgba(255, 143, 56, 0.08);
  border: 1px solid rgba(255, 143, 56, 0.15);
  border-radius: 10px;
}

.block-header__bar {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #ff8f38, #ff6b6b);
  border-radius: 2px;
  flex-shrink: 0;
}

.block-header__name {
  font-size: 14px;
  font-weight: 700;
  color: #ff8f38;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
}

.block-header__rounds {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #b0b8c4;
  font-weight: 500;
}

.block-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 0;
  margin: 4px 0;
  color: #555;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.block-rest-time {
  color: #ff8f38;
  font-weight: 700;
  margin-left: 4px;
}

/* ===== Tabs de rondas ===== */
.block-tabs :deep(.q-tabs__content) {
  gap: 6px;
  padding: 4px;
}

.block-tabs :deep(.q-tab) {
  min-height: 32px;
  padding: 4px 14px;
  border-radius: 8px;
  color: #8b949e;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.block-tabs :deep(.q-tab:hover) {
  background: rgba(255, 255, 255, 0.04);
  color: #c9d1d9;
}

.block-tabs :deep(.q-tab--active) {
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(255, 143, 56, 0.3);
}

.block-tabs :deep(.q-tab__indicator) {
  display: none;
}

.block-tabs :deep(.q-tab__content) {
  min-width: auto;
}

.block-panels {
  background: transparent;
}

.block-panels :deep(.q-tab-panel) {
  padding: 16px 4px 4px;
}

/* Responsive tweaks */
@media (max-width: 480px) {
  .session-card {
    padding: 18px;
  }

  .week-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
