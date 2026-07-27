// Smoke-Test: App lädt fehlerfrei, PFT-Berechnung und Speicherung funktionieren.
import { test, expect } from "@playwright/test";

const JAHR = new Date().getFullYear();

test("App lädt ohne Konsolenfehler und berechnet den PFT korrekt", async ({ page }) => {
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push(String(e)));

  await page.goto("/");
  await expect(page).toHaveTitle(/PFT Tool/);
  await page.click("#ob-skip");
  await page.click("#go-teilnehmer");

  // Beispiel Mann, Altersklasse bis 24: 4+3+3+3+3 = 16 Punkte, bestanden
  await page.fill("#t-age", String(JAHR - 24));
  await page.fill("#t-pendel", "9,0");
  await page.fill("#t-situp", "30");
  await page.fill("#t-sprung", "230");
  await page.fill("#t-liegest", "20");
  await page.fill("#t-lauf", "2300");
  await expect(page.locator("#t-r-total")).toHaveText("16 / 30");
  await expect(page.locator("#t-r-grade")).toHaveText("bestanden");

  // Eine Aufgabe unter 2 Punkten => nicht bestanden trotz hoher Gesamtpunkte
  await page.fill("#t-pendel", "10,4");
  await page.fill("#t-situp", "40");
  await page.fill("#t-sprung", "257");
  await page.fill("#t-liegest", "27");
  await page.fill("#t-lauf", "2851");
  await expect(page.locator("#t-r-total")).toHaveText("24 / 30");
  await expect(page.locator("#t-r-grade")).toHaveText("nicht bestanden");
  await expect(page.locator("#t-r-failhint")).toContainText("Pendellauf");

  // Hallen-Variante (Runden)
  await page.click('#t-runtype button[data-v="halle"]');
  await page.fill("#t-lauf", "49,5");
  await expect(page.locator("#t-r-lauf-pts")).toHaveText("6 P");

  // Verlauf speichern + nur pft_-Schlüssel im localStorage
  await page.click('#t-runtype button[data-v="feld"]');
  await page.fill("#t-pendel", "9,0");
  await page.click("#t-save");
  await expect(page.locator("#t-history table")).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.every(k => k.startsWith("pft_"))).toBeTruthy();
  expect(keys.some(k => k.startsWith("bft_"))).toBeFalsy();

  expect(errors).toEqual([]);
});

test("Frauen-Wertung und Prüfermodus funktionieren", async ({ page }) => {
  await page.goto("/");
  await page.click("#ob-skip");
  await page.click("#go-teilnehmer");

  // Frau, 30–34, exakt 15 Punkte => bestanden
  await page.click('#t-sex button[data-v="w"]');
  await page.fill("#t-age", String(JAHR - 30));
  await page.fill("#t-pendel", "10,3");
  await page.fill("#t-situp", "20");
  await page.fill("#t-sprung", "169");
  await page.fill("#t-liegest", "15");
  await page.click('#t-runtype button[data-v="halle"]');
  await page.fill("#t-lauf", "29");
  await expect(page.locator("#t-r-total")).toHaveText("15 / 30");
  await expect(page.locator("#t-r-grade")).toHaveText("bestanden");
  await expect(page.locator("#t-ageclass")).toContainText("30–34");

  // Prüfermodus: Teilnehmer anlegen
  await page.click('[data-nav="home"]');
  await page.click("#go-pruefer");
  await page.click("#p-add");
  await page.fill("#e-name", "Mustermann, A.");
  await page.fill("#e-age", String(JAHR - 26));
  await page.fill("#e-pendel", "8,7");
  await page.fill("#e-situp", "35");
  await page.fill("#e-sprung", "244");
  await page.fill("#e-liegest", "23");
  await page.fill("#e-lauf", "2601");
  await page.click("#e-save");
  // M 25–29: 5+5+5+5+5 = 25 Punkte
  await expect(page.locator("#p-tbody tr")).toHaveCount(1);
  await expect(page.locator("#p-tbody")).toContainText("25");
  await expect(page.locator("#p-tbody")).toContainText("bestanden");
});
