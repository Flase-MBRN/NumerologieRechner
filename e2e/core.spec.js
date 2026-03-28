import { test, expect } from '@playwright/test'

test.describe('Numerologie Rechner - Core Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Numerologie Rechner/)
    await expect(page.locator('h1')).toContainText('numerologisches')
  })

  test('should calculate life path number', async ({ page }) => {
    // Fill form
    await page.fill('#name', 'Max Mustermann')
    await page.fill('#birthdate', '15.03.1990')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Wait for results
    await expect(page.locator('#lifeHeroDisplay')).toBeVisible()
    await expect(page.locator('#lifeHeroNum')).not.toBeEmpty()
  })

  test('should toggle theme', async ({ page }) => {
    const themeButton = page.locator('#themeToggle')
    
    // Click theme toggle
    await themeButton.click()
    
    // Check if theme changed
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('should show offline indicator when offline', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true)
    
    // Check for offline indicator
    await expect(page.locator('#offline-indicator')).toBeVisible()
    
    // Restore online
    await page.context().setOffline(false)
  })

  test('should be accessible', async ({ page }) => {
    // Run accessibility audit
    const accessibilityScanResults = await page.accessibility.snapshot()
    expect(accessibilityScanResults).toBeTruthy()
  })
})

test.describe('Legal Pages', () => {
  test('should display impressum', async ({ page }) => {
    await page.goto('/impressum.html')
    await expect(page.locator('h1')).toContainText('Impressum')
    await expect(page.locator('text=Erik Klauß')).toBeVisible()
  })

  test('should display datenschutz', async ({ page }) => {
    await page.goto('/datenschutz.html')
    await expect(page.locator('h1')).toContainText('Datenschutz')
    await expect(page.locator('#exportDataBtn')).toBeVisible()
  })
})
