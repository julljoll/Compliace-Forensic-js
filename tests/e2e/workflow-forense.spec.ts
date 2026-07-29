import { test, expect } from '@playwright/test'

test.describe('CMS Compliance Forense SHA256.US — Flujo Pericial E2E', () => {
  test('debe permitir autenticación, navegación al Dashboard y verificar elementos clave', async ({ page }) => {
    // 1. Navegar a la página de Login o Dashboard
    await page.goto('/')

    // Si redirige a login
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'julljoll@gmail.com')
      await page.fill('input[type="password"]', 'admin')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')
    }

    // 2. Verificar títulos y marca del CMS
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(13, 17, 23)') // #0D1117
    await expect(page).toHaveTitle(/SHA256/)

    // 3. Verificar navegación a casos
    await page.goto('/casos')
    await expect(page).toHaveURL(/.*casos/)
  })

  test('debe cargar la sección de normativas y mostrar normativas RAG', async ({ page }) => {
    await page.goto('/normativas')
    await expect(page).toHaveURL(/.*normativas/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('debe abrir la vista de auditoría inmutable', async ({ page }) => {
    await page.goto('/auditoria')
    await expect(page).toHaveURL(/.*auditoria/)
  })
})
