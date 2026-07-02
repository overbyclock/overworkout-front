import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PosterCard from '../PosterCard.vue'

describe('PosterCard', () => {
  const baseProgram = {
    id: 1,
    name: 'Calistenia Básica',
    discipline: 'calisthenia',
  }

  const mountPosterCard = (props = {}) =>
    mount(PosterCard, {
      props,
      global: {
        stubs: {
          'q-icon': {
            props: ['name', 'size'],
            template: '<span class="q-icon-stub" :data-name="name" :data-size="size" />',
          },
        },
      },
    })

  it('renders program badge correctly', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      level: 'Principiante',
      levels: '4 niveles',
      duration: '8 fases',
      extra: '12 sesiones',
    })

    expect(wrapper.text()).toContain('Programa')
    expect(wrapper.text()).toContain('Calistenia Básica')
    expect(wrapper.text()).toContain('Principiante')
    expect(wrapper.text()).toContain('4 niveles')
    expect(wrapper.text()).toContain('8 fases')
    expect(wrapper.text()).toContain('12 sesiones')
  })

  it('renders training badge correctly', () => {
    const wrapper = mountPosterCard({
      item: { id: 2, name: 'HIIT 20 min', discipline: 'hiit' },
      type: 'training',
      level: 'Intermedio',
      duration: '20-30 min',
      extra: '4 rounds',
    })

    expect(wrapper.text()).toContain('Entreno')
    expect(wrapper.text()).toContain('HIIT 20 min')
  })

  it('emits click event', async () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
    })

    await wrapper.find('[data-testid="poster-card-action"]').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emits toggle-favorite event', async () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      showFavorite: true,
      isFavorite: false,
    })

    await wrapper.find('[data-testid="favorite-button"]').trigger('click')
    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
  })

  it('does not render favorite button when showFavorite is false', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      showFavorite: false,
    })

    expect(wrapper.find('[data-testid="favorite-button"]').exists()).toBe(false)
  })

  it('renders filled favorite icon when isFavorite is true', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      showFavorite: true,
      isFavorite: true,
    })

    expect(wrapper.find('.q-icon-stub').attributes('data-name')).toBe('favorite')
  })

  it('renders outlined favorite icon when isFavorite is false', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      showFavorite: true,
      isFavorite: false,
    })

    expect(wrapper.find('.q-icon-stub').attributes('data-name')).toBe('favorite_border')
  })

  it('renders progress bar and clamps values to 0-100', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      progress: 150,
    })

    const progress = wrapper.find('[role="progressbar"]')
    expect(progress.exists()).toBe(true)
    expect(progress.attributes('aria-valuemin')).toBe('0')
    expect(progress.attributes('aria-valuemax')).toBe('100')
    expect(progress.attributes('aria-valuenow')).toBe('100')
    expect(wrapper.text()).toContain('100%')
  })

  it('clamps negative progress to 0', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      progress: -20,
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('joins metaLine with separator and filters empty values', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
      level: 'Principiante',
      levels: '4 niveles',
      duration: '8 fases',
      extra: '',
    })

    const meta = wrapper.find('.poster-card__meta')
    expect(meta.text()).toBe('Principiante · 4 niveles · 8 fases')
  })

  it('uses gradient background by default', () => {
    const wrapper = mountPosterCard({
      item: baseProgram,
      type: 'program',
    })

    const card = wrapper.find('[data-testid="poster-card"]')
    expect(card.attributes('style')).toContain('linear-gradient')
  })

  it('combines image and gradient in background when imageUrl is provided', () => {
    const wrapper = mountPosterCard({
      item: { ...baseProgram, imageUrl: 'https://example.com/image.jpg' },
      type: 'program',
    })

    const card = wrapper.find('[data-testid="poster-card"]')
    expect(card.attributes('style')).toContain('https://example.com/image.jpg')
    expect(card.attributes('style')).toContain('linear-gradient')
  })

  it('uses fallback aria-label when item name is missing', () => {
    const wrapper = mountPosterCard({
      item: { id: 3, discipline: 'hiit' },
      type: 'training',
    })

    expect(wrapper.find('[data-testid="poster-card-action"]').attributes('aria-label')).toBe(
      'Abrir elemento',
    )
  })
})
