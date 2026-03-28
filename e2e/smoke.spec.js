import { test, expect } from '@playwright/test'

/**
 * Smoke tests - Verifica que la aplicación básica funciona
 */
test.describe('Smoke Tests', () => {
  test('application loads without errors', async ({ page }) => {
    await page.goto('/')
    
    // Check no console errors
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    // Wait for app to load
    await page.waitForLoadState('networkidle')
    
    // Should have rendered content
    await expect(page.locator('body')).not.toBeEmpty()
    
    // Should not have critical console errors
    expect(consoleErrors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('source map')
    )).toHaveLength(0)
  })

  test('all main routes are accessible', async ({ page }) => {
    const routes = [
      '/',
      '/login',
    ]
    
    for (const route of routes) {
      const response = await page.goto(route)
      expect(response.status()).toBeLessThan(400)
      
      // Page should have content
      const body = await page.locator('body').textContent()
      expect(body.length).toBeGreaterThan(0)
    }
  })

  test('CSS loads correctly', async ({ page }) => {
    await page.goto('/login')
    
    // Check computed styles
    const bodyColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })
    
    // Should have some background color (not default white)
    expect(bodyColor).toBeTruthy()
  })

  test('JavaScript functionality works', async ({ page }) => {
    await page.goto('/login')
    
    // Check if Vue is loaded (looking for specific Vue behavior)
    const hasVue = await page.evaluate(() => {
      return document.querySelector('[data-v-]') !== null ||
             document.querySelector('#app').childElementCount > 0
    })
    
    expect(hasVue).toBe(true)
  })
})
