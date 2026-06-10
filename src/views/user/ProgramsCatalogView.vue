<template>
  <div class="mobile-view">
    <MobilePageHeader title="Elige tu programa" subtitle="Encuentra tu camino" :centered="true" />

    <div class="mobile-container">
      <!-- Recomendación del assessment -->
      <section v-if="recommendedProgram" class="mobile-section animate-fadeInUp">
        <p class="mobile-caption" style="margin-bottom: var(--space-3)">Recomendado para ti</p>
        <MobileCard variant="primary" clickable @click="selectProgram(recommendedProgram)">
          <template #icon>
            <q-icon name="stars" size="32px" />
          </template>
          <template #default>
            <h3 class="mobile-card__title">{{ recommendedProgram.name }}</h3>
            <p class="mobile-card__text">{{ recommendedProgram.description }}</p>
            <div class="program-tags">
              <span class="program-tag program-tag--dark">{{ recommendedProgram.level }}</span>
              <span class="program-tag program-tag--dark">{{ recommendedProgram.duration }}</span>
            </div>
          </template>
          <template #action>
            <button
              class="btn-mobile btn-mobile--primary"
              style="width: auto; padding: var(--space-2) var(--space-4); min-height: 40px"
            >
              Empezar
            </button>
          </template>
        </MobileCard>
      </section>

      <!-- Filtros -->
      <section class="mobile-section">
        <div class="filters-scroll hide-scrollbar">
          <button
            v-for="filter in filters"
            :key="filter.value"
            class="filter-chip"
            :class="{ 'filter-chip--active': activeFilter === filter.value }"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </section>

      <!-- Lista de programas -->
      <section class="mobile-section">
        <h3 v-if="!recommendedProgram" class="mobile-h4" style="margin-bottom: var(--space-4)">
          Programas disponibles
        </h3>
        <h3 v-else class="mobile-h4" style="margin-bottom: var(--space-4)">Otros programas</h3>

        <div class="programs-list animate-stagger">
          <div
            v-for="program in filteredPrograms"
            :key="program.id"
            class="program-card"
            :class="{ 'program-card--recommended': isRecommended(program) }"
            @click="selectProgram(program)"
          >
            <div class="program-card__header">
              <div class="program-card__icon">
                <q-icon :name="getProgramIcon(program.discipline)" size="28px" />
              </div>
              <div class="program-card__meta">
                <span class="program-card__level">{{ formatLevel(program.difficulty) }}</span>
                <span class="program-card__duration">{{ program.totalLevels }} niveles</span>
              </div>
            </div>

            <h4 class="program-card__name">{{ program.name }}</h4>
            <p class="program-card__desc">{{ truncateText(program.description, 100) }}</p>

            <div class="program-card__footer">
              <div class="program-card__stats">
                <span
                  ><q-icon name="schedule" size="16px" />
                  {{ program.estimatedDurationWeeks || '-' }} sem</span
                >
                <span
                  ><q-icon name="stacked_bar_chart" size="16px" />
                  {{ program.totalLevels }} niv</span
                >
              </div>
              <q-icon name="chevron_right" size="24px" color="muted" />
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
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import MobileCard from '@/components/mobile/MobileCard.vue'
import { programService } from '@/services/programs'
import { useUserProfileStore } from '@/stores/userProfile'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

const programs = ref([])
const loading = ref(false)
const activeFilter = ref('all')

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
]

// Programa recomendado basado en el perfil del usuario
const recommendedProgram = computed(() => {
  const goal = authStore.user?.trainingGoal
  const level = authStore.user?.estimatedLevel

  if (!goal && !level) return null

  // Lógica simple de recomendación (coincide con backend)
  if (goal === 'skills' && level !== 'beginner') {
    return (
      programs.value.find((p) => p.slug === 'handstand-balance-mastery') ||
      programs.value.find((p) => p.slug === 'front-lever-mastery')
    )
  }

  if (level === 'beginner') {
    return programs.value.find((p) => p.slug === 'calisthenia-master-v3')
  }

  // Por defecto, calistenia general
  return programs.value.find((p) => p.slug === 'calisthenia-master-v3')
})

const filteredPrograms = computed(() => {
  let result = programs.value

  // Excluir el recomendado de la lista general (ya aparece arriba)
  if (recommendedProgram.value) {
    result = result.filter((p) => p.id !== recommendedProgram.value.id)
  }

  if (activeFilter.value === 'all') return result

  return result.filter((p) => p.difficulty === activeFilter.value)
})

const isRecommended = (program) => {
  return recommendedProgram.value?.id === program.id
}

const getProgramIcon = (discipline) => {
  const icons = {
    calisthenics: 'sports_gymnastics',
    crossfit: 'fitness_center',
    strength: 'fitness_center',
    cardio: 'directions_run',
  }
  return icons[discipline] || 'fitness_center'
}

const formatLevel = (difficulty) => {
  const labels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  }
  return labels[difficulty] || difficulty
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const selectProgram = async (program) => {
  try {
    loading.value = true
    await userProfileStore.initProgram(program.id)
    router.push({ name: 'user-home' })
  } catch {
    // Si falla, igual redirigimos al home (puede que ya tuviera progreso)
    router.push({ name: 'user-home' })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const response = await programService.getAll()
    programs.value = Array.isArray(response) ? response : response['hydra:member'] || []
  } catch {
    console.error('Error cargando programas')
  }
})
</script>

<style scoped>
.filters-scroll {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;
}

.filter-chip {
  flex-shrink: 0;
  padding: var(--space-2) var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.filter-chip:hover {
  border-color: var(--border-default);
}

.filter-chip--active {
  background-color: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.program-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-top: var(--space-3);
}

.program-tag {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
}

.program-tag--dark {
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.9);
}

.programs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.program-card {
  padding: var(--space-5);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.program-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-default);
}

.program-card--recommended {
  border-color: rgba(255, 143, 56, 0.3);
}

.program-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.program-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.program-card__level {
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.program-card__duration {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

.program-card__name {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.program-card__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4) 0;
  line-height: var(--leading-normal);
}

.program-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}

.program-card__stats {
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-sm);
  color: var(--text-muted);
}

.program-card__stats span {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
