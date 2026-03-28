import { ref, computed } from 'vue'

/**
 * Composable para manejar paginación
 * @param {Object} options - Opciones de configuración
 */
export function usePagination(options = {}) {
  const {
    initialPage = 1,
    initialItemsPerPage = 10,
    itemsPerPageOptions = [10, 20, 30, 50],
  } = options

  const page = ref(initialPage)
  const itemsPerPage = ref(initialItemsPerPage)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))
  
  const from = computed(() => {
    if (total.value === 0) return 0
    return (page.value - 1) * itemsPerPage.value + 1
  })
  
  const to = computed(() => {
    return Math.min(page.value * itemsPerPage.value, total.value)
  })

  const canGoPrevious = computed(() => page.value > 1)
  const canGoNext = computed(() => page.value < totalPages.value)

  /**
   * Ir a una página específica
   */
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
    }
  }

  /**
   * Ir a la página anterior
   */
  const previous = () => {
    if (canGoPrevious.value) {
      page.value--
    }
  }

  /**
   * Ir a la página siguiente
   */
  const next = () => {
    if (canGoNext.value) {
      page.value++
    }
  }

  /**
   * Ir a la primera página
   */
  const first = () => {
    page.value = 1
  }

  /**
   * Ir a la última página
   */
  const last = () => {
    page.value = totalPages.value
  }

  /**
   * Cambiar el número de elementos por página
   */
  const setItemsPerPage = (value) => {
    itemsPerPage.value = value
    page.value = 1 // Resetear a la primera página
  }

  /**
   * Actualizar el total de elementos
   */
  const setTotal = (value) => {
    total.value = value
  }

  /**
   * Resetear la paginación
   */
  const reset = () => {
    page.value = initialPage
    itemsPerPage.value = initialItemsPerPage
    total.value = 0
  }

  /**
   * Obtener páginas visibles para mostrar en controles de paginación
   */
  const getVisiblePages = (maxVisible = 5) => {
    const pages = []
    let start = Math.max(1, page.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  /**
   * Paginar un array de elementos
   */
  const paginateItems = (items) => {
    const start = (page.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return items.slice(start, end)
  }

  return {
    // Estado
    page,
    itemsPerPage,
    total,
    itemsPerPageOptions,
    
    // Computed
    totalPages,
    from,
    to,
    canGoPrevious,
    canGoNext,
    
    // Métodos
    goToPage,
    previous,
    next,
    first,
    last,
    setItemsPerPage,
    setTotal,
    reset,
    getVisiblePages,
    paginateItems,
  }
}
