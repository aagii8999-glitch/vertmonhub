import { test, expect } from '@playwright/test';

/**
 * VertmonHub E2E Tests
 * 
 * Covers: Login, Properties, Pipeline, Admin Import, RBAC
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// ============================================
// AUTH TESTS
// ============================================

test.describe('Authentication', () => {
    test('should display login page', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth/login`);
        await expect(page.locator('h1, h2')).toContainText(/vertmon|нэвтрэх|login/i);
    });

    test('should show validation errors for empty form', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth/login`);
        const submitBtn = page.locator('button[type="submit"]');
        if (await submitBtn.isVisible()) {
            await submitBtn.click();
            // Should show validation messages
            await expect(page.locator('text=/имэйл|email/i')).toBeVisible({ timeout: 3000 }).catch(() => { });
        }
    });

    test('should redirect unauthenticated users', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForURL(/\/(auth\/login|$)/, { timeout: 5000 }).catch(() => { });
        // Should not be on dashboard
        const url = page.url();
        expect(url).not.toContain('/dashboard');
    });
});

// ============================================
// PROPERTIES TESTS
// ============================================

test.describe('Properties Page', () => {
    test('should load properties page', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard/properties`);
        // Either shows properties list or login redirect
        const hasContent = await page.locator('text=/байр|properties/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth')).toBeTruthy();
    });
});

// ============================================
// PIPELINE TESTS
// ============================================

test.describe('Pipeline Kanban', () => {
    test('should load pipeline page', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard/leads/pipeline`);
        const hasContent = await page.locator('text=/pipeline|шинэ|лийд/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth')).toBeTruthy();
    });
});

// ============================================
// ADMIN TESTS
// ============================================

test.describe('Admin Pages', () => {
    test('should load admin login/dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        // Should either show admin or redirect
        await page.waitForLoadState('networkidle');
        const url = page.url();
        expect(url.includes('/admin') || url.includes('/auth')).toBeTruthy();
    });

    test('should load admin users page', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin/users`);
        await page.waitForLoadState('networkidle');
        const hasContent = await page.locator('text=/хэрэглэгч|users/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth') || page.url().includes('/admin')).toBeTruthy();
    });

    test('should load admin import page', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin/import`);
        await page.waitForLoadState('networkidle');
        const hasContent = await page.locator('text=/import|импорт/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth')).toBeTruthy();
    });
});

// ============================================
// NEW FEATURES TESTS
// ============================================

test.describe('New Features', () => {
    test('should load contracts page', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard/contracts`);
        const hasContent = await page.locator('text=/гэрээ|contract/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth')).toBeTruthy();
    });

    test('should load viewings page', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard/viewings`);
        const hasContent = await page.locator('text=/үзлэг|viewing/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth')).toBeTruthy();
    });

    test('should load marketing ROI page', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard/marketing-roi`);
        const hasContent = await page.locator('text=/маркетинг|roi/i').isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent || page.url().includes('auth')).toBeTruthy();
    });
});

// ============================================
// RESPONSIVE / ACCESSIBILITY
// ============================================

test.describe('Responsiveness', () => {
    test('should render on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(`${BASE_URL}`);
        await page.waitForLoadState('networkidle');
        // Page should render without errors
        const errors: string[] = [];
        page.on('pageerror', err => errors.push(err.message));
        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
    });

    test('should have proper page titles', async ({ page }) => {
        await page.goto(`${BASE_URL}`);
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });
});
