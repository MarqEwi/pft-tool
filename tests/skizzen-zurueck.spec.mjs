// Tests für: Skizzen in den Info-Dialogen (wiederverwendet aus dem Aufbau-Tab)
// und das Verhalten der Android-Zurück-Taste.
import { test, expect } from "@playwright/test";

const SKIP_OB = () => localStorage.setItem("pft_onboarding_done", "true");

// Nachgestellte App-Umgebung mit App-Plugin
const FAKE_APP = () => {
  window.__exitCount = 0;
  window.Capacitor = {
    isNativePlatform: () => true,
    Plugins: {
      App: {
        addListener(ev, cb){ if (ev === "backButton") window.__backCb = cb; return { remove(){} }; },
        exitApp(){ window.__exitCount++; }
      }
    }
  };
};
const back = page => page.evaluate(() => window.__backCb && window.__backCb());

test("Info-Dialog zeigt dieselbe Skizze wie der Aufbau-Tab", async ({ page }) => {
  await page.addInitScript(SKIP_OB);
  await page.goto("/");

  for (const [infoKey, skizzeId] of [
    ["pendel", "skizze-pendel"], ["situp", "skizze-situp"], ["sprung", "skizze-sprung"],
    ["liegest", "skizze-liegest"], ["lauf", "skizze-lauf"]
  ]){
    await page.click(`[data-info="${infoKey}"]`);
    const dialogImg = page.locator("#info-content img.station-img").first();
    await expect(dialogImg).toBeVisible();
    const srcDialog = await dialogImg.getAttribute("src");
    const srcQuelle = await page.locator("#" + skizzeId).getAttribute("src");
    expect(srcDialog).toBe(srcQuelle);
    expect(srcDialog.startsWith("data:image/webp;base64,")).toBeTruthy();
    await page.click('[data-close="modal-info"]');
  }
});

test("Info-Dialog ohne Skizze bleibt bildlos, Bilder werden nicht doppelt eingebettet", async ({ page }) => {
  await page.addInitScript(SKIP_OB);
  await page.goto("/");
  await page.click('[data-info="allgemein"]');
  await expect(page.locator("#info-content img")).toHaveCount(0);
  await page.click('[data-close="modal-info"]');

  // Die eigenen Skizzen liegen genau einmal im Dokument (6 Stück: 5 Stationen + Halle)
  const eigene = await page.locator('img[id^="skizze-"]').count();
  expect(eigene).toBe(6);
  // Der Dialog erhält beim Öffnen genau ein Bild und beim erneuten Öffnen kein zweites
  await page.click('[data-info="pendel"]');
  await expect(page.locator("#info-content img.station-img")).toHaveCount(1);
  await page.click('[data-close="modal-info"]');
  await page.click('[data-info="pendel"]');
  await expect(page.locator("#info-content img.station-img")).toHaveCount(1);
});

test("Zurück-Taste: Fenster zu → Startseite → Hinweis → zweiter Druck beendet", async ({ page }) => {
  await page.addInitScript(FAKE_APP);
  await page.addInitScript(SKIP_OB);
  await page.goto("/");

  // Unterseite öffnen und darin ein Fenster
  await page.click("#go-pruefer");
  await expect(page.locator("#view-pruefer")).toHaveClass(/active/);
  await page.click("#btn-settings");
  await expect(page.locator("#modal-settings")).toHaveClass(/open/);

  // 1. Druck: Fenster schließt, Ansicht bleibt
  await back(page);
  await expect(page.locator("#modal-settings")).not.toHaveClass(/open/);
  await expect(page.locator("#view-pruefer")).toHaveClass(/active/);
  expect(await page.evaluate(() => window.__exitCount)).toBe(0);

  // 2. Druck: zurück zur Startseite
  await back(page);
  await expect(page.locator("#view-home")).toHaveClass(/active/);
  expect(await page.evaluate(() => window.__exitCount)).toBe(0);

  // 3. Druck: Hinweis erscheint, App läuft weiter
  await back(page);
  await expect(page.locator("#toast")).toBeVisible();
  await expect(page.locator("#toast")).toContainText("erneut");
  expect(await page.evaluate(() => window.__exitCount)).toBe(0);

  // 4. Druck innerhalb der Frist: App wird beendet
  await back(page);
  expect(await page.evaluate(() => window.__exitCount)).toBe(1);
});

test("Zurück-Taste schließt das zuletzt geöffnete Fenster zuerst", async ({ page }) => {
  await page.addInitScript(FAKE_APP);
  await page.addInitScript(SKIP_OB);
  await page.goto("/");
  await page.click('[data-info="pendel"]');                          // zuerst geöffnet
  await page.evaluate(() => openModal("modal-settings"));            // zuletzt geöffnet
  await expect(page.locator("#modal-info")).toHaveClass(/open/);
  await expect(page.locator("#modal-settings")).toHaveClass(/open/);

  await back(page);
  await expect(page.locator("#modal-settings")).not.toHaveClass(/open/);
  await expect(page.locator("#modal-info")).toHaveClass(/open/);   // noch offen

  await back(page);
  await expect(page.locator("#modal-info")).not.toHaveClass(/open/);
  expect(await page.evaluate(() => window.__exitCount)).toBe(0);
});

test("Zurück auf der Einführung wirkt wie Überspringen", async ({ page }) => {
  await page.addInitScript(FAKE_APP);
  await page.goto("/");   // ohne SKIP_OB: Einführung erscheint
  await expect(page.locator("#modal-onboarding")).toHaveClass(/open/);
  expect(await page.evaluate(() => localStorage.getItem("pft_onboarding_done"))).toBeNull();

  await back(page);
  await expect(page.locator("#modal-onboarding")).not.toHaveClass(/open/);
  expect(await page.evaluate(() => localStorage.getItem("pft_onboarding_done"))).toBe("true");
  expect(await page.evaluate(() => window.__exitCount)).toBe(0);
});

test("Kurzmeldung nutzt die volle Breite (kein halbseitiger Umbruch)", async ({ page }) => {
  await page.addInitScript(FAKE_APP);
  await page.addInitScript(SKIP_OB);
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await back(page);
  const el = page.locator("#toast");
  await expect(el).toBeVisible();
  const box = await el.boundingBox();
  // Nutzt deutlich mehr als die halbe Bildschirmbreite und bleibt im Rahmen
  expect(box.width).toBeGreaterThan(360 / 2);
  expect(box.width).toBeLessThanOrEqual(360 - 32);
  expect(box.height).toBeLessThan(90);
});
