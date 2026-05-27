import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { levelService } from '@/services'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

export const useLevelsStore = defineStore('levels', () => {
  // State
  const levels = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedLevel = ref(null)

  // Getters
  const allLevels = computed(() => levels.value)
  const totalLevels = computed(() => levels.value.length)
  const isEmpty = computed(() => levels.value.length === 0)
  const hasError = computed(() => !!error.value)

  // Actions
  const fetchLevels = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await levelService.getAll()
      levels.value = extractItems(response)
      return levels.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getLevelById = (id) => {
    return levels.value.find((l) => l.id === id)
  }

  const createLevel = async (levelData) => {
    const response = await levelService.create(levelData)
    await fetchLevels()
    return response
  }

  const updateLevel = async (id, levelData) => {
    const response = await levelService.update(id, levelData)
    await fetchLevels()
    return response
  }

  const deleteLevel = async (id) => {
    await levelService.delete(id)
    await fetchLevels()
  }

  const selectLevel = (level) => {
    selectedLevel.value = level
  }

  const clearSelection = () => {
    selectedLevel.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    levels.value = []
    selectedLevel.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    levels,
    loading,
    error,
    selectedLevel,

    // Getters
    allLevels,
    totalLevels,
    isEmpty,
    hasError,

    // Actions
    fetchLevels,
    getLevelById,
    createLevel,
    updateLevel,
    deleteLevel,
    selectLevel,
    clearSelection,
    clearError,
    reset,
  }
})
