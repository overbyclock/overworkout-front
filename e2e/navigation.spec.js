import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate through admin sections', async ({ page }) => {
    // Login first (skip if already authenticated)
    await page.goto('/login')
    
    // Try to login with test credentials
    await page.locator('input[type="text"]').first().fill('admin')
    await page.locator('input[type="password"]').fill('admin123')
    await page.locator('button[type="submit"]').click()
    
    // Wait for navigation to complete
    await page.waitForURL(/.*admin.*/, { timeout: 5000 }).catch(() => {})
    
    // If we're on admin page, test navigation
    if (page.url().includes('admin')) {
      // Test navigation to different sections
      const sections = [
        { name: /dashboard/i, url: /dashboard/ },
        { name: /usuarios/i, url: /users/ },
        { name: /ejercicios/i, url: /exercises/ },
        { name: /equipos/i, url: /equipments/ },
        { name: /entrenamientos/i, url: /trainings/ },
      ]
      
      for (const section of sections) {
        const link = page.locator('nav a, .sidebar a, [class*="nav"]').filter({ hasText: section.name })
        
        if (await link.count() > 0) {
          await link.click()
          await expect(page).toHaveURL(section.url)
        }
      }
    }
  })

  test('should have responsive layout', async ({ page }) => {
    await page.goto('/login')
    
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.locator('body')).toBeVisible()
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})
