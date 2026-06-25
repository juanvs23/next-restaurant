import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./auth.setup";
import path from "path";
import fs from "fs";

const FIXTURE_DIR = path.join(__dirname, "..", "fixtures");

test.describe("Media management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/media");
    await page.waitForSelector("text=Multimedia", { timeout: 5000 });
  });

  test("should upload an image via URL", async ({ page }) => {
    await page.click('button:has-text("Subir")');
    await page.fill('input[placeholder*="https://"]', "https://via.placeholder.com/150");
    await page.click('button:has-text("Add")');
    await page.waitForTimeout(2000);
    await expect(page.locator("text=150")).toBeVisible();
  });

  test("should upload an image via file picker", async ({ page }) => {
    const filePath = path.join(FIXTURE_DIR, "test-image.png");
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });

    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xd7, 0x63, 0x60, 0x60, 0x60, 0x00,
      0x00, 0x00, 0x04, 0x00, 0x01, 0x27, 0x34, 0x27,
      0x9d, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
      0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
    fs.writeFileSync(filePath, png);

    await page.click('button:has-text("Subir")');
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[class*="dashed"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await page.waitForTimeout(3000);

    await expect(page.locator("text=test-image.png")).toBeVisible();
  });

  test("should delete an image", async ({ page }) => {
    await page.waitForTimeout(1000);
    const deleteBtn = page.locator('button[title="Delete"]').first();
    if (await deleteBtn.isVisible()) {
      page.on("dialog", (dialog) => dialog.accept());
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }
  });
});
