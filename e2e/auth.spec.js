import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/OverWorkout/)
    
    // Check login form elements
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.locator('input[type="text"]').first().fill('invaliduser')
    await page.locator('input[type="password"]').fill('wrongpassword')
    
    // Submit form
    await page.locator('button[type="submit"]').click()
    
    // Wait for error notification
    await expect(page.locator('.q-notification').filter({ hasText: /error|inválido/i })).toBeVisible()
  })

  test('should navigate to admin dashboard with valid credentials', async ({ page }) => {
    // Note: This test assumes mock/dev credentials
    // In production, use test-specific credentials
    
    await page.locator('input[type="text"]').first().fill('admin')
    await page.locator('input[type="password"]').fill('admin123')
    
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/.*admin.*/)
  })

  test('should have working navigation links', async ({ page }) => {
    // Check if help link exists
    const helpLink = page.locator('a[href="#"]').filter({ hasText: /ayuda/i })
    await expect(helpLink).toBeVisible()
    
    // Check if forgot password link exists
    const forgotLink = page.locator('a').filter({ hasText: /olvidaste|recuperar/i })
    await expect(forgotLink).toBeVisible()
  })
})
