<template>
  <div class="week-panel">
    <!-- Encabezado de la semana -->
    <div class="week-hero">
      <div class="week-hero__icon">{{ weekIcon }}</div>
      <div class="week-hero__text">
        <h4 class="week-hero__title">{{ weekData?.info?.name }}</h4>
        <p v-if="weekData?.progression" class="week-hero__tip">{{ weekData.progression }}</p>
      </div>
      <q-badge v-if="weekData?.info?.intensity" color="dark" class="intensity-badge">
        Intensidad {{ weekData.info.intensity }}
      </q-badge>
    </div>

    <q-banner v-if="weekNum === 0" class="info-banner info-banner--amber" dense rounded>
      <template #avatar>
        <q-icon name="info" color="amber" />
      </template>
      {{ weekData?.info?.note }}
    </q-banner>
    <q-banner v-else-if="weekNum === 2" class="info-banner info-banner--blue" dense rounded>
      <template #avatar>
        <q-icon name="trending_up" color="blue" />
      </template>
      {{ weekData?.info?.note }}
    </q-banner>
    <q-banner v-else-if="weekNum === 3 || weekNum === 4" class="info-banner info-banner--red" dense rounded>
      <template #avatar>
        <q-icon name="local_fire_department" color="red" />
      </template>
      {{ weekData?.info?.note }}
    </q-banner>

    <!-- Grid de sesiones -->
    <div class="sessions-grid">
      <div
        v-for="sessionKey in sessionKeys"
        :key="sessionKey"
        class="session-card"
        :class="[`session-card--${sessionTheme(sessionKey)}`]">

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
              <div class="muscle-tags">
                <span
                  v-for="mg in weekData?.data?.[sessionKey]?.muscleGroups"
                  :key="mg"
                  class="muscle-tag">
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

        <!-- Circuito info -->
        <div v-if="weekData?.data?.[sessionKey]?.isCircuit" class="circuit-banner">
          <div class="circuit-banner__main">
            <q-icon name="repeat" size="18px" />
            <strong>{{ weekData.data[sessionKey].circuitConfig?.rounds }} RONDAS</strong>
          </div>
          <div class="circuit-banner__rest">
            <span class="rest-pill">
              <q-icon name="timer" size="12px" />
              {{ weekData.data[sessionKey].circuitConfig?.restBetweenExercises }} entre ejercicios
            </span>
            <span class="rest-pill">
              <q-icon name="hourglass_top" size="12px" />
              {{ weekData.data[sessionKey].circuitConfig?.restBetweenRounds }} entre rondas
            </span>
          </div>
        </div>

        <!-- Lista de ejercicios -->
        <div class="exercises-list" :class="{ 'exercises-list--circuit': weekData?.data?.[sessionKey]?.isCircuit }">
          <div
            v-for="(ex, exIdx) in weekData?.data?.[sessionKey]?.exercises"
            :key="exIdx"
            class="exercise-item">

            <div class="exercise-item__left">
              <div class="exercise-number">{{ exIdx + 1 }}</div>
              <div v-if="weekData?.data?.[sessionKey]?.isCircuit && exIdx < (weekData.data[sessionKey].exercises.length - 1)" class="circuit-connector">
                <q-icon name="arrow_downward" size="14px" />
              </div>
            </div>

            <div class="exercise-item__body">
              <div class="exercise-main">
                <div class="exercise-title">
                  <span class="exercise-name">{{ ex.name }}</span>
                  <span v-if="ex.id" class="exercise-id">#{{ ex.id }}</span>
                </div>
                <div class="exercise-badges">
                  <span class="difficulty-flames" :class="'difficulty-' + (ex.difficulty || 1)">
                    <q-icon
                      v-for="n in (ex.difficulty || 1)"
                      :key="n"
                      name="local_fire_department"
                      size="12px" />
                  </span>
                  <q-btn
                    v-if="ex.videoSearch"
                    flat
                    round
                    dense
                    icon="play_circle"
                    size="sm"
                    class="video-btn"
                    @click="searchVideo(ex.videoSearch)">
                    <q-tooltip>Ver video</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div class="exercise-sub">
                <span class="exercise-reps">{{ ex.reps }}</span>
                <span v-if="ex.notes" class="exercise-note">{{ ex.notes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  weekData: Object,
  weekNum: Number,
  levelNum: Number
})

const sessionKeys = ['day1_push', 'day2_pull', 'day3_legs', 'day4_core']

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
  return 'core'
}

const sessionIcon = (key) => {
  if (key.includes('push')) return '💪'
  if (key.includes('pull')) return '🏋️'
  if (key.includes('legs')) return '🦵'
  return '🧘'
}

const searchVideo = (query) => {
  if (!query) return
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  window.open(url, '_blank')
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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
.session-card--push::before { background: linear-gradient(90deg, #ff8f38, #ff6b6b); }
.session-card--push { border-top-color: rgba(255, 143, 56, 0.3); }

.session-card--pull::before { background: linear-gradient(90deg, #38b2ac, #3182ce); }
.session-card--pull { border-top-color: rgba(56, 178, 172, 0.3); }

.session-card--legs::before { background: linear-gradient(90deg, #21ba45, #10b981); }
.session-card--legs { border-top-color: rgba(33, 186, 69, 0.3); }

.session-card--core::before { background: linear-gradient(90deg, #9b59b6, #ec4899); }
.session-card--core { border-top-color: rgba(155, 89, 182, 0.3); }

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

.difficulty-1 :deep(.q-icon:nth-child(-n+1)) { color: #ff8f38; }
.difficulty-2 :deep(.q-icon:nth-child(-n+2)) { color: #ff8f38; }
.difficulty-3 :deep(.q-icon:nth-child(-n+3)) { color: #ff8f38; }
.difficulty-4 :deep(.q-icon:nth-child(-n+4)) { color: #ff8f38; }
.difficulty-5 :deep(.q-icon:nth-child(-n+5)) { color: #ff8f38; }

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

  .circuit-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .exercise-main {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
