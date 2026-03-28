import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { exerciseService } from '@/services'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

export const useExercisesStore = defineStore('exercises', () => {
  // State
  const exercises = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedExercise = ref(null)

  // Getters
  const allExercises = computed(() => exercises.value)
  const totalExercises = computed(() => exercises.value.length)
  const isEmpty = computed(() => exercises.value.length === 0)
  const hasError = computed(() => !!error.value)
  
  const exercisesByCategory = computed(() => {
    const grouped = {}
    exercises.value.forEach(ex => {
      const category = ex.category || 'general'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(ex)
    })
    return grouped
  })

  const exercisesByMuscleGroup = computed(() => {
    const grouped = {}
    exercises.value.forEach(ex => {
      const muscle = ex.muscleGroup || ex.primaryMuscle || 'general'
      if (!grouped[muscle]) grouped[muscle] = []
      grouped[muscle].push(ex)
    })
    return grouped
  })

  // Actions
  const fetchExercises = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await exerciseService.getAll()
      
      exercises.value = extractItems(response)
      
      return exercises.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getExerciseById = (id) => {
    return exercises.value.find(e => e.id === id)
  }

  const createExercise = async (exerciseData) => {
    const response = await exerciseService.create(exerciseData)
    await fetchExercises()
    return response
  }

  const updateExercise = async (id, exerciseData) => {
    const response = await exerciseService.update(id, exerciseData)
    await fetchExercises()
    return response
  }

  const deleteExercise = async (id) => {
    await exerciseService.delete(id)
    await fetchExercises()
  }

  const selectExercise = (exercise) => {
    selectedExercise.value = exercise
  }

  const clearSelection = () => {
    selectedExercise.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    exercises.value = []
    selectedExercise.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    exercises,
    loading,
    error,
    selectedExercise,
    
    // Getters
    allExercises,
    totalExercises,
    isEmpty,
    hasError,
    exercisesByCategory,
    exercisesByMuscleGroup,
    
    // Actions
    fetchExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
    selectExercise,
    clearSelection,
    clearError,
    reset,
  }
})
