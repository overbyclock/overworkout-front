<template>
  <div class="mobile-view">
    <MobilePageHeader title="Mis programas" :centered="true" />

    <div class="mobile-container">
      <!-- Estado de carga -->
      <section
        v-if="userProfileStore.loading"
        class="mobile-section loading-state"
        data-testid="programs-loading"
      >
        <q-spinner color="primary" size="40px" />
        <p class="mobile-body-sm">Cargando tus programas...</p>
      </section>

      <template v-else>
        <!-- Lista de programas activos -->
        <section v-if="activePrograms.length > 0" class="mobile-section">
          <div class="programs-list" role="list">
            <button
              v-for="program in activePrograms"
              :key="program.id"
              class="program-card"
              data-testid="program-card"
              @click="handleProgramClick(program)"
            >
              <div class="program-card__icon">
                <q-icon :name="getDisciplineIcon(program.discipline)" size="28px" />
              </div>

              <div class="program-card__content">
                <h3 class="program-card__name">{{ program.name }}</h3>
                <p class="program-card__meta">
                  <span>{{ getLevelLabel(program.difficulty) }}</span>
                  <span class="program-card__meta-separator">•</span>
                  <span>{{ program.totalLevels }} niveles</span>
                </p>

                <q-linear-progress
                  :value="(program.progress?.percentage || 0) / 100"
                  color="primary"
                  track-color="surface-tertiary"
                  size="6px"
                  rounded
                  class="program-card__progress"
                  data-testid="program-progress"
                />

                <span class="program-card__percentage"
                  >{{ program.progress?.percentage || 0 }}%</span
                >
              </div>

              <q-icon name="chevron_right" size="24px" color="muted" />
            </button>
          </div>
        </section>

        <!-- Estado vacío -->
        <section v-else class="mobile-section empty-state" data-testid="empty-state">
          <q-icon name="fitness_center" size="48px" color="muted" />
          <p class="mobile-body">Aún no tienes programas activos</p>
          <button
            class="btn-mobile btn-mobile--primary empty-state__cta"
            data-testid="empty-state-cta"
            @click="goToExplore"
          >
            Explorar programas
          </button>
        </section>

        <!-- CTA para explorar más programas -->
        <section v-if="activePrograms.length > 0" class="mobile-section">
          <button
            class="btn-mobile btn-mobile--secondary"
            data-testid="explore-cta"
            @click="goToExplore"
          >
            Explorar más programas
          </button>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import { useUserProfileStore } from '@/stores/userProfile'
import { getDisciplineIcon } from '@/constants/disciplines'
import { getLevelLabel } from '@/constants/levels'

const router = useRouter()
const userProfileStore = useUserProfileStore()

const activePrograms = computed(() => userProfileStore.activePrograms)

/**
 * Selecciona un programa activo y navega a su detalle.
 */
const handleProgramClick = (program) => {
  userProfileStore.selectProgram(program.id)
  router.push({ name: 'user-program' })
}

/**
 * Navega a la vista de exploración de programas.
 */
const goToExplore = () => {
  router.push({ name: 'user-explore' })
}

onMounted(() => {
  userProfileStore.fetchActiveProgress()
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-16) 0;
  text-align: center;
  color: var(--text-secondary);
}

.programs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.program-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-5);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  text-align: left;
}

.program-card:hover {
  border-color: var(--border-default);
  background-color: var(--surface-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.program-card:active {
  transform: translateY(0);
}

.program-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.program-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.program-card__name {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.program-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.program-card__meta-separator {
  color: var(--text-muted);
}

.program-card__progress {
  border-radius: var(--radius-full);
  overflow: hidden;
}

.program-card__progress :deep(.q-linear-progress__track) {
  background-color: var(--surface-tertiary);
}

.program-card__progress :deep(.q-linear-progress__model) {
  background-color: var(--color-primary);
}

.program-card__percentage {
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
  color: var(--text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16) 0;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state__cta {
  width: auto;
  min-width: 240px;
  padding: var(--space-3) var(--space-8);
}
</style>
