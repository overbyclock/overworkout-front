import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trainingService } from '@/services'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

export const useTrainingsStore = defineStore('trainings', () => {
  // State
  const trainings = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedTraining = ref(null)

  // Getters
  const allTrainings = computed(() => trainings.value)
  const totalTrainings = computed(() => trainings.value.length)
  const isEmpty = computed(() => trainings.value.length === 0)
  const hasError = computed(() => !!error.value)
  
  const trainingsByType = computed(() => {
    const grouped = {}
    trainings.value.forEach(t => {
      const type = t.type || 'general'
      if (!grouped[type]) grouped[type] = []
      grouped[type].push(t)
    })
    return grouped
  })

  const publicTrainings = computed(() => 
    trainings.value.filter(t => t.isPublic === true)
  )

  const privateTrainings = computed(() => 
    trainings.value.filter(t => t.isPublic === false)
  )

  // Actions
  const fetchTrainings = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await trainingService.getAll()
      
      trainings.value = extractItems(response)
      
      return trainings.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTrainingById = (id) => {
    return trainings.value.find(t => t.id === id)
  }

  const createTraining = async (trainingData) => {
    const response = await trainingService.create(trainingData)
    await fetchTrainings()
    return response
  }

  const updateTraining = async (id, trainingData) => {
    const response = await trainingService.update(id, trainingData)
    await fetchTrainings()
    return response
  }

  const deleteTraining = async (id) => {
    await trainingService.delete(id)
    await fetchTrainings()
  }

  const selectTraining = (training) => {
    selectedTraining.value = training
  }

  const clearSelection = () => {
    selectedTraining.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    trainings.value = []
    selectedTraining.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    trainings,
    loading,
    error,
    selectedTraining,
    
    // Getters
    allTrainings,
    totalTrainings,
    isEmpty,
    hasError,
    trainingsByType,
    publicTrainings,
    privateTrainings,
    
    // Actions
    fetchTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining,
    selectTraining,
    clearSelection,
    clearError,
    reset,
  }
})
