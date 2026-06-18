<template>
  <div class="mobile-view">
    <MobilePageHeader title="Nivel" show-back />

    <div v-if="isLoading" class="mobile-container">
      <div class="loading-state">
        <q-spinner color="primary" size="40px" />
        <p class="mobile-body">Cargando nivel...</p>
      </div>
    </div>

    <div v-else-if="error" class="mobile-container">
      <MobileCard variant="outlined">
        <template #default>
          <p class="mobile-body">{{ error }}</p>
        </template>
        <template #action>
          <button class="btn-mobile btn-mobile--primary" @click="fetchLevelDetail">
            Reintentar
          </button>
        </template>
      </MobileCard>
    </div>

    <div v-else class="mobile-container">
      <section class="mobile-section level-header">
        <div class="level-header__badge">Nivel {{ level.levelNumber }}</div>
        <h1 class="mobile-h2">{{ level.name }}</h1>
        <p v-if="level.objective" class="mobile-body level-header__objective">
          {{ level.objective }}
        </p>
        <div class="level-header__progress">
          <ProgressRing
            :value="levelProgressPercentage"
            :max="100"
            :size="64"
            :stroke-width="6"
            fill-color="#ff8f38"
            track-color="rgba(0, 0, 0, 0.08)"
          />
          <span class="level-header__progress-text">{{ levelProgressPercentage }}%</span>
        </div>
      </section>

      <section class="mobile-section">
        <h3 class="mobile-h4" style="margin-bottom: var(--space-4)">Fases</h3>
        <div class="phases-timeline">
          <div
            v-for="(phase, index) in phases"
            :key="phase.weekNumber"
            class="phase-item"
            :class="`phase-item--${phase.status}`"
          >
            <div class="phase-item__marker">
              <q-icon
                :name="getPhaseIcon(phase.status)"
                :color="getPhaseColor(phase.status)"
                size="20px"
              />
            </div>
            <div class="phase-item__content">
              <p class="phase-item__name">{{ phase.name || `Fase ${index + 1}` }}</p>
              <p v-if="phase.focus" class="phase-item__focus">{{ phase.focus }}</p>
              <p v-if="phase.note" class="phase-item__note">{{ phase.note }}</p>
            </div>
          </div>

          <div class="phase-item" :class="`phase-item--${testStatus}`">
            <div class="phase-item__marker">
              <q-icon
                :name="getPhaseIcon(testStatus)"
                :color="getPhaseColor(testStatus)"
                size="20px"
              />
            </div>
            <div class="phase-item__content">
              <p class="phase-item__name">Test de nivel</p>
              <p class="phase-item__focus">
                {{
                  testAvailable
                    ? 'Disponible para evaluar tu progreso'
                    : 'Completa las 4 fases para desbloquear'
                }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="activePhase" class="mobile-section">
        <h3 class="mobile-h4" style="margin-bottom: var(--space-4)">
          Sesiones: {{ activePhase.name || `Fase ${activePhase.weekNumber + 1}` }}
        </h3>
        <div class="sessions-list">
          <div
            v-for="(session, sessionIndex) in activePhase.sessions"
            :key="session.id"
            class="session-card"
            :class="`session-card--${session.status}`"
            @click="openSession(session)"
          >
            <div class="session-card__number">{{ sessionIndex + 1 }}</div>
            <div class="session-card__info">
              <p class="session-card__name">{{ session.name || 'Sesión sin nombre' }}</p>
              <p class="session-card__meta">
                <span v-if="session.estimatedDurationMin && session.estimatedDurationMax">
                  {{ Math.round(session.estimatedDurationMin / 60) }}-{{
                    Math.round(session.estimatedDurationMax / 60)
                  }}
                  min
                </span>
                <span v-else-if="session.estimatedDurationMin">
                  {{ Math.round(session.estimatedDurationMin / 60) }} min
                </span>
                <span v-if="session.sessionType">· {{ session.sessionType }}</span>
              </p>
            </div>
            <div class="session-card__status">
              <q-icon
                :name="
                  session.status === 'completed'
                    ? 'check_circle'
                    : session.status === 'active'
                      ? 'play_circle'
                      : 'lock'
                "
                :color="
                  session.status === 'completed'
                    ? 'positive'
                    : session.status === 'active'
                      ? 'primary'
                      : 'muted'
                "
                size="24px"
              />
            </div>
          </div>
        </div>
      </section>

      <section v-if="testAvailable" class="mobile-section">
        <MobileCard variant="primary">
          <template #default>
            <h3 class="mobile-card__title">Test de nivel</h3>
            <p class="mobile-card__text">
              Has completado las 4 fases. Evalúa si estás listo para subir de nivel.
            </p>
          </template>
          <template #action>
            <button class="btn-mobile btn-mobile--dark" @click="goToTest">Hacer test</button>
          </template>
        </MobileCard>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import MobileCard from '@/components/mobile/MobileCard.vue'
import ProgressRing from '@/components/mobile/ProgressRing.vue'
import { levelProgressService } from '@/services/levelProgress'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const programId = computed(() => Number(route.params.programId))
const levelId = computed(() => Number(route.params.levelId))

const isLoading = ref(true)
const error = ref('')
const level = ref({})
const phases = ref([])
const progress = ref(null)
const test = ref({ available: false, requirements: [], latestResult: null })

const levelProgressPercentage = computed(() => {
  if (!progress.value) return 0
  const currentWeek = progress.value.currentWeek ?? 0
  return Math.min(100, Math.round((currentWeek / 4) * 100))
})

const activePhase = computed(() => {
  return phases.value.find((phase) => phase.status === 'active') || null
})

const testAvailable = computed(() => test.value?.available ?? false)

const testStatus = computed(() => {
  if (test.value?.latestResult?.overallPassed) return 'completed'
  if (testAvailable.value) return 'active'
  return 'locked'
})

const getPhaseIcon = (status) => {
  if (status === 'completed') return 'check_circle'
  if (status === 'active') return 'radio_button_checked'
  return 'lock'
}

const getPhaseColor = (status) => {
  if (status === 'completed') return 'positive'
  if (status === 'active') return 'primary'
  return 'muted'
}

const fetchLevelDetail = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const data = await levelProgressService.getLevelDetail(programId.value, levelId.value)
    level.value = data.level || {}
    phases.value = data.phases || []
    progress.value = data.progress || null
    test.value = data.test || { available: false, requirements: [], latestResult: null }
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al cargar el nivel'
    console.error('Error cargando nivel:', err)
  } finally {
    isLoading.value = false
  }
}

const openSession = (session) => {
  if (session.status === 'locked') {
    $q.notify({
      type: 'warning',
      message: 'Completa las sesiones anteriores para desbloquear esta.',
      position: 'top',
    })
    return
  }

  router.push({
    name: 'user-train',
    params: { sessionId: session.id },
  })
}

const goToTest = () => {
  router.push({
    name: 'user-assessment',
    query: { programId: programId.value, levelId: levelId.value },
  })
}

onMounted(() => {
  fetchLevelDetail()
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-10) 0;
}

.level-header {
  text-align: center;
}

.level-header__badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background-color: rgba(255, 143, 56, 0.12);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-3);
}

.level-header__objective {
  color: var(--text-secondary);
  margin-top: var(--space-2);
}

.level-header__progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--space-4);
}

.level-header__progress-text {
  position: absolute;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.phases-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: relative;
}

.phase-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: all 0.2s var(--ease-out);
}

.phase-item--active {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.phase-item--completed {
  opacity: 0.85;
}

.phase-item--locked {
  opacity: 0.6;
}

.phase-item__marker {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--surface-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.phase-item--active .phase-item__marker {
  background-color: var(--color-primary);
  color: #000;
}

.phase-item__content {
  flex: 1;
  min-width: 0;
}

.phase-item__name {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 2px 0;
}

.phase-item__focus {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 2px 0;
}

.phase-item__note {
  font-size: var(--font-xs);
  color: var(--text-muted);
  margin: 0;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.session-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.session-card--active {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.session-card--locked {
  cursor: not-allowed;
  opacity: 0.6;
}

.session-card__number {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--surface-tertiary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-sm);
  flex-shrink: 0;
}

.session-card--active .session-card__number {
  background-color: var(--color-primary);
  color: #000;
}

.session-card__info {
  flex: 1;
  min-width: 0;
}

.session-card__name {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 2px 0;
}

.session-card__meta {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
}

.session-card__status {
  flex-shrink: 0;
}
</style>
