<template>
  <div class="mobile-view">
    <MobilePageHeader title="Mi Programa" show-back />

    <div class="mobile-container">
      <section class="mobile-section">
        <div v-if="userProfileStore.hasActiveProgram" class="program-card-wrapper">
          <ProgressRing
            :value="userProfileStore.currentProgram?.progress?.percentage || 0"
            :max="100"
            :size="48"
            :stroke-width="6"
            fill-color="#ff8f38"
            track-color="rgba(0, 0, 0, 0.08)"
            class="program-card-wrapper__progress"
          />
          <MobileCard variant="elevated">
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
              <button
                class="btn-mobile btn-mobile--ghost abandon-btn"
                style="
                  width: fit-content;
                  padding: var(--space-2) var(--space-4);
                  min-height: 40px;
                  margin-top: var(--space-3);
                "
                @click="confirmAbandon"
              >
                Abandonar programa
              </button>
            </template>
          </MobileCard>
        </div>

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

        <div v-if="isLoadingLevels" class="loading-state">
          <q-spinner color="primary" size="32px" />
          <p class="mobile-body-sm">Cargando niveles...</p>
        </div>

        <div v-else class="levels-list">
          <div
            v-for="level in levels"
            :key="level.id"
            class="level-item"
            :class="{
              'level-item--active': level.isActive,
              'level-item--completed': level.isCompleted,
              'level-item--locked': level.isLocked,
            }"
            @click="openLevel(level)"
          >
            <div class="level-item__number">{{ level.levelNumber }}</div>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import MobileCard from '@/components/mobile/MobileCard.vue'
import ProgressRing from '@/components/mobile/ProgressRing.vue'
import { useUserProfileStore } from '@/stores/userProfile'
import { levelProgressService } from '@/services/levelProgress'

const router = useRouter()
const $q = useQuasar()
const userProfileStore = useUserProfileStore()

const levelsData = ref([])
const isLoadingLevels = ref(false)

const confirmAbandon = () => {
  const programId = userProfileStore.currentProgram?.id
  if (!programId) return

  $q.dialog({
    title: 'Abandonar programa',
    message: '¿Estás seguro? Perderás el progreso actual de este programa.',
    cancel: {
      label: 'Cancelar',
      flat: true,
    },
    ok: {
      label: 'Abandonar',
      color: 'negative',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await userProfileStore.abandonActiveProgram(programId)
      if (!userProfileStore.hasActiveProgram) {
        router.push({ name: 'user-explore' })
      }
    } catch (err) {
      console.error('Error abandonando programa:', err)
    }
  })
}

const levels = computed(() => {
  if (!levelsData.value.length) return []

  const currentLevelNumber = userProfileStore.currentLevel?.levelNumber || 1

  return levelsData.value.map((level) => {
    const levelNumber = level.levelNumber
    const isCompleted = levelNumber < currentLevelNumber
    const isActive = levelNumber === currentLevelNumber
    const isLocked = levelNumber > currentLevelNumber
    const status =
      level.progress?.status || (isLocked ? 'locked' : isCompleted ? 'completed' : 'in_progress')

    return {
      ...level,
      isCompleted,
      isActive,
      isLocked,
      statusText:
        status === 'completed'
          ? 'Completado'
          : status === 'in_progress' || status === 'repeat'
            ? 'En progreso'
            : 'Bloqueado',
    }
  })
})

const fetchProgramLevels = async () => {
  const programId = userProfileStore.currentProgram?.id
  if (!programId) return

  isLoadingLevels.value = true
  try {
    levelsData.value = await levelProgressService.getProgramLevels(programId)
  } catch (err) {
    console.error('Error cargando niveles:', err)
    levelsData.value = []
  } finally {
    isLoadingLevels.value = false
  }
}

const openLevel = (level) => {
  if (level.isLocked) {
    $q.notify({
      type: 'warning',
      message: 'Completa el nivel anterior para desbloquear este.',
      position: 'top',
    })
    return
  }

  router.push({
    name: 'user-level',
    params: {
      programId: userProfileStore.currentProgram?.id,
      levelId: level.id,
    },
  })
}

onMounted(async () => {
  await userProfileStore.fetchActiveProgress()
  await fetchProgramLevels()
})
</script>

<style scoped>
.levels-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8) 0;
}

.level-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
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

.program-card-wrapper {
  position: relative;
}

.program-card-wrapper__progress {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 1;
}

.abandon-btn {
  color: var(--color-danger, #ef4444);
  border-color: rgba(239, 68, 68, 0.3);
}

.abandon-btn:hover {
  background-color: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.5);
}
</style>
