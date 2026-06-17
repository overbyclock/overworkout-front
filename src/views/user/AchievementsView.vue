<template>
  <div class="mobile-view">
    <MobilePageHeader title="Tus logros" subtitle="Desbloquea retos" :centered="true" />

    <div class="mobile-container">
      <!-- Stats de gamificación -->
      <section class="mobile-section stats-grid animate-fadeInUp">
        <div class="stat-card">
          <q-icon name="local_fire_department" size="32px" color="primary" />
          <span class="stat-card__value">{{ userProfileStore.streakDays }}</span>
          <span class="stat-card__label">Racha</span>
        </div>
        <div class="stat-card">
          <q-icon name="military_tech" size="32px" color="accent" />
          <span class="stat-card__value">{{ userProfileStore.userLevel }}</span>
          <span class="stat-card__label">Nivel atleta</span>
        </div>
        <div class="stat-card">
          <q-icon name="emoji_events" size="32px" color="warning" />
          <span class="stat-card__value">{{ unlockedCount }}</span>
          <span class="stat-card__label">Logros</span>
        </div>
      </section>

      <!-- Estado vacío: sin logros -->
      <section
        v-if="achievements.length === 0"
        class="mobile-section empty-state animate-fadeInUp"
        style="animation-delay: 0.1s"
      >
        <div class="empty-state__icon">
          <q-icon name="emoji_events" size="64px" />
        </div>
        <h3 class="mobile-h3">Aún no tienes logros</h3>
        <p class="mobile-body" style="text-align: center; max-width: 300px">
          Completa tu primer entrenamiento, supera un benchmark o mantén una racha para desbloquear
          tu primera medalla.
        </p>
      </section>

      <!-- Lista de logros (cuando haya datos reales) -->
      <section v-else class="mobile-section animate-fadeInUp" style="animation-delay: 0.1s">
        <h3 class="mobile-h4" style="margin-bottom: var(--space-4)">Logros recientes</h3>
        <div class="achievements-list">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ 'achievement-card--unlocked': achievement.unlocked }"
          >
            <div class="achievement-card__icon">
              <q-icon :name="achievement.icon" size="32px" />
            </div>
            <div class="achievement-card__content">
              <h4 class="achievement-card__title">{{ achievement.title }}</h4>
              <p class="achievement-card__desc">{{ achievement.description }}</p>
              <div v-if="!achievement.unlocked" class="achievement-card__progress">
                <div class="achievement-card__progress-bar">
                  <div
                    class="achievement-card__progress-fill"
                    :style="{ width: achievement.progress + '%' }"
                  />
                </div>
                <span class="achievement-card__progress-text">{{ achievement.progress }}%</span>
              </div>
            </div>
            <div v-if="achievement.unlocked" class="achievement-card__badge">
              <q-icon name="check_circle" size="24px" color="positive" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import { useUserProfileStore } from '@/stores/userProfile'

const userProfileStore = useUserProfileStore()

// TODO: Cargar desde backend cuando esté disponible
const achievements = ref([])

const unlockedCount = computed(() => achievements.value.filter((a) => a.unlocked).length)
</script>

<style scoped>
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

.stat-card__value {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.stat-card__label {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

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

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.achievement-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  opacity: 0.6;
  transition: all 0.2s var(--ease-out);
}

.achievement-card--unlocked {
  opacity: 1;
  border-color: rgba(255, 143, 56, 0.3);
  background: linear-gradient(145deg, var(--surface-secondary) 0%, rgba(255, 143, 56, 0.05) 100%);
}

.achievement-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background-color: var(--surface-tertiary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.achievement-card--unlocked .achievement-card__icon {
  background-color: rgba(255, 143, 56, 0.15);
  color: var(--color-primary);
}

.achievement-card__content {
  flex: 1;
  min-width: 0;
}

.achievement-card__title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

.achievement-card__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-3) 0;
}

.achievement-card__progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.achievement-card__progress-bar {
  flex: 1;
  height: 6px;
  background-color: var(--surface-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.achievement-card__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-full);
  transition: width 0.5s var(--ease-out);
}

.achievement-card__progress-text {
  font-size: var(--font-xs);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  min-width: 36px;
  text-align: right;
}

.achievement-card__badge {
  flex-shrink: 0;
}
</style>
