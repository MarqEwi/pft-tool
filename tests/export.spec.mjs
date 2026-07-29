// Export-/Druck-Tests: In der App-Umgebung (nachgestelltes Capacitor) müssen
// Export und Drucken über Filesystem.writeFile → getUri → Share.share laufen –
// genau dieser Weg fehlte ursprünglich und fiel still auf den Browser-Weg zurück.
import { test, expect } from "@playwright/test";

const JAHR = new Date().getFullYear();

// Vorbelegung: Onboarding erledigt, Premium aktiv, ein Teilnehmer in der Liste
const SEED = () => {
  localStorage.setItem("pft_onboarding_done", "true");
  localStorage.setItem("pft_edition", JSON.stringify("premium"));
  localStorage.setItem("pft_participants", JSON.stringify([
    { name: "Test, A.", sex: "m", birthYear: new Date().getFullYear() - 26,
      pendel: 8.7, situp: 35, sprung: 244, liegest: 23, laufType: "feld", lauf: 2601 }
  ]));
};

// Nachgestellte App-Umgebung: Schein-Plugins protokollieren ihre Aufrufe
const FAKE_NATIVE = (opts = {}) => {
  window.__calls = [];
  window.Capacitor = {
    isNativePlatform: () => true,
    Plugins: {
      Filesystem: {
        writeFile: async o => { window.__calls.push(["writeFile", o.path, (o.data || "").length, o.directory]); return {}; },
        getUri: async o => { window.__calls.push(["getUri", o.path]); return { uri: "content://test/" + o.path }; }
      },
      Share: {
        share: async o => {
          window.__calls.push(["share", (o.files || [])[0]]);
          if (window.__shareCancel) throw new Error("Share canceled");
          return {};
        }
      }
    }
  };
  Object.assign(window, opts);
};

async function callsOf(page){ return page.evaluate(() => window.__calls); }

test("App-Umgebung: Export PDF/Text/Bild und Drucken laufen über writeFile → getUri → share", async ({ page }) => {
  const dialoge = [];
  page.on("dialog", d => { dialoge.push(d.message()); d.accept(); });
  await page.addInitScript(FAKE_NATIVE);
  await page.addInitScript(SEED);
  await page.goto("/");
  await page.click("#go-pruefer");

  // In der App heißt der Knopf "Drucken / Teilen"
  await expect(page.locator("#p-print-label")).toHaveText("Drucken / Teilen");

  // Export als PDF
  await page.click("#p-export");
  await page.click("#exp-pdf");
  await expect.poll(async () => (await callsOf(page)).length).toBeGreaterThanOrEqual(3);
  let calls = await callsOf(page);
  expect(calls[0][0]).toBe("writeFile");
  expect(calls[0][1]).toMatch(/^pft-ergebnisliste-.*\.pdf$/);
  expect(calls[0][2]).toBeGreaterThan(100);      // Base64-Inhalt nicht leer
  expect(calls[0][3]).toBe("CACHE");
  expect(calls[1][0]).toBe("getUri");
  expect(calls[2]).toEqual(["share", "content://test/" + calls[0][1]]);

  // Export als Text
  await page.evaluate(() => { window.__calls = []; });
  await page.click("#p-export");
  await page.click("#exp-txt");
  await expect.poll(async () => (await callsOf(page)).length).toBeGreaterThanOrEqual(3);
  calls = await callsOf(page);
  expect(calls[0][1]).toMatch(/\.txt$/);
  expect(calls[2][0]).toBe("share");

  // Export als Bild (canvas.toBlob ist asynchron)
  await page.evaluate(() => { window.__calls = []; });
  await page.click("#p-export");
  await page.click("#exp-img");
  await expect.poll(async () => (await callsOf(page)).length).toBeGreaterThanOrEqual(3);
  calls = await callsOf(page);
  expect(calls[0][1]).toMatch(/\.png$/);
  expect(calls[0][2]).toBeGreaterThan(100);

  // Drucken = PDF erzeugen und teilen
  await page.evaluate(() => { window.__calls = []; });
  await page.click("#p-print");
  await expect.poll(async () => (await callsOf(page)).length).toBeGreaterThanOrEqual(3);
  calls = await callsOf(page);
  expect(calls[0][1]).toMatch(/\.pdf$/);
  expect(calls[2][0]).toBe("share");

  // Kein einziger Fehlerdialog im Erfolgsfall
  expect(dialoge).toEqual([]);
});

test("App-Umgebung: Abbruch des Teilen-Menüs zeigt KEINE Fehlermeldung", async ({ page }) => {
  const dialoge = [];
  page.on("dialog", d => { dialoge.push(d.message()); d.accept(); });
  await page.addInitScript(FAKE_NATIVE, { __shareCancel: true });
  await page.addInitScript(SEED);
  await page.goto("/");
  await page.click("#go-pruefer");
  await page.click("#p-export");
  await page.click("#exp-txt");
  await expect.poll(async () => (await callsOf(page)).length).toBeGreaterThanOrEqual(3);
  await page.waitForTimeout(400);
  expect(dialoge).toEqual([]);
});

test("App-Umgebung: fehlende Plugins melden sich statt still zu scheitern", async ({ page }) => {
  const dialoge = [];
  page.on("dialog", d => { dialoge.push(d.message()); d.accept(); });
  await page.addInitScript(() => {
    window.Capacitor = { isNativePlatform: () => true, Plugins: {} };
  });
  await page.addInitScript(SEED);
  await page.goto("/");
  await page.click("#go-pruefer");
  await page.click("#p-export");
  await page.click("#exp-txt");
  await expect.poll(() => dialoge.length).toBeGreaterThanOrEqual(1);
  expect(dialoge[0]).toContain("Plugins");
});

test("Browser: Download-Weg funktioniert unverändert", async ({ page }) => {
  await page.addInitScript(SEED);
  await page.goto("/");
  await page.click("#go-pruefer");
  // Im Browser heißt der Knopf weiterhin "Drucken"
  await expect(page.locator("#p-print-label")).toHaveText("Drucken");
  await page.click("#p-export");
  const dl = page.waitForEvent("download");
  await page.click("#exp-txt");
  const download = await dl;
  expect(download.suggestedFilename()).toMatch(/^pft-ergebnisliste-.*\.txt$/);
});
