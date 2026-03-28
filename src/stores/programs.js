import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { programService } from '@/services'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

export const useProgramsStore = defineStore('programs', () => {
  // State
  const programs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedProgram = ref(null)

  // Getters
  const allPrograms = computed(() => programs.value)
  const totalPrograms = computed(() => programs.value.length)
  const isEmpty = computed(() => programs.value.length === 0)
  const hasError = computed(() => !!error.value)
  
  const activePrograms = computed(() => 
    programs.value.filter(p => p.isActive !== false)
  )
  
  const programsByDiscipline = computed(() => {
    const grouped = {}
    programs.value.forEach(p => {
      const discipline = p.discipline || 'general'
      if (!grouped[discipline]) grouped[discipline] = []
      grouped[discipline].push(p)
    })
    return grouped
  })

  const publicPrograms = computed(() => 
    programs.value.filter(p => p.isPublic === true)
  )

  // Actions
  const fetchPrograms = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await programService.getAll()
      programs.value = extractItems(response)
      return programs.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getProgramById = (id) => {
    return programs.value.find(p => p.id === id)
  }

  const createProgram = async (programData) => {
    const response = await programService.create(programData)
    await fetchPrograms()
    return response
  }

  const updateProgram = async (id, programData) => {
    const response = await programService.update(id, programData)
    await fetchPrograms()
    return response
  }

  const deleteProgram = async (id) => {
    await programService.delete(id)
    await fetchPrograms()
  }

  const selectProgram = (program) => {
    selectedProgram.value = program
  }

  const clearSelection = () => {
    selectedProgram.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    programs.value = []
    selectedProgram.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    programs,
    loading,
    error,
    selectedProgram,
    
    // Getters
    allPrograms,
    totalPrograms,
    isEmpty,
    hasError,
    activePrograms,
    programsByDiscipline,
    publicPrograms,
    
    // Actions
    fetchPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    selectProgram,
    clearSelection,
    clearError,
    reset,
  }
})
