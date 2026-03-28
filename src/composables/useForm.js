import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

/**
 * Composable para manejo de formularios
 * @param {Object} options - Opciones de configuración
 */
export function useForm(options = {}) {
  const $q = useQuasar()
  
  const {
    initialData = {},
    validators = {},
    onSubmit,
    successMessage = 'Guardado correctamente',
    errorMessage = 'Error al guardar',
  } = options

  const form = ref({ ...initialData })
  const errors = ref({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const isValid = computed(() => !hasErrors.value)

  /**
   * Validar un campo específico
   */
  const validateField = (fieldName, value) => {
    const validator = validators[fieldName]
    if (!validator) return null
    
    if (Array.isArray(validator)) {
      // Array de validadores
      for (const rule of validator) {
        const error = rule(value, form.value)
        if (error) return error
      }
      return null
    } else {
      // Validador simple
      return validator(value, form.value)
    }
  }

  /**
   * Validar todo el formulario
   */
  const validate = () => {
    errors.value = {}
    
    for (const [fieldName, validator] of Object.entries(validators)) {
      if (!validator) continue
      
      const value = form.value[fieldName]
      const error = validateField(fieldName, value)
      
      if (error) {
        errors.value[fieldName] = error
      }
    }
    
    return Object.keys(errors.value).length === 0
  }

  /**
   * Validar un campo individual
   */
  const validateSingleField = (fieldName) => {
    const value = form.value[fieldName]
    const error = validateField(fieldName, value)
    
    if (error) {
      errors.value[fieldName] = error
    } else {
      delete errors.value[fieldName]
    }
    
    return !error
  }

  /**
   * Resetear el formulario
   */
  const reset = (newData = null) => {
    form.value = { ...(newData || initialData) }
    errors.value = {}
    isDirty.value = false
  }

  /**
   * Establecer datos del formulario
   */
  const setData = (data) => {
    form.value = { ...data }
    isDirty.value = true
  }

  /**
   * Actualizar un campo
   */
  const setField = (fieldName, value) => {
    form.value[fieldName] = value
    isDirty.value = true
    
    // Validar el campo si ya tiene error
    if (errors.value[fieldName]) {
      validateSingleField(fieldName)
    }
  }

  /**
   * Obtener error de un campo
   */
  const getError = (fieldName) => errors.value[fieldName] || null

  /**
   * Verificar si un campo tiene error
   */
  const hasError = (fieldName) => !!errors.value[fieldName]

  /**
   * Submit del formulario
   */
  const submit = async (submitFn = null) => {
    if (!validate()) {
      $q.notify({
        type: 'warning',
        message: 'Por favor, corrige los errores del formulario',
        position: 'top',
      })
      return { success: false, errors: errors.value }
    }

    isSubmitting.value = true
    
    try {
      const fn = submitFn || onSubmit
      if (!fn) {
        throw new Error('No se proporcionó función de submit')
      }
      
      const result = await fn(form.value)
      
      $q.notify({
        type: 'positive',
        message: successMessage,
        position: 'top',
      })
      
      isDirty.value = false
      return { success: true, data: result }
    } catch (error) {
      const message = error.response?.data?.message || errorMessage
      
      $q.notify({
        type: 'negative',
        message,
        position: 'top',
        timeout: 5000,
      })
      
      return { success: false, error }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    // Estado
    form,
    errors,
    isSubmitting,
    isDirty,
    
    // Computed
    hasErrors,
    isValid,
    
    // Métodos
    validate,
    validateSingleField,
    reset,
    setData,
    setField,
    getError,
    hasError,
    submit,
  }
}

/**
 * Validadores comunes
 */
export const validators = {
  required: (message = 'Este campo es obligatorio') => (value) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    if (Array.isArray(value) && value.length === 0) {
      return message
    }
    return null
  },
  
  email: (message = 'Email no válido') => (value) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : message
  },
  
  minLength: (min, message) => (value) => {
    if (!value) return null
    const msg = message || `Mínimo ${min} caracteres`
    return String(value).length >= min ? null : msg
  },
  
  maxLength: (max, message) => (value) => {
    if (!value) return null
    const msg = message || `Máximo ${max} caracteres`
    return String(value).length <= max ? null : msg
  },
  
  min: (min, message) => (value) => {
    if (value === null || value === undefined) return null
    const msg = message || `Mínimo ${min}`
    return Number(value) >= min ? null : msg
  },
  
  max: (max, message) => (value) => {
    if (value === null || value === undefined) return null
    const msg = message || `Máximo ${max}`
    return Number(value) <= max ? null : msg
  },
  
  pattern: (regex, message = 'Formato no válido') => (value) => {
    if (!value) return null
    return regex.test(value) ? null : message
  },
  
  match: (fieldToMatch, message = 'Los campos no coinciden') => (value, form) => {
    return value === form[fieldToMatch] ? null : message
  },
}
