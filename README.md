# BFT Tool – Basis Fitness Test (inoffiziell)

Punkterechner für den **Basis-Fitness-Test (BFT)**: 11×10-m-Sprinttest, Klimmhang und
1000-m-Lauf (oder Fahrradergometer 3000 m) eingeben – die App berechnet Punkte, Gesamtergebnis
und Note.

> **Inoffizielle App** – privates Projekt, kein Angebot der Bundeswehr.
> Alle Angaben ohne Gewähr; maßgeblich ist die offizielle Wertung.

## Funktionen

- **Teilnehmer-Modus:** Leistungen eingeben, Punkte/Note live sehen, Verlauf lokal speichern
- **Prüfermodus:** mehrere Teilnehmer erfassen, Ergebnisliste mit bestanden/nicht bestanden,
  Aufbau- und Durchführungsanleitung für alle drei Stationen, Drucken, Export als PDF/Bild/Text (Premium)
- **Editionen:** Freie Version (mit Werbe-Platzhalter, max. 5 Teilnehmer) und Premium
  (2,99 €: werbefrei, unbegrenzt Teilnehmer, Export als PDF/Bild/Text)
- Helles Design mit Dark Mode, responsiv, Ersteinrichtungs-Dialog
- Komplett offline-fähig, alle Daten bleiben lokal auf dem Gerät (kein Server, kein Tracking)

## Technik

- Eine einzige, in sich geschlossene `index.html` (inline CSS/JS, keine externen Abhängigkeiten)
- `npm run sync` kopiert die Web-Dateien nach `www/` (Vorbereitung für die Capacitor-App)
- Service Worker (`sw.js`) wird nur auf `github.io` registriert, nicht in der App
- Native Brücke mit Feature-Detection (`window.Capacitor`): Datei-Export und Drucken laufen im
  Browser über `a.download`/`window.print()`, in der späteren Android-App über
  Capacitor-Plugins (Filesystem/Share/Printer)

## Wertungssystem (Kurzfassung)

| Disziplin | Mindestanforderung (= 100 P) | „gut“ (300 P) | „sehr gut“ (400 P) |
|---|---|---|---|
| 11×10-m-Sprinttest | 60,0 s | 48,0 s | 42,0 s |
| Klimmhang | 5 s | 45 s | 65 s |
| 1000-m-Lauf / FET 3000 m | 6:30 min | 4:30 min | 3:30 min |

Frauen erhalten einen Leistungszuschlag von 15 % (Sprint, Ausdauer) bzw. 40 % (Klimmhang).
Note aus der Punktsumme: ab 300 ausreichend, 600 befriedigend, 900 gut, 1200 sehr gut –
sofern in jeder Disziplin mindestens 100 Punkte erreicht wurden; zusätzlich als Dezimalnote
(1200 = 1,0 · 900 = 2,0 · 600 = 3,0 · 300 = 4,0). Alterszuschlag: ab dem vollendeten
36. Lebensjahr +0,5 % Punkte pro Lebensjahr (abschaltbar).

Quellen: bundeswehr.de (Basis-Fitness-Test), Informationsblatt „Sporttest Basis-Fitness-Test“,
einstellungstest-bundeswehr.de, Wikipedia „Basis-Fitness-Test“.

## Web-Version

Die App läuft als Web-Version unter: <https://marqewi.github.io/bft-rechner/>
(GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root)
