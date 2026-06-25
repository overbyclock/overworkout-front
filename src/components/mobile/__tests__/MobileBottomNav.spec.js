import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, RouterLink } from 'vue-router'
import MobileBottomNav from '../MobileBottomNav.vue'

/**
 * Tests for MobileBottomNav Component
 */
describe('MobileBottomNav', () => {
  const routes = [
    { path: '/user/home', name: 'user-home', component: { template: '<div />' } },
    { path: '/user/programs', name: 'user-programs', component: { template: '<div />' } },
    { path: '/user/explore', name: 'user-explore', component: { template: '<div />' } },
    { path: '/user/achievements', name: 'user-achievements', component: { template: '<div />' } },
    { path: '/user/profile', name: 'user-profile', component: { template: '<div />' } },
  ]

  const createWrapper = async (initialRoute = '/user/home') => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })
    await router.push(initialRoute)
    await router.isReady()

    return mount(MobileBottomNav, {
      global: {
        plugins: [router],
        stubs: {
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub">{{ name }}</span>',
          },
        },
      },
    })
  }

  it('exports component correctly', () => {
    expect(MobileBottomNav).toBeDefined()
  })

  it('renders 5 router-link navigation items', async () => {
    const wrapper = await createWrapper()
    const links = wrapper.findAllComponents(RouterLink)
    expect(links).toHaveLength(5)
  })

  it('renders expected navigation items with correct labels, icons and routes', async () => {
    const wrapper = await createWrapper()
    const links = wrapper.findAllComponents(RouterLink)

    const expectedItems = [
      { label: 'Inicio', icon: 'home', to: { name: 'user-home' } },
      { label: 'Programas', icon: 'fitness_center', to: { name: 'user-programs' } },
      { label: 'Explorar', icon: 'explore', to: { name: 'user-explore' } },
      { label: 'Logros', icon: 'emoji_events', to: { name: 'user-achievements' } },
      { label: 'Perfil', icon: 'person', to: { name: 'user-profile' } },
    ]

    expect(links).toHaveLength(expectedItems.length)

    expectedItems.forEach((expected, index) => {
      const link = links[index]
      expect(link.text()).toContain(expected.label)
      expect(link.props('to')).toEqual(expected.to)
      expect(link.find('.q-icon-stub').text()).toBe(expected.icon)
    })
  })

  it('does not render central floating action button', async () => {
    const wrapper = await createWrapper()
    expect(wrapper.find('.mobile-bottom-nav__fab').exists()).toBe(false)
  })

  it('marks active item based on current route', async () => {
    const wrapper = await createWrapper('/user/achievements')
    const links = wrapper.findAllComponents(RouterLink)
    const activeLink = links.find((link) => link.props('to').name === 'user-achievements')

    expect(activeLink).toBeDefined()
    expect(activeLink.classes()).toContain('mobile-bottom-nav__item--active')
    expect(activeLink.attributes('aria-current')).toBe('page')
  })

  it('sets aria-label on navigation for accessibility', async () => {
    const wrapper = await createWrapper()
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Navegación principal')
  })
})
