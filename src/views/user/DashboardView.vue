<template>
  <div class="mobile-view">
    <MobilePageHeader title="Hola, atleta" subtitle="Tu resumen" :centered="true" />

    <div class="mobile-container">
      <!-- Estado: Sin programas activos -->
      <template v-if="!userProfileStore.hasActiveProgram">
        <div class="empty-state animate-fadeInUp">
          <div class="empty-state__icon">
            <q-icon name="fitness_center" size="64px" />
          </div>
          <h2 class="mobile-h2">Aún no tienes un programa</h2>
          <p class="mobile-body" style="text-align: center; max-width: 300px">
            Elige un programa de nuestro catálogo o completa tu evaluación para que te recomendemos
            el mejor plan.
          </p>
          <div class="empty-state__actions">
            <button
              class="btn-mobile btn-mobile--large btn-mobile--primary"
              @click="startOnboarding"
            >
              Hacer test de evaluación
              <q-icon name="arrow_forward" size="20px" />
            </button>
            <button class="btn-mobile btn-mobile--ghost" @click="explorePrograms">
              Explorar programas
            </button>
          </div>
        </div>

        <!-- Stats iniciales vacíos -->
        <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.2s">
          <div class="stats-grid">
            <div class="stat-card stat-card--empty">
              <q-icon name="local_fire_department" size="28px" color="muted" />
              <span class="stat-card__value">0</span>
              <span class="stat-card__label">Racha</span>
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

      <!-- Estado: Con programas activos -->
      <template v-else>
        <!-- Recompensa diaria -->
        <div v-if="showDailyReward" class="daily-reward animate-fadeIn">
          <q-icon name="redeem" size="24px" class="daily-reward__icon" />
          <div class="daily-reward__text">
            <strong>+{{ dailyXp }} XP</strong> por conectarte
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

        <!-- Mis programas activos -->
        <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.25s">
          <div class="section-header">
            <h3 class="mobile-h4">Mis programas</h3>
            <button class="section-link" @click="explorePrograms">Añadir</button>
          </div>

          <div class="programs-grid">
            <div
              v-for="program in userProfileStore.activePrograms"
              :key="program.id"
              class="program-card"
              @click="openProgram(program)"
            >
              <div class="program-card__progress">
                <ProgressRing
                  :value="program.progress?.percentage || 0"
                  :max="100"
                  :size="44"
                  :stroke-width="6"
                  fill-color="#ff8f38"
                  track-color="rgba(0, 0, 0, 0.08)"
                />
              </div>

              <div class="program-card__icon">
                <q-icon :name="getProgramIcon(program.discipline)" size="28px" />
              </div>
              <div class="program-card__content">
                <h4 class="program-card__name">{{ program.name }}</h4>
                <p class="program-card__desc">{{ truncateText(program.description, 60) }}</p>
                <div class="program-card__meta">
                  <span class="program-card__level">{{ formatLevel(program.difficulty) }}</span>
                  <span class="program-card__levels">{{ program.totalLevels }} niveles</span>
                </div>
              </div>
              <q-icon name="chevron_right" size="20px" color="muted" />
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import ProgressRing from '@/components/mobile/ProgressRing.vue'
import StreakBadge from '@/components/mobile/StreakBadge.vue'
import { useUserProfileStore } from '@/stores/userProfile'
import { getDisciplineIcon } from '@/constants/disciplines'

const router = useRouter()
const userProfileStore = useUserProfileStore()

const showDailyReward = ref(false)
const dailyXp = ref(10)

onMounted(async () => {
  await userProfileStore.fetchActiveProgress()
})

const startOnboarding = () => {
  router.push({ name: 'user-welcome' })
}

const explorePrograms = () => {
  router.push({ name: 'user-programs-catalog' })
}

const openProgram = (program) => {
  userProfileStore.selectProgram(program.id)
  router.push({ name: 'user-program' })
}

const getProgramIcon = (discipline) => {
  return getDisciplineIcon(discipline)
}

const formatLevel = (difficulty) => {
  const labels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  }
  return labels[difficulty] || difficulty
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
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
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.programs-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.program-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  padding-top: var(--space-6);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.program-card:hover {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.program-card__progress {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
}

.program-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.program-card__content {
  flex: 1;
  min-width: 0;
}

.program-card__name {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

.program-card__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-2) 0;
  line-height: var(--leading-normal);
}

.program-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.program-card__level {
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.program-card__levels {
  font-size: var(--font-xs);
  color: var(--text-muted);
}
</style>
