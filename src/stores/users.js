import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userService } from '@/services'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allUsers = computed(() => users.value)
  const totalUsers = computed(() => users.value.length)
  const activeUsers = computed(() => users.value.filter(u => u.isActive !== false).length)
  const adminUsers = computed(() => 
    users.value.filter(u => u.roles?.includes('ROLE_ADMIN')).length
  )
  const isEmpty = computed(() => users.value.length === 0)
  const hasError = computed(() => !!error.value)

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userService.getAll()
      
      users.value = extractItems(response)
      
      return users.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserById = (id) => {
    return users.value.find(u => u.id === id)
  }

  const createUser = async (userData) => {
    const response = await userService.create(userData)
    await fetchUsers() // Refresh list
    return response
  }

  const updateUser = async (id, userData) => {
    const response = await userService.update(id, userData)
    await fetchUsers() // Refresh list
    return response
  }

  const deleteUser = async (id) => {
    await userService.delete(id)
    await fetchUsers() // Refresh list
  }

  const setUsers = (newUsers) => {
    users.value = newUsers
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    users.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    users,
    loading,
    error,
    
    // Getters
    allUsers,
    totalUsers,
    activeUsers,
    adminUsers,
    isEmpty,
    hasError,
    
    // Actions
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    setUsers,
    clearError,
    reset,
  }
})
