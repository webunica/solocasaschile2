import { expect, test } from "@playwright/test";

const AUTH_COOKIE = {
  name: "sb-e2e-auth-token",
  value: "mock-session-token",
  path: "/",
  domain: "127.0.0.1",
};

test.describe("critical flows", () => {
  test("redirects unauthenticated dashboard traffic to login", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
    await expect(page.getByRole("heading", { name: /acceso/i })).toBeVisible();
  });

  test("redirects authenticated users away from login and into the dashboard", async ({ context, page }) => {
    await context.addCookies([{ ...AUTH_COOKIE }]);
    await page.goto("/login");

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: /hola/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /publicar nuevo modelo/i })).toBeVisible();
  });

  test("submits the public lead form successfully", async ({ page }) => {
    await page.route("**/api/leads/public", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/");

    await page.getByRole("button", { name: /solicitar asesor/i }).first().click();

    const leadForm = page.locator('[role="dialog"] form').first();

    await leadForm.locator('input[name="name"]').fill("Maria Perez");
    await leadForm.locator('input[name="phone"]').fill("+56 9 5555 5555");
    await leadForm.locator('input[name="email"]').fill("maria@example.com");
    await leadForm.locator('input[name="message"]').fill("Quiero cotizar una casa modular para parcela.");
    await leadForm.getByRole("button", { name: /solicitar asesor/i }).click();

    await expect(page.getByText(/consulta enviada/i)).toBeVisible();
  });

  test("starts checkout and redirects to the welcome page when Flow responds", async ({ page }) => {
    await page.route("**/api/checkout/start", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "/bienvenida?plan=pro" }),
      });
    });

    await page.goto("/checkout?plan=pro&billing=monthly");

    await page.locator("#companyName").fill("Constructora Demo");
    await page.locator("#repName").fill("Ana Demo");
    await page.locator("#phone").fill("+56 9 4444 4444");
    await page.locator("#rut").fill("76.123.456-7");
    await page.locator("#email").fill("ana@demo.cl");
    await page.locator("#password").fill("demo1234");
    await page.locator("#confirmPassword").fill("demo1234");
    await page.getByRole("button", { name: /crear cuenta y pagar/i }).click();

    await expect(page).toHaveURL(/\/bienvenida\?plan=pro$/);
    await expect(page.getByRole("heading", { name: /bienvenido/i })).toBeVisible();
  });

  test("shows the checkout error returned by the backend", async ({ page }) => {
    await page.route("**/api/checkout/start", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Flow no disponible en este momento." }),
      });
    });

    await page.goto("/checkout?plan=pro&billing=monthly");

    await page.locator("#companyName").fill("Constructora Demo");
    await page.locator("#repName").fill("Ana Demo");
    await page.locator("#phone").fill("+56 9 4444 4444");
    await page.locator("#rut").fill("76.123.456-7");
    await page.locator("#email").fill("ana@demo.cl");
    await page.locator("#password").fill("demo1234");
    await page.locator("#confirmPassword").fill("demo1234");
    await page.getByRole("button", { name: /crear cuenta y pagar/i }).click();

    await expect(page.getByText(/flow no disponible en este momento/i)).toBeVisible();
  });
});
