

/**
 * Composable con utilidades comunes para formateo y transformación de datos
 * Elimina duplicación de funciones helper en múltiples vistas
 */
export function useHelpers() {
  /**
   * Obtiene las iniciales de un nombre
   * @param {string} name - Nombre completo
   * @returns {string} Iniciales en mayúsculas (máximo 2 caracteres)
   */
  const getInitials = (name) => {
    if (!name) return 'U'
    const names = name.trim().split(/\s+/)
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  /**
   * Formatea una fecha a formato legible
   * @param {string|Date} dateString - Fecha a formatear
   * @param {Object} options - Opciones de Intl.DateTimeFormat
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A'
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', defaultOptions)
    } catch {
      return 'Fecha inválida'
    }
  }

  /**
   * Formatea una fecha y hora
   * @param {string|Date} dateString - Fecha a formatear
   * @returns {string} Fecha y hora formateadas
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  /**
   * Formatea tiempo relativo (hace X tiempo)
   * @param {string|Date} lastLogin - Última fecha de login
   * @returns {string} Tiempo relativo formateado
   */
  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Nunca'
    
    try {
      const date = new Date(lastLogin)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'Hace un momento'
      if (diffMins < 60) return `Hace ${diffMins} min`
      if (diffHours < 24) return `Hace ${diffHours} h`
      if (diffDays < 30) return `Hace ${diffDays} días`
      
      return formatDate(lastLogin)
    } catch {
      return 'Fecha inválida'
    }
  }

  /**
   * Trunca texto a una longitud máxima
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @returns {string} Texto truncado con ellipsis si aplica
   */
  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Formatea un número como porcentaje
   * @param {number} value - Valor a formatear (0-1)
   * @param {number} decimals - Decimales a mostrar
   * @returns {string} Porcentaje formateado
   */
  const formatPercentage = (value, decimals = 0) => {
    if (value === null || value === undefined) return '0%'
    const percentage = Math.round(value * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals)
    return `${percentage}%`
  }

  /**
   * Formatea un número con separadores de miles
   * @param {number} value - Número a formatear
   * @returns {string} Número formateado
   */
  const formatNumber = (value) => {
    if (value === null || value === undefined) return '0'
    return value.toLocaleString('es-ES')
  }

  /**
   * Capitaliza la primera letra de un string
   * @param {string} str - String a capitalizar
   * @returns {string} String capitalizado
   */
  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  /**
   * Convierte a formato kebab-case
   * @param {string} str - String a convertir
   * @returns {string} kebab-case
   */
  const toKebabCase = (str) => {
    if (!str) return ''
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  }

  return {
    // Formatters
    getInitials,
    formatDate,
    formatDateTime,
    formatLastLogin,
    truncateText,
    formatPercentage,
    formatNumber,
    capitalize,
    toKebabCase,
  }
}

/**
 * Versión con helpers computados para uso en templates
 * @param {Object} options - Opciones de configuración
 */
export function useFormatters(options = {}) {
  const helpers = useHelpers()
  
  // Configuración por defecto
  const config = {
    dateFormat: { year: 'numeric', month: 'short', day: 'numeric' },
    ...options
  }
  
  // Helpers con configuración aplicada
  const formatDate = (date) => helpers.formatDate(date, config.dateFormat)
  const formatDateTime = helpers.formatDateTime
  const formatLastLogin = helpers.formatLastLogin
  const formatNumber = helpers.formatNumber
  const formatPercentage = helpers.formatPercentage
  const truncateText = (text) => helpers.truncateText(text, config.maxLength || 50)
  
  return {
    ...helpers,
    formatDate,
    formatDateTime,
    formatLastLogin,
    formatNumber,
    formatPercentage,
    truncateText,
  }
}
