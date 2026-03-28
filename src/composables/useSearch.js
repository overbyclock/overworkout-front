import { ref, computed, watch } from 'vue'

/**
 * Composable para búsqueda con debounce
 * @param {Object} options - Opciones de configuración
 */
export function useSearch(options = {}) {
  const {
    debounceMs = 300,
    minLength = 0,
    fields = [], // Campos a buscar si se filtra localmente
  } = options

  const query = ref('')
  const debouncedQuery = ref('')
  let debounceTimeout = null

  const isSearching = computed(() => query.value.length >= minLength)
  const hasQuery = computed(() => query.value.trim().length > 0)

  /**
   * Debounce del query
   */
  watch(query, (newValue) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      debouncedQuery.value = newValue.trim().toLowerCase()
    }, debounceMs)
  })

  /**
   * Limpiar la búsqueda
   */
  const clear = () => {
    query.value = ''
    debouncedQuery.value = ''
  }

  /**
   * Establecer el query
   */
  const setQuery = (value) => {
    query.value = value
  }

  /**
   * Filtrar items localmente
   */
  const filterItems = (items) => {
    if (!debouncedQuery.value) return items
    
    const searchFields = fields.length > 0 ? fields : null
    
    return items.filter(item => {
      if (searchFields) {
        // Buscar solo en campos específicos
        return searchFields.some(field => {
          const value = getNestedValue(item, field)
          return String(value).toLowerCase().includes(debouncedQuery.value)
        })
      } else {
        // Buscar en todos los campos string
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(debouncedQuery.value)
          }
          return false
        })
      }
    })
  }

  /**
   * Obtener valor anidado de un objeto por path (ej: 'user.name')
   */
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
  }

  /**
   * Resaltar coincidencias en texto
   */
  const highlightMatch = (text, highlightClass = 'highlight') => {
    if (!debouncedQuery.value || !text) return text
    
    const regex = new RegExp(`(${debouncedQuery.value})`, 'gi')
    return String(text).replace(regex, `<span class="${highlightClass}">$1</span>`)
  }

  return {
    // Estado
    query,
    debouncedQuery,
    
    // Computed
    isSearching,
    hasQuery,
    
    // Métodos
    clear,
    setQuery,
    filterItems,
    highlightMatch,
  }
}
