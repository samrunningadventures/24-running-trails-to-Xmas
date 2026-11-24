# Prompt – 24 Running Trails to Xmas

Bouw een interactieve adventskalender-kaart: "24 Running Trails to Xmas".
Van 1 tot en met 24 december verschijnt er elke dag een nieuwe trailtip op een
kaart van Nederland (en omgeving). Elke tip staat als een kerstcadeautje met het
dagnummer op de plek van de route. Klik je op een cadeautje, dan opent er een
kaart met alle informatie over die run en een link naar de Instagram-reel.

De kaart hoort bij mijn website "Sam Runninggirl – Weekendjes weg & mooiste trails"
en moet dezelfde uitstraling hebben.

## Techniek
- Statische pagina (HTML/CSS/JS) zonder build-stap, zodat ik hem op mijn site kan
  zetten, embedden of via GitHub Pages kan hosten.
- Kaart met Leaflet.js en een rustige, lichte kaartlaag (CARTO Positron), iets warmer
  gekleurd zodat de kleuren van de site naar voren komen.
- Alle routes staan in een apart bestand `trails.js`, zodat ik dag 4 t/m 24 kan
  toevoegen zonder de rest van de code aan te raken. Daarin staat ook een klein
  config-blok (jaar, tijdzone, link naar mijn Instagram-profiel).
- Volledig responsive: eerst goed op mobiel, daarna op desktop.
- Scrollen over de kaart mag de pagina niet "vangen": inzoomen met het scrollwiel
  pas na een klik op de kaart.

## Stijl (overnemen van mijn site)
- Achtergrond: warme, zachte gradient van perzik/zalm (#F1E2D3) naar crème (#F7F2EA).
- Kleuren: diep bosgroen #23392E, saliegroen #6F8466, zand/oker #C9A86A,
  terracotta-accent #C0623F, kaartjes in gebroken wit #FBF7F1.
- Typografie: koppen in een zware, elegante serif (Fraunces), lopende tekst in een
  rustige sans-serif (Inter).
- Kleine bovenlabels in hoofdletters met ruime letterafstand, in terracotta.
- Afgeronde kaartjes (radius ±20px), zachte schaduwen, veel witruimte.
- Pill-knoppen: primair donkergroen met crème tekst, secundair crème met rand.
- Platte landschapsillustraties in SVG (glooiende heuvels, zachte zon, kronkelend
  wit pad) per type landschap: bos, duinen, heide, rivier.
- Kerstsfeer subtiel: geen felrood of glitter, wel het cadeautje, sterretjes en
  heel lichte sneeuw in de stijlkleuren.

## Opbouw van de pagina
1. Zwevende pill-navigatie: "Sam Runninggirl" / "Weekendjes weg & mooiste trails",
   rechts "Volg op Instagram".
2. Hero: label "ADVENTSKALENDER 2026", titel "24 trails tot kerst", korte intro,
   teller en rechts een uitgelicht kaartje met de tip van vandaag.
3. De kaart (groot, afgeronde hoeken, schaduw).
4. Een raster met 24 deurtjes: open dagen zijn klikbaar en zoomen in op de kaart,
   toekomstige dagen zijn gesloten cadeautjes met een slotje.
5. Donkergroene footer zoals op mijn site.

## Markers en ontgrendelen
- Elke marker is een eigen SVG-cadeautje met strik en het dagnummer.
- Dag X gaat open op X december om 00:00 Nederlandse tijd (Europe/Amsterdam).
- Toekomstige dagen staan niet op de kaart; in het deurtjes-raster wel als gesloten cadeau.
- De tip van vandaag pulseert zacht en heeft het label "Nieuw vandaag".
- Bij het openen zoomt de kaart naar de tip van vandaag.
- Vóór 1 december: een nette "bijna"-staat met aftelling tot het eerste cadeautje
  en een melding op de lege kaart.
- Na 24 december blijven alle 24 dagen open.
- Testmodus: `?preview=24` doet alsof het 24 december is (`?preview=0` = vóór december).

## Detailkaart
Op mobiel een bottom sheet, op desktop een zijpaneel. Inhoud: illustratie, label
"DAG 1 · TRAIL TIP", titel, 📍 locatie, 🅿️ parkeren, 🏃‍♀️ afstand en routes,
intro/beschrijving, "Geschikt voor"-tags, hashtags, knop "Bekijk de reel op
Instagram" (nieuw tabblad), knop "Route naar parkeerplaats" (Google Maps; op
coördinaten als die er zijn, anders op naam van de parkeerplaats), vorige/volgende
dag (alleen geopende dagen), sluiten met ✕, Esc of klik op de achtergrond.

## Data
```js
{
  day: 1,
  title: "Paleispark Het Loo",
  location: "Apeldoorn, Paleispark (Kroondomein) Het Loo",
  coords: [52.2339, 5.9453],               // controleren
  parking: "Bosloo (gratis parkeren)",
  parkingQuery: "Parkeerplaats Bosloo, Apeldoorn",
  parkingCoords: null,                      // optioneel, exacter dan parkingQuery
  distance: "2 tot 12,5 km",
  routes: "7 unieke routes, combineer ze voor nog meer plezier",
  suitableFor: ["Hardlopen", "Wandelen"],
  landscape: "forest",                      // forest | dunes | heath | river
  intro: "Perfect voor hardlopen of wandelen 🙏",
  hashtags: ["hardlopen", "running", "dutchrunner", "trailrun", "paleisparkhetloo"],
  instagramUrl: "https://www.instagram.com/reel/DUfuLEJiObz/"   // zonder ?hvrq=...
}
```
- Dag 2: Loonse en Drunense Duinen (duinen), dag 3: Nationaal Park De Maasduinen (heide).
  Dag 4 t/m 24 volgen nog.
- Lege velden worden weggelaten. Een geopende dag zonder titel of coördinaten
  verschijnt als "Binnenkort" in het raster en niet op de kaart.

## Extra's
- Toegankelijk: markers en deurtjes met toetsenbord te bedienen, aria-labels
  ("Dag 1: Paleispark Het Loo"), focus blijft in het paneel, voldoende contrast.
- `prefers-reduced-motion`: geen puls, sneeuw of vlieg-animatie.
- Alle teksten in het Nederlands.
- README met uitleg hoe je een nieuwe dag toevoegt.
