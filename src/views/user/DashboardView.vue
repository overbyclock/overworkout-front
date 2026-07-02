<template>
  <div class="dashboard-view">
    <header class="dashboard-view__header">
      <h1 class="dashboard-view__greeting">{{ greeting }}</h1>
      <p class="dashboard-view__date">{{ todayDate }}</p>
    </header>

    <section class="dashboard-view__section">
      <DailyStats
        :streak="userStatsStore.streakDays"
        :weekly="userStatsStore.weeklyWorkouts"
        :xp="userStatsStore.xp"
      />
    </section>

    <template v-if="userProfileStore.hasActiveProgram">
      <section class="dashboard-view__section">
        <ContinueCard
          :title="userProfileStore.currentProgram.name"
          :subtitle="continueSubtitle"
          @continue="handleContinue"
        />
      </section>
    </template>

    <template v-else>
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
        <button
          type="button"
          class="empty-state__cta btn-mobile btn-mobile--ghost"
          @click="goToWelcome"
        >
          Hacer cuestionario
        </button>
      </div>
    </template>

    <template v-if="hasProgramsOrFavorites">
      <section v-if="activeProgramCards.length > 0" class="dashboard-view__section">
        <HorizontalCarousel title="Mis programas" :items="activeProgramCards">
          <template #item="{ item }">
            <PosterCard
              :item="item.item"
              :type="item.type"
              :level="item.level"
              :duration="item.duration"
              :extra="item.extra"
              :progress="item.progress"
              @click="openActiveProgram(item.raw)"
            />
          </template>
        </HorizontalCarousel>
      </section>

      <section v-if="favoriteCards.length > 0" class="dashboard-view__section">
        <HorizontalCarousel
          title="Tus favoritos"
          action-label="Ver todos"
          :action-to="{ name: 'user-explore' }"
          :items="favoriteCards"
        >
          <template #item="{ item }">
            <PosterCard
              :item="item.item"
              :type="item.type"
              :level="item.level"
              :duration="item.duration"
              :extra="item.extra"
              show-favorite
              :is-favorite="item.isFavorite"
              @click="openFavoriteCard(item)"
              @toggle-favorite="toggleFavoriteCard(item)"
            />
          </template>
        </HorizontalCarousel>
      </section>
    </template>

    <template v-else-if="!userProfileStore.hasActiveProgram">
      <div class="dashboard-view__empty empty-state">
        <div class="empty-state__icon">
          <q-icon name="favorite_border" size="64px" />
        </div>
        <h2 class="empty-state__title">Tus programas y favoritos</h2>
        <p class="empty-state__text">
          Aquí aparecerán los programas en los que estés inscrito y los entrenamientos que guardes.
        </p>
        <button
          type="button"
          class="empty-state__cta btn-mobile btn-mobile--large btn-mobile--primary"
          @click="navigateToExplore"
        >
          Explorar contenido
        </button>
        <button
          type="button"
          class="empty-state__cta btn-mobile btn-mobile--ghost"
          @click="goToWelcome"
        >
          Hacer cuestionario
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HorizontalCarousel from '@/components/mobile/HorizontalCarousel.vue'
import DailyStats from '@/components/mobile/DailyStats.vue'
import ContinueCard from '@/components/mobile/ContinueCard.vue'
import PosterCard from '@/components/mobile/PosterCard.vue'
import { useUserProfileStore } from '@/stores/userProfile'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { useUserStatsStore } from '@/stores/userStats'
import { getLevelLabel } from '@/constants/levels'

const router = useRouter()
const userProfileStore = useUserProfileStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const userStatsStore = useUserStatsStore()

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

const activeProgramCards = computed(() => {
  return userProfileStore.activePrograms.map((program) => ({
    id: `active-program-${program.id}`,
    type: 'program',
    item: program,
    level: getLevelLabel(program.difficulty),
    duration: program.estimatedDurationWeeks ? `${program.estimatedDurationWeeks} semanas` : '',
    extra: program.totalLevels ? `${program.totalLevels} niveles` : '',
    progress: program.progress?.percentage ?? null,
    raw: program,
  }))
})

const favoriteCards = computed(() => {
  const programs = favoritesStore.programFavorites.map((favorite) => ({
    id: `favorite-program-${favorite.id}`,
    type: 'program',
    item: favorite.trainingProgram,
    level: getLevelLabel(favorite.trainingProgram.difficulty),
    duration: favorite.trainingProgram.estimatedDurationWeeks
      ? `${favorite.trainingProgram.estimatedDurationWeeks} semanas`
      : '',
    extra: favorite.trainingProgram.totalLevels
      ? `${favorite.trainingProgram.totalLevels} niveles`
      : '',
    showFavorite: true,
    isFavorite: true,
    raw: favorite.trainingProgram,
  }))

  const trainings = favoritesStore.trainingFavorites.map((favorite) => ({
    id: `favorite-training-${favorite.id}`,
    type: 'training',
    item: favorite.training,
    level: favorite.training.sessionType || favorite.training.target || '',
    duration:
      favorite.training.estimatedDurationMin && favorite.training.estimatedDurationMax
        ? `${favorite.training.estimatedDurationMin}-${favorite.training.estimatedDurationMax} min`
        : '',
    extra: favorite.training.rounds ? `${favorite.training.rounds} rounds` : '',
    showFavorite: true,
    isFavorite: true,
    raw: favorite.training,
  }))

  return [...programs, ...trainings]
})

const hasProgramsOrFavorites = computed(
  () => activeProgramCards.value.length > 0 || favoriteCards.value.length > 0,
)

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

const goToWelcome = () => {
  router.push({ name: 'user-welcome' })
}

const navigateToExplore = () => {
  router.push({ name: 'user-explore' })
}

const openActiveProgram = (program) => {
  userProfileStore.selectProgram(program.id)
  router.push({ name: 'user-program' })
}

const openFavoriteCard = (card) => {
  if (card.type === 'program') {
    userProfileStore.selectProgram(card.raw.id)
    router.push({ name: 'user-program' })
  } else {
    router.push({ name: 'user-explore' })
  }
}

const toggleFavoriteCard = (card) => {
  if (card.type === 'program') {
    favoritesStore.toggleProgramFavorite(card.raw)
  } else {
    favoritesStore.toggleTrainingFavorite(card.raw)
  }
}

const handleContinue = () => {
  const program = userProfileStore.currentProgram
  if (program) {
    openActiveProgram(program)
  } else {
    navigateToExplore()
  }
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

.dashboard-view__section:empty {
  display: none;
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
