# PFT Tool – Physical Fitness Test (inoffiziell)

Punkterechner für den **Physical Fitness Test (PFT)** der Bundeswehr: Pendellauf (4×9 m),
Sit-ups (40 s), Standweitsprung, Liegestütz (40 s) und 12-Minuten-Lauf eingeben – die App
berechnet die Punktwerte (0–6 je Testaufgabe) und das Gesamtergebnis.

> **Inoffizielle App** – privates Projekt, kein Angebot der Bundeswehr.
> Alle Angaben ohne Gewähr; maßgeblich ist die offizielle Wertung.

## Funktionen

- **Teilnehmer-Modus:** Leistungen eingeben, Punkte live sehen, Verlauf lokal speichern
- **Prüfermodus:** mehrere Teilnehmer erfassen, Ergebnisliste mit bestanden/nicht bestanden,
  Aufbau- und Durchführungsanleitung für alle fünf Stationen, Drucken, Export als PDF/Bild/Text (Premium)
- **Editionen:** Freie Version (mit Werbung, begrenzte Teilnehmerzahl) und Premium
  (2,99 €: werbefrei, unbegrenzt Teilnehmer, Export als PDF/Bild/Text)
- Helles Design mit Dark Mode, responsiv, Ersteinrichtungs-Dialog
- Komplett offline-fähig, alle Daten bleiben lokal auf dem Gerät (kein Server, kein Tracking)

## Technik

- Eine einzige, in sich geschlossene `index.html` (inline CSS/JS, keine externen Abhängigkeiten)
- `npm run sync` kopiert die Web-Dateien nach `www/` (Vorbereitung für die Capacitor-App)
- Service Worker (`sw.js`) wird nur auf `github.io` registriert, nicht in der App
- Native Brücke mit Feature-Detection (`window.Capacitor`): Datei-Export und Drucken laufen im
  Browser über `a.download`/`window.print()`, in der Android-App über Capacitor-Plugins

## Wertungssystem (Kurzfassung)

Der PFT besteht aus 5 Testaufgaben, die nacheinander an einem Tag absolviert werden
(verbindliche Reihenfolge, Aufgaben 1–4 in der Halle, Aufgabe 5 im Freien):

| Nr. | Testaufgabe | Messwert |
|---|---|---|
| 1 | Pendellauf 4×9 m | Zeit auf 0,1 s (bester von 2 Versuchen) |
| 2 | Sit-ups (40 s) | korrekt ausgeführte Wiederholungen |
| 3 | Standweitsprung | Weite in cm (bester von 3 Versuchen) |
| 4 | Liegestütz (40 s) | korrekt ausgeführte Wiederholungen |
| 5 | 12-Minuten-Lauf | Strecke in m (Feld, auf 25 m) bzw. Runden (Halle, auf ½ Runde) |

Je Testaufgabe gibt es **0–6 Punkte** aus der Wertungstabelle (getrennt nach Geschlecht
und Altersklassen: bis 24, 25–29, 30–34, 35–39). **Bestanden** ist der Test, wenn in jeder
Aufgabe mindestens **2 Punkte** und insgesamt mindestens **15 Punkte** (von max. 30) erreicht werden.

Quelle: Sportschule der Bundeswehr, „Durchführungsbestimmungen Physical Fitness Test (PFT)".

## Web-Version

Die App läuft als Web-Version unter: <https://marqewi.github.io/pft-tool/>
(GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root)
