import { ref, computed, watch } from 'vue'
import { usePagination } from './usePagination'

/**
 * Composable para manejar filtros de listado con búsqueda, categorías y ordenamiento
 * @param {Object} options - Opciones de configuración
 * @param {Array} options.items - Items a filtrar (ref o array)
 * @param {Object} options.filters - Configuración de filtros
 * @param {Function} options.searchFn - Función personalizada de búsqueda
 * @param {String} options.sortBy - Campo de ordenamiento inicial
 * @param {String} options.sortOrder - 'asc' o 'desc'
 */
export function useFilters(options = {}) {
  const {
    items = [],
    filters = {},
    searchFn = null,
    sortBy: initialSortBy = '',
    sortOrder: initialSortOrder = 'asc',
  } = options

  // Estado de búsqueda
  const searchQuery = ref('')
  
  // Estado de filtros dinámicos
  const activeFilters = ref({})
  
  // Estado de ordenamiento
  const sortBy = ref(initialSortBy)
  const sortOrder = ref(initialSortOrder)

  // Inicializar filtros con valores por defecto
  const initializeFilters = () => {
    Object.keys(filters).forEach(key => {
      activeFilters.value[key] = filters[key].defaultValue || 'all'
    })
  }
  
  initializeFilters()

  /**
   * Verificar si hay filtros activos
   */
  const hasActiveFilters = computed(() => {
    const hasSearch = searchQuery.value.trim().length > 0
    const hasCustomFilters = Object.values(activeFilters.value).some(
      value => value !== 'all' && value !== '' && value !== null && value !== undefined
    )
    return hasSearch || hasCustomFilters
  })

  /**
   * Items filtrados y ordenados
   */
  const filteredItems = computed(() => {
    let result = Array.isArray(items) ? [...items] : [...(items.value || [])]

    // Aplicar búsqueda
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      
      if (searchFn) {
        // Usar función de búsqueda personalizada
        result = result.filter(item => searchFn(item, query))
      } else {
        // Búsqueda por defecto en campos comunes
        result = result.filter(item => {
          const searchFields = [
            item.name,
            item.title,
            item.description,
            item.email,
            item.nick,
          ].filter(Boolean)
          
          return searchFields.some(field => 
            String(field).toLowerCase().includes(query)
          )
        })
      }
    }

    // Aplicar filtros personalizados
    Object.keys(activeFilters.value).forEach(key => {
      const filterConfig = filters[key]
      const filterValue = activeFilters.value[key]
      
      if (filterValue === 'all' || filterValue === '' || filterValue === null) {
        return // Saltar filtros en estado "todos"
      }

      if (filterConfig?.filterFn) {
        // Usar función de filtro personalizada
        result = result.filter(item => filterConfig.filterFn(item, filterValue))
      } else if (filterConfig?.field) {
        // Filtrar por campo directo
        const field = filterConfig.field
        result = result.filter(item => {
          const itemValue = getNestedValue(item, field)
          
          if (Array.isArray(itemValue)) {
            return itemValue.includes(filterValue)
          }
          return itemValue === filterValue
        })
      }
    })

    // Aplicar ordenamiento
    if (sortBy.value) {
      result.sort((a, b) => {
        let aVal = getNestedValue(a, sortBy.value)
        let bVal = getNestedValue(b, sortBy.value)

        // Manejar valores nulos/undefined
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return sortOrder.value === 'asc' ? 1 : -1
        if (bVal == null) return sortOrder.value === 'asc' ? -1 : 1

        // Ordenar strings (case insensitive)
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }

        // Comparar
        if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  })

  /**
   * Contador de items filtrados
   */
  const filteredCount = computed(() => filteredItems.value.length)

  /**
   * Establecer valor de un filtro
   */
  const setFilter = (key, value) => {
    activeFilters.value[key] = value
  }

  /**
   * Obtener valor de un filtro
   */
  const getFilter = (key) => activeFilters.value[key]

  /**
   * Limpiar un filtro específico
   */
  const clearFilter = (key) => {
    const defaultValue = filters[key]?.defaultValue || 'all'
    activeFilters.value[key] = defaultValue
  }

  /**
   * Limpiar búsqueda
   */
  const clearSearch = () => {
    searchQuery.value = ''
  }

  /**
   * Limpiar todos los filtros
   */
  const clearAllFilters = () => {
    searchQuery.value = ''
    initializeFilters()
  }

  /**
   * Establecer campo de ordenamiento
   */
  const setSortBy = (field) => {
    if (sortBy.value === field) {
      // Toggle dirección si ya está ordenado por este campo
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  /**
   * Obtener valor anidado de un objeto
   */
  const getNestedValue = (obj, path) => {
    if (!path) return obj
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
  }

  /**
   * Configuración de filtros para casos comunes
   */
  const createStatusFilter = (options = {}) => ({
    field: 'status',
    defaultValue: 'all',
    options: [
      { label: 'Todos', value: 'all' },
      { label: 'Activos', value: 'active' },
      { label: 'Inactivos', value: 'inactive' },
    ],
    ...options,
  })

  const createDisciplineFilter = (options = {}) => ({
    field: 'discipline',
    defaultValue: 'all',
    options: [
      { label: 'Todos', value: 'all' },
      { label: 'Calistenia', value: 'calisthenics' },
      { label: 'CrossFit', value: 'crossfit' },
      { label: 'Fitness', value: 'fitness' },
    ],
    ...options,
  })

  const createLevelFilter = (options = {}) => ({
    field: 'level',
    defaultValue: 'all',
    options: [
      { label: 'Todos', value: 'all' },
      { label: 'Principiante', value: 'beginner' },
      { label: 'Intermedio', value: 'intermediate' },
      { label: 'Experto', value: 'expert' },
    ],
    ...options,
  })

  return {
    // Estado
    searchQuery,
    activeFilters,
    sortBy,
    sortOrder,
    
    // Computed
    filteredItems,
    filteredCount,
    hasActiveFilters,
    
    // Métodos
    setFilter,
    getFilter,
    clearFilter,
    clearSearch,
    clearAllFilters,
    setSortBy,
    
    // Helpers
    createStatusFilter,
    createDisciplineFilter,
    createLevelFilter,
  }
}

/**
 * Versión simplificada solo con búsqueda
 */
export function useSearchFilter(items, options = {}) {
  const { searchFields = ['name', 'description'] } = options
  
  const searchQuery = ref('')
  
  const filteredItems = computed(() => {
    let result = Array.isArray(items) ? [...items] : [...(items.value || [])]
    
    if (!searchQuery.value.trim()) return result
    
    const query = searchQuery.value.toLowerCase().trim()
    
    return result.filter(item => 
      searchFields.some(field => {
        const value = getNestedValue(item, field)
        return String(value).toLowerCase().includes(query)
      })
    )
  })
  
  const getNestedValue = (obj, path) => {
    if (!path) return obj
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
  }
  
  return {
    searchQuery,
    filteredItems,
    clearSearch: () => { searchQuery.value = '' },
  }
}

/**
 * Versión con paginación incluida
 */
export function useFilteredPagination(items, options = {}) {
  const filters = useFilters({ items, ...options })
  
  const pagination = usePagination({
    initialPage: options.initialPage || 1,
    initialItemsPerPage: options.initialItemsPerPage || 10,
  })

  // Sincronizar total con items filtrados
  const paginatedItems = computed(() => {
    const filtered = filters.filteredItems.value
    pagination.setTotal(filtered.length)
    return pagination.paginateItems(filtered)
  })

  // Resetear página cuando cambian filtros
  watch(filters.searchQuery, () => { pagination.first() })
  watch(filters.activeFilters, () => { pagination.first() }, { deep: true })

  return {
    ...filters,
    ...pagination,
    paginatedItems,
  }
}
