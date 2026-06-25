import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./auth.setup";

test.describe("Product form dialog", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForSelector("text=Productos", { timeout: 5000 });
  });

  test("should open product form and add image fields", async ({ page }) => {
    await page.click('button:has-text("Agregar Producto")');
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 });

    // First image field exists by default, add a second
    await page.click('button:has-text("Agregar Imagen")');
    await expect(
      page.locator('[role="dialog"] [class*="dashed"]'),
    ).toHaveCount(2);

    // Add a third
    await page.click('button:has-text("Agregar Imagen")');
    await expect(
      page.locator('[role="dialog"] [class*="dashed"]'),
    ).toHaveCount(3);

    const createBtn = page.locator('[role="dialog"] button:has-text("Crear")');
    await expect(createBtn).toBeVisible();
    await expect(createBtn).toBeEnabled();
  });

  test("should create a product with an image URL", async ({ page }) => {
    await page.click('button:has-text("Agregar Producto")');
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 });

    await page.fill("#name", "E2E Test Product");
    await page.click('button:has-text("Agregar Imagen")');

    const imageInput = page
      .locator('[role="dialog"] input[placeholder*="Drop image"]')
      .first();
    await imageInput.fill("https://via.placeholder.com/150");

    const createBtn = page.locator('[role="dialog"] button:has-text("Crear")');
    await expect(createBtn).toBeVisible();
    await expect(createBtn).toBeEnabled();
  });

  test("should keep accept button visible with many images", async ({ page }) => {
    await page.click('button:has-text("Agregar Producto")');
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 });

    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Agregar Imagen")');
    }

    const dialogContent = page.locator('[role="dialog"] [class*="overflow"]');
    await dialogContent.evaluate((el) => (el.scrollTop = el.scrollHeight));

    const createBtn = page.locator('[role="dialog"] button:has-text("Crear")');
    await expect(createBtn).toBeVisible();
    await expect(createBtn).toBeEnabled();
  });
});
