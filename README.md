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

## Testen
Open de pagina met `?preview=N` om te doen alsof het N december is:
- `index.html?preview=0`: vóór 1 december
- `index.html?preview=3`: dag 3
- `index.html?preview=24`: alles open

Een directe link naar een dag: `index.html#dag-1`.

## Lokaal bekijken
```
python3 -m http.server
```
Ga daarna naar http://localhost:8000. Hosten kan bijvoorbeeld via GitHub Pages (Settings → Pages → branch kiezen).
