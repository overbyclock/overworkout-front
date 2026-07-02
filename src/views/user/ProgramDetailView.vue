<template>
  <div class="mobile-view program-detail-view">
    <MobilePageHeader title="Programa" show-back :back-to="{ name: 'user-explore' }" />

    <div v-if="isLoading" class="mobile-container">
      <div class="loading-state">
        <q-spinner color="primary" size="40px" />
        <p class="mobile-body">Cargando programa...</p>
      </div>
    </div>

    <div v-else-if="error" class="mobile-container">
      <MobileCard variant="outlined">
        <template #default>
          <p class="mobile-body">{{ error }}</p>
        </template>
        <template #action>
          <button class="btn-mobile btn-mobile--primary" @click="loadData">Reintentar</button>
        </template>
      </MobileCard>
    </div>

    <div v-else class="mobile-container">
      <section class="program-detail-view__hero" :style="heroStyle">
        <div class="program-detail-view__overlay" />
        <div class="program-detail-view__hero-content">
          <span class="program-detail-view__badge">Programa</span>
          <h1 class="program-detail-view__name">{{ program.name }}</h1>
          <p v-if="program.description" class="program-detail-view__description">
            {{ program.description }}
          </p>
          <div class="program-detail-view__meta">
            <span v-if="levels.length > 0" class="program-detail-view__meta-item">
              <q-icon name="layers" size="16px" />
              {{ levels.length }} niveles
            </span>
            <span v-if="totalPhases > 0" class="program-detail-view__meta-item">
              <q-icon name="view_week" size="16px" />
              {{ totalPhases }} fases
            </span>
            <span v-if="totalSessions > 0" class="program-detail-view__meta-item">
              <q-icon name="fitness_center" size="16px" />
              {{ totalSessions }} sesiones
            </span>
          </div>
        </div>
      </section>

      <section class="mobile-section">
        <h2 class="mobile-h4" style="margin-bottom: var(--space-4)">Niveles</h2>

        <div v-if="levels.length === 0" class="program-detail-view__empty">
          <p class="mobile-body-sm">Este programa aún no tiene niveles publicados.</p>
        </div>

        <div v-else class="levels-list">
          <MobileCard v-for="level in levels" :key="level.id" variant="elevated" class="level-card">
            <template #default>
              <div class="level-card__header">
                <span class="level-card__number">{{ level.levelNumber }}</span>
                <div class="level-card__info">
                  <h3 class="level-card__name">{{ level.name }}</h3>
                  <p v-if="level.objective" class="level-card__objective">
                    {{ level.objective }}
                  </p>
                </div>
              </div>

              <div v-if="level.phases.length > 0" class="level-card__phases">
                <div v-for="phase in level.phases" :key="phase.weekNumber" class="phase-section">
                  <p class="phase-section__title">
                    {{ phase.name || `Fase ${phase.weekNumber + 1}` }}
                  </p>
                  <div class="sessions-list">
                    <button
                      v-for="session in phase.sessions"
                      :key="session.id"
                      type="button"
                      class="session-button"
                      @click="startSession(session)"
                    >
                      <span class="session-button__number">
                        {{ session.sessionIndex }}
                      </span>
                      <span class="session-button__info">
                        <span class="session-button__name">
                          {{ session.name || 'Sesión sin nombre' }}
                        </span>
                        <span class="session-button__meta">
                          <span v-if="session.duration">
                            {{ session.duration }}
                          </span>
                          <span v-if="session.sessionType"> · {{ session.sessionType }} </span>
                        </span>
                      </span>
                      <q-icon name="play_arrow" size="20px" />
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="level-card__empty">
                <p class="mobile-body-sm">Sin sesiones publicadas</p>
              </div>
            </template>
          </MobileCard>
        </div>
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
import { useProgramsStore } from '@/stores/programs'
import { programService } from '@/services/programs'
import { levelProgressService } from '@/services/levelProgress'
import { trainingService } from '@/services/trainings'
import { getDisciplineGradient } from '@/constants/disciplines'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const programsStore = useProgramsStore()

const programId = computed(() => Number(route.params.programId))

const program = ref({})
const levelsData = ref([])
const isLoading = ref(true)
const error = ref('')

const heroStyle = computed(() => {
  const gradient = getDisciplineGradient(program.value.discipline)
  if (program.value.imageUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), url(${program.value.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { backgroundImage: gradient }
})

const normalizeSession = (session, index) => {
  const duration =
    session.estimatedDurationMin && session.estimatedDurationMax
      ? `${Math.round(session.estimatedDurationMin / 60)}-${Math.round(session.estimatedDurationMax / 60)} min`
      : session.estimatedDurationMin
        ? `${Math.round(session.estimatedDurationMin / 60)} min`
        : ''

  return {
    ...session,
    sessionIndex: index + 1,
    duration,
  }
}

const levels = computed(() => {
  return levelsData.value.map((level) => {
    const sessions = Array.isArray(level.trainings) ? level.trainings : []
    const grouped = {}

    sessions.forEach((session, index) => {
      const weekNumber = session.weekNumber ?? 0
      if (!grouped[weekNumber]) {
        grouped[weekNumber] = []
      }
      grouped[weekNumber].push(normalizeSession(session, index))
    })

    const phases = Object.entries(grouped)
      .map(([weekNumber, phaseSessions]) => ({
        weekNumber: Number(weekNumber),
        name: `Fase ${Number(weekNumber) + 1}`,
        sessions: phaseSessions,
      }))
      .sort((a, b) => a.weekNumber - b.weekNumber)

    return {
      ...level,
      phases,
    }
  })
})

const totalSessions = computed(() => {
  return levels.value.reduce(
    (sum, level) => sum + level.phases.reduce((p, phase) => p + phase.sessions.length, 0),
    0,
  )
})

const totalPhases = computed(() => {
  return levels.value.reduce((sum, level) => sum + level.phases.length, 0)
})

const fetchProgram = async () => {
  const id = programId.value
  const fromStore = programsStore.getProgramById(id)

  if (fromStore) {
    program.value = fromStore
    return
  }

  try {
    program.value = await programService.getById(id)
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al cargar el programa'
    throw err
  }
}

const fetchLevels = async () => {
  try {
    levelsData.value = await levelProgressService.getProgramLevels(programId.value)
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al cargar los niveles del programa'
    throw err
  }
}

const loadData = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await Promise.all([fetchProgram(), fetchLevels()])
  } catch {
    // El error ya se asigna en cada fetch.
  } finally {
    isLoading.value = false
  }
}

const startSession = async (session) => {
  try {
    await trainingService.start(session.id)
    router.push({
      name: 'user-train',
      params: { sessionId: session.id },
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'No se pudo iniciar la sesión. Inténtalo de nuevo.',
      position: 'top',
    })
  }
}

onMounted(loadData)
</script>

<style scoped>
.program-detail-view {
  background-color: var(--surface-primary);
}

.program-detail-view__hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 280px;
  margin: var(--space-5);
  border-radius: var(--radius-xl);
  overflow: hidden;
  color: #fff;
}

.program-detail-view__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.7) 100%);
}

.program-detail-view__hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
}

.program-detail-view__badge {
  display: inline-flex;
  width: fit-content;
  padding: var(--space-1) var(--space-3);
  background-color: var(--color-primary);
  color: var(--surface-primary, #000);
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.program-detail-view__name {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  margin: 0;
  line-height: var(--leading-tight);
}

.program-detail-view__description {
  font-size: var(--font-base);
  line-height: var(--leading-normal);
  margin: 0;
  opacity: 0.9;
}

.program-detail-view__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.program-detail-view__meta-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  opacity: 0.9;
}

.program-detail-view__empty {
  padding: var(--space-8) 0;
  text-align: center;
  color: var(--text-secondary);
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.level-card :deep(.mobile-card__content) {
  width: 100%;
}

.level-card__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.level-card__number {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--surface-primary, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-base);
  flex-shrink: 0;
}

.level-card__info {
  flex: 1;
  min-width: 0;
}

.level-card__name {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.level-card__objective {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: var(--space-1) 0 0 0;
}

.level-card__phases {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.level-card__empty {
  padding: var(--space-4) 0;
  text-align: center;
  color: var(--text-secondary);
}

.phase-section__title {
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0 0 var(--space-3) 0;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.session-button {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background-color: var(--surface-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.session-button:hover {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.session-button__number {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--surface-secondary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-xs);
  flex-shrink: 0;
}

.session-button__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-button__name {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.session-button__meta {
  font-size: var(--font-xs);
  color: var(--text-secondary);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-10) 0;
}
</style>
