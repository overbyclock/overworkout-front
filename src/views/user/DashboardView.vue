<template>
  <div class="mobile-view">
    <MobilePageHeader title="Buenos días, atleta" subtitle="Tu resumen diario" :centered="true" />

    <div class="mobile-container">
      <!-- Estado: Sin programa activo -->
      <template v-if="!userProfileStore.hasActiveProgram">
        <div class="empty-state animate-fadeInUp">
          <div class="empty-state__icon">
            <q-icon name="fitness_center" size="64px" />
          </div>
          <h2 class="mobile-h2">Bienvenido a tu entrenamiento</h2>
          <p class="mobile-body" style="text-align: center; max-width: 300px">
            Todavía no tienes un programa activo. Completa tu evaluación para que podamos
            recomendarte el mejor plan.
          </p>
          <div class="empty-state__actions">
            <button
              class="btn-mobile btn-mobile--large btn-mobile--primary"
              @click="startOnboarding"
            >
              Encontrar mi programa
              <q-icon name="arrow_forward" size="20px" />
            </button>
            <button class="btn-mobile btn-mobile--ghost" @click="explorePrograms">
              Explorar programas disponibles
            </button>
          </div>
        </div>

        <!-- Stats iniciales vacíos -->
        <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.2s">
          <div class="stats-grid">
            <div class="stat-card stat-card--empty">
              <q-icon name="local_fire_department" size="28px" color="muted" />
              <span class="stat-card__value">0</span>
              <span class="stat-card__label">Días seguidos</span>
            </div>
            <div class="stat-card stat-card--empty">
              <q-icon name="military_tech" size="28px" color="muted" />
              <span class="stat-card__value">1</span>
              <span class="stat-card__label">Nivel atleta</span>
            </div>
            <div class="stat-card stat-card--empty">
              <q-icon name="local_fire_department" size="28px" color="muted" />
              <span class="stat-card__value">0</span>
              <span class="stat-card__label">XP Total</span>
            </div>
          </div>
        </section>
      </template>

      <!-- Estado: Con programa activo -->
      <template v-else>
        <!-- Recompensa diaria -->
        <div v-if="showDailyReward" class="daily-reward animate-fadeIn">
          <q-icon name="redeem" size="24px" class="daily-reward__icon" />
          <div class="daily-reward__text">
            <strong>+{{ dailyXp }} XP</strong> por conectarte hoy
          </div>
        </div>

        <!-- Streak y nivel -->
        <section class="mobile-section stats-row animate-fadeInUp" style="animation-delay: 0.1s">
          <div class="stat-pill">
            <StreakBadge :count="userProfileStore.streakDays" size="md" />
          </div>
          <div class="stat-pill">
            <q-icon name="military_tech" size="20px" color="primary" />
            <span>Nv. {{ userProfileStore.userLevel }}</span>
          </div>
          <div class="stat-pill">
            <q-icon name="local_fire_department" size="20px" color="primary" />
            <span>{{ userProfileStore.userXp }} XP</span>
          </div>
        </section>

        <!-- Tarjeta principal: entrenamiento de hoy -->
        <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.2s">
          <MobileCard variant="primary" clickable @click="goToTrain">
            <template #icon>
              <q-icon name="play_arrow" size="32px" />
            </template>
            <template #default>
              <h2 class="today-card__title">Hoy toca entrenar</h2>
              <p class="today-card__session">{{ todaySessionName }}</p>
              <p class="today-card__meta">{{ todaySessionMeta }}</p>
            </template>
            <template #action>
              <q-icon name="arrow_forward" size="24px" />
            </template>
          </MobileCard>
        </section>

        <!-- Progreso del nivel -->
        <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.3s">
          <div class="section-header">
            <h3 class="mobile-h4">Tu progreso</h3>
            <router-link :to="{ name: 'user-program' }" class="section-link"
              >Ver programa</router-link
            >
          </div>

          <div class="progress-card">
            <ProgressRing :value="levelProgress" :max="100" :size="100" :stroke-width="8" />
            <div class="progress-card__info">
              <p class="progress-card__level">{{ currentLevelName }}</p>
              <p class="progress-card__week">Semana {{ userProfileStore.currentWeek + 1 }} de 4</p>
              <p class="progress-card__cycles">Ciclo {{ cyclesCompleted + 1 }}</p>
            </div>
          </div>
        </section>

        <!-- Próximos entrenamientos (solo si hay datos reales) -->
        <section
          v-if="upcomingDays.length > 0"
          class="mobile-section animate-fadeInUp"
          style="animation-delay: 0.4s"
        >
          <h3 class="mobile-h4" style="margin-bottom: var(--space-4)">Próximos días</h3>
          <div class="upcoming-list">
            <div
              v-for="(day, index) in upcomingDays"
              :key="index"
              class="upcoming-day"
              :class="{ 'upcoming-day--today': day.isToday }"
            >
              <div class="upcoming-day__name">{{ day.name }}</div>
              <div class="upcoming-day__session">{{ day.session }}</div>
              <div v-if="day.isToday" class="upcoming-day__badge">Hoy</div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import MobileCard from '@/components/mobile/MobileCard.vue'
import ProgressRing from '@/components/mobile/ProgressRing.vue'
import StreakBadge from '@/components/mobile/StreakBadge.vue'
import { useUserProfileStore } from '@/stores/userProfile'

const router = useRouter()
const userProfileStore = useUserProfileStore()

const showDailyReward = ref(false)
const dailyXp = ref(10)

// Datos del programa activo (mock temporal hasta conectar backend real)
const todaySessionName = computed(() => 'Sesión A — Push + Core')
const todaySessionMeta = computed(() => '45 min · 6 ejercicios')
const currentLevelName = computed(() => userProfileStore.currentLevel?.name || 'Nivel 1')
const cyclesCompleted = computed(() => userProfileStore.activeProgress?.cyclesCompleted || 0)
const levelProgress = computed(() => {
  const week = userProfileStore.currentWeek || 0
  return (week / 4) * 100
})

// Upcoming days vacío por defecto — se llenará cuando conectemos con backend
const upcomingDays = computed(() => {
  if (!userProfileStore.hasActiveProgram) return []
  // TODO: Cargar desde backend cuando esté disponible
  return [
    { name: 'Hoy', session: todaySessionName.value, isToday: true },
    { name: 'Mañana', session: 'Sesión B — Pull', isToday: false },
    { name: 'Miércoles', session: 'Descanso activo', isToday: false },
    { name: 'Jueves', session: 'Sesión C — Legs', isToday: false },
  ]
})

onMounted(async () => {
  await userProfileStore.fetchActiveProgress()
})

const startOnboarding = () => {
  router.push({ name: 'user-welcome' })
}

const explorePrograms = () => {
  router.push({ name: 'user-programs-catalog' })
}

const goToTrain = () => {
  router.push({ name: 'user-train' })
}

setTimeout(() => {
  showDailyReward.value = false
}, 4000)
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-5);
  padding: var(--space-8) 0;
}

.empty-state__icon {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.12) 0%, rgba(56, 178, 172, 0.08) 100%);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state__actions {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-align: center;
}

.stat-card--empty {
  opacity: 0.6;
}

.stat-card__value {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.stat-card__label {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

.daily-reward {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: linear-gradient(90deg, rgba(255, 143, 56, 0.15) 0%, rgba(56, 178, 172, 0.1) 100%);
  border: 1px solid rgba(255, 143, 56, 0.2);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
  margin: var(--space-4) auto;
  max-width: fit-content;
  color: var(--color-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

.daily-reward__icon {
  animation: bounce-subtle 1s ease-in-out infinite;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

.today-card__title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  margin: 0 0 var(--space-1) 0;
}

.today-card__session {
  font-size: var(--font-base);
  font-weight: var(--font-medium);
  margin: 0 0 var(--space-1) 0;
  opacity: 0.95;
}

.today-card__meta {
  font-size: var(--font-sm);
  margin: 0;
  opacity: 0.85;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.section-link {
  color: var(--color-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  text-decoration: none;
}

.progress-card {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.progress-card__info {
  flex: 1;
}

.progress-card__level {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

.progress-card__week,
.progress-card__cycles {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-1) 0;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.upcoming-day {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.upcoming-day--today {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.upcoming-day__name {
  width: 70px;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  color: var(--text-muted);
  flex-shrink: 0;
}

.upcoming-day__session {
  flex: 1;
  font-size: var(--font-base);
  color: var(--text-primary);
}

.upcoming-day__badge {
  background-color: var(--color-primary);
  color: #000;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
</style>
