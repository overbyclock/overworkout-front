/**
 * Utilidades para parsear respuestas de API Platform
 */

/**
 * Extrae el array de elementos de una respuesta API Platform
 * Maneja diferentes formatos: hydra:member, member, o array directo
 * @param {Object|Array} response - Respuesta de la API
 * @returns {Array} Array de elementos
 */
export function extractItems(response) {
  if (!response) return []
  
  if (response['hydra:member']) {
    return response['hydra:member']
  }
  
  if (response.member) {
    return response.member
  }
  
  if (Array.isArray(response)) {
    return response
  }
  
  return []
}

/**
 * Extrae el total de elementos de una respuesta API Platform
 * @param {Object} response - Respuesta de la API
 * @returns {number} Total de elementos
 */
export function extractTotalItems(response) {
  if (!response) return 0
  
  if (response['hydra:totalItems']) {
    return response['hydra:totalItems']
  }
  
  if (response.totalItems !== undefined) {
    return response.totalItems
  }
  
  if (Array.isArray(response)) {
    return response.length
  }
  
  return 0
}

/**
 * Extrae el mensaje de error de una respuesta API Platform
 * @param {Object} error - Error de la API
 * @returns {string} Mensaje de error legible
 */
export function extractErrorMessage(error) {
  if (!error) return 'Error desconocido'
  
  // Si es un string, devolverlo directamente
  if (typeof error === 'string') return error
  
  // Si tiene hydra:description (API Platform)
  if (error['hydra:description']) {
    return error['hydra:description']
  }
  
  // Si tiene message
  if (error.message) {
    return error.message
  }
  
  // Si tiene detail
  if (error.detail) {
    return error.detail
  }
  
  // Si tiene response.data
  if (error.response?.data) {
    const data = error.response.data
    if (data['hydra:description']) return data['hydra:description']
    if (data.message) return data.message
    if (data.detail) return data.detail
  }
  
  return 'Error en la operación'
}

/**
 * Construye parámetros de query string para API Platform
 * @param {Object} params - Parámetros a convertir
 * @returns {string} Query string
 */
export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Parsea una URL de API Platform para extraer el ID
 * @param {string} iri - IRI de API Platform (ej: "/api/exercises/123")
 * @returns {string|null} ID extraído
 */
export function extractIdFromIri(iri) {
  if (!iri) return null
  
  const parts = iri.split('/')
  return parts[parts.length - 1] || null
}
