import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContentCard from '../ContentCard.vue'

/**
 * Tests para el componente ContentCard
 */
describe('ContentCard', () => {
  const mountWithQuasarStubs = (props = {}) =>
    mount(ContentCard, {
      props,
      global: {
        stubs: {
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
        },
      },
    })

  it('renderiza el título, descripción, icono e insignia', () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Fuerza básica',
      description: 'Entrenamiento introductorio',
      icon: 'fitness_center',
      badge: 'Entreno',
      level: 'Principiante',
      footer: '25% completado',
    })

    expect(wrapper.text()).toContain('Fuerza básica')
    expect(wrapper.text()).toContain('Entrenamiento introductorio')
    expect(wrapper.text()).toContain('Entreno')
    expect(wrapper.text()).toContain('Principiante')
    expect(wrapper.text()).toContain('25% completado')
    expect(wrapper.find('[data-name="fitness_center"]').exists()).toBe(true)
  })

  it('aplica la clase de variante correspondiente', () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Test',
      variant: 'primary',
    })

    expect(wrapper.find('.content-card--primary').exists()).toBe(true)
  })

  it('emite click al pulsar la tarjeta', async () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Test',
      description: 'Desc',
    })

    await wrapper.find('[data-testid="content-card"]').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renderiza el botón de favorito solo cuando showFavorite es true', () => {
    const withoutFavorite = mountWithQuasarStubs({ title: 'Test' })
    const withFavorite = mountWithQuasarStubs({ title: 'Test', showFavorite: true })

    expect(withoutFavorite.find('[data-testid="favorite-button"]').exists()).toBe(false)
    expect(withFavorite.find('[data-testid="favorite-button"]').exists()).toBe(true)
  })

  it('emite toggle-favorite al pulsar el botón de favorito sin propagar click a la tarjeta', async () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Test',
      showFavorite: true,
    })

    await wrapper.find('[data-testid="favorite-button"]').trigger('click')
    expect(wrapper.emitted('toggle-favorite')).toHaveLength(1)
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('muestra el icono de favorito relleno cuando isFavorite es true', () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Test',
      showFavorite: true,
      isFavorite: true,
    })

    expect(wrapper.find('[data-name="favorite"]').exists()).toBe(true)
    expect(wrapper.find('[data-name="favorite_border"]').exists()).toBe(false)
  })

  it('muestra el icono de favorito vacío cuando isFavorite es false', () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Test',
      showFavorite: true,
      isFavorite: false,
    })

    expect(wrapper.find('[data-name="favorite_border"]').exists()).toBe(true)
    expect(wrapper.find('[data-name="favorite"]').exists()).toBe(false)
  })

  it('no renderiza la meta cuando no hay badge ni level', () => {
    const wrapper = mountWithQuasarStubs({ title: 'Test' })

    expect(wrapper.find('[data-testid="content-card-meta"]').exists()).toBe(false)
  })

  it('no renderiza el footer cuando no se proporciona', () => {
    const wrapper = mountWithQuasarStubs({ title: 'Test' })

    expect(wrapper.find('[data-testid="content-card-footer"]').exists()).toBe(false)
  })
})
