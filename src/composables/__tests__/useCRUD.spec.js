import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCrud } from '../useCrud'

// Mock Quasar
const mockNotify = vi.fn()
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: mockNotify,
  }),
}))

describe('useCrud', () => {
  let mockService

  beforeEach(() => {
    vi.clearAllMocks()
    mockService = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  })

  describe('Estado inicial', () => {
    it('inicializa con valores por defecto', () => {
      const crud = useCrud(mockService)

      expect(crud.items.value).toEqual([])
      expect(crud.loading.value).toBe(false)
      expect(crud.saving.value).toBe(false)
      expect(crud.deleting.value).toBe(false)
      expect(crud.error.value).toBeNull()
      expect(crud.authError.value).toBe(false)
      expect(crud.isEmpty.value).toBe(true)
      expect(crud.count.value).toBe(0)
    })
  })

  describe('fetchAll', () => {
    it('carga elementos correctamente', async () => {
      const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]
      mockService.getAll.mockResolvedValue(mockData)

      const crud = useCrud(mockService)
      const result = await crud.fetchAll()

      expect(mockService.getAll).toHaveBeenCalledWith({})
      expect(crud.items.value).toEqual(mockData)
      expect(result).toEqual(mockData)
      expect(crud.loading.value).toBe(false)
      expect(crud.error.value).toBeNull()
    })

    it('maneja respuesta API Platform (hydra:member)', async () => {
      const mockData = {
        '@context': '/api/contexts/Item',
        'hydra:member': [{ id: 1, name: 'Item 1' }],
        'hydra:totalItems': 1,
      }
      mockService.getAll.mockResolvedValue(mockData)

      const crud = useCrud(mockService)
      await crud.fetchAll()

      expect(crud.items.value).toEqual([{ id: 1, name: 'Item 1' }])
    })

    it('pasa parámetros al servicio', async () => {
      mockService.getAll.mockResolvedValue([])

      const crud = useCrud(mockService)
      await crud.fetchAll({ page: 1, limit: 10 })

      expect(mockService.getAll).toHaveBeenCalledWith({ page: 1, limit: 10 })
    })

    it('maneja errores correctamente', async () => {
      const error = new Error('Network error')
      mockService.getAll.mockRejectedValue(error)

      const crud = useCrud(mockService)
      
      await expect(crud.fetchAll()).rejects.toThrow('Network error')
      expect(crud.loading.value).toBe(false)
      expect(crud.error.value).toBeTruthy()
    })

    it('detecta error 401', async () => {
      const error = { response: { status: 401 } }
      mockService.getAll.mockRejectedValue(error)

      const crud = useCrud(mockService)
      
      await expect(crud.fetchAll()).rejects.toEqual(error)
      expect(crud.authError.value).toBe(true)
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: expect.stringContaining('Sesión expirada'),
      }))
    })
  })

  describe('create', () => {
    it('crea elemento y muestra notificación', async () => {
      const newItem = { id: 3, name: 'New Item' }
      mockService.create.mockResolvedValue(newItem)
      mockService.getAll.mockResolvedValue([newItem])

      const crud = useCrud(mockService, { entityName: 'usuario' })
      const result = await crud.create({ name: 'New Item' })

      expect(mockService.create).toHaveBeenCalledWith({ name: 'New Item' })
      expect(result).toEqual(newItem)
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        type: 'positive',
        message: 'usuario creado correctamente',
      }))
    })

    it('no muestra notificación si showNotification es false', async () => {
      mockService.create.mockResolvedValue({ id: 1 })
      mockService.getAll.mockResolvedValue([{ id: 1 }])

      const crud = useCrud(mockService)
      await crud.create({ name: 'Test' }, { showNotification: false })

      const positiveNotifications = mockNotify.mock.calls.filter(
        call => call[0].type === 'positive'
      )
      expect(positiveNotifications).toHaveLength(0)
    })

    it('no recarga lista si refresh es false', async () => {
      mockService.create.mockResolvedValue({ id: 1 })

      const crud = useCrud(mockService)
      await crud.create({ name: 'Test' }, { refresh: false })

      expect(mockService.getAll).not.toHaveBeenCalled()
    })

    it('maneja error al crear', async () => {
      const error = new Error('Validation failed')
      mockService.create.mockRejectedValue(error)

      const crud = useCrud(mockService, { entityName: 'producto' })
      
      await expect(crud.create({ name: 'Test' })).rejects.toThrow('Validation failed')
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
      }))
    })
  })

  describe('update', () => {
    it('actualiza elemento correctamente', async () => {
      const updatedItem = { id: 1, name: 'Updated' }
      mockService.update.mockResolvedValue(updatedItem)
      mockService.getAll.mockResolvedValue([updatedItem])

      const crud = useCrud(mockService, { entityName: 'ejercicio' })
      const result = await crud.update(1, { name: 'Updated' })

      expect(mockService.update).toHaveBeenCalledWith(1, { name: 'Updated' })
      expect(result).toEqual(updatedItem)
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        message: 'ejercicio actualizado correctamente',
      }))
    })

    it('acepta mensaje personalizado', async () => {
      mockService.update.mockResolvedValue({ id: 1 })
      mockService.getAll.mockResolvedValue([{ id: 1 }])

      const crud = useCrud(mockService)
      await crud.update(1, { name: 'Test' }, {
        successMessage: 'Guardado exitosamente',
      })

      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Guardado exitosamente',
      }))
    })
  })

  describe('remove', () => {
    it('elimina elemento correctamente', async () => {
      mockService.delete.mockResolvedValue()
      mockService.getAll.mockResolvedValue([])

      const crud = useCrud(mockService, { entityName: 'usuario' })
      const result = await crud.remove(1)

      expect(mockService.delete).toHaveBeenCalledWith(1)
      expect(result).toBe(true)
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        message: 'usuario eliminado correctamente',
      }))
    })

    it('maneja error al eliminar', async () => {
      const error = new Error('Cannot delete')
      mockService.delete.mockRejectedValue(error)

      const crud = useCrud(mockService, { entityName: 'item' })
      
      await expect(crud.remove(1)).rejects.toThrow('Cannot delete')
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
      }))
    })
  })

  describe('getById', () => {
    it('obtiene elemento por ID', async () => {
      const item = { id: 1, name: 'Test' }
      mockService.getById.mockResolvedValue(item)

      const crud = useCrud(mockService)
      const result = await crud.getById(1)

      expect(mockService.getById).toHaveBeenCalledWith(1)
      expect(result).toEqual(item)
    })

    it('maneja error al obtener', async () => {
      mockService.getById.mockRejectedValue(new Error('Not found'))

      const crud = useCrud(mockService)
      
      await expect(crud.getById(999)).rejects.toThrow('Not found')
    })
  })

  describe('Computed properties', () => {
    it('isEmpty es true cuando no hay items', () => {
      const crud = useCrud(mockService)
      expect(crud.isEmpty.value).toBe(true)
    })

    it('isEmpty es false cuando hay items', async () => {
      mockService.getAll.mockResolvedValue([{ id: 1 }])

      const crud = useCrud(mockService)
      await crud.fetchAll()

      expect(crud.isEmpty.value).toBe(false)
    })

    it('count refleja cantidad de items', async () => {
      mockService.getAll.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])

      const crud = useCrud(mockService)
      await crud.fetchAll()

      expect(crud.count.value).toBe(3)
    })
  })

  describe('Opciones globales', () => {
    it('deshabilita notificaciones globalmente', async () => {
      mockService.create.mockResolvedValue({ id: 1 })

      const crud = useCrud(mockService, { showNotifications: false })
      await crud.create({ name: 'Test' })

      const positiveNotifications = mockNotify.mock.calls.filter(
        call => call[0].type === 'positive'
      )
      expect(positiveNotifications).toHaveLength(0)
    })

    it('llama callback onError cuando se proporciona', async () => {
      const onError = vi.fn()
      const error = new Error('Custom error')
      mockService.getAll.mockRejectedValue(error)

      const crud = useCrud(mockService, { onError })
      
      try {
        await crud.fetchAll()
      } catch {
        // Expected error
      }

      expect(onError).toHaveBeenCalledWith(error, expect.any(String))
    })
  })
})
