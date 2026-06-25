import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./auth.setup";

test.describe("Storage settings", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/config");
    await page.waitForSelector("text=Configuración", { timeout: 5000 });
  });

  test("should show Storage tab", async ({ page }) => {
    await page.click('button:has-text("Almacenamiento")');
    await expect(
      page.locator('button:has-text("Local")'),
    ).toBeVisible();
    await expect(
      page.locator('button:has-text("S3 Compatible")'),
    ).toBeVisible();
  });

  test("should toggle to S3 and show config form", async ({ page }) => {
    await page.click('button:has-text("Almacenamiento")');
    await page.click('button:has-text("S3 Compatible")');
    await expect(page.locator("text=Configuración S3")).toBeVisible();
    await expect(page.locator('label:has-text("Bucket")')).toBeVisible();
  });

  test("should save S3 configuration", async ({ page }) => {
    await page.click('button:has-text("Almacenamiento")');
    await page.click('button:has-text("S3 Compatible")');
    await page.fill("#s3-bucket", "test-bucket");
    await page.fill("#s3-region", "us-east-1");
    await page.fill("#s3-key", "AKIA-test-key");
    await page.fill("#s3-secret", "test-secret-key");
    await page.fill("#s3-endpoint", "https://fra1.digitaloceanspaces.com");
    await page.click('button:has-text("Guardar Configuración")');
    await expect(page.locator("text=Guardado")).toBeVisible({ timeout: 5000 });
  });

  test("should switch back to Local storage", async ({ page }) => {
    await page.click('button:has-text("Almacenamiento")');
    await page.click('button:has-text("Local")');
    await page.click('button:has-text("Guardar Configuración")');
    await expect(page.locator("text=Guardado")).toBeVisible({ timeout: 5000 });
  });
});
