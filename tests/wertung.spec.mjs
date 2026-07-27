// Wertungstabellen-Tests: prüft die PFT-Engine der echten Seite gegen die
// offiziellen Durchführungsbestimmungen (Sportschule der Bundeswehr, 2006).
// Abgedeckt sind alle 6- und 0-Punkte-Grenzen beider Geschlechter sowie
// Stichproben sämtlicher Bänder und Altersklassen (Altersklassen-Index:
// 0 = bis 24 · 1 = 25–29 · 2 = 30–34 · 3 = 35–39).
import { test, expect } from "@playwright/test";

// [Disziplin, Wert, Geschlecht, Altersklassen-Index, erwartete Punkte]
const CHECKS = [
  // ===== Männer, bis 24 (zusätzlich gegengeprüft mit unabhängiger Abschrift) =====
  ["pendel", 8.5, "m", 0, 6], ["pendel", 8.6, "m", 0, 5], ["pendel", 8.8, "m", 0, 5],
  ["pendel", 8.9, "m", 0, 4], ["pendel", 9.1, "m", 0, 4], ["pendel", 9.2, "m", 0, 3],
  ["pendel", 9.7, "m", 0, 3], ["pendel", 9.8, "m", 0, 2], ["pendel", 10.0, "m", 0, 2],
  ["pendel", 10.1, "m", 0, 1], ["pendel", 10.3, "m", 0, 1], ["pendel", 10.4, "m", 0, 0],
  ["situp", 40, "m", 0, 6], ["situp", 39, "m", 0, 5], ["situp", 37, "m", 0, 5],
  ["situp", 36, "m", 0, 4], ["situp", 34, "m", 0, 4], ["situp", 33, "m", 0, 3],
  ["situp", 27, "m", 0, 3], ["situp", 26, "m", 0, 2], ["situp", 25, "m", 0, 2],
  ["situp", 24, "m", 0, 1], ["situp", 21, "m", 0, 1], ["situp", 20, "m", 0, 0],
  ["sprung", 257, "m", 0, 6], ["sprung", 256, "m", 0, 5], ["sprung", 247, "m", 0, 5],
  ["sprung", 246, "m", 0, 4], ["sprung", 238, "m", 0, 4], ["sprung", 237, "m", 0, 3],
  ["sprung", 217, "m", 0, 3], ["sprung", 216, "m", 0, 2], ["sprung", 205, "m", 0, 2],
  ["sprung", 204, "m", 0, 1], ["sprung", 195, "m", 0, 1], ["sprung", 194, "m", 0, 0],
  ["liegest", 27, "m", 0, 6], ["liegest", 26, "m", 0, 5], ["liegest", 25, "m", 0, 5],
  ["liegest", 24, "m", 0, 4], ["liegest", 22, "m", 0, 4], ["liegest", 21, "m", 0, 3],
  ["liegest", 18, "m", 0, 3], ["liegest", 17, "m", 0, 2], ["liegest", 16, "m", 0, 2],
  ["liegest", 15, "m", 0, 1], ["liegest", 13, "m", 0, 1], ["liegest", 12, "m", 0, 0],
  ["lauf_feld", 2851, "m", 0, 6], ["lauf_feld", 2850, "m", 0, 5], ["lauf_feld", 2676, "m", 0, 5],
  ["lauf_feld", 2675, "m", 0, 4], ["lauf_feld", 2526, "m", 0, 4], ["lauf_feld", 2525, "m", 0, 3],
  ["lauf_feld", 2126, "m", 0, 3], ["lauf_feld", 2125, "m", 0, 2], ["lauf_feld", 1901, "m", 0, 2],
  ["lauf_feld", 1900, "m", 0, 1], ["lauf_feld", 1751, "m", 0, 1], ["lauf_feld", 1750, "m", 0, 0],
  ["lauf_halle", 49.5, "m", 0, 6], ["lauf_halle", 49.0, "m", 0, 5], ["lauf_halle", 47.0, "m", 0, 5],
  ["lauf_halle", 46.5, "m", 0, 4], ["lauf_halle", 44.5, "m", 0, 4], ["lauf_halle", 44.0, "m", 0, 3],
  ["lauf_halle", 39.5, "m", 0, 3], ["lauf_halle", 39.0, "m", 0, 2], ["lauf_halle", 36.5, "m", 0, 2],
  ["lauf_halle", 36.0, "m", 0, 1], ["lauf_halle", 34.5, "m", 0, 1], ["lauf_halle", 34.0, "m", 0, 0],
  // ===== Männer, weitere Altersklassen (Bandgrenzen-Stichproben) =====
  ["pendel", 8.6, "m", 1, 6], ["pendel", 8.7, "m", 1, 5], ["pendel", 10.5, "m", 1, 1], ["pendel", 10.6, "m", 1, 0],
  ["situp", 38, "m", 1, 6], ["situp", 35, "m", 1, 5], ["situp", 19, "m", 1, 0],
  ["sprung", 254, "m", 1, 6], ["sprung", 253, "m", 1, 5],
  ["liegest", 25, "m", 1, 6], ["liegest", 24, "m", 1, 5],
  ["lauf_feld", 2801, "m", 1, 6], ["lauf_feld", 2800, "m", 1, 5],
  ["lauf_halle", 48.5, "m", 1, 6], ["lauf_halle", 48.0, "m", 1, 5],
  ["pendel", 8.7, "m", 2, 6], ["pendel", 8.8, "m", 2, 5],
  ["situp", 35, "m", 2, 6], ["situp", 34, "m", 2, 5],
  ["sprung", 250, "m", 2, 6], ["sprung", 249, "m", 2, 5],
  ["liegest", 23, "m", 2, 6], ["liegest", 22, "m", 2, 5],
  ["lauf_feld", 2701, "m", 2, 6], ["lauf_feld", 2700, "m", 2, 5],
  ["lauf_halle", 48.0, "m", 2, 6], ["lauf_halle", 47.5, "m", 2, 5],
  ["pendel", 8.9, "m", 3, 6], ["pendel", 9.0, "m", 3, 5], ["pendel", 10.7, "m", 3, 1], ["pendel", 10.8, "m", 3, 0],
  ["situp", 33, "m", 3, 6], ["situp", 32, "m", 3, 5], ["situp", 17, "m", 3, 0],
  ["sprung", 247, "m", 3, 6], ["sprung", 246, "m", 3, 5], ["sprung", 187, "m", 3, 0],
  ["liegest", 22, "m", 3, 6], ["liegest", 21, "m", 3, 5], ["liegest", 10, "m", 3, 0],
  ["lauf_feld", 2626, "m", 3, 6], ["lauf_feld", 2625, "m", 3, 5], ["lauf_feld", 1600, "m", 3, 0],
  ["lauf_halle", 45.5, "m", 3, 6], ["lauf_halle", 45.0, "m", 3, 5], ["lauf_halle", 31.0, "m", 3, 0],
  // ===== Frauen, bis 24 =====
  ["pendel", 9.4, "w", 0, 6], ["pendel", 9.5, "w", 0, 5], ["pendel", 9.6, "w", 0, 5],
  ["pendel", 9.7, "w", 0, 4], ["pendel", 10.0, "w", 0, 4], ["pendel", 10.1, "w", 0, 3],
  ["pendel", 10.6, "w", 0, 3], ["pendel", 10.7, "w", 0, 2], ["pendel", 10.9, "w", 0, 2],
  ["pendel", 11.0, "w", 0, 1], ["pendel", 11.2, "w", 0, 1], ["pendel", 11.3, "w", 0, 0],
  ["situp", 33, "w", 0, 6], ["situp", 32, "w", 0, 5], ["situp", 31, "w", 0, 5],
  ["situp", 30, "w", 0, 4], ["situp", 28, "w", 0, 4], ["situp", 27, "w", 0, 3],
  ["situp", 23, "w", 0, 3], ["situp", 22, "w", 0, 2], ["situp", 21, "w", 0, 2],
  ["situp", 20, "w", 0, 1], ["situp", 17, "w", 0, 1], ["situp", 16, "w", 0, 0],
  ["sprung", 207, "w", 0, 6], ["sprung", 206, "w", 0, 5], ["sprung", 198, "w", 0, 5],
  ["sprung", 197, "w", 0, 4], ["sprung", 190, "w", 0, 4], ["sprung", 189, "w", 0, 3],
  ["sprung", 173, "w", 0, 3], ["sprung", 172, "w", 0, 2], ["sprung", 164, "w", 0, 2],
  ["sprung", 163, "w", 0, 1], ["sprung", 157, "w", 0, 1], ["sprung", 156, "w", 0, 0],
  ["liegest", 25, "w", 0, 6], ["liegest", 24, "w", 0, 5], ["liegest", 23, "w", 0, 5],
  ["liegest", 22, "w", 0, 4], ["liegest", 21, "w", 0, 4], ["liegest", 20, "w", 0, 3],
  ["liegest", 17, "w", 0, 3], ["liegest", 16, "w", 0, 2], ["liegest", 15, "w", 0, 2],
  ["liegest", 14, "w", 0, 1], ["liegest", 13, "w", 0, 1], ["liegest", 12, "w", 0, 0],
  ["lauf_feld", 2201, "w", 0, 6], ["lauf_feld", 2200, "w", 0, 5], ["lauf_feld", 2076, "w", 0, 5],
  ["lauf_feld", 2075, "w", 0, 4], ["lauf_feld", 1951, "w", 0, 4], ["lauf_feld", 1950, "w", 0, 3],
  ["lauf_feld", 1651, "w", 0, 3], ["lauf_feld", 1650, "w", 0, 2], ["lauf_feld", 1476, "w", 0, 2],
  ["lauf_feld", 1475, "w", 0, 1], ["lauf_feld", 1351, "w", 0, 1], ["lauf_feld", 1350, "w", 0, 0],
  ["lauf_halle", 38.0, "w", 0, 6], ["lauf_halle", 37.5, "w", 0, 5], ["lauf_halle", 36.5, "w", 0, 5],
  ["lauf_halle", 36.0, "w", 0, 4], ["lauf_halle", 34.5, "w", 0, 4], ["lauf_halle", 34.0, "w", 0, 3],
  ["lauf_halle", 30.5, "w", 0, 3], ["lauf_halle", 30.0, "w", 0, 2], ["lauf_halle", 28.0, "w", 0, 2],
  ["lauf_halle", 27.5, "w", 0, 1], ["lauf_halle", 26.5, "w", 0, 1], ["lauf_halle", 26.0, "w", 0, 0],
  // ===== Frauen, weitere Altersklassen – inkl. Druckfehler-Korrektur Halle 25–29 =====
  ["lauf_halle", 37.5, "w", 1, 6], ["lauf_halle", 37.0, "w", 1, 5],
  ["lauf_halle", 35.0, "w", 1, 5], // Original „25,0–37,0“ → korrigiert 35,0–37,0
  ["lauf_halle", 34.5, "w", 1, 4],
  ["pendel", 9.5, "w", 1, 6], ["pendel", 9.6, "w", 1, 5], ["pendel", 11.6, "w", 1, 0],
  ["situp", 32, "w", 1, 6], ["situp", 31, "w", 1, 5], ["situp", 16, "w", 1, 0],
  ["sprung", 203, "w", 1, 6], ["sprung", 202, "w", 1, 5], ["sprung", 153, "w", 1, 0],
  ["liegest", 24, "w", 1, 6], ["liegest", 23, "w", 1, 5], ["liegest", 10, "w", 1, 0],
  ["lauf_feld", 2151, "w", 1, 6], ["lauf_feld", 2150, "w", 1, 5], ["lauf_feld", 1300, "w", 1, 0],
  ["pendel", 9.6, "w", 2, 6], ["pendel", 9.7, "w", 2, 5], ["pendel", 11.8, "w", 2, 0],
  ["situp", 30, "w", 2, 6], ["situp", 29, "w", 2, 5], ["situp", 15, "w", 2, 0],
  ["sprung", 200, "w", 2, 6], ["sprung", 199, "w", 2, 5], ["sprung", 151, "w", 2, 0],
  ["liegest", 22, "w", 2, 6], ["liegest", 21, "w", 2, 5], ["liegest", 10, "w", 2, 0],
  ["lauf_feld", 2076, "w", 2, 6], ["lauf_feld", 2075, "w", 2, 5], ["lauf_feld", 1275, "w", 2, 0],
  ["lauf_halle", 37.0, "w", 2, 6], ["lauf_halle", 36.5, "w", 2, 5], ["lauf_halle", 24.0, "w", 2, 0],
  ["pendel", 9.8, "w", 3, 6], ["pendel", 9.9, "w", 3, 5], ["pendel", 11.9, "w", 3, 0],
  ["situp", 28, "w", 3, 6], ["situp", 27, "w", 3, 5], ["situp", 14, "w", 3, 0],
  ["sprung", 198, "w", 3, 6], ["sprung", 197, "w", 3, 5], ["sprung", 149, "w", 3, 0],
  ["liegest", 21, "w", 3, 6], ["liegest", 20, "w", 3, 5], ["liegest", 9, "w", 3, 0],
  ["lauf_feld", 2026, "w", 3, 6], ["lauf_feld", 2025, "w", 3, 5], ["lauf_feld", 1225, "w", 3, 0],
  ["lauf_halle", 35.0, "w", 3, 6], ["lauf_halle", 34.5, "w", 3, 5], ["lauf_halle", 23.5, "w", 3, 0]
];

test("Wertungstabellen: alle Grenzwerte entsprechen der Vorschrift", async ({ page }) => {
  await page.goto("/");
  const results = await page.evaluate(cs => cs.map(([d, v, s, a]) => PFT.points(d, v, s, a)), CHECKS);
  const diffs = [];
  results.forEach((got, i) => {
    const [d, v, s, a, want] = CHECKS[i];
    if (got !== want) diffs.push(`${d} ${v} ${s} AK${a}: erwartet ${want}, erhalten ${got}`);
  });
  expect(diffs, diffs.join("\n")).toEqual([]);
  expect(results.length).toBe(CHECKS.length);
});

test("Altersklassen und Bestehen-Logik", async ({ page }) => {
  await page.goto("/");
  const r = await page.evaluate(() => {
    const Y = new Date().getFullYear();
    return {
      ak: [24, 25, 29, 30, 34, 35, 39, 45].map(a => PFT.ageIndex(a)),
      // 4+3+3+3+3 = 16, alle ≥2 → bestanden
      ok:   PFT.evaluate({ sex: "m", birthYear: Y - 24, pendel: 9.0, situp: 30, sprung: 230, liegest: 20, laufType: "feld", lauf: 2300 }),
      // 0+6+6+6+6 = 24, aber Pendellauf 0 Punkte → nicht bestanden
      fail1: PFT.evaluate({ sex: "m", birthYear: Y - 24, pendel: 10.4, situp: 40, sprung: 257, liegest: 27, laufType: "feld", lauf: 2851 }),
      // Frau 30–34: genau 15 Punkte, alle ≥2 → bestanden
      exakt15: PFT.evaluate({ sex: "w", birthYear: Y - 30, pendel: 10.3, situp: 20, sprung: 169, liegest: 15, laufType: "halle", lauf: 29.0 }),
      // 13 Punkte, alle ≥2 → nicht bestanden (unter 15)
      unter15: PFT.evaluate({ sex: "w", birthYear: Y - 30, pendel: 10.3, situp: 19, sprung: 169, liegest: 14, laufType: "halle", lauf: 29.0 }),
      // Ohne Geburtsjahr keine Wertung
      unvollst: PFT.evaluate({ sex: "m", birthYear: null, pendel: 9.0, situp: 30, sprung: 230, liegest: 20, laufType: "feld", lauf: 2300 })
    };
  });
  expect(r.ak).toEqual([0, 1, 1, 2, 2, 3, 3, 3]);
  expect(r.ok.total).toBe(16);
  expect(r.ok.pass).toBe(true);
  expect(r.fail1.total).toBe(24);
  expect(r.fail1.pass).toBe(false);
  expect(r.fail1.fails).toEqual(["pendel"]);
  expect(r.exakt15.total).toBe(15);
  expect(r.exakt15.pass).toBe(true);
  expect(r.unter15.total).toBe(13);
  expect(r.unter15.pass).toBe(false);
  expect(r.unvollst.complete).toBe(false);
});
