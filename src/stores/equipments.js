import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { equipmentService, exerciseService } from '@/services'

export const useEquipmentsStore = defineStore('equipments', () => {
  // State
  const equipments = ref([])
  const exercises = ref([]) // Para calcular equipos en uso
  const loading = ref(false)
  const error = ref(null)
  const selectedEquipment = ref(null)

  // Getters
  const allEquipments = computed(() => equipments.value)
  const totalEquipments = computed(() => equipments.value.length)
  const isEmpty = computed(() => equipments.value.length === 0)
  const hasError = computed(() => !!error.value)
  
  const equipmentsByCategory = computed(() => {
    const grouped = {}
    equipments.value.forEach(eq => {
      const category = eq.category || 'general'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(eq)
    })
    return grouped
  })

  const usedInExercisesCount = computed(() => {
    const usedEquipmentIds = new Set()
    exercises.value.forEach(ex => {
      if (ex.equipment?.id) {
        usedEquipmentIds.add(ex.equipment.id)
      }
    })
    return usedEquipmentIds.size
  })

  const unusedEquipments = computed(() => {
    const usedIds = new Set()
    exercises.value.forEach(ex => {
      if (ex.equipment?.id) usedIds.add(ex.equipment.id)
    })
    return equipments.value.filter(eq => !usedIds.has(eq.id))
  })

  // Actions
  const fetchEquipments = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await equipmentService.getAll()
      
      if (response['hydra:member']) {
        equipments.value = response['hydra:member']
      } else if (response.member) {
        equipments.value = response.member
      } else if (Array.isArray(response)) {
        equipments.value = response
      } else {
        equipments.value = []
      }
      
      return equipments.value
    } catch (err) {
      error.value = err.message || 'Error al cargar equipamiento'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchWithExercises = async () => {
    loading.value = true
    error.value = null
    
    try {
      const [equipResponse, exerciseResponse] = await Promise.all([
        equipmentService.getAll(),
        exerciseService.getAll()
      ])
      
      // Parse equipments
      if (equipResponse['hydra:member']) {
        equipments.value = equipResponse['hydra:member']
      } else if (equipResponse.member) {
        equipments.value = equipResponse.member
      } else if (Array.isArray(equipResponse)) {
        equipments.value = equipResponse
      } else {
        equipments.value = []
      }
      
      // Parse exercises
      if (exerciseResponse['hydra:member']) {
        exercises.value = exerciseResponse['hydra:member']
      } else if (exerciseResponse.member) {
        exercises.value = exerciseResponse.member
      } else if (Array.isArray(exerciseResponse)) {
        exercises.value = exerciseResponse
      } else {
        exercises.value = []
      }
      
      return { equipments: equipments.value, exercises: exercises.value }
    } catch (err) {
      error.value = err.message || 'Error al cargar datos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getEquipmentById = (id) => {
    return equipments.value.find(e => e.id === id)
  }

  const createEquipment = async (equipmentData) => {
    const response = await equipmentService.create(equipmentData)
    await fetchEquipments()
    return response
  }

  const updateEquipment = async (id, equipmentData) => {
    const response = await equipmentService.update(id, equipmentData)
    await fetchEquipments()
    return response
  }

  const deleteEquipment = async (id) => {
    await equipmentService.delete(id)
    await fetchEquipments()
  }

  const selectEquipment = (equipment) => {
    selectedEquipment.value = equipment
  }

  const clearSelection = () => {
    selectedEquipment.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    equipments.value = []
    exercises.value = []
    selectedEquipment.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    equipments,
    exercises,
    loading,
    error,
    selectedEquipment,
    
    // Getters
    allEquipments,
    totalEquipments,
    isEmpty,
    hasError,
    equipmentsByCategory,
    usedInExercisesCount,
    unusedEquipments,
    
    // Actions
    fetchEquipments,
    fetchWithExercises,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    selectEquipment,
    clearSelection,
    clearError,
    reset,
  }
})
