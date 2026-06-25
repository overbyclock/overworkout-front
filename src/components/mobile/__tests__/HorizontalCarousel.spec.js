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

  it('renderiza el enlace de acción con router-link cuando se proporciona actionTo', () => {
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

  it('actualiza el punto activo al desplazarse', async () => {
    const wrapper = mount(HorizontalCarousel, {
      props: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      slots: {
        item: '<template #item="{ item }"><div class="test-item" style="width:100px" /></template>',
      },
      global: { stubs: ['router-link', 'q-icon'] },
    })

    const track = wrapper.find('.horizontal-carousel__track').element
    const slide = track.firstElementChild
    Object.defineProperty(slide, 'clientWidth', { value: 100 })
    Object.defineProperty(track, 'scrollLeft', { value: 80, writable: true })
    Object.defineProperty(track, 'clientWidth', { value: 100 })
    Object.defineProperty(track, 'scrollWidth', { value: 300 })

    await track.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const dots = wrapper.findAll('.horizontal-carousel__dot')
    expect(dots[1].classes()).toContain('horizontal-carousel__dot--active')
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

    expect(scrollToMock).toHaveBeenCalled()
  })
})
