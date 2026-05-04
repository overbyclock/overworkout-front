import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillTracker from '../SkillTracker.vue'

describe('SkillTracker', () => {
  it('se renderiza correctamente', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: 'Wall Handstand' },
        ],
        currentLevel: 1,
      },
    })

    expect(wrapper.find('.skill-tracker').exists()).toBe(true)
    expect(wrapper.find('.skill-tracker__title').text()).toContain('Skills por nivel')
  })

  it('muestra todos los niveles del programa', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: null },
          { levelNumber: 3, skillFocus: 'L-Sit Tuck' },
        ],
        currentLevel: 1,
      },
    })

    const cards = wrapper.findAll('.skill-level-card')
    expect(cards.length).toBe(3)
  })

  it('muestra el skill cuando está definido y el estado vacío cuando no', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: null },
        ],
        currentLevel: 1,
      },
    })

    const cards = wrapper.findAll('.skill-level-card')

    expect(cards[0].find('.skill-level-card__value').text()).toBe('Fundamentos')
    expect(cards[0].classes()).not.toContain('skill-level-card--empty')

    expect(cards[1].find('.skill-level-card__empty').exists()).toBe(true)
    expect(cards[1].classes()).toContain('skill-level-card--empty')
  })

  it('muestra el contador de skills definidos', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: null },
          { levelNumber: 3, skillFocus: 'L-Sit Tuck' },
        ],
        currentLevel: 1,
      },
    })

    expect(wrapper.find('.skill-tracker__badge').text()).toContain('2 / 3 definidos')
  })

  it('ordena los niveles por levelNumber', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 3, skillFocus: 'L-Sit Tuck' },
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: 'Wall Handstand' },
        ],
        currentLevel: 1,
      },
    })

    const cards = wrapper.findAll('.skill-level-card')
    expect(cards[0].find('.skill-level-card__dot').text()).toBe('1')
    expect(cards[1].find('.skill-level-card__dot').text()).toBe('2')
    expect(cards[2].find('.skill-level-card__dot').text()).toBe('3')
  })

  it('no se renderiza si no hay niveles', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [],
        currentLevel: 1,
      },
    })

    expect(wrapper.find('.skill-tracker').exists()).toBe(false)
  })
})
