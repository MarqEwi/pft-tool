# Play-Store-Texte – PFT Tool (Vorschlag)

Eigenständige Texte, bewusst anders aufgebaut und formuliert als beim BFT Tool,
damit Google die App nicht als „wiederholten Inhalt" einstuft. Vor dem Einreichen
in der Play Console einfügen und bei Bedarf anpassen.

## App-Name (max. 30 Zeichen) – FESTGELEGT

```
PFT – Physical Fitness Test
```

(27 Zeichen – der volle Suchbegriff im Titel. „PFT Tool – Physical Fitness Test"
hätte 32 Zeichen und überschreitet das Play-Limit von 30. Der Launcher-Name
unter dem App-Icon bleibt davon unberührt „PFT Tool", Branding-konsistent
zum BFT Tool.)

## Kurzbeschreibung (max. 80 Zeichen)

```
Punkterechner für den Physical Fitness Test: 5 Übungen, Tabellenwertung 0–6.
```

## Vollständige Beschreibung (max. 4000 Zeichen)

```
Wie fit bist du nach dem Maßstab des klassischen Bundeswehr-Fitnesstests? Das PFT Tool wertet den Physical Fitness Test (PFT) aus – den fünfteiligen Sporttest, der bei der Bundeswehr bis Ende 2009 im Einsatz war und bis heute ein beliebter Standard für Training, Vereine und Sportgruppen ist.

DIE FÜNF TESTAUFGABEN
• Pendellauf 4×9 m – Aktionsschnelligkeit (Zeit auf 0,1 s)
• Sit-ups in 40 Sekunden – Kraftausdauer des Rumpfes
• Standweitsprung – Schnellkraft der Beine (in cm)
• Liegestütz in 40 Sekunden – Kraftausdauer der Arme
• 12-Minuten-Lauf – Ausdauer, wahlweise Bahn (Meter) oder Halle (Runden)

ECHTE TABELLENWERTUNG
Jede Übung wird mit 0 bis 6 Punkten nach den offiziellen Wertungstabellen der Sportschule der Bundeswehr bewertet – getrennt nach Männern und Frauen und vier Altersklassen (bis 24, 25–29, 30–34, 35–39). Bestanden ist der Test ab 15 von 30 Punkten, wenn zugleich keine Übung unter 2 Punkten liegt. Die kompletten Tabellen sind in der App einsehbar.

FÜR DICH SELBST …
Leistungen eintippen und sofort sehen, wo du stehst: Punkte je Übung, Gesamtergebnis, bestanden oder nicht – plus Verlauf, um deinen Fortschritt über Wochen zu verfolgen.

… ODER FÜR DEINE GRUPPE
Im Prüfermodus erfasst du beliebig viele Teilnehmerinnen und Teilnehmer, siehst alle Ergebnisse auf einen Blick und hast die komplette Aufbau- und Durchführungsanleitung für alle fünf Stationen dabei – vom Mattenaufbau bis zur Messwertaufnahme. Ergebnislisten lassen sich drucken oder als PDF, Bild und Text exportieren (Premium).

DEINE DATEN GEHÖREN DIR
Alles wird ausschließlich lokal auf deinem Gerät gespeichert. Kein Konto, kein Server, kein Tracking durch den Anbieter – die App funktioniert komplett offline.

PREMIUM (EINMALIG, KEIN ABO)
Die freie Version enthält Werbung und begrenzt den Prüfermodus auf drei Teilnehmer. Der einmalige Premium-Kauf entfernt die Werbung, hebt das Limit auf und schaltet Export und Druck frei.

HINWEIS
Inoffizielle App, kein Angebot der Bundeswehr. Der PFT wurde dort zum 1. Januar 2010 durch den Basis-Fitness-Test abgelöst; „Physical Fitness Test" wird nur beschreibend verwendet. Alle Angaben ohne Gewähr – maßgeblich ist die offizielle Wertung.
```

## Grafiken (Learning 17)

- **App-Icon 512×512**: liegt bereit unter `icons/icon-512.png`
- **Feature-Grafik 1024×500**: Logo bündig auf exakt gleichfarbigem Hintergrund –
  Farbwert des Logo-Hintergrunds: **#5C673C** (aus dem Logo gemessen)
- **Screenshots**: gerahmt mit Überschrift, eigene Motive (nicht die BFT-Screenshots):
  1. Teilnehmer-Rechner mit Ergebnis („Alle 5 Übungen, sofort ausgewertet")
  2. Wertungstabellen in den Einstellungen („Die offiziellen Tabellen immer dabei")
  3. Prüfermodus-Liste („Ganze Gruppen erfassen")
  4. Aufbau-&-Ablauf-Anleitung („Jede Station richtig aufbauen")
  5. Verlauf („Fortschritt verfolgen")

## Formulare (Learning 16, Kurzreferenz)

- Data Safety: Geräte-/andere IDs, ungefährer Standort, App-Interaktionen,
  Absturz/Diagnose – „erhoben und geteilt", Zweck Werbung + Analyse,
  nicht sitzungsspezifisch, keine Löschfunktion
- Anzeigen: Ja · Werbe-ID: Ja · Zielgruppe: 18+
- Datenschutz-URL: `https://marqewi.github.io/pft-tool/datenschutz.html`
- In-App-Produkt: `premium_unlock` (Einmalkauf, 2,99 €, „Digitale Inhalte";
  Kaufoptions-ID `premium-unlock`)
- AdMob-DSGVO-Meldung: Option „Nicht einwilligen" auf AN
