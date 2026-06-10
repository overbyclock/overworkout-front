<template>
  <div class="mobile-view">
    <MobilePageHeader title="Mi Programa" show-back />

    <div class="mobile-container">
      <section class="mobile-section">
        <MobileCard v-if="userProfileStore.hasActiveProgram" variant="elevated">
          <template #default>
            <p class="mobile-caption">Programa activo</p>
            <h2 class="mobile-h3" style="margin: var(--space-1) 0">
              {{ userProfileStore.currentProgram?.name || 'Programa personalizado' }}
            </h2>
            <p class="mobile-body-sm">
              {{
                userProfileStore.currentProgram?.description || 'Sigue tu progreso nivel a nivel.'
              }}
            </p>
          </template>
        </MobileCard>

        <MobileCard v-else variant="outlined">
          <template #default>
            <h3 class="mobile-card__title">No tienes un programa activo</h3>
            <p class="mobile-card__text">
              Elige un programa de nuestro catálogo o completa tu evaluación inicial.
            </p>
          </template>
          <template #action>
            <button
              class="btn-mobile btn-mobile--primary"
              @click="$router.push({ name: 'user-welcome' })"
            >
              Encontrar programa
            </button>
          </template>
        </MobileCard>
      </section>

      <section class="mobile-section">
        <h3 class="mobile-h4" style="margin-bottom: var(--space-4)">Niveles</h3>
        <div class="levels-list">
          <div
            v-for="level in levels"
            :key="level.id"
            class="level-item"
            :class="{
              'level-item--active': level.isActive,
              'level-item--completed': level.isCompleted,
              'level-item--locked': level.isLocked,
            }"
          >
            <div class="level-item__number">{{ level.number }}</div>
            <div class="level-item__info">
              <p class="level-item__name">{{ level.name }}</p>
              <p class="level-item__status">{{ level.statusText }}</p>
            </div>
            <div class="level-item__icon">
              <q-icon
                :name="
                  level.isLocked
                    ? 'lock'
                    : level.isCompleted
                      ? 'check_circle'
                      : 'radio_button_checked'
                "
                :color="level.isLocked ? 'muted' : level.isCompleted ? 'positive' : 'primary'"
                size="24px"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import MobileCard from '@/components/mobile/MobileCard.vue'
import { useUserProfileStore } from '@/stores/userProfile'

const userProfileStore = useUserProfileStore()

const levels = computed(() => {
  // Mock hasta conectar con niveles reales del programa
  if (!userProfileStore.hasActiveProgram) return []

  return Array.from({ length: 6 }, (_, i) => {
    const levelNum = i + 1
    const currentLevelNumber = userProfileStore.currentLevel?.number || 1
    const isCompleted = levelNum < currentLevelNumber
    const isActive = levelNum === currentLevelNumber
    const isLocked = levelNum > currentLevelNumber

    return {
      id: levelNum,
      number: levelNum,
      name: `Nivel ${levelNum}`,
      isActive,
      isCompleted,
      isLocked,
      statusText: isCompleted ? 'Completado' : isActive ? 'En progreso' : 'Bloqueado',
    }
  })
})

onMounted(async () => {
  await userProfileStore.fetchActiveProgress()
})
</script>

<style scoped>
.levels-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.level-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all 0.2s var(--ease-out);
}

.level-item--active {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.level-item--completed {
  opacity: 0.8;
}

.level-item--locked {
  opacity: 0.5;
}

.level-item__number {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--surface-tertiary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-base);
  flex-shrink: 0;
}

.level-item--active .level-item__number {
  background-color: var(--color-primary);
  color: #000;
}

.level-item--completed .level-item__number {
  background-color: var(--color-success);
  color: #fff;
}

.level-item__info {
  flex: 1;
}

.level-item__name {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 2px 0;
}

.level-item__status {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
}

.level-item__icon {
  flex-shrink: 0;
}
</style>
