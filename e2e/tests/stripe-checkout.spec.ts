import { test, expect, Page } from "@playwright/test";

/**
 * Helper: inject cart items into localStorage so the checkout page
 * sees a non-empty cart when it hydrates.
 */
async function seedCart(page: Page) {
  const items = [
    {
      productId: "507f1f77bcf86cd799439011",
      name: "Jugo de Naranja",
      price: 5,
      priceBs: 182.5,
      quantity: 2,
      image: "",
    },
    {
      productId: "507f1f77bcf86cd799439012",
      name: "Agua Mineral",
      price: 2,
      priceBs: 73,
      quantity: 1,
      image: "",
    },
  ];

  await page.evaluate((cartItems) => {
    localStorage.setItem("gericht-cart-items", JSON.stringify(cartItems));
  }, items);
}

/**
 * Prevents Stripe redirect from breaking the test by intercepting
 * navigation to checkout.stripe.com
 */
async function blockStripeRedirect(page: Page) {
  await page.route("https://checkout.stripe.com/**", (route) => {
    route.abort();
  });
}

test.describe("Stripe Checkout — Frontend flow", () => {
  test("displays order summary and payment buttons when cart has items", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");

    // Wait for the cart to hydrate from localStorage
    await page.waitForSelector("text=Resumen del pedido", { timeout: 5000 });

    // Items visible
    await expect(page.locator("text=Jugo de Naranja")).toBeVisible();
    await expect(page.locator("text=Agua Mineral")).toBeVisible();

    // Form fields present
    await expect(page.locator('input[placeholder="Tu nombre"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Calle, número, colonia, ciudad"]')).toBeVisible();

    // Both payment buttons visible
    await expect(page.locator("text=Pagar por WhatsApp")).toBeVisible();
    await expect(page.locator("text=Pagar con tarjeta")).toBeVisible();
  });

  test("shows empty cart state when no items", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForSelector("text=Tu carrito está vacío", { timeout: 5000 });
  });

  test("disables payment buttons when form is incomplete", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");
    await page.waitForSelector("text=Resumen del pedido", { timeout: 5000 });

    const stripeBtn = page.locator("text=Pagar con tarjeta").first();
    await expect(stripeBtn).toBeDisabled();
  });

  test("enables payment buttons when form is complete", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");
    await page.waitForSelector("text=Resumen del pedido", { timeout: 5000 });

    await page.fill('input[placeholder="Tu nombre"]', "María García");
    await page.fill('input[placeholder="+58 412 1234567"]', "+584141234567");
    await page.fill('input[placeholder="Calle, número, colonia, ciudad"]', "Av. Principal, Caracas");

    const stripeBtn = page.locator("text=Pagar con tarjeta").first();
    await expect(stripeBtn).toBeEnabled();
  });

  test("sends correct payload to Stripe checkout API", async ({ page }) => {
    await seedCart(page);
    await blockStripeRedirect(page);

    // Mock the API response
    await page.route("**/api/stripe/checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://checkout.stripe.com/pay/cs_test_mock",
          sessionId: "cs_test_mock",
        }),
      });
    });

    await page.goto("/checkout");
    await page.waitForSelector("text=Resumen del pedido", { timeout: 5000 });

    // Fill form
    await page.fill('input[placeholder="Tu nombre"]', "Juan Pérez");
    await page.fill('input[placeholder="+58 412 1234567"]', "+584141234567");
    await page.fill('input[placeholder="Calle, número, colonia, ciudad"]', "Av. Principal, Caracas");

    // Intercept the API request
    const apiPromise = page.waitForRequest("**/api/stripe/checkout");

    // Click Stripe button
    await page.locator("text=Pagar con tarjeta").first().click();

    // Wait for the API call
    const request = await apiPromise;
    const body = JSON.parse(request.postData() || "{}");

    expect(body.paymentMethod).toBe("stripe");
    expect(body.customer.name).toBe("Juan Pérez");
    expect(body.items).toHaveLength(2);
    expect(body.items[0]).toMatchObject({
      productName: "Jugo de Naranja",
      quantity: 2,
    });
  });

  test("shows error message when Stripe API fails", async ({ page }) => {
    await seedCart(page);

    // Mock API failure
    await page.route("**/api/stripe/checkout", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Error al procesar el pago" }),
      });
    });

    await page.goto("/checkout");
    await page.waitForSelector("text=Resumen del pedido", { timeout: 5000 });

    await page.fill('input[placeholder="Tu nombre"]', "María García");
    await page.fill('input[placeholder="+58 412 1234567"]', "+584141234567");
    await page.fill('input[placeholder="Calle, número, colonia, ciudad"]', "Av. Principal, Caracas");

    await page.locator("text=Pagar con tarjeta").first().click();

    // Error message should appear
    await expect(page.locator("text=Error al procesar el pago")).toBeVisible({ timeout: 5000 });
  });

  test("success page renders correctly", async ({ page }) => {
    await page.goto("/checkout/success");

    await page.waitForSelector("text=Pago exitoso", { timeout: 5000 });
    await expect(page.locator("text=Tu pedido ha sido recibido")).toBeVisible();
    await expect(page.locator("text=Seguir viendo el menú")).toBeVisible();
  });

  test("shows canceled message when returning from Stripe", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout?canceled=true");

    await expect(page.locator("text=El pago fue cancelado")).toBeVisible({ timeout: 5000 });
  });
});
