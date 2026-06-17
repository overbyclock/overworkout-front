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

      <!-- Programas activos -->
      <section v-if="activePrograms.length > 0" class="mobile-section animate-fadeInUp">
        <div class="section-header">
          <p class="mobile-caption">Tus programas activos</p>
          <router-link :to="{ name: 'user-program' }" class="section-link"
            >Ver progreso</router-link
          >
        </div>
        <div class="active-programs-list">
          <button
            v-for="program in activePrograms"
            :key="program.id"
            class="active-program-chip"
            @click="continueProgram(program)"
          >
            <q-icon :name="getProgramIcon(program.discipline)" size="18px" />
            <span>{{ program.name }}</span>
            <q-icon name="chevron_right" size="18px" color="muted" />
          </button>
        </div>
      </section>

      <!-- Filtros por dificultad -->
      <section class="mobile-section filters-section">
        <div class="filters-scroll hide-scrollbar">
          <button
            v-for="filter in difficultyFilters"
            :key="filter.value"
            class="filter-chip"
            :class="{ 'filter-chip--active': activeDifficultyFilter === filter.value }"
            @click="activeDifficultyFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </section>

      <!-- Carruseles por disciplina -->
      <section
        v-for="category in programCategories"
        :key="category.discipline"
        class="mobile-section category-section"
      >
        <div class="category-header">
          <div class="category-title">
            <q-icon :name="getProgramIcon(category.discipline)" size="20px" color="primary" />
            <h3 class="mobile-h4">{{ category.label }}</h3>
            <span class="category-count">{{ category.programs.length }}</span>
          </div>
        </div>

        <div class="carousel-stage">
          <button
            v-if="category.programs.length > 1"
            class="carousel-arrow carousel-arrow--left"
            aria-label="Anterior"
            @click="prevSlide(category.discipline)"
          >
            <q-icon name="chevron_left" size="24px" />
          </button>

          <div
            :ref="(el) => setCarouselRef(el, category.discipline)"
            class="programs-carousel hide-scrollbar"
            @scroll="onCarouselScroll(category.discipline)"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd(category.discipline, $event)"
          >
            <div
              v-for="(program, index) in duplicatedPrograms(category.programs)"
              :key="`${category.discipline}-${program.id}-${index}`"
              class="program-card"
              :class="{
                'program-card--recommended': isRecommended(program),
                'program-card--active': isActive(program),
              }"
              @click="selectProgram(program)"
            >
              <div v-if="isActive(program)" class="program-card__badge">Activo</div>
              <div
                v-else-if="isRecommended(program)"
                class="program-card__badge program-card__badge--recommended"
              >
                Recomendado
              </div>

              <div class="program-card__icon">
                <q-icon :name="getProgramIcon(program.discipline)" size="28px" />
              </div>

              <div class="program-card__meta">
                <span class="program-card__level">{{ formatLevel(program.difficulty) }}</span>
                <span class="program-card__duration">{{ program.totalLevels }} niveles</span>
              </div>

              <h4 class="program-card__name">{{ program.name }}</h4>
              <p class="program-card__desc">{{ truncateText(program.description, 70) }}</p>

              <div class="program-card__footer">
                <span class="program-card__stat">
                  <q-icon name="schedule" size="14px" />
                  {{ program.estimatedDurationWeeks || '-' }} sem
                </span>
                <q-icon name="chevron_right" size="20px" color="muted" />
              </div>
            </div>
          </div>

          <button
            v-if="category.programs.length > 1"
            class="carousel-arrow carousel-arrow--right"
            aria-label="Siguiente"
            @click="nextSlide(category.discipline)"
          >
            <q-icon name="chevron_right" size="24px" />
          </button>
        </div>

        <div v-if="category.programs.length > 1" class="carousel-dots">
          <button
            v-for="(_, index) in category.programs"
            :key="index"
            class="carousel-dot"
            :class="{ 'carousel-dot--active': getCarouselPage(category.discipline) === index }"
            :aria-label="`Ir al programa ${index + 1}`"
            @click="goToSlide(category.discipline, index)"
          />
        </div>
      </section>

      <!-- Estado vacío -->
      <section v-if="programCategories.length === 0 && !loading" class="mobile-section empty-state">
        <q-icon name="fitness_center" size="48px" color="muted" />
        <p class="mobile-body">No hay programas disponibles con los filtros seleccionados.</p>
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
import { DISCIPLINE_LABELS, getDisciplineIcon } from '@/constants/disciplines'

const router = useRouter()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

const programs = ref([])
const loading = ref(false)
const activeDifficultyFilter = ref('all')
const carouselRefs = ref({})
const carouselPages = ref({})
const touchStartX = ref(0)

const difficultyFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
]

const activePrograms = computed(() => userProfileStore.activePrograms)

// Programa recomendado basado en el perfil del usuario
const recommendedProgram = computed(() => {
  const goal = authStore.user?.trainingGoal
  const level = authStore.user?.estimatedLevel

  if (!goal && !level) return null

  if (goal === 'skills' && level !== 'beginner') {
    return (
      programs.value.find((p) => p.slug === 'handstand-balance-mastery') ||
      programs.value.find((p) => p.slug === 'front-lever-mastery')
    )
  }

  if (level === 'beginner') {
    return programs.value.find((p) => p.slug === 'calisthenia-master-v3')
  }

  return programs.value.find((p) => p.slug === 'calisthenia-master-v3')
})

const filteredPrograms = computed(() => {
  if (activeDifficultyFilter.value === 'all') return programs.value

  return programs.value.filter((p) => p.difficulty === activeDifficultyFilter.value)
})

const programCategories = computed(() => {
  const grouped = {}

  filteredPrograms.value.forEach((program) => {
    const discipline = program.discipline || 'other'
    if (!grouped[discipline]) {
      grouped[discipline] = []
    }
    grouped[discipline].push(program)
  })

  return Object.entries(grouped)
    .map(([discipline, programs]) => ({
      discipline,
      label: DISCIPLINE_LABELS[discipline] || discipline,
      programs,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

// Duplicamos los programas al inicio y final para crear la sensación de loop infinito
const duplicatedPrograms = (programs) => {
  if (programs.length <= 1) return programs
  return [...programs, ...programs, ...programs]
}

const setCarouselRef = (el, discipline) => {
  if (el) {
    carouselRefs.value[discipline] = el
  }
}

const getCarouselPage = (discipline) => {
  return carouselPages.value[discipline] || 0
}

const getCardWidth = (discipline) => {
  const el = carouselRefs.value[discipline]
  if (!el || !el.children[el.children.length > 1 ? 1 : 0]) {
    return window.innerWidth < 768 ? window.innerWidth * 0.7 : 260
  }

  const child = el.children[el.children.length > 1 ? 1 : 0]
  return child.getBoundingClientRect().width
}

const getOriginalCount = (discipline) => {
  const category = programCategories.value.find((c) => c.discipline === discipline)
  return category ? category.programs.length : 0
}

const getRealIndex = (discipline, virtualIndex) => {
  const count = getOriginalCount(discipline)
  if (count === 0) return 0
  return ((virtualIndex % count) + count) % count
}

const getCenteredScrollLeft = (discipline, virtualIndex) => {
  const el = carouselRefs.value[discipline]
  if (!el) return 0

  const card = el.children[virtualIndex]
  if (!card) return 0

  const containerWidth = el.offsetWidth
  const cardWidth = card.offsetWidth
  const cardLeft = card.offsetLeft

  return cardLeft - containerWidth / 2 + cardWidth / 2
}

const updateCarouselPage = (discipline) => {
  const el = carouselRefs.value[discipline]
  if (!el) return

  const count = getOriginalCount(discipline)
  if (count <= 1) return

  const cardWidth = getCardWidth(discipline)
  const containerWidth = el.offsetWidth
  const scrollLeft = el.scrollLeft + containerWidth / 2
  const virtualIndex = Math.round(scrollLeft / (cardWidth + 12))
  const realIndex = getRealIndex(discipline, virtualIndex - count)

  carouselPages.value[discipline] = realIndex

  // Reposicionar silenciosamente en el bloque central cuando estamos en los extremos duplicados
  const currentBlock = Math.floor(virtualIndex / count)
  if (currentBlock !== 1) {
    const newVirtualIndex = realIndex + count
    const newScrollLeft = getCenteredScrollLeft(discipline, newVirtualIndex)
    if (Math.abs(newScrollLeft - el.scrollLeft) > 5) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft = newScrollLeft
      el.style.scrollBehavior = 'smooth'
    }
  }
}

const goToSlide = (discipline, realIndex) => {
  const el = carouselRefs.value[discipline]
  if (!el) return

  const count = getOriginalCount(discipline)
  if (count <= 1) return

  const virtualIndex = realIndex + count
  el.scrollTo({
    left: getCenteredScrollLeft(discipline, virtualIndex),
    behavior: 'smooth',
  })
}

const nextSlide = (discipline) => {
  const el = carouselRefs.value[discipline]
  if (!el) return

  const count = getOriginalCount(discipline)
  if (count <= 1) return

  const currentPage = getCarouselPage(discipline)
  const nextPage = (currentPage + 1) % count
  goToSlide(discipline, nextPage)
}

const prevSlide = (discipline) => {
  const el = carouselRefs.value[discipline]
  if (!el) return

  const count = getOriginalCount(discipline)
  if (count <= 1) return

  const currentPage = getCarouselPage(discipline)
  const prevPage = (currentPage - 1 + count) % count
  goToSlide(discipline, prevPage)
}

const onCarouselScroll = (discipline) => {
  updateCarouselPage(discipline)
}

const onTouchStart = (event) => {
  touchStartX.value = event.changedTouches[0].screenX
}

const onTouchEnd = (discipline, event) => {
  const endX = event.changedTouches[0].screenX
  const diff = touchStartX.value - endX

  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      nextSlide(discipline)
    } else {
      prevSlide(discipline)
    }
  }
}

const isRecommended = (program) => {
  return recommendedProgram.value?.id === program.id
}

const isActive = (program) => {
  return activePrograms.value.some((p) => p.id === program.id)
}

const continueProgram = (program) => {
  userProfileStore.selectProgram(program.id)
  router.push({ name: 'user-program' })
}

const getProgramIcon = (discipline) => {
  return getDisciplineIcon(discipline)
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
  if (isActive(program)) {
    continueProgram(program)
    return
  }

  try {
    loading.value = true
    await userProfileStore.switchProgram(program.id)
    router.push({ name: 'user-home' })
  } catch (err) {
    console.error('Error iniciando programa:', err)
  } finally {
    loading.value = false
  }
}

const initializeCarousels = () => {
  programCategories.value.forEach((category) => {
    const count = category.programs.length
    if (count <= 1) return

    // Posicionar el carrusel en el bloque central
    const activeIndex = category.programs.findIndex((p) => isActive(p))
    const startIndex = activeIndex >= 0 ? activeIndex : 0
    goToSlide(category.discipline, startIndex)
  })
}

onMounted(async () => {
  loading.value = true

  try {
    await userProfileStore.fetchActiveProgress()
    const response = await programService.getAll()
    programs.value = Array.isArray(response) ? response : response['hydra:member'] || []

    // Inicializar carruseles en el bloque central después de renderizar
    requestAnimationFrame(() => {
      initializeCarousels()
    })
  } catch (err) {
    console.error('Error cargando programas:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.active-programs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.active-program-chip {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  text-align: left;
}

.active-program-chip:hover {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.06);
}

.active-program-chip span {
  flex: 1;
}

.section-link {
  color: var(--color-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  text-decoration: none;
}

.filters-section {
  padding-top: var(--space-2);
  padding-bottom: var(--space-2);
  margin-top: var(--space-2);
  margin-bottom: var(--space-4);
}

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

.category-section {
  padding-bottom: var(--space-4);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.category-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.category-title h3 {
  margin: 0;
}

.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background-color: var(--surface-tertiary);
  color: var(--text-muted);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  border-radius: var(--radius-full);
}

.carousel-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.programs-carousel {
  display: flex;
  gap: 12px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--space-2) 0 var(--space-4);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.programs-carousel::-webkit-scrollbar {
  display: none;
}

.program-card {
  flex: 0 0 calc(100% - 64px);
  min-width: 260px;
  max-width: 320px;
  padding: var(--space-5);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out),
    opacity 0.2s var(--ease-out);
  position: relative;
  scroll-snap-align: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

@media (min-width: 390px) {
  .program-card {
    flex: 0 0 calc(100% - 72px);
    max-width: 330px;
  }
}

@media (min-width: 480px) {
  .program-card {
    flex: 0 0 calc(100% - 96px);
    max-width: 350px;
  }
}

@media (min-width: 640px) {
  .program-card {
    flex: 0 0 calc(100% - 140px);
    max-width: 370px;
  }
}

@media (min-width: 768px) {
  .program-card {
    flex: 0 0 calc(100% - 180px);
    max-width: 390px;
  }
}

@media (min-width: 1024px) {
  .program-card {
    flex: 0 0 calc(100% - 240px);
    max-width: 420px;
  }
}

@media (min-width: 1440px) {
  .program-card {
    flex: 0 0 calc(100% - 320px);
    max-width: 460px;
  }
}

.program-card:active {
  transform: scale(0.97);
}

.program-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-default);
}

.program-card--recommended {
  border-color: rgba(255, 143, 56, 0.6);
}

.program-card--active {
  border-color: var(--color-primary);
  background-color: rgba(255, 143, 56, 0.08);
}

.program-card__badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  padding: 2px 8px;
  background-color: var(--color-primary);
  color: #000;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  border-radius: var(--radius-full);
}

.program-card__badge--recommended {
  background-color: rgba(255, 143, 56, 0.2);
  color: var(--color-primary);
}

.program-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
}

.program-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
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
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
  line-height: 1.25;
}

.program-card__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4) 0;
  line-height: var(--leading-normal);
  min-height: 40px;
}

.program-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.program-card__stat {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-sm);
  color: var(--text-muted);
}

.carousel-arrow {
  display: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  z-index: 2;
}

.carousel-arrow:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #000;
}

@media (min-width: 768px) {
  .carousel-arrow {
    display: flex;
    position: absolute;
  }

  .carousel-arrow--left {
    left: -20px;
  }

  .carousel-arrow--right {
    right: -20px;
  }
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.carousel-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  background-color: var(--surface-tertiary);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.carousel-dot--active {
  width: 20px;
  background-color: var(--color-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8) 0;
  text-align: center;
  color: var(--text-muted);
}

/* Permitir que el catálogo aproveche pantallas grandes sin perder la
   estética mobile-first. */
.mobile-container {
  max-width: 900px;
}
</style>
