(function () {
  "use strict";

  var CFG = window.TRAILS_CONFIG || {};
  var YEAR = CFG.year || new Date().getFullYear();
  var TZ = CFG.timeZone || "Europe/Amsterdam";
  var TRAILS = (window.TRAILS || []).slice().sort(function (a, b) { return a.day - b.day; });
  var byDay = {};
  TRAILS.forEach(function (t) { byDay[t.day] = t; });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Datum & ontgrendelen ---------- */
  function nlToday() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, m: +o.month, d: +o.day };
  }

  function isReady(t) {
    return !!(t && t.title && Array.isArray(t.coords) && t.coords.length === 2);
  }

  var today = nlToday();
  var loadedDate = today;
  var previewDay = null;
  var previewParam = new URLSearchParams(location.search).get("preview");
  if (previewParam !== null) {
    if (/^\d+$/.test(previewParam)) previewDay = Math.max(0, Math.min(25, +previewParam));
    // Preview van een dag die nog niet (compleet) in trails.js staat: terug naar de gewone pagina.
    if (previewDay === null || (previewDay > 0 && !isReady(byDay[Math.min(previewDay, 24)]))) {
      location.replace(location.pathname + location.hash);
      return;
    }
    today = previewDay === 0 ? { y: YEAR, m: 11, d: 30 } : { y: YEAR, m: 12, d: previewDay };
  }

  var openCount = (function () {
    if (today.y < YEAR) return 0;
    if (today.y > YEAR) return 24;
    if (today.m < 12) return 0;
    return Math.min(today.d, 24);
  })();
  var todayDay = today.y === YEAR && today.m === 12 && today.d <= 24 ? today.d : null;

  function daysBetween(a, b) {
    return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86400000);
  }

  var openDays = TRAILS.filter(function (t) { return t.day <= openCount && isReady(t); })
    .map(function (t) { return t.day; });

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function has(v) { return Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== ""; }
  function $(id) { return document.getElementById(id); }

  var uid = 0;

  /* ---------- Illustraties ---------- */
  var SCENES = {
    forest: {
      sky: ["#F1D9C4", "#F7EEE3"], sun: "#F2C48D", sunPos: [312, 70, 34],
      layers: [
        ["#9AAA8A", "M0 150 C 60 120 120 118 180 138 S 300 110 400 128 V240 H0Z"],
        ["#6F8466", "M0 172 C 70 150 140 152 210 168 S 330 150 400 160 V240 H0Z"],
        ["#23392E", "M0 200 C 80 182 170 186 240 198 S 350 184 400 192 V240 H0Z"]
      ],
      trees: true,
      path: "M150 240 C 170 214 210 200 226 186 S 250 168 262 160"
    },
    dunes: {
      sky: ["#CFDCE0", "#F2EADF"], sun: "#F2C48D", sunPos: [80, 64, 26],
      layers: [
        ["#E4CFA0", "M0 140 C 80 104 160 110 230 132 S 340 120 400 112 V240 H0Z"],
        ["#C9A86A", "M0 168 C 90 140 170 150 250 166 S 350 150 400 150 V240 H0Z"],
        ["#4F6B55", "M0 200 C 90 184 180 190 260 200 S 360 188 400 194 V240 H0Z"]
      ],
      grass: true,
      path: "M60 240 C 110 214 180 196 230 182 S 320 156 350 146"
    },
    heath: {
      sky: ["#EAD3C8", "#F6EEE6"], sun: "#F2C48D", sunPos: [300, 78, 30],
      layers: [
        ["#B9A27C", "M0 148 C 70 128 150 128 220 144 S 340 128 400 136 V240 H0Z"],
        ["#A98785", "M0 176 C 80 160 160 164 240 174 S 350 160 400 168 V240 H0Z"],
        ["#3E5646", "M0 206 C 90 192 180 196 260 204 S 360 194 400 198 V240 H0Z"]
      ],
      trees: "sparse",
      path: "M240 240 C 220 220 190 206 176 190 S 160 168 150 158"
    },
    river: {
      sky: ["#D9E0D6", "#F4EEE4"], sun: "#F2C48D", sunPos: [96, 72, 28],
      layers: [
        ["#9AAA8A", "M0 140 C 90 116 170 122 240 136 S 340 120 400 126 V240 H0Z"],
        ["#6F8466", "M0 166 C 90 150 180 156 250 164 S 350 150 400 156 V240 H0Z"],
        ["#23392E", "M0 204 C 90 190 180 194 260 202 S 360 190 400 196 V240 H0Z"]
      ],
      water: "M0 196 C 90 176 200 186 260 176 S 360 160 400 166 V178 C 360 176 300 190 250 196 S 100 206 0 214Z",
      path: ""
    }
  };

  function scene(type) {
    var s = SCENES[type] || SCENES.forest;
    var id = "sky" + (++uid);
    var out = '<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + s.sky[0] + '"/><stop offset="1" stop-color="' + s.sky[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="240" fill="url(#' + id + ')"/>' +
      '<circle cx="' + s.sunPos[0] + '" cy="' + s.sunPos[1] + '" r="' + s.sunPos[2] + '" fill="' + s.sun + '" opacity=".9"/>' +
      stars();
    s.layers.forEach(function (l, i) {
      out += '<path d="' + l[1] + '" fill="' + l[0] + '"/>';
      if (i === 1 && s.trees) out += trees(s.trees === "sparse");
      if (i === 1 && s.grass) out += grass();
    });
    if (s.water) out += '<path d="' + s.water + '" fill="#A9BFC2" opacity=".9"/>';
    if (s.path) out += '<path d="' + s.path + '" fill="none" stroke="#FBF7F1" stroke-width="5" stroke-linecap="round" opacity=".92"/>';
    return out + "</svg>";
  }

  function stars() {
    var pts = [[40, 30], [120, 22], [210, 40], [250, 18], [360, 34], [180, 70]];
    return pts.map(function (p) {
      return '<path d="M' + p[0] + " " + (p[1] - 4) + "L" + (p[0] + 1) + " " + (p[1] - 1) + "L" + (p[0] + 4) + " " + p[1] +
        "L" + (p[0] + 1) + " " + (p[1] + 1) + "L" + p[0] + " " + (p[1] + 4) + "L" + (p[0] - 1) + " " + (p[1] + 1) +
        "L" + (p[0] - 4) + " " + p[1] + "L" + (p[0] - 1) + " " + (p[1] - 1) + 'Z" fill="#FBF7F1" opacity=".8"/>';
    }).join("");
  }

  function trees(sparse) {
    var xs = sparse ? [64, 318, 350] : [36, 70, 98, 300, 330, 360, 384];
    return xs.map(function (x, i) {
      var h = 26 + (i % 3) * 8;
      var base = 166 - (i % 2) * 4;
      return '<path d="M' + x + " " + (base - h) + " L" + (x + 10) + " " + base + " L" + (x - 10) + " " + base + 'Z" fill="#2F4A3A"/>';
    }).join("");
  }

  function grass() {
    var out = "";
    [40, 52, 64, 300, 312, 336].forEach(function (x) {
      out += '<path d="M' + x + ' 166 q 2 -12 6 -16 M' + (x + 4) + ' 166 q -2 -10 -6 -14" stroke="#6F8466" stroke-width="2" fill="none" stroke-linecap="round"/>';
    });
    return out;
  }

  /* ---------- Cadeautje ---------- */
  function giftSVG(opts) {
    opts = opts || {};
    var box = opts.box || "#23392E";
    var lid = opts.lid || "#2F4A3A";
    var ribbon = opts.ribbon || "#C0623F";
    return '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
      '<path d="M24 13 C 17 3 9 8 15 13 Z" fill="' + ribbon + '"/>' +
      '<path d="M24 13 C 31 3 39 8 33 13 Z" fill="' + ribbon + '"/>' +
      '<rect x="8" y="19" width="32" height="25" rx="5" fill="' + box + '"/>' +
      '<rect x="5" y="12" width="38" height="9" rx="3.5" fill="' + lid + '"/>' +
      '<rect x="21" y="12" width="6" height="9" fill="' + ribbon + '"/>' +
      '<circle cx="24" cy="13" r="3" fill="' + ribbon + '"/>' +
      "</svg>";
  }

  /* ---------- Header / hero ---------- */
  var igUrl = CFG.instagramProfileUrl || "https://www.instagram.com/";
  $("ig-profile").href = igUrl;
  $("ig-profile-footer").href = igUrl;
  $("year").textContent = YEAR;
  $("footer-year").textContent = YEAR;

  function renderCounter() {
    var xmas = { y: YEAR, m: 12, d: 25 };
    var html;
    if (openCount === 0) {
      var toStart = daysBetween(today, { y: YEAR, m: 12, d: 1 });
      html = '<div class="counter-num">' + Math.max(toStart, 0) + "</div>" +
        '<div><p class="counter-title">' + (toStart === 1 ? "Nog 1 nachtje" : "Nog " + toStart + " dagen") + " tot het eerste cadeautje</p>" +
        '<p class="counter-sub">Op 1 december gaat deurtje 1 open.</p></div>';
    } else if (todayDay) {
      var left = daysBetween(today, xmas);
      html = '<div class="counter-num">' + todayDay + "</div>" +
        '<div><p class="counter-title">Dag ' + todayDay + " van 24</p>" +
        '<p class="counter-sub">' + (left === 1 ? "Morgen is het kerst 🎄" : "Nog " + left + " dagen tot kerst") + "</p></div>";
    } else {
      html = '<div class="counter-num">24</div>' +
        '<div><p class="counter-title">Alle 24 trails staan open</p>' +
        '<p class="counter-sub">Fijne feestdagen en veel loopplezier 🎄</p></div>';
    }
    $("counter").innerHTML = html;
    if (previewDay !== null) {
      var chip = document.createElement("span");
      chip.className = "preview-chip";
      chip.textContent = previewDay === 0 ? "Preview: vóór 1 december" : "Preview: " + previewDay + " december";
      $("counter").insertAdjacentElement("afterend", chip);
    }
  }

  function renderFeature() {
    var featureDay = todayDay && openDays.indexOf(todayDay) !== -1 ? todayDay : openDays[openDays.length - 1];
    var t = featureDay ? byDay[featureDay] : null;
    var el = $("hero-feature");
    if (t) {
      el.innerHTML = '<button class="feature-card" type="button" aria-label="Open dag ' + t.day + ": " + esc(t.title) + '">' +
        '<div class="feature-art">' + scene(t.landscape) + "</div>" +
        '<span class="feature-badge">' + (t.day === todayDay ? "Nieuw vandaag · dag " + t.day : "Dag " + t.day) + "</span>" +
        '<div class="feature-body"><p class="eyebrow">Trail tip</p>' +
        '<p class="feature-title">' + esc(t.title) + "</p>" +
        '<p class="feature-meta">' + esc([t.location, t.distance].filter(has).join(" · ")) + "</p></div></button>";
      el.querySelector("button").addEventListener("click", function (e) { focusTrail(t.day, e.currentTarget); });
    } else {
      el.innerHTML = '<button class="feature-card" type="button" disabled>' +
        '<div class="feature-art">' + scene("forest") + "</div>" +
        '<span class="feature-badge">Dag 1 · 1 december</span>' +
        '<div class="feature-body"><p class="eyebrow">Binnenkort</p>' +
        '<p class="feature-title">Het eerste cadeautje is nog ingepakt</p>' +
        '<p class="feature-meta">Kom op 1 december terug voor trail 1.</p></div></button>';
    }
  }

  function renderSnow() {
    if (reduceMotion) return;
    var wrap = document.querySelector(".snow");
    for (var i = 0; i < 22; i++) {
      var s = document.createElement("span");
      var size = 2 + Math.random() * 4;
      s.style.left = Math.random() * 100 + "%";
      s.style.width = s.style.height = size + "px";
      s.style.animationDuration = 9 + Math.random() * 10 + "s";
      s.style.animationDelay = -Math.random() * 18 + "s";
      s.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      wrap.appendChild(s);
    }
  }

  /* ---------- Kaart ---------- */
  // Op touchscreens: één vinger scrollt de pagina, twee vingers verplaatsen/zoomen de kaart.
  // Zonder `dragging` krijgt de kaart van Leaflet `touch-action: pan-x pan-y`, waardoor de
  // browser het scrollen met één vinger afhandelt en Leaflets pinch-zoom het met twee doet.
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  var map = L.map("map", {
    scrollWheelZoom: false,
    dragging: !coarsePointer,
    zoomSnap: 0.5,
    attributionControl: true
  }).fitBounds([[50.75, 3.4], [53.5, 7.2]]);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bijdragers'
  }).addTo(map);

  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.getContainer().addEventListener("mouseleave", function () { map.scrollWheelZoom.disable(); });

  if (coarsePointer) {
    var hint = $("map-hint");
    var hintTimer = null;
    var touchStart = null;
    var mapEl = map.getContainer();
    mapEl.addEventListener("touchstart", function (e) {
      touchStart = e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null;
      if (e.touches.length > 1) hint.classList.remove("is-visible");
    }, { passive: true });
    mapEl.addEventListener("touchmove", function (e) {
      if (!touchStart || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - touchStart[0], dy = e.touches[0].clientY - touchStart[1];
      if (dx * dx + dy * dy < 144) return;
      touchStart = null;
      hint.classList.add("is-visible");
      clearTimeout(hintTimer);
      hintTimer = setTimeout(function () { hint.classList.remove("is-visible"); }, 1600);
    }, { passive: true });
  }

  var markers = {};
  openDays.forEach(function (day) {
    var t = byDay[day];
    var isToday = day === todayDay;
    var label = "Dag " + day + ": " + t.title;
    var icon = L.divIcon({
      className: "gift-icon",
      html: '<div class="gift-marker' + (isToday ? " is-today" : "") + '">' + giftSVG() +
        '<span class="gift-num">' + day + "</span>" +
        (isToday ? '<span class="gift-label">Nieuw vandaag</span>' : "") + "</div>",
      iconSize: [48, 56],
      iconAnchor: [24, 50]
    });
    var m = L.marker(t.coords, { icon: icon, title: label, alt: label, keyboard: true, riseOnHover: true,
      zIndexOffset: isToday ? 1000 : 0 }).addTo(map);
    var el = m.getElement();
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", label);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSheet(day, el); }
    });
    m.on("click", function () { openSheet(day, el); });
    markers[day] = m;
  });

  if (openDays.length === 0) {
    $("map-empty").hidden = false;
    document.querySelector(".map-empty .gift-big").innerHTML = giftSVG();
  } else if (todayDay && markers[todayDay]) {
    map.setView(byDay[todayDay].coords, 9);
  } else if (openDays.length > 1) {
    map.fitBounds(L.latLngBounds(openDays.map(function (d) { return byDay[d].coords; })).pad(0.35));
  } else {
    map.setView(byDay[openDays[0]].coords, 9);
  }

  function flyTo(day) {
    var t = byDay[day];
    if (!t) return;
    var z = Math.max(map.getZoom(), 10);
    if (reduceMotion) map.setView(t.coords, z);
    else map.flyTo(t.coords, z, { duration: 0.8 });
  }

  function focusTrail(day, trigger) {
    flyTo(day);
    openSheet(day, trigger);
  }

  /* ---------- Deurtjes ---------- */
  var LOCK = '<svg class="door-lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  function renderDoors() {
    var list = $("doors");
    var html = "";
    for (var d = 1; d <= 24; d++) {
      var t = byDay[d];
      var unlocked = d <= openCount;
      var ready = unlocked && isReady(t);
      var cls = "door";
      var inner = '<span class="door-num">' + d + "</span>";
      var attrs = ' type="button" data-day="' + d + '"';
      if (ready) {
        if (d === todayDay) { cls += " is-today"; inner += '<span class="door-tag">Vandaag</span>'; }
        inner += '<span class="door-title">' + esc(t.title) + "</span>";
        attrs += ' aria-label="Dag ' + d + ": " + esc(t.title) + '"';
      } else if (unlocked) {
        cls += " is-soon";
        inner += '<span class="door-title">Binnenkort</span>';
        attrs += ' aria-disabled="true" aria-label="Dag ' + d + ': binnenkort"';
      } else {
        cls += " is-locked";
        inner += LOCK + '<span class="door-gift">' + giftSVG({ box: "#C9A86A", lid: "#B8955A", ribbon: "#6F8466" }) + "</span>";
        attrs += ' aria-disabled="true" aria-label="Dag ' + d + ": opent op " + d + ' december"';
      }
      html += '<li><button class="' + cls + '"' + attrs + ">" + inner + "</button></li>";
    }
    list.innerHTML = html;
    list.addEventListener("click", function (e) {
      var btn = e.target.closest("button.door");
      if (!btn || btn.getAttribute("aria-disabled") === "true") return;
      var day = +btn.dataset.day;
      document.getElementById("kaart").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      focusTrail(day, btn);
    });
  }

  /* ---------- Detailpaneel ---------- */
  var sheet = $("sheet");
  var backdrop = $("sheet-backdrop");
  var content = $("sheet-content");
  var lastTrigger = null;
  var currentDay = null;

  function routeUrl(t) {
    var dest = has(t.parkingCoords) ? t.parkingCoords.join(",") : has(t.parkingQuery) ? t.parkingQuery : t.coords.join(",");
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest);
  }

  function fact(icon, label, value) {
    if (!has(value)) return "";
    return '<li class="fact"><span class="fact-icon" aria-hidden="true">' + icon + "</span>" +
      '<span><span class="fact-label">' + label + '</span><span class="fact-value">' + esc(value) + "</span></span></li>";
  }

  var SHARE = '<svg class="ig-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var PAGE_TITLE = document.title;
  var DAY_HASH = /^#dag-(\d{1,2})$/;

  function shareUrl(day) {
    return location.origin + location.pathname + "#dag-" + day;
  }

  // Zet #dag-N in de adresbalk zonder extra stap in de geschiedenis.
  function setDayHash(day) {
    if (!day && !DAY_HASH.test(location.hash)) return;
    history.replaceState(null, "", location.pathname + location.search + (day ? "#dag-" + day : ""));
    document.title = day ? "Dag " + day + ": " + byDay[day].title + " · " + PAGE_TITLE : PAGE_TITLE;
  }

  function shareDay(day, btn) {
    var t = byDay[day];
    var url = shareUrl(day);
    var label = btn.querySelector(".share-label");
    function feedback(text) {
      label.textContent = text;
      setTimeout(function () { label.textContent = "Deel deze trail"; }, 2200);
    }
    if (navigator.share) {
      navigator.share({ title: "Dag " + day + ": " + t.title, text: "Trail tip " + day + " van 24 trails tot kerst", url: url })
        .catch(function () {});
    } else if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () { feedback("Link gekopieerd ✓"); },
        function () { window.prompt("Kopieer de link:", url); });
    } else {
      window.prompt("Kopieer de link:", url);
    }
  }

  var IG = '<svg class="ig-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>';

  function renderSheet(day) {
    var t = byDay[day];
    var idx = openDays.indexOf(day);
    var prev = openDays[idx - 1];
    var next = openDays[idx + 1];
    var html = '<div class="sheet-art">' + scene(t.landscape) + "</div>" +
      '<div class="sheet-body">' +
      '<p class="eyebrow">Dag ' + t.day + " · Trail tip" + (t.day === todayDay ? " · Nieuw vandaag" : "") + "</p>" +
      '<h2 id="sheet-title">' + esc(t.title) + "</h2>" +
      (has(t.intro) ? '<p class="sheet-intro">' + esc(t.intro) + "</p>" : "") +
      '<ul class="facts">' +
      fact("📍", "Locatie", t.location) +
      fact("🅿️", "Parkeren", t.parking) +
      fact("🏃‍♀️", "Afstand", t.distance) +
      fact("🧭", "Routes", t.routes) +
      "</ul>" +
      (has(t.description) ? '<p class="sheet-desc">' + esc(t.description) + "</p>" : "");

    if (has(t.suitableFor)) {
      html += '<div class="tag-group"><span class="tag-group-label">Geschikt voor</span><ul class="tags">' +
        t.suitableFor.map(function (s) { return '<li class="tag tag-solid">' + esc(s) + "</li>"; }).join("") + "</ul></div>";
    }
    if (has(t.hashtags)) {
      html += '<div class="tag-group"><span class="tag-group-label">Hashtags</span><ul class="tags">' +
        t.hashtags.map(function (s) { return '<li class="tag">#' + esc(String(s).replace(/^#/, "")) + "</li>"; }).join("") + "</ul></div>";
    }

    html += '<div class="sheet-actions">' +
      (has(t.instagramUrl)
        ? '<a class="btn btn-primary" href="' + esc(t.instagramUrl) + '" target="_blank" rel="noopener">' + IG + "Bekijk de reel op Instagram</a>"
        : '<span class="btn btn-primary" aria-disabled="true">' + IG + "Reel volgt binnenkort</span>") +
      '<a class="btn btn-secondary" href="' + esc(routeUrl(t)) + '" target="_blank" rel="noopener">Route naar ' + (has(t.parking) ? "parkeerplaats" : "startpunt") + "</a>" +
      '<button class="btn btn-secondary" type="button" id="share-btn">' + SHARE + '<span class="share-label" aria-live="polite">Deel deze trail</span></button>' +
      "</div>" +
      '<div class="sheet-nav">' +
      '<button class="nav-btn" type="button" data-go="' + (prev || "") + '"' + (prev ? "" : " disabled") + ">← " + (prev ? "Dag " + prev : "Vorige") + "</button>" +
      '<button class="nav-btn" type="button" data-go="' + (next || "") + '"' + (next ? "" : " disabled") + ">" + (next ? "Dag " + next : "Volgende") + " →</button>" +
      "</div></div>";
    content.innerHTML = html;
    content.scrollTop = 0;
    setDayHash(day);
    $("share-btn").addEventListener("click", function (e) { shareDay(day, e.currentTarget); });
    content.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = +b.dataset.go;
        if (!d) return;
        var dir = b === content.querySelectorAll("[data-go]")[0] ? 0 : 1;
        flyTo(d);
        renderSheet(d);
        currentDay = d;
        var same = content.querySelectorAll("[data-go]")[dir];
        (same && !same.disabled ? same : $("sheet-close")).focus();
      });
    });
  }

  function openSheet(day, trigger) {
    if (openDays.indexOf(day) === -1) return;
    lastTrigger = trigger || document.activeElement;
    currentDay = day;
    renderSheet(day);
    sheet.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add("sheet-open");
    $("sheet-close").focus();
  }

  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("sheet-open");
    currentDay = null;
    setDayHash(null);
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  }

  $("sheet-close").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) {
    if (sheet.hidden) return;
    if (e.key === "Escape") { closeSheet(); return; }
    if (e.key === "Tab") {
      var f = sheet.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Start ---------- */
  renderCounter();
  renderFeature();
  renderDoors();
  renderSnow();

  function openFromHash() {
    var m = DAY_HASH.exec(location.hash);
    var day = m ? +m[1] : null;
    if (day && openDays.indexOf(day) !== -1) {
      if (day !== currentDay) focusTrail(day);
    } else if (!sheet.hidden) {
      closeSheet();
    }
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  // Pagina blijft open over middernacht: herladen zodat het nieuwe deurtje opengaat.
  if (previewDay === null) {
    var checkNewDay = function () {
      var now = nlToday();
      var changed = now.y !== loadedDate.y || now.m !== loadedDate.m || now.d !== loadedDate.d;
      if (changed && sheet.hidden && document.visibilityState === "visible") location.reload();
    };
    setInterval(checkNewDay, 60000);
    document.addEventListener("visibilitychange", checkNewDay);
  }
})();
