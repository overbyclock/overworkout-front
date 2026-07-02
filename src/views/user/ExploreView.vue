<template>
  <div class="mobile-view mobile-view--no-nav explore-view">
    <header class="explore-view__header">
      <h1 class="explore-view__title">Explorar</h1>
      <p class="explore-view__subtitle">Programas y entrenamientos</p>
    </header>

    <div class="mobile-container">
      <q-tabs
        v-model="activeTab"
        class="explore-tabs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab :name="EXPLORE_TABS.PROGRAMS" label="Programas" />
        <q-tab :name="EXPLORE_TABS.TRAININGS" label="Entrenamientos" />
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
        <div v-if="activeTab === EXPLORE_TABS.PROGRAMS" class="explore-tab-panel">
          <HorizontalCarousel
            v-if="recommendedProgram"
            title="Recomendado para ti"
            :items="[recommendedProgram]"
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

          <HorizontalCarousel
            v-for="[discipline, items] in orderedProgramDisciplines"
            :key="discipline"
            :title="getDisciplineLabel(discipline)"
            :items="items"
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
        </div>

        <div v-if="activeTab === EXPLORE_TABS.TRAININGS" class="explore-tab-panel">
          <HorizontalCarousel
            v-for="[discipline, items] in orderedTrainingDisciplines"
            :key="discipline"
            :title="getDisciplineLabel(discipline)"
            :items="items"
          >
            <template #item="{ item }">
              <PosterCard
                :item="item"
                type="training"
                :level="item.sessionType || item.target || ''"
                :duration="item.rounds ? `${item.rounds} rounds` : ''"
                :extra="''"
                show-favorite
                :is-favorite="favoritesStore.isTrainingFavorite(item.id)"
                @click="handleTrainingClick(item)"
                @toggle-favorite="favoritesStore.toggleTrainingFavorite(item)"
              />
            </template>
          </HorizontalCarousel>

          <div v-if="trainingsStore.isEmpty" class="explore-state">
            <q-icon name="fitness_center" size="48px" color="muted" aria-hidden="true" />
            <p class="mobile-body-sm">No hay entrenamientos disponibles</p>
          </div>
        </div>
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
import { useTrainingsStore } from '@/stores/trainings'
import { useFavoritesStore } from '@/stores/favorites'
import { useUserProfileStore } from '@/stores/userProfile'
import { useAuthStore } from '@/stores/auth'
import { DISCIPLINE_LABELS, getDisciplineLabel } from '@/constants/disciplines'
import { getLevelLabel } from '@/constants/levels'
import { EXPLORE_ROUTES, EXPLORE_TABS } from '@/constants/explore'

const router = useRouter()
const $q = useQuasar()

const programsStore = useProgramsStore()
const trainingsStore = useTrainingsStore()
const favoritesStore = useFavoritesStore()
const userProfileStore = useUserProfileStore()
const authStore = useAuthStore()

const activeTab = ref(EXPLORE_TABS.PROGRAMS)
const loading = ref(false)

/**
 * Indica si el usuario aún no ha completado el onboarding.
 * Se muestra el banner cuando falta el objetivo o el nivel estimado.
 */
const showOnboardingBanner = computed(() => {
  const user = authStore.user
  return !user?.trainingGoal || !user?.estimatedLevel
})

/**
 * Conjunto de ids de programas activos del usuario para decisiones de navegación.
 */
const activeProgramIds = computed(() => {
  return new Set(userProfileStore.activePrograms.map((program) => program.id))
})

const isActiveProgram = (program) => activeProgramIds.value.has(program.id)

/**
 * Programa destacado en la sección "Recomendado para ti".
 * Se usa el primer programa disponible como recomendación por defecto.
 */
const recommendedProgram = computed(() => {
  return programsStore.programs[0] || null
})

/**
 * Agrupa una lista de items por disciplina manteniendo un orden estable.
 * Se usa 'general' como clave por defecto para alinearlo con el getter
 * programsByDiscipline del store de programas.
 */
const groupItemsByDiscipline = (items) => {
  const grouped = {}

  items.forEach((item) => {
    const discipline = item.discipline || 'general'
    if (!grouped[discipline]) {
      grouped[discipline] = []
    }
    grouped[discipline].push(item)
  })

  // Orden de disciplinas según las constantes del proyecto
  const orderedKeys = Object.keys(DISCIPLINE_LABELS).filter((key) => grouped[key])

  return orderedKeys.map((key) => [key, grouped[key]])
}

const orderedProgramDisciplines = computed(() => {
  return groupItemsByDiscipline(programsStore.programs)
})

const orderedTrainingDisciplines = computed(() => {
  return groupItemsByDiscipline(trainingsStore.trainings)
})

const hasError = computed(() => programsStore.error || trainingsStore.error)

const errorMessage = computed(
  () => programsStore.error || trainingsStore.error || 'Error al cargar el contenido',
)

/**
 * Carga programas, entrenamientos, favoritos y progreso en paralelo.
 * Cada store gestiona su propio estado de error para no bloquear la UI.
 */
const loadData = async () => {
  loading.value = true

  try {
    await Promise.all([
      programsStore.fetchPrograms(),
      trainingsStore.fetchPublicTrainings(),
      favoritesStore.loadFavorites(),
      userProfileStore.fetchActiveProgress(),
    ])
  } catch {
    // Los stores gestionan su propio estado de error; no bloqueamos la UI.
  } finally {
    loading.value = false
  }
}

/**
 * Navega al flujo de onboarding para que el usuario complete su perfil.
 */
const goToOnboarding = () => {
  router.push({ name: EXPLORE_ROUTES.WELCOME })
}

/**
 * Maneja el click en una tarjeta de programa.
 * Si ya está activo, navega al detalle. Si no, lo activa y va al inicio.
 */
const handleProgramClick = async (program) => {
  if (isActiveProgram(program)) {
    userProfileStore.selectProgram(program.id)
    router.push({ name: EXPLORE_ROUTES.PROGRAMS })
    return
  }

  try {
    await userProfileStore.switchProgram(program.id)
    router.push({ name: EXPLORE_ROUTES.HOME })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar de programa',
    })
  }
}

/**
 * Maneja el click en una tarjeta de entrenamiento.
 * La vista detallada aún no está construida, por lo que se muestra una notificación.
 */
const handleTrainingClick = () => {
  $q.notify({
    message: 'La vista detallada de entrenamientos estará disponible pronto',
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
}

.explore-tabs :deep(.q-tab__label) {
  font-weight: var(--font-semibold);
  text-transform: none;
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

.explore-tab-panel {
  padding: var(--space-4) 0;
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
