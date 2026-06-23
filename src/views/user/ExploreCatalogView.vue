<template>
  <div class="mobile-view mobile-view--no-nav explore-catalog-view">
    <MobilePageHeader title="Explorar contenido" show-back :back-to="{ name: 'user-welcome' }" />

    <div class="mobile-container">
      <q-tabs
        v-model="activeTab"
        class="explore-tabs"
        dark
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="trainings" label="Entrenamientos" />
        <q-tab name="programs" label="Programas" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated dark class="explore-panels">
        <q-tab-panel name="trainings" class="explore-panel">
          <div v-if="trainingsLoading" class="explore-state">
            <q-spinner color="primary" size="40px" />
            <p class="mobile-body-sm">Cargando entrenamientos...</p>
          </div>

          <div v-else-if="trainingsError" class="explore-state">
            <q-icon name="error_outline" size="48px" color="negative" />
            <p class="mobile-body-sm">{{ trainingsError }}</p>
          </div>

          <div v-else-if="trainings.length === 0" class="explore-state">
            <q-icon name="fitness_center" size="48px" color="muted" />
            <p class="mobile-body-sm">No hay entrenamientos disponibles</p>
          </div>

          <div v-else class="catalog-list">
            <div
              v-for="training in trainings"
              :key="training.id"
              class="catalog-item"
              @click="openDetail(training, 'training')"
            >
              <div class="catalog-item__icon">
                <q-icon :name="getDisciplineIcon(training.discipline)" size="24px" />
              </div>

              <div class="catalog-item__content">
                <h3 class="catalog-item__title">{{ training.name }}</h3>
                <p class="catalog-item__meta">{{ getTrainingMeta(training) }}</p>
              </div>

              <button
                class="catalog-item__favorite mobile-touch"
                :disabled="favoritesStore.isToggling || favoritesLoading"
                :aria-label="
                  favoritesStore.isTrainingFavorite(training.id)
                    ? 'Quitar de favoritos'
                    : 'Añadir a favoritos'
                "
                @click.stop="toggleTrainingFavorite(training)"
              >
                <q-icon
                  :name="
                    favoritesStore.isTrainingFavorite(training.id) ? 'favorite' : 'favorite_border'
                  "
                  size="24px"
                  :color="favoritesStore.isTrainingFavorite(training.id) ? 'negative' : 'muted'"
                />
              </button>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="programs" class="explore-panel">
          <div v-if="programsLoading" class="explore-state">
            <q-spinner color="primary" size="40px" />
            <p class="mobile-body-sm">Cargando programas...</p>
          </div>

          <div v-else-if="programsError" class="explore-state">
            <q-icon name="error_outline" size="48px" color="negative" />
            <p class="mobile-body-sm">{{ programsError }}</p>
          </div>

          <div v-else-if="programs.length === 0" class="explore-state">
            <q-icon name="school" size="48px" color="muted" />
            <p class="mobile-body-sm">No hay programas disponibles</p>
          </div>

          <div v-else class="catalog-list">
            <div
              v-for="program in programs"
              :key="program.id"
              class="catalog-item"
              @click="openDetail(program, 'program')"
            >
              <div class="catalog-item__icon">
                <q-icon :name="getDisciplineIcon(program.discipline)" size="24px" />
              </div>

              <div class="catalog-item__content">
                <h3 class="catalog-item__title">{{ program.name }}</h3>
                <p class="catalog-item__meta">{{ getProgramMeta(program) }}</p>
              </div>

              <button
                class="catalog-item__favorite mobile-touch"
                :disabled="favoritesStore.isToggling || favoritesLoading"
                :aria-label="
                  favoritesStore.isProgramFavorite(program.id)
                    ? 'Quitar de favoritos'
                    : 'Añadir a favoritos'
                "
                @click.stop="toggleProgramFavorite(program)"
              >
                <q-icon
                  :name="
                    favoritesStore.isProgramFavorite(program.id) ? 'favorite' : 'favorite_border'
                  "
                  size="24px"
                  :color="favoritesStore.isProgramFavorite(program.id) ? 'negative' : 'muted'"
                />
              </button>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="showModal" position="bottom" class="catalog-modal">
      <q-card v-if="selectedItem" class="catalog-modal__card">
        <div class="catalog-modal__header">
          <div class="catalog-modal__icon">
            <q-icon :name="getDisciplineIcon(selectedItem.discipline)" size="32px" />
          </div>
          <div class="catalog-modal__title-block">
            <h3 class="catalog-modal__title">{{ selectedItem.name }}</h3>
            <p class="catalog-modal__meta">{{ getItemMeta(selectedItem, selectedType) }}</p>
          </div>
          <button
            class="catalog-modal__close mobile-touch"
            aria-label="Cerrar"
            @click="showModal = false"
          >
            <q-icon name="close" size="24px" />
          </button>
        </div>

        <div class="catalog-modal__body">
          <p class="catalog-modal__description">
            {{ selectedItem.description || 'Sin descripción' }}
          </p>

          <div class="catalog-modal__chips">
            <span v-if="selectedItem.duration" class="catalog-chip">
              <q-icon name="schedule" size="14px" />
              {{ selectedItem.duration }}
            </span>
            <span v-if="selectedItem.level || selectedItem.difficulty" class="catalog-chip">
              <q-icon name="signal_cellular_alt" size="14px" />
              {{ getLevelLabel(selectedItem.level || selectedItem.difficulty) }}
            </span>
            <span v-if="selectedItem.discipline" class="catalog-chip">
              <q-icon name="sports" size="14px" />
              {{ getDisciplineLabel(selectedItem.discipline) }}
            </span>
          </div>
        </div>

        <div class="catalog-modal__actions">
          <button class="btn-mobile btn-mobile--ghost" @click="showModal = false">Cerrar</button>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import { trainingService } from '@/services/trainings'
import { programService } from '@/services/programs'
import { useFavoritesStore } from '@/stores/favorites'
import { getDisciplineLabel, getDisciplineIcon } from '@/constants/disciplines'
import { getLevelLabel } from '@/constants/levels'

const $q = useQuasar()
const favoritesStore = useFavoritesStore()

const activeTab = ref('trainings')
const trainings = ref([])
const programs = ref([])
const trainingsLoading = ref(false)
const programsLoading = ref(false)
const favoritesLoading = ref(false)
const trainingsError = ref(null)
const programsError = ref(null)
const favoritesError = ref(null)
const showModal = ref(false)
const selectedItem = ref(null)
const selectedType = ref('training')

const normalizeList = (response, key) => {
  if (Array.isArray(response)) return response
  if (response && Array.isArray(response[key])) return response[key]
  return []
}

const loadTrainings = async () => {
  trainingsLoading.value = true
  trainingsError.value = null
  try {
    const response = await trainingService.getPublic()
    trainings.value = normalizeList(response, 'trainings')
  } catch {
    trainingsError.value = 'Error al cargar entrenamientos'
    $q.notify({
      type: 'negative',
      message: trainingsError.value,
    })
  } finally {
    trainingsLoading.value = false
  }
}

const loadPrograms = async () => {
  programsLoading.value = true
  programsError.value = null
  try {
    const response = await programService.getAll()
    programs.value = normalizeList(response, 'programs')
  } catch {
    programsError.value = 'Error al cargar programas'
    $q.notify({
      type: 'negative',
      message: programsError.value,
    })
  } finally {
    programsLoading.value = false
  }
}

const loadFavorites = async () => {
  favoritesLoading.value = true
  favoritesError.value = null
  try {
    await favoritesStore.loadFavorites()
  } catch {
    favoritesError.value = 'Error al cargar favoritos'
    $q.notify({
      type: 'negative',
      message: favoritesError.value,
    })
  } finally {
    favoritesLoading.value = false
  }
}

const loadData = () => {
  loadTrainings()
  loadPrograms()
  loadFavorites()
}

const getTrainingMeta = (training) => {
  const discipline = getDisciplineLabel(training.discipline)
  const level = getLevelLabel(training.difficulty || training.level)
  return level ? `${discipline} · ${level}` : discipline
}

const getProgramMeta = (program) => {
  const discipline = getDisciplineLabel(program.discipline)
  const level = getLevelLabel(program.level)
  return level ? `${discipline} · ${level}` : discipline
}

const getItemMeta = (item, type) => {
  return type === 'program' ? getProgramMeta(item) : getTrainingMeta(item)
}

const openDetail = (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  showModal.value = true
}

const toggleTrainingFavorite = async (training) => {
  try {
    await favoritesStore.toggleTrainingFavorite(training)
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar favorito',
    })
  }
}

const toggleProgramFavorite = async (program) => {
  try {
    await favoritesStore.toggleProgramFavorite(program)
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar favorito',
    })
  }
}

onMounted(loadData)
</script>

<style scoped>
.explore-catalog-view {
  background-color: var(--surface-primary);
  min-height: 100vh;
  min-height: 100dvh;
}

.explore-tabs {
  background-color: transparent;
}

.explore-tabs :deep(.q-tab__label) {
  font-weight: var(--font-semibold);
  text-transform: none;
}

.explore-panels {
  background-color: transparent !important;
  box-shadow: none !important;
}

.explore-panel {
  padding: var(--space-4) 0;
  background-color: transparent !important;
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

.catalog-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.catalog-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.catalog-item:active {
  transform: scale(0.98);
}

.catalog-item__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.catalog-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.catalog-item__title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.catalog-item__meta {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
}

.catalog-item__favorite {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.catalog-item__favorite:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.catalog-modal__card {
  width: 100%;
  max-width: 480px;
  background-color: var(--surface-secondary);
  color: var(--text-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.catalog-modal__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.catalog-modal__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background-color: rgba(255, 143, 56, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.catalog-modal__title-block {
  flex: 1;
  min-width: 0;
}

.catalog-modal__title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
  line-height: var(--leading-tight);
}

.catalog-modal__meta {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
}

.catalog-modal__close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.catalog-modal__body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.catalog-modal__description {
  font-size: var(--font-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.catalog-modal__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.catalog-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background-color: var(--surface-tertiary);
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.catalog-modal__actions {
  padding: var(--space-4) var(--space-5) calc(var(--space-6) + var(--safe-bottom));
  display: flex;
  justify-content: flex-end;
}
</style>
