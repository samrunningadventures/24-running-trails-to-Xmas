/*
 * 24 Running Trails to Xmas – alle gegevens staan in dit bestand.
 *
 * Nieuwe dag toevoegen: kopieer het blok van dag 1, pas de velden aan en zet het
 * op de juiste plek in de lijst. Velden die je leeg laat (of weglaat) worden
 * gewoon niet getoond.
 *
 * Coördinaten vinden: zoek de plek op in Google Maps, klik met rechts op het
 * startpunt en klik op de twee getallen bovenaan het menu om ze te kopiëren.
 *
 * Instagram-link: gebruik de link zonder het stukje "?hvrq=..." of "?igsh=...".
 *
 * Foto's: zet ze in de map "images" en noem ze in `images`. Eén foto = één foto,
 * meerdere = een slideshow. Zonder foto's verschijnt de illustratie (`landscape`).
 *   images: ["images/dag-1-1.jpg", "images/dag-1-2.jpg"]
 * Of met extra info per foto:
 *   images: [{ src: "images/dag-1-1.jpg", alt: "Bospad bij Het Loo", caption: "Start bij Bosloo", position: "center 30%" }]
 *   - alt: korte beschrijving voor schermlezers (anders de titel van de dag)
 *   - caption: tekstje onderin de foto (optioneel)
 *   - position: welk deel zichtbaar blijft als de foto wordt bijgesneden (optioneel)
 */

window.TRAILS_CONFIG = {
  year: 2026,
  timeZone: "Europe/Amsterdam",
  instagramProfileUrl: "https://www.instagram.com/sam.runninggirl/",
};

window.TRAILS = [
  {
    day: 1,
    title: "Paleispark Het Loo",
    location: "Apeldoorn, Paleispark (Kroondomein) Het Loo",
    coords: [52.2339, 5.9453],
    parking: "Bosloo (gratis parkeren)",
    parkingQuery: "Parkeerplaats Bosloo, Apeldoorn",
    parkingCoords: null, // optioneel, bijv. [52.24, 5.93]
    distance: "2 tot 12,5 km",
    routes: "7 unieke routes, combineer ze voor nog meer plezier",
    suitableFor: ["Hardlopen", "Wandelen"],
    landscape: "forest", // forest | dunes | heath | river
    images: [
      { src: "images/placeholder-1.svg", alt: "Voorbeeldfoto", caption: "Voorbeeld met onderschrift" },
      "images/placeholder-2.svg",
      "images/placeholder-3.svg",
    ],
    intro: "Perfect voor hardlopen of wandelen 🙏",
    description: "",
    hashtags: ["hardlopen", "running", "test", "trailrun", "paleisparkhetloo"],
    instagramUrl: "https://www.instagram.com/reel/DUfuLEJiObz/",
  },
  {
    day: 2,
    title: "Loonse en Drunense Duinen",
    location: "Noord-Brabant, Nationaal Park Loonse en Drunense Duinen",
    coords: [51.6440, 5.0960],
    parking: "",
    distance: "",
    routes: "",
    suitableFor: ["Hardlopen", "Wandelen"],
    landscape: "dunes",
    images: ["images/placeholder-2.svg"],
    intro: "",
    hashtags: ["hardlopen", "trailrun", "loonseendrunenseduinen"],
    instagramUrl: "",
  },
  {
    day: 3,
    title: "Nationaal Park De Maasduinen",
    location: "Noord-Limburg, Nationaal Park De Maasduinen",
    coords: [51.5600, 6.1000],
    parking: "",
    distance: "",
    routes: "",
    suitableFor: ["Hardlopen", "Wandelen"],
    landscape: "heath",
    intro: "",
    hashtags: ["hardlopen", "trailrun", "maasduinen"],
    instagramUrl: "",
  },
  // Dag 4 t/m 24: hier toevoegen
];
