import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HorizontalCarousel from '../HorizontalCarousel.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('HorizontalCarousel', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renderiza el título y los slots de items', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { title: 'Mis programas', items: [{ id: 1, name: 'Test' }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item">{{ item.name }}</div></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.text()).toContain('Mis programas')
    expect(wrapper.find('.test-item').exists()).toBe(true)
  })

  it('no renderiza nada cuando items está vacío', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { title: 'Mis programas', items: [] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item">{{ item.name }}</div></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.find('.horizontal-carousel').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('oculta flechas e indicadores cuando hay un único item', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }], showArrows: true },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.findAll('.horizontal-carousel__arrow').length).toBe(0)
    expect(wrapper.findAll('.horizontal-carousel__dot').length).toBe(0)
    expect(wrapper.find('.test-item').exists()).toBe(true)
  })

  it('no renderiza el título cuando no se proporciona', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1, name: 'Test' }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item">{{ item.name }}</div></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.find('.horizontal-carousel__title').exists()).toBe(false)
  })

  it('renderiza el botón de acción cuando se proporcionan actionLabel y actionTo', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: {
        title: 'Entrenamientos',
        items: [{ id: 1 }],
        actionLabel: 'Ver todos',
        actionTo: '/trainings',
      },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    const action = wrapper.find('.horizontal-carousel__action')
    expect(action.exists()).toBe(true)
    expect(action.element.tagName).toBe('BUTTON')
    expect(action.text()).toContain('Ver todos')
  })

  it('navega al hacer clic en el botón de acción', async () => {
    const wrapper = mount(HorizontalCarousel, {
      props: {
        title: 'Entrenamientos',
        items: [{ id: 1 }],
        actionLabel: 'Ver todos',
        actionTo: { name: 'Trainings' },
      },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    await wrapper.find('.horizontal-carousel__action').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'Trainings' })
  })

  it('no renderiza el botón de acción si falta actionLabel', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { title: 'Entrenamientos', items: [{ id: 1 }], actionTo: '/trainings' },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.find('.horizontal-carousel__action').exists()).toBe(false)
  })

  it('renderiza un indicador de puntos con tantos puntos como items', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.findAll('.horizontal-carousel__dot').length).toBe(3)
  })

  it('utiliza itemKey como clave de renderizado', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ slug: 'a' }, { slug: 'b' }], itemKey: 'slug' },
      slots: {
        item: '<template #item="{ item }"><div class="test-item">{{ item.slug }}</div></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.findAll('.test-item').length).toBe(2)
    expect(wrapper.text()).toContain('a')
    expect(wrapper.text()).toContain('b')
  })

  it('no muestra flechas de navegación por defecto', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.find('.horizontal-carousel__arrow').exists()).toBe(false)
  })

  it('muestra flechas de navegación cuando showArrows es true', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }], showArrows: true },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    expect(wrapper.findAll('.horizontal-carousel__arrow').length).toBe(2)
  })

  it('marca el punto activo con aria-current', () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    const dots = wrapper.findAll('.horizontal-carousel__dot')
    expect(dots[0].attributes('aria-current')).toBe('true')
    expect(dots[1].attributes('aria-current')).toBeUndefined()
  })

  it('actualiza el punto activo al desplazarse', async () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" style="width:100px" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    const track = wrapper.find('.horizontal-carousel__track').element
    const slides = track.children
    Array.from(slides).forEach((slide, index) => {
      Object.defineProperty(slide, 'offsetLeft', { value: index * 100, writable: true })
      Object.defineProperty(slide, 'clientWidth', { value: 100, writable: true })
    })
    Object.defineProperty(track, 'scrollLeft', { value: 80, writable: true })
    Object.defineProperty(track, 'clientWidth', { value: 100 })

    await track.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const dots = wrapper.findAll('.horizontal-carousel__dot')
    expect(dots[1].classes()).toContain('horizontal-carousel__dot--active')
    expect(dots[1].attributes('aria-current')).toBe('true')
  })

  it('desplaza al item anterior/siguiente al hacer clic en las flechas', async () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }, { id: 3 }], showArrows: true },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" style="width:100px" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    const track = wrapper.find('.horizontal-carousel__track').element
    const scrollToMock = vi.fn()
    track.scrollTo = scrollToMock

    await wrapper.findAll('.horizontal-carousel__arrow')[1].trigger('click')

    expect(scrollToMock).toHaveBeenCalledTimes(1)
    expect(scrollToMock).toHaveBeenCalledWith({ left: expect.any(Number), behavior: 'smooth' })
  })

  it('emite page-change al cambiar de página', async () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }], showArrows: true },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    const track = wrapper.find('.horizontal-carousel__track').element
    track.scrollTo = vi.fn()

    await wrapper.findAll('.horizontal-carousel__arrow')[1].trigger('click')

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')[0]).toEqual([1])
  })
})
