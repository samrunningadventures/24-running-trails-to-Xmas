# 24 Running Trails to Xmas

Interactieve adventskalender-kaart in de stijl van *Sam Runninggirl – Weekendjes weg & mooiste trails*.
Van 1 t/m 24 december gaat er elke dag (00:00, Nederlandse tijd) een nieuw cadeautje open op de kaart,
met alle info over de trail en een link naar de Instagram-reel.

## Bestanden
| Bestand | Wat |
| --- | --- |
| `index.html` | De pagina |
| `trails.js` | **Alle routes + instellingen**: alleen dit bestand hoef je aan te passen |
| `styles.css` | Stijl (kleuren, lettertypes, kaartjes) |
| `app.js` | Logica (kaart, ontgrendelen, detailpaneel) |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Icoontjes voor het browsertabblad en het beginscherm |
| `images/` | Foto's per dag (nu nog met voorbeeldplaatjes `placeholder-1.svg` t/m `3`) |
| `og-image.png` | Voorbeeldplaatje als de link gedeeld wordt (WhatsApp, Instagram...) |
| `.nojekyll` | Zorgt dat GitHub Pages de bestanden serveert zoals ze zijn (zonder Jekyll) |
| `PROMPT.md` | De prompt waarmee dit is gebouwd |

## Een nieuwe dag toevoegen
1. Open `trails.js`.
2. Kopieer het blok van dag 1 en plak het onderaan de lijst (vóór `];`).
3. Pas `day`, `title`, `location`, `coords`, `parking`, `distance`, `routes`, `intro`, `hashtags` en `instagramUrl` aan.
   - **Coördinaten:** zoek de plek op in Google Maps, klik met rechts op het startpunt en klik op de getallen om ze te kopiëren.
   - **Instagram-link:** zonder `?hvrq=...` of `?igsh=...` erachter.
   - **Landschap:** `forest`, `dunes`, `heath` of `river` (bepaalt de illustratie).
   - Velden die je leeg laat, worden niet getoond.
4. Zonder `title` of `coords` verschijnt een geopende dag als "Binnenkort" en niet op de kaart.

## Foto's toevoegen
1. Zet de foto's in de map `images`, bijvoorbeeld `images/dag-4-1.jpg`, `images/dag-4-2.jpg`.
   Geen spaties of hoofdletters in de bestandsnaam: GitHub Pages let op hoofdletters.
2. Zet ze bij de dag in `trails.js`:
   ```js
   images: ["images/dag-4-1.jpg", "images/dag-4-2.jpg"],
   ```
   Eén foto wordt één foto, meer foto's worden een slideshow (swipen op mobiel, pijltjes op desktop).
   Zonder `images` blijft de illustratie staan. Klopt een pad niet, dan zie je ook de illustratie.
3. Wil je een onderschrift of een betere uitsnede? Gebruik dan een object:
   ```js
   images: [{ src: "images/dag-4-1.jpg", alt: "Zandpad door de duinen", caption: "Start bij de parkeerplaats", position: "center 30%" }],
   ```
   `position` bepaalt welk deel zichtbaar blijft. De foto wordt liggend (16:10) getoond, dus bij
   staande foto's valt boven en onder iets weg.

Tip: maak foto's ongeveer 1200 px breed en sla ze op als JPG (liefst onder 300 KB), dan laadt het paneel snel.

Let op: dag 1 en 2 gebruiken nu de voorbeeldplaatjes. Vervang ze vóór 1 december door echte foto's
(of haal de `images`-regels weg), anders zien bezoekers "Foto volgt".

## Testen
Open de pagina met `?preview=N` om te doen alsof het N december is:
- `index.html?preview=0`: vóór 1 december
- `index.html?preview=3`: dag 3
- `index.html?preview=24`: alles open

Een preview werkt alleen voor dagen die al compleet in `trails.js` staan (met `title` en `coords`).
Vraag je een dag op die er nog niet in staat, dan ga je terug naar de gewone pagina.
Let op: wat in `trails.js` staat is openbaar (in de code en de repo). Zet een dag er dus pas in
als hij open mag.

## Delen
Elke dag heeft een eigen link: `index.html#dag-1`. Die staat in de adresbalk zodra je een dag
openklikt, en de knop "Deel deze trail" deelt of kopieert hem. Een link naar een dag die nog
niet open is, opent gewoon de pagina.

Verhuist de site naar een ander adres? Pas dan in `index.html` de adressen bij
`canonical`, `og:url` en `og:image` aan, anders klopt het linkvoorbeeld niet.

## Lokaal bekijken
```
python3 -m http.server
```
Ga daarna naar http://localhost:8000. Hosten kan bijvoorbeeld via GitHub Pages (Settings → Pages → branch kiezen).

De kaart gebruikt de gratis tegels van OpenStreetMap. Dat mag voor een kleine site, zolang de
bronvermelding zichtbaar blijft ([gebruiksregels](https://operations.osmfoundation.org/policies/tiles/)).
