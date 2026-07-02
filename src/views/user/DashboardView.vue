<template>
  <div class="dashboard-view">
    <!-- Cabecera con saludo y fecha -->
    <header class="dashboard-view__header">
      <h1 class="dashboard-view__greeting">{{ greeting }}</h1>
      <p class="dashboard-view__date">{{ todayDate }}</p>
    </header>

    <!-- Estadísticas diarias -->
    <section class="dashboard-view__section">
      <DailyStats
        :streak="userStatsStore.streakDays"
        :weekly="userStatsStore.weeklyWorkouts"
        :xp="userStatsStore.xp"
      />
    </section>

    <!-- Estado vacío: sin programas activos -->
    <template v-if="!userProfileStore.hasActiveProgram">
      <div class="dashboard-view__empty empty-state">
        <div class="empty-state__icon">
          <q-icon name="fitness_center" size="64px" />
        </div>
        <h2 class="empty-state__title">Aún no tienes un programa</h2>
        <p class="empty-state__text">
          Explora nuestras disciplinas y encuentra el plan perfecto para empezar a entrenar.
        </p>
        <button
          type="button"
          class="empty-state__cta btn-mobile btn-mobile--large btn-mobile--primary"
          @click="navigateToExplore"
        >
          Explorar programas
          <q-icon name="arrow_forward" size="20px" />
        </button>
      </div>
    </template>

    <!-- Estado con programas activos -->
    <template v-else>
      <!-- Continúa donde lo dejaste -->
      <section v-if="userProfileStore.currentProgram" class="dashboard-view__section">
        <ContinueCard
          :title="userProfileStore.currentProgram.name"
          :subtitle="continueSubtitle"
          @continue="handleContinue"
        />
      </section>

      <!-- Carrusel: Mis programas -->
      <section v-if="userProfileStore.activePrograms.length > 0" class="dashboard-view__section">
        <HorizontalCarousel
          title="Mis programas"
          action-label="Ver todos"
          :action-to="{ name: 'user-explore' }"
          :items="userProfileStore.activePrograms"
          loop
        >
          <template #item="{ item }">
            <ContentCard
              :title="item.name"
              :description="item.description"
              :icon="getDisciplineIcon(item.discipline)"
              :level="getLevelLabel(item.difficulty)"
              :footer="`${item.progress?.percentage || 0}% completado`"
              @click="openProgram(item)"
            />
          </template>
        </HorizontalCarousel>
      </section>
    </template>

    <!-- Carrusel: Tus favoritos -->
    <section v-if="favoriteItems.length > 0" class="dashboard-view__section">
      <HorizontalCarousel
        title="Tus favoritos"
        action-label="Ver todos"
        :action-to="{ name: 'user-explore' }"
        :items="favoriteItems"
      >
        <template #item="{ item }">
          <ContentCard
            :title="item.title"
            :description="item.description"
            :icon="item.icon"
            :badge="item.badge"
            :level="item.level"
            show-favorite
            :is-favorite="true"
            @click="openFavorite(item)"
            @toggle-favorite="toggleFavorite(item)"
          />
        </template>
      </HorizontalCarousel>
    </section>

    <!-- Carrusel: Descubrir -->
    <section class="dashboard-view__section">
      <HorizontalCarousel title="Descubrir" :items="discoverItems" loop>
        <template #item="{ item }">
          <ContentCard
            :title="item.label"
            :icon="item.icon"
            variant="primary"
            @click="navigateToExplore"
          />
        </template>
      </HorizontalCarousel>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HorizontalCarousel from '@/components/mobile/HorizontalCarousel.vue'
import DailyStats from '@/components/mobile/DailyStats.vue'
import ContinueCard from '@/components/mobile/ContinueCard.vue'
import ContentCard from '@/components/mobile/ContentCard.vue'
import { useUserProfileStore } from '@/stores/userProfile'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { useUserStatsStore } from '@/stores/userStats'
import { getDisciplineIcon } from '@/constants/disciplines'
import { getLevelLabel } from '@/constants/levels'

const router = useRouter()
const userProfileStore = useUserProfileStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const userStatsStore = useUserStatsStore()

const discoverItems = [
  { id: 'calisthenia', label: 'Calistenia', icon: getDisciplineIcon('calisthenia') },
  { id: 'hiit', label: 'HIIT', icon: getDisciplineIcon('hiit') },
  { id: 'strength', label: 'Fuerza', icon: getDisciplineIcon('strength') },
  { id: 'skills', label: 'Skills', icon: getDisciplineIcon('skills') },
]

const greeting = computed(() => {
  const name = authStore.user?.nick || 'atleta'
  return `Hola, ${name}`
})

const todayDate = computed(() => {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
    .formatToParts(new Date())
    .map((part) => (part.type === 'literal' ? part.value.replace(',', '') : part.value))
    .join('')
    .trim()
    .replace(/\s+/g, ' ')
})

const continueSubtitle = computed(() => {
  const program = userProfileStore.currentProgram
  const level = userProfileStore.currentLevel

  if (level?.name) {
    return level.name
  }

  return program?.difficulty ? getLevelLabel(program.difficulty) : ''
})

const favoriteItems = computed(() => {
  const programs = favoritesStore.programFavorites.map((favorite) => ({
    id: `program-${favorite.id}`,
    type: 'program',
    title: favorite.trainingProgram.name,
    description: favorite.trainingProgram.description || '',
    icon: getDisciplineIcon(favorite.trainingProgram.discipline),
    badge: 'Programa',
    level: getLevelLabel(favorite.trainingProgram.difficulty),
    raw: favorite.trainingProgram,
  }))

  const trainings = favoritesStore.trainingFavorites.map((favorite) => ({
    id: `training-${favorite.id}`,
    type: 'training',
    title: favorite.training.name,
    description: favorite.training.description || '',
    icon: getDisciplineIcon(favorite.training.discipline),
    badge: 'Entreno',
    level: getLevelLabel(favorite.training.difficulty),
    raw: favorite.training,
  }))

  return [...programs, ...trainings]
})

onMounted(async () => {
  try {
    await Promise.all([
      userProfileStore.fetchActiveProgress(),
      favoritesStore.loadFavorites(),
      userStatsStore.fetchDashboardStats(),
    ])
  } catch {
    // Los stores ya gestionan su propio estado de error; no hacemos nada aquí para no bloquear la UI.
  }
})

const navigateToProgram = (programId) => {
  userProfileStore.selectProgram(programId)
  router.push({ name: 'user-program' })
}

const handleContinue = () => {
  const programId = userProfileStore.currentProgram?.id
  if (programId) {
    navigateToProgram(programId)
  } else {
    router.push({ name: 'user-explore' })
  }
}

const openProgram = (program) => {
  navigateToProgram(program.id)
}

const openFavorite = (item) => {
  if (item.type === 'program') {
    navigateToProgram(item.raw.id)
  } else {
    router.push({ name: 'user-explore' })
  }
}

const toggleFavorite = (item) => {
  if (item.type === 'program') {
    favoritesStore.toggleProgramFavorite(item.raw)
  } else {
    favoritesStore.toggleTrainingFavorite(item.raw)
  }
}

const navigateToExplore = () => {
  router.push({ name: 'user-explore' })
}
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-5);
  min-height: 100%;
}

.dashboard-view__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.dashboard-view__greeting {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.dashboard-view__date {
  font-size: var(--font-base);
  color: var(--text-muted);
  margin: 0;
  text-transform: capitalize;
}

.dashboard-view__section {
  width: 100%;
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

.empty-state__title {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.empty-state__text {
  font-size: var(--font-base);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  /* Anchos fijos intencionales para mantener la legibilidad del texto en móvil */
  max-width: clamp(240px, 80vw, 300px);
  margin: 0;
}

.empty-state__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  /* Ancho máximo intencional para botones de acción principales en estado vacío */
  max-width: clamp(280px, 90vw, 360px);
}
</style>
