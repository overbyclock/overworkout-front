import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { favoritesService } from '@/services/favorites'
import { extractErrorMessage } from '@/utils/api-helpers'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const trainingFavorites = ref([])
  const programFavorites = ref([])
  const isLoading = ref(false)
  const isToggling = ref(false)
  const error = ref(null)

  // Getters
  const trainingFavoriteIds = computed(() => trainingFavorites.value.map((fav) => fav.training.id))

  const programFavoriteIds = computed(() =>
    programFavorites.value.map((fav) => fav.trainingProgram.id),
  )

  // Helpers
  const findTrainingFavorite = (trainingId) =>
    trainingFavorites.value.find((fav) => fav.training.id === trainingId)

  const findProgramFavorite = (programId) =>
    programFavorites.value.find((fav) => fav.trainingProgram.id === programId)

  // Actions
  const loadFavorites = async () => {
    error.value = null
    isLoading.value = true

    try {
      const data = await favoritesService.getFavorites()
      trainingFavorites.value = data.trainings || []
      programFavorites.value = data.programs || []
    } catch (err) {
      error.value = extractErrorMessage(err) || 'Error al cargar favoritos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const toggleTrainingFavorite = async (training) => {
    if (isToggling.value) return

    error.value = null
    const existing = findTrainingFavorite(training.id)
    isToggling.value = true

    try {
      if (existing) {
        await favoritesService.removeTrainingFavorite(existing.id)
        trainingFavorites.value = trainingFavorites.value.filter((fav) => fav.id !== existing.id)
      } else {
        const newFavorite = await favoritesService.addTrainingFavorite(training.id)
        trainingFavorites.value.unshift(newFavorite.favorite)
      }
    } catch (err) {
      error.value = extractErrorMessage(err) || 'Error al actualizar favorito'
      throw err
    } finally {
      isToggling.value = false
    }
  }

  const toggleProgramFavorite = async (program) => {
    if (isToggling.value) return

    error.value = null
    const existing = findProgramFavorite(program.id)
    isToggling.value = true

    try {
      if (existing) {
        await favoritesService.removeProgramFavorite(existing.id)
        programFavorites.value = programFavorites.value.filter((fav) => fav.id !== existing.id)
      } else {
        const newFavorite = await favoritesService.addProgramFavorite(program.id)
        programFavorites.value.unshift(newFavorite.favorite)
      }
    } catch (err) {
      error.value = extractErrorMessage(err) || 'Error al actualizar favorito'
      throw err
    } finally {
      isToggling.value = false
    }
  }

  const isTrainingFavorite = (trainingId) => trainingFavoriteIds.value.includes(trainingId)

  const isProgramFavorite = (programId) => programFavoriteIds.value.includes(programId)

  const reset = () => {
    trainingFavorites.value = []
    programFavorites.value = []
    isLoading.value = false
    isToggling.value = false
    error.value = null
  }

  return {
    // State
    trainingFavorites,
    programFavorites,
    isLoading,
    isToggling,
    error,

    // Getters
    trainingFavoriteIds,
    programFavoriteIds,

    // Actions
    loadFavorites,
    toggleTrainingFavorite,
    toggleProgramFavorite,
    isTrainingFavorite,
    isProgramFavorite,
    reset,
  }
})
