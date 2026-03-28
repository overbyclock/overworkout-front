import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

/**
 * @typedef {Object} CrudOptions
 * @property {string} [entityName='elemento'] - Nombre de la entidad para mensajes
 * @property {boolean} [showNotifications=true] - Mostrar notificaciones Quasar
 * @property {Function} [onError] - Callback personalizado para errores
 */

/**
 * @typedef {Object} CrudState
 * @property {import('vue').Ref<Array>} items - Lista de elementos
 * @property {import('vue').Ref<boolean>} loading - Estado de carga
 * @property {import('vue').Ref<boolean>} saving - Estado de guardado
 * @property {import('vue').Ref<boolean>} deleting - Estado de eliminación
 * @property {import('vue').Ref<string|null>} error - Mensaje de error
 * @property {import('vue').Ref<boolean>} authError - Error de autenticación
 * @property {import('vue').ComputedRef<boolean>} isEmpty - Si la lista está vacía
 * @property {import('vue').ComputedRef<number>} count - Cantidad de elementos
 */

/**
 * @typedef {Object} CrudMethods
 * @property {Function} fetchAll - Cargar todos los elementos
 * @property {Function} create - Crear nuevo elemento
 * @property {Function} update - Actualizar elemento
 * @property {Function} remove - Eliminar elemento
 * @property {Function} getById - Obtener elemento por ID
 */

/**
 * Composable para operaciones CRUD genéricas con manejo de estado
 * 
 * @param {Object} service - Servicio con métodos getAll, getById, create, update, delete
 * @param {CrudOptions} [options={}] - Opciones de configuración
 * @returns {CrudState & CrudMethods} Estado y métodos CRUD
 * 
 * @example
 * const { items, loading, fetchAll, create } = useCrud(userService, { entityName: 'usuario' })
 * 
 * // Cargar datos
 * await fetchAll()
 * 
 * // Crear elemento
 * await create({ name: 'John' })
 */
export function useCrud(service, options = {}) {
  const $q = useQuasar()
  
  const {
    entityName = 'elemento',
    showNotifications = true,
    onError,
  } = options

  /** @type {import('vue').Ref<Array>} */
  const items = ref([])
  
  /** @type {import('vue').Ref<boolean>} */
  const loading = ref(false)
  
  /** @type {import('vue').Ref<boolean>} */
  const saving = ref(false)
  
  /** @type {import('vue').Ref<boolean>} */
  const deleting = ref(false)
  
  /** @type {import('vue').Ref<string|null>} */
  const error = ref(null)
  
  /** @type {import('vue').Ref<boolean>} */
  const authError = ref(false)

  /** @type {import('vue').ComputedRef<boolean>} */
  const isEmpty = computed(() => items.value.length === 0)
  
  /** @type {import('vue').ComputedRef<number>} */
  const count = computed(() => items.value.length)

  /**
   * Cargar todos los elementos
   * @param {Object} [params={}] - Parámetros de query
   * @returns {Promise<Array>} Lista de elementos
   */
  const fetchAll = async (params = {}) => {
    loading.value = true
    error.value = null
    authError.value = false
    
    try {
      const response = await service.getAll(params)
      items.value = extractItems(response)
      return items.value
    } catch (err) {
      handleError(err, 'Error al cargar datos')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear un nuevo elemento
   * @param {Object} data - Datos del elemento
   * @param {Object} [options={}] - Opciones de la operación
   * @param {boolean} [options.showNotification] - Mostrar notificación
   * @param {string} [options.successMessage] - Mensaje de éxito personalizado
   * @param {string} [options.errorMessage] - Mensaje de error personalizado
   * @param {boolean} [options.refresh=true] - Recargar lista después
   * @returns {Promise<Object>} Elemento creado
   */
  const create = async (data, options = {}) => {
    saving.value = true
    
    try {
      const result = await service.create(data)
      
      if (options.showNotification !== false && showNotifications) {
        $q.notify({
          type: 'positive',
          message: options.successMessage || `${entityName} creado correctamente`,
          position: 'top',
        })
      }
      
      if (options.refresh !== false) {
        await fetchAll()
      }
      
      return result
    } catch (err) {
      handleError(err, options.errorMessage || `Error al crear ${entityName.toLowerCase()}`)
      throw err
    } finally {
      saving.value = false
    }
  }

  /**
   * Actualizar un elemento existente
   * @param {string|number} id - ID del elemento
   * @param {Object} data - Datos actualizados
   * @param {Object} [options={}] - Opciones de la operación
   * @returns {Promise<Object>} Elemento actualizado
   */
  const update = async (id, data, options = {}) => {
    saving.value = true
    
    try {
      const result = await service.update(id, data)
      
      if (options.showNotification !== false && showNotifications) {
        $q.notify({
          type: 'positive',
          message: options.successMessage || `${entityName} actualizado correctamente`,
          position: 'top',
        })
      }
      
      if (options.refresh !== false) {
        await fetchAll()
      }
      
      return result
    } catch (err) {
      handleError(err, options.errorMessage || `Error al actualizar ${entityName.toLowerCase()}`)
      throw err
    } finally {
      saving.value = false
    }
  }

  /**
   * Eliminar un elemento
   * @param {string|number} id - ID del elemento
   * @param {Object} [options={}] - Opciones de la operación
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const remove = async (id, options = {}) => {
    deleting.value = true
    
    try {
      await service.delete(id)
      
      if (options.showNotification !== false && showNotifications) {
        $q.notify({
          type: 'positive',
          message: options.successMessage || `${entityName} eliminado correctamente`,
          position: 'top',
        })
      }
      
      if (options.refresh !== false) {
        await fetchAll()
      }
      
      return true
    } catch (err) {
      handleError(err, options.errorMessage || `Error al eliminar ${entityName.toLowerCase()}`)
      throw err
    } finally {
      deleting.value = false
    }
  }

  /**
   * Manejar errores de operaciones CRUD
   * @private
   * @param {Error} err - Error ocurrido
   * @param {string} defaultMessage - Mensaje por defecto
   */
  const handleError = (err, defaultMessage) => {
    console.error('CRUD Error:', err)
    
    if (err.response?.status === 401) {
      authError.value = true
      error.value = 'Sesión expirada'
      if (showNotifications) {
        $q.notify({
          type: 'negative',
          message: 'Sesión expirada. Por favor, inicia sesión de nuevo.',
          position: 'top',
          timeout: 5000,
        })
      }
    } else {
      const message = extractErrorMessage(err) || defaultMessage
      error.value = message
      
      if (showNotifications) {
        $q.notify({
          type: 'negative',
          message,
          position: 'top',
          timeout: 5000,
        })
      }
      
      if (onError) {
        onError(err, message)
      }
    }
  }

  /**
   * Obtener un elemento por ID
   * @param {string|number} id - ID del elemento
   * @returns {Promise<Object>} Elemento encontrado
   */
  const getById = async (id) => {
    try {
      return await service.getById(id)
    } catch (err) {
      handleError(err, 'Error al obtener datos')
      throw err
    }
  }

  return {
    // Estado
    items,
    loading,
    saving,
    deleting,
    error,
    authError,
    isEmpty,
    count,
    
    // Métodos
    fetchAll,
    create,
    update,
    remove,
    getById,
  }
}
