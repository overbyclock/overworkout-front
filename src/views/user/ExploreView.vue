<template>
  <div class="mobile-view explore-view">
    <header class="explore-view__header">
      <h1 class="explore-view__title">Explorar</h1>
      <p class="explore-view__subtitle">Programas y entrenamientos</p>
    </header>

    <div class="mobile-container">
      <q-tabs
        v-model="activeSection"
        class="explore-tabs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab :name="SECTIONS.PROGRAMS" label="Programas" />
        <q-tab :name="SECTIONS.BENCHMARKS" label="Benchmarks" />
      </q-tabs>

      <div v-if="showOnboardingBanner" class="explore-banner" data-testid="onboarding-banner">
        <div class="explore-banner__content">
          <q-icon name="help_outline" size="24px" aria-hidden="true" />
          <div class="explore-banner__text-block">
            <p class="explore-banner__title">¿No sabes por dónde empezar?</p>
            <p class="explore-banner__text">Haz un cuestionario rápido</p>
          </div>
        </div>
        <button
          type="button"
          class="btn-mobile btn-mobile--primary explore-banner__cta"
          @click="goToOnboarding"
        >
          Empezar
        </button>
      </div>

      <section v-if="loading" class="explore-state" data-testid="explore-loading">
        <q-spinner color="primary" size="40px" />
        <p class="mobile-body-sm">Cargando contenido...</p>
      </section>

      <section v-else-if="hasError" class="explore-state" data-testid="explore-error">
        <q-icon name="error_outline" size="48px" color="negative" aria-hidden="true" />
        <p class="mobile-body-sm">{{ errorMessage }}</p>
        <button
          type="button"
          class="btn-mobile btn-mobile--primary"
          data-testid="error-retry-button"
          @click="loadData"
        >
          Reintentar
        </button>
      </section>

      <template v-else>
        <section v-if="activeSection === SECTIONS.PROGRAMS" class="explore-section">
          <HorizontalCarousel
            v-for="[discipline, items] in orderedProgramDisciplines"
            :key="discipline"
            :title="getDisciplineLabel(discipline)"
            :items="items"
            loop
          >
            <template #item="{ item }">
              <PosterCard
                :item="item"
                type="program"
                :level="getLevelLabel(item.difficulty)"
                :levels="item.levelCount ? `${item.levelCount} niveles` : ''"
                :duration="item.totalPhases ? `${item.totalPhases} fases` : ''"
                :extra="item.totalSessions ? `${item.totalSessions} sesiones` : ''"
                show-favorite
                :is-favorite="favoritesStore.isProgramFavorite(item.id)"
                @click="handleProgramClick(item)"
                @toggle-favorite="favoritesStore.toggleProgramFavorite(item)"
              />
            </template>
          </HorizontalCarousel>

          <div v-if="programsStore.isEmpty" class="explore-state">
            <q-icon name="school" size="48px" color="muted" aria-hidden="true" />
            <p class="mobile-body-sm">No hay programas disponibles</p>
          </div>
        </section>

        <section v-if="activeSection === SECTIONS.BENCHMARKS" class="explore-section">
          <HorizontalCarousel
            v-for="[type, items] in orderedBenchmarkTypes"
            :key="type"
            :title="getBenchmarkTypeLabel(type)"
            :items="items"
            loop
          >
            <template #item="{ item }">
              <PosterCard
                :item="item"
                type="benchmark"
                :level="getBenchmarkFormatLabel(item.format)"
                :duration="item.rounds ? `${item.rounds} rounds` : ''"
                :extra="item.timeCapSeconds ? `${formatDuration(item.timeCapSeconds)}` : ''"
                @click="handleBenchmarkClick(item)"
              />
            </template>
          </HorizontalCarousel>

          <div v-if="benchmarksStore.isEmpty" class="explore-state">
            <q-icon name="timer" size="48px" color="muted" aria-hidden="true" />
            <p class="mobile-body-sm">No hay benchmarks disponibles</p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import HorizontalCarousel from '@/components/mobile/HorizontalCarousel.vue'
import PosterCard from '@/components/mobile/PosterCard.vue'
import { useProgramsStore } from '@/stores/programs'
import { useBenchmarksStore } from '@/stores/benchmarks'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { DISCIPLINE_LABELS, getDisciplineLabel } from '@/constants/disciplines'
import { getLevelLabel } from '@/constants/levels'
import { EXPLORE_ROUTES } from '@/constants/explore'

const router = useRouter()
const $q = useQuasar()

const programsStore = useProgramsStore()
const benchmarksStore = useBenchmarksStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const SECTIONS = {
  PROGRAMS: 'programs',
  BENCHMARKS: 'benchmarks',
}

const activeSection = ref(SECTIONS.PROGRAMS)
const loading = ref(false)

const BENCHMARK_TYPE_LABELS = {
  hero: 'Hero WODs',
  girl: 'Girl WODs',
  benchmark: 'Benchmarks',
}

const BENCHMARK_FORMAT_LABELS = {
  for_time: 'For time',
  amrap: 'AMRAP',
  emom: 'EMOM',
  tabata: 'Tabata',
  chipper: 'Chipper',
  ladder: 'Ladder',
  interval_stations: 'Interval',
}

const showOnboardingBanner = computed(() => {
  const user = authStore.user
  return !user?.trainingGoal || !user?.estimatedLevel
})

const groupItemsByDiscipline = (items) => {
  const grouped = {}

  items.forEach((item) => {
    const discipline = item.discipline || 'general'
    if (!grouped[discipline]) {
      grouped[discipline] = []
    }
    grouped[discipline].push(item)
  })

  const orderedKeys = Object.keys(DISCIPLINE_LABELS).filter((key) => grouped[key])

  return orderedKeys.map((key) => [key, grouped[key]])
}

const orderedProgramDisciplines = computed(() => {
  return groupItemsByDiscipline(programsStore.programs)
})

const orderedBenchmarkTypes = computed(() => {
  const grouped = benchmarksStore.benchmarksByType
  const orderedKeys = Object.keys(BENCHMARK_TYPE_LABELS).filter((key) => grouped[key])
  const remainingKeys = Object.keys(grouped).filter((key) => !BENCHMARK_TYPE_LABELS[key])
  return [...orderedKeys, ...remainingKeys].map((key) => [key, grouped[key]])
})

const hasError = computed(() => programsStore.error || benchmarksStore.error)

const errorMessage = computed(
  () => programsStore.error || benchmarksStore.error || 'Error al cargar el contenido',
)

const getBenchmarkTypeLabel = (type) => {
  return (
    BENCHMARK_TYPE_LABELS[type] ||
    (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Benchmarks')
  )
}

const getBenchmarkFormatLabel = (format) => {
  return BENCHMARK_FORMAT_LABELS[format] || format || ''
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  return minutes > 0 ? `${minutes} min` : `${seconds} s`
}

const loadData = async () => {
  loading.value = true

  try {
    await Promise.all([
      programsStore.fetchPrograms(),
      benchmarksStore.fetchBenchmarks(),
      favoritesStore.loadFavorites(),
    ])
  } catch {
    // Los stores gestionan su propio estado de error; no bloqueamos la UI.
  } finally {
    loading.value = false
  }
}

const goToOnboarding = () => {
  router.push({ name: EXPLORE_ROUTES.WELCOME })
}

const handleProgramClick = (program) => {
  router.push({
    name: 'user-program-detail',
    params: { programId: program.id },
  })
}

const handleBenchmarkClick = () => {
  $q.notify({
    message: 'La vista detallada de benchmarks estará disponible pronto',
    color: 'info',
  })
}

onMounted(loadData)
</script>

<style scoped>
.explore-view {
  background-color: var(--surface-primary);
}

.explore-view__header {
  padding: var(--space-6) var(--space-5) var(--space-4);
  text-align: center;
}

.explore-view__title {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
  line-height: var(--leading-tight);
}

.explore-view__subtitle {
  font-size: var(--font-base);
  color: var(--text-secondary);
  margin: 0;
}

.explore-tabs {
  background-color: transparent;
  margin-bottom: var(--space-6);
}

.explore-tabs :deep(.q-tab__label) {
  font-weight: var(--font-semibold);
  text-transform: none;
}

.explore-section {
  margin-bottom: var(--space-10);
}

.explore-section:first-of-type {
  padding-top: var(--space-2);
}

/* En pantallas grandes el explorar puede aprovechar más ancho
   para mostrar más tarjetas por carrusel. */
@media (min-width: 768px) {
  .explore-view .mobile-container {
    max-width: 1200px;
  }
}

.explore-banner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin: var(--space-4) var(--space-5) var(--space-6);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border-radius: var(--radius-xl);
}

.explore-banner__content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-primary);
}

.explore-banner__text-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.explore-banner__title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.explore-banner__text {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
}

.explore-banner__cta {
  width: 100%;
  min-height: var(--space-12);
}

.explore-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-12) var(--space-4);
  color: var(--text-secondary);
  text-align: center;
}
</style>
