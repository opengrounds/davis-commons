/*
  open:grounds — script.js
  a citizen map of shared resources in davis, ca
  by zahra baxi

  all place data lives in data.js (loaded first).
  this file handles the map, UI, and two live data fetches:
    1. falling fruit  (public foraging database)
    2. back4app       (our own community submissions)

  geocodes address-only entries via nominatim in the background,
  caching results in localStorage.
*/


/* ============================================================
   CONFIG
   ============================================================ */

// back4app credentials — swap these out for real values
var BACK4APP_APP_ID = 'rIyLxl8dBdYyeGszVuQCldrfXw7jkEL6ZlnzH0Oa';
var BACK4APP_JS_KEY = 'm64FAAIQEPo5itUwfP1A0lzY3mZRbBJVdqN2HXFX';
var BACK4APP_URL    = 'https://parseapi.back4app.com/classes/Place';

// stadia maps / stamen toner API key
var STADIA_API_KEY = 'ac4366c6-d3c7-4f8b-85fd-0e87a1202622';

// bounding box for the davis, CA area — used to limit API queries
var DAVIS_BBOX = {
  south: 38.51,
  north: 38.57,
  west: -121.82,
  east: -121.70
};


// CATEGORIES, SEED_DATA, and ADDRESS_DATA are defined in data.js (loaded before this file)


/* ============================================================
   APP STATE
   module-level variables shared across functions
   ============================================================ */

var map            = null;   // the leaflet map instance
var allMarkers     = [];     // leaflet marker objects currently on the map
var activeCategory = 'all'; // which category filter is selected
var activeTags     = {};     // which value tags are toggled: { free: true, ... }
var allPlaces      = SEED_DATA.concat(ADDRESS_DATA); // working array — seed + API results

// map each category to which value tags apply
var CATEGORY_TAGS = {
  garden:   ['free', 'zero-waste', 'community'],
  parks:    ['free', 'community'],
  fridge:   ['free', 'community'],
  commun:   ['free', 'community'],
  entertain:['low-cost', 'community'],
  coop:     ['low-cost', 'zero-waste', 'community'],
  pantry:   ['free', 'community'],
  lolib:    ['free', 'community'],
  library:  ['free', 'community'],
  tools:    ['free', 'zero-waste', 'community'],
  thrift:   ['low-cost', 'zero-waste'],
  foraging: ['free', 'zero-waste'],
  bikes:    ['free', 'zero-waste', 'community'],
  mutual:   ['free', 'community'],
  other:    ['community']
};

// used by the animated loading counter
var _loadPct    = 0;
var _loadTicker = null;


/* ============================================================
   CATEGORY HELPERS
   ============================================================ */

// look up a category object by its id string
function catInfo(id) {
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].id === id) return CATEGORIES[i];
  }
  // fall back to the last entry ("other") if we don't recognise the id
  return CATEGORIES[CATEGORIES.length - 1];
}

function catColor(id) { return catInfo(id).color; }
function catLabel(id) { return catInfo(id).label; }


/* ============================================================
   LOADING OVERLAY
   animates the big percentage counter toward a target value
   ============================================================ */

function setStatus(msg) {
  var el = document.querySelector('#loader-label');
  if (el) el.textContent = msg;
}

function setLoading(target) {
  // cancel any existing animation tick
  if (_loadTicker) {
    clearInterval(_loadTicker);
  }

  var overlay = document.querySelector('#loading-overlay');
  var label   = document.querySelector('#loader-percent');

  // ease toward the target value, stepping faster when far away
  _loadTicker = setInterval(function() {
    var diff = target - _loadPct;
    var step = Math.max(0.5, diff * 0.06);
    _loadPct = Math.min(target, _loadPct + step);

    if (label) {
      label.textContent = Math.round(_loadPct) + '%';
    }

    // once we reach the target, stop ticking
    if (_loadPct >= target) {
      clearInterval(_loadTicker);
      _loadTicker = null;

      // at 100%, fade the overlay out and then remove it from flow
      if (target >= 100) {
        setTimeout(function() {
          if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(function() {
              if (overlay) overlay.style.display = 'none';
            }, 420);
          }
        }, 350);
      }
    }
  }, 30);
}


/* ============================================================
   MAP SETUP
   ============================================================ */

function initMap() {
  // center on downtown Davis at a comfortable zoom level
  map = L.map('map', {
    center: [38.546, -121.748],
    zoom: 14,
    zoomControl: true
  });

  // stamen toner — high-contrast black-and-white base map
  L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png?api_key=' + STADIA_API_KEY,
    {
      attribution: 'map tiles by <a href="http://stamen.com">stamen design</a>, &copy; <a href="https://stadiamaps.com">stadia maps</a>, data &copy; <a href="https://openstreetmap.org">osm</a>',
      maxZoom: 20
    }
  ).addTo(map);
}


/* ============================================================
   MAP MARKER ICONS
   circular div icons with a number inside, colored by category
   ============================================================ */

function makeIcon(cat, num) {
  var color = catColor(cat);

  // build the icon as an inline-styled div so it matches our design system
  var html = '<div style="' +
    'width:30px;height:30px;border-radius:50%;' +
    'background:' + color + ';' +
    'border:2px solid #15130F;' +
    'display:flex;align-items:center;justify-content:center;' +
    'font-family:\'Space Grotesk\',sans-serif;font-weight:400;' +
    'font-size:15px;color:#F7F4EC;' +
    'box-shadow:2px 2px 0 rgba(21,19,15,0.35);line-height:1' +
  '">' + num + '</div>';

  return L.divIcon({
    className:   '',
    html:        html,
    iconSize:    [30, 30],
    iconAnchor:  [15, 15],
    popupAnchor: [0, -15]
  });
}


/* ============================================================
   SIDEBAR FILTER BUTTONS
   rebuilds the category list every time the selection changes
   ============================================================ */

function buildFilters() {
  var el = document.querySelector('#cat-filters');
  el.innerHTML = '';

  for (var i = 0; i < CATEGORIES.length; i++) {
    var cat = CATEGORIES[i];

    // count how many visible places belong to this category —
    // entries still waiting on geocoding (lat/lng not resolved
    // yet) aren't counted until they have a real position
    var count = 0;
    for (var j = 0; j < allPlaces.length; j++) {
      var pj = allPlaces[j];
      if (pj.lat == null || pj.lng == null) continue;
      if (cat.id === 'all' || pj.category === cat.id) count++;
    }

    var btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat.id === activeCategory ? ' active' : '');
    btn.style.setProperty('--cat-color', cat.color);
    btn.innerHTML =
      '<span class="cat-swatch"></span>' +
      cat.label +
      '<span class="cat-count">' + count + '</span>';

    // use a closure to capture the current cat.id for the click handler
    btn.onclick = (function(id) {
      return function() {
        activeCategory = id;
        buildFilters();
        renderMarkers();
        renderListings();
      };
    }(cat.id));

    el.appendChild(btn);
  }
}


/* ============================================================
   TAG FILTER PILLS
   ============================================================ */

var TAG_DEFS = [
  { id: 'free',       label: 'free' },
  { id: 'low-cost',   label: 'low-cost' },
  { id: 'zero-waste', label: 'zero-waste' },
  { id: 'community',  label: 'community' }
];

function buildTagFilters(containerEl) {
  if (!containerEl) containerEl = document.querySelector('#tag-filters');
  if (!containerEl) return;
  containerEl.innerHTML = '';

  for (var i = 0; i < TAG_DEFS.length; i++) {
    var t = TAG_DEFS[i];
    var pill = document.createElement('button');
    pill.className = 'tag-pill' + (activeTags[t.id] ? ' active' : '');
    pill.textContent = t.label;
    pill.onclick = (function(tid) {
      return function() {
        if (activeTags[tid]) {
          delete activeTags[tid];
        } else {
          activeTags[tid] = true;
        }
        // rebuild both desktop and mobile tag pills
        buildTagFilters(document.querySelector('#tag-filters'));
        buildTagFilters(document.querySelector('#mobile-tag-filters'));
        buildFilters();
        renderMarkers();
        renderListings();
        // also refresh mobile listings if open
        if (document.querySelector('.mobile-sheet.open') && _mobileTab === 'list') {
          renderMobileListings();
        }
      };
    }(t.id));
    containerEl.appendChild(pill);
  }
}


/* ============================================================
   FILTERING
   returns the subset of places that match the active category
   ============================================================ */

function getFiltered() {
  var result = [];
  var tagKeys = Object.keys(activeTags);

  for (var i = 0; i < allPlaces.length; i++) {
    var p = allPlaces[i];

    if (p.lat == null || p.lng == null) continue;

    if (activeCategory !== 'all' && p.category !== activeCategory) continue;

    // tag filter: place must match ALL active tags
    if (tagKeys.length > 0) {
      var placeTags = CATEGORY_TAGS[p.category] || [];
      var match = true;
      for (var t = 0; t < tagKeys.length; t++) {
        if (placeTags.indexOf(tagKeys[t]) === -1) { match = false; break; }
      }
      if (!match) continue;
    }

    result.push(p);
  }
  return result;
}


/* ============================================================
   MAP MARKERS
   clears the old set and drops fresh pins for the filtered list
   ============================================================ */

function renderMarkers() {
  // remove every existing marker from the map
  for (var i = 0; i < allMarkers.length; i++) {
    map.removeLayer(allMarkers[i]);
  }
  allMarkers = [];

  var filtered = getFiltered();

  for (var i = 0; i < filtered.length; i++) {
    var place = filtered[i];
    var num   = i + 1; // 1-based display number

    // human-readable source attribution
    var sourceLabel = 'open grounds';
    if (place.source === 'community')    sourceLabel = 'community data';
    if (place.source === 'dero')    sourceLabel = 'dero fixit map';
    if (place.source === 'public')       sourceLabel = 'public';
    if (place.source === 'fallingfruit') sourceLabel = 'falling fruit';

    // optional "visit site" link in the popup
    var linkHtml = '';
    if (place.link) {
      linkHtml = '<a href="' + place.link + '" target="_blank" class="popup-link">visit site</a>';
    }

    // optional address line
    var addrHtml = '';
    if (place.address) {
      addrHtml = '<div class="popup-addr">' + place.address + '</div>';
    }

    // optional description paragraph
    var descHtml = '';
    if (place.description) {
      descHtml = '<div class="popup-desc">' + place.description + '</div>';
    }

    // optional status badge (e.g. "bridge closed for repairs")
    var statusHtml = '';
    if (place.status) {
      statusHtml = '<div class="popup-status">' + place.status + '</div>';
    }

    // co-located places — shown as stacked sub-sections in the popup
    var colocatedHtml = '';
    if (place.colocated && place.colocated.length) {
      for (var c = 0; c < place.colocated.length; c++) {
        var co = place.colocated[c];
        var coLink = co.link
          ? '<a href="' + co.link + '" target="_blank" class="popup-link">visit site</a>'
          : '';
        var coHours = co.hours
          ? '<div class="popup-status">' + co.hours + '</div>'
          : '';
        colocatedHtml +=
          '<div class="popup-colocated">' +
            '<div class="popup-co-name">' +
              '<span class="popup-cat" style="--cat-color:' + catColor(co.category) + '">' + catLabel(co.category) + '</span>' +
              co.name +
            '</div>' +
            '<div class="popup-desc">' + (co.description || '') + '</div>' +
            coHours +
            (coLink ? '<div class="popup-footer">' + coLink + '</div>' : '') +
          '</div>';
      }
    }

    var popupContent =
      '<div class="popup-inner">' +
        '<div class="popup-cat" style="--cat-color:' + catColor(place.category) + '">' + catLabel(place.category) + '</div>' +
        '<div class="popup-name">' + num + '. ' + place.name + '</div>' +
        addrHtml +
        descHtml +
        statusHtml +
        colocatedHtml +
        '<div class="popup-footer">' +
          '<span class="popup-source">via ' + sourceLabel + '</span>' +
          linkHtml +
        '</div>' +
      '</div>';

    var marker = L.marker([place.lat, place.lng], { icon: makeIcon(place.category, num) })
      .bindPopup(popupContent)
      .addTo(map);

    allMarkers.push(marker);
  }
}


/* ============================================================
   SIDEBAR LISTINGS
   the scrollable index below the filter buttons
   ============================================================ */

function renderListings() {
  var el         = document.querySelector('#listings');
  var countLabel = document.querySelector('#count-label');
  var filtered   = getFiltered();

  el.innerHTML = '';
  countLabel.textContent = filtered.length + ' place' + (filtered.length === 1 ? '' : 's');

  for (var i = 0; i < filtered.length; i++) {
    var place = filtered[i];
    var num   = i + 1;

    var addrHtml = '';
    if (place.address) {
      addrHtml = '<div class="listing-addr">' + place.address + '</div>';
    }

    var statusTag = '';
    if (place.status) {
      statusTag = '<span class="listing-tag status">' + place.status + '</span>';
    }

    var linkTag = '';
    if (place.link) {
      linkTag = '<a class="listing-tag listing-link" href="' + place.link + '" target="_blank" onclick="event.stopPropagation()">website</a>';
    }

    var colocatedCardHtml = '';
    if (place.colocated && place.colocated.length) {
      colocatedCardHtml += '<div class="listing-colocated">';
      for (var c = 0; c < place.colocated.length; c++) {
        var co = place.colocated[c];
        colocatedCardHtml +=
          '<div class="listing-co-row">' +
            '<span class="listing-tag" style="background:' + catColor(co.category) + ';color:#F7F4EC">' + catLabel(co.category) + '</span>' +
            '<span class="listing-co-name">' + co.name + '</span>' +
          '</div>';
      }
      colocatedCardHtml += '</div>';
    }

    var card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML =
      '<div class="listing-num" style="--cat-color:' + catColor(place.category) + '">' + num + '</div>' +
      '<div class="listing-body">' +
        '<div class="listing-name">' + place.name + '</div>' +
        addrHtml +
        '<div class="listing-tags">' +
          '<span class="listing-tag" style="background:' + catColor(place.category) + ';color:#F7F4EC">' + catLabel(place.category) + '</span>' +
          statusTag +
          linkTag +
        '</div>' +
        colocatedCardHtml +
      '</div>';

    // clicking a card flies the map to that pin and opens its popup.
    // we use a closure to freeze the values of i and place for this iteration.
    card.onclick = (function(idx, p) {
      return function() {
        map.setView([p.lat, p.lng], 17);
        if (allMarkers[idx]) {
          allMarkers[idx].openPopup();
        }
      };
    }(i, place));

    el.appendChild(card);
  }
}




/* ============================================================
   DATA FETCHING — FALLING FRUIT
   public database of forageable trees and plants
   ============================================================ */

async function fetchFallingFruit() {
  var bbox = DAVIS_BBOX;
  var url  = 'https://fallingfruit.org/api/0.3/locations.json' +
             '?bounds=' + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east +
             '&limit=200&locale=en';

  try {
    var res  = await fetch(url);
    var data = await res.json();
    var results = [];

    var locations = data || [];
    for (var i = 0; i < locations.length; i++) {
      var loc = locations[i];
      if (!loc.lat || !loc.lng) continue;

      var name = 'foraging spot';
      if (loc.type_names && loc.type_names.length > 0) {
        name = loc.type_names.join(', ');
      }

      var desc = loc.description || name;

      results.push({
        id:          'ff-' + loc.id,
        name:        name,
        category:    'foraging',
        lat:         loc.lat,
        lng:         loc.lng,
        address:     loc.address || '',
        description: desc,
        source:      'fallingfruit'
      });
    }

    return results;

  } catch(e) {
    console.log('Falling Fruit fetch failed:', e);
    return [];
  }
}


/* ============================================================
   DATA FETCHING — BACK4APP (community submissions)
   only pulls entries that have been approved by the maintainer
   ============================================================ */

async function fetchBack4App() {
  try {
    var res = await fetch(BACK4APP_URL + '?where={"status":"approved"}&limit=200', {
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-JavaScript-Key': BACK4APP_JS_KEY
      }
    });
    var data    = await res.json();
    var results = [];
    var rows    = data.results || [];

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r.lat || !r.lng) continue;
      results.push({
        id:          r.objectId,
        name:        r.name,
        category:    r.category,
        lat:         r.lat,
        lng:         r.lng,
        address:     r.address,
        description: r.description,
        source:      'opengrounds'
      });
    }

    return results;

  } catch(e) {
    // silently fail — the app still works without community submissions
    return [];
  }
}


/* ============================================================
   DEDUPLICATION
   removes places that are within ~100m of each other AND share
   a category — prevents double-pins when our seed data
   overlaps with an OSM entry for the same location
   ============================================================ */

function dedup(places) {
  var seen    = {};
  var results = [];

  for (var i = 0; i < places.length; i++) {
    var p = places[i];

    // entries waiting on geocoding have no coordinates to compare yet —
    // let them through as-is; getFiltered() hides them until they resolve
    if (p.lat == null || p.lng == null) {
      results.push(p);
      continue;
    }

    // round to 3 decimal places (~100m grid) for fuzzy matching
    var key = Math.round(p.lat * 1000) + ',' + Math.round(p.lng * 1000) + ',' + p.category;

    if (!seen[key]) {
      seen[key] = true;
      results.push(p);
    }
  }

  return results;
}


/* ============================================================
   GEOCODING (nominatim)
   converts addresses to lat/lng coordinates.
   results are cached in localStorage so we only call nominatim
   once per address across page loads, staying within their
   usage policy (1 request per second).
   ============================================================ */

var GEO_CACHE_PREFIX = 'og_geo_v3:';

function geoCache(key) {
  try {
    var v = localStorage.getItem(GEO_CACHE_PREFIX + key);
    return v ? JSON.parse(v) : null;
  } catch(e) {
    return null;
  }
}

function geoCacheSet(key, val) {
  try {
    localStorage.setItem(GEO_CACHE_PREFIX + key, JSON.stringify(val));
  } catch(e) {
    // localStorage might be blocked (private browsing, etc.) — that's fine
  }
}

async function geocodeOne(query) {
  // check the cache before hitting the network
  var cached = geoCache(query);
  if (cached) return cached;

  try {
    var url = 'https://nominatim.openstreetmap.org/search' +
              '?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(query);
    var res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    var data = await res.json();

    if (data && data[0]) {
      var result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      geoCacheSet(query, result);
      return result;
    }
  } catch(e) {
    // network error — we'll just use the fallback coords
  }

  return null;
}

// runs through all entries that have a geocodeAddress, sequentially,
// with a 1.1s delay between cache misses to respect nominatim's rate limit.
// geocoded coordinates take priority; hardcoded lat/lng act as fallback only
// if geocoding fails (network down, address not found, etc.).
async function geocodeSeedData(places, onProgress) {
  var queue = [];
  for (var i = 0; i < places.length; i++) {
    var p = places[i];
    if (!p.geocodeAddress) continue; // no address to geocode
    queue.push(p);
  }

  for (var i = 0; i < queue.length; i++) {
    var p = queue[i];

    // only sleep if this address isn't already cached
    var cached = geoCache(p.geocodeAddress);
    if (!cached) {
      await new Promise(function(resolve) { setTimeout(resolve, 1100); });
    }

    var result = await geocodeOne(p.geocodeAddress);
    if (result) {
      // geocoded result takes priority over any hardcoded coords
      p.lat = result.lat;
      p.lng = result.lng;
    } else if (p.lat == null) {
      console.log('geocoding failed, no result for:', p.geocodeAddress);
    }
    // if geocoding fails but we have hardcoded fallback coords, keep them

    // report progress to caller (used to drive the loading bar)
    if (onProgress) onProgress(i + 1, queue.length);

    // re-render after each result so the map updates progressively
    buildFilters();
    renderMarkers();
    renderListings();
  }
}


/* ============================================================
   MAIN LOAD SEQUENCE
   kicks off all three API calls in parallel, then kicks off
   geocoding in the background while the map is already usable
   ============================================================ */

async function loadAll() {
  setLoading(5);
  setStatus('connecting to community data...');

  // fetch community submissions from back4app
  var b4aPromise = fetchBack4App();
  b4aPromise.then(function() { setLoading(60); });
  var b4aData = await b4aPromise;

  setStatus('building the map...');

  // merge all data sources
  allPlaces = dedup(SEED_DATA.concat(ADDRESS_DATA).concat(b4aData));

  buildFilters();
  buildTagFilters();
  renderMarkers();
  renderListings();

  setStatus('fetching addresses...');

  // geocode address-only entries — keep the overlay up and drive the bar
  // from 60% to 99% as each address resolves, then dismiss at 100%.
  // pass allPlaces directly so geocoding mutates the objects the map renders.
  await geocodeSeedData(allPlaces, function(done, total) {
    setLoading(60 + Math.round((done / total) * 39));
    setStatus('fetching addresses... (' + done + ' of ' + total + ')');
  });

  setStatus('done!');
  setLoading(100);
}


/* ============================================================
   PANEL ROW RESIZE HANDLES
   one horizontal drag handle sits between the index and commons panels.
   the filters and index panels each get flex:1 (equal share) by default;
   dragging the handle redistributes height between index and commons.
   ============================================================ */

(function() {
  var filters  = document.querySelector('#panel-filters');
  var index    = document.querySelector('#panel-index');
  var commons  = document.querySelector('#panel-commons');
  var handle2  = document.querySelector('#row-handle-2');

  var dragging   = false;
  var dragStartY = 0;
  var startIndex = 0;
  var startCommons = 0;

  var MIN_H = 80;

  if (!handle2 || !index || !commons) return;

  handle2.addEventListener('mousedown', function(e) {
    dragging   = true;
    dragStartY = e.clientY;
    startIndex   = index.getBoundingClientRect().height;
    startCommons = commons.getBoundingClientRect().height;
    handle2.classList.add('dragging');
    document.body.style.cursor     = 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var delta    = e.clientY - dragStartY;
    var newIndex   = Math.max(MIN_H, startIndex + delta);
    var newCommons = Math.max(MIN_H, startCommons - delta);
    index.style.height   = newIndex + 'px';
    index.style.flex     = '0 0 ' + newIndex + 'px';
    commons.style.height = newCommons + 'px';
    commons.style.flex   = '0 0 ' + newCommons + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    handle2.classList.remove('dragging');
    document.body.style.cursor     = '';
    document.body.style.userSelect = '';
  });
}());


/* ============================================================
   MODAL OPEN / CLOSE
   ============================================================ */

function openSubmit()    { document.querySelector('#submit-modal').classList.add('open'); }
function closeSubmit()   { document.querySelector('#submit-modal').classList.remove('open'); }
function openAbout()     { document.querySelector('#about-modal').classList.add('open'); }
function closeAbout()    { document.querySelector('#about-modal').classList.remove('open'); }
function openCorrection()  { document.querySelector('#correction-modal').classList.add('open'); }
function closeCorrection() { document.querySelector('#correction-modal').classList.remove('open'); }


/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */

function showToast(msg) {
  var t = document.querySelector('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() {
    t.classList.remove('show');
  }, 3000);
}


/* ============================================================
   FORM SUBMISSION — ADD A PLACE
   ============================================================ */

async function submitPlace() {
  var name    = document.querySelector('#f-name').value.trim();
  var cat     = document.querySelector('#f-cat').value;
  var addr    = document.querySelector('#f-addr').value.trim();
  var desc    = document.querySelector('#f-desc').value.trim();
  var link    = document.querySelector('#f-link').value.trim();
  var contact = document.querySelector('#f-contact').value.trim();
  var latRaw  = document.querySelector('#f-lat').value.trim();
  var lngRaw  = document.querySelector('#f-lng').value.trim();
  var lat     = latRaw ? parseFloat(latRaw) : null;
  var lng     = lngRaw ? parseFloat(lngRaw) : null;

  // basic validation — need at least a name, type, and some location info
  if (!name || !cat || (!addr && !lat)) {
    showToast('name, type, and either address or coordinates are required.');
    return;
  }

  try {
    var res = await fetch(BACK4APP_URL, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-JavaScript-Key': BACK4APP_JS_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:        name,
        category:    cat,
        address:     addr,
        description: desc,
        link:        link,
        submittedBy: contact,
        status:      'pending', // maintainer reviews before it goes live
        lat:         lat,
        lng:         lng
      })
    });

    if (res.ok) {
      closeSubmit();
      // clear the form fields
      var fields = ['f-name', 'f-addr', 'f-desc', 'f-link', 'f-contact', 'f-lat', 'f-lng'];
      for (var i = 0; i < fields.length; i++) {
        document.querySelector('#' + fields[i]).value = '';
      }
      document.querySelector('#f-cat').value = '';
      showToast('submitted. thanks for adding to the commons.');
    } else {
      showToast('something went wrong. try again?');
    }

  } catch(e) {
    showToast('connection error. please try again.');
  }
}


/* ============================================================
   FORM SUBMISSION — SUGGEST A CORRECTION
   ============================================================ */

async function submitCorrection() {
  var name    = document.querySelector('#c-name').value.trim();
  var type    = document.querySelector('#c-type').value;
  var details = document.querySelector('#c-details').value.trim();
  var latRaw  = document.querySelector('#c-lat').value.trim();
  var lngRaw  = document.querySelector('#c-lng').value.trim();

  if (!name || !type) {
    showToast('place name and correction type are required.');
    return;
  }

  try {
    // corrections go to a separate Back4App class
    var correctionUrl = BACK4APP_URL.replace('/Place', '/Correction');

    var res = await fetch(correctionUrl, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-JavaScript-Key': BACK4APP_JS_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        placeName:      name,
        correctionType: type,
        details:        details,
        lat:            latRaw || null,
        lng:            lngRaw || null,
        status:         'pending'
      })
    });

    if (res.ok) {
      closeCorrection();
      var fields = ['c-name', 'c-details', 'c-lat', 'c-lng'];
      for (var i = 0; i < fields.length; i++) {
        document.querySelector('#' + fields[i]).value = '';
      }
      document.querySelector('#c-type').value = '';
      showToast('correction sent. thanks for keeping the map accurate.');
    } else {
      showToast('something went wrong. try again?');
    }

  } catch(e) {
    showToast('connection error. please try again.');
  }
}


/* ============================================================
   SIDEBAR RESIZE HANDLE
   lets the user drag the divider between the sidebar and map.
   clamped between 180px and 600px wide.
   ============================================================ */

(function() {
  var handle   = document.querySelector('#resize-handle');
  var appBody  = document.querySelector('.app-body');
  var dragging = false;

  handle.addEventListener('mousedown', function(e) {
    dragging = true;
    handle.classList.add('dragging');
    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault(); // prevent text selection during drag
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var bodyRect = appBody.getBoundingClientRect();
    var newWidth = e.clientX - bodyRect.left;
    newWidth = Math.min(600, Math.max(180, newWidth));
    appBody.style.gridTemplateColumns = newWidth + 'px 4px 1fr';
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor    = '';
    document.body.style.userSelect = '';
    // tell leaflet the map container changed size so it redraws tiles correctly
    if (map) map.invalidateSize();
  });
}());


/* ============================================================
   USER LOCATION DOT
   requests the browser's geolocation and drops a pulsing blue
   dot on the map. silently does nothing if the user denies.
   ============================================================ */

function showUserLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(function(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;

    // pulsing blue dot — uses the sky blue already in the design system
    var dotIcon = L.divIcon({
      className: '',
      html: '<div style="' +
        'width:16px;height:16px;border-radius:50%;' +
        'background:#2F9BD6;' +
        'border:2.5px solid #F7F4EC;' +
        'box-shadow:0 0 0 4px rgba(47,155,214,0.3),2px 2px 0 rgba(21,19,15,0.25);' +
        'animation:userLocPulse 2s ease-in-out infinite;' +
      '"></div>',
      iconSize:    [16, 16],
      iconAnchor:  [8, 8],
      popupAnchor: [0, -10]
    });

    L.marker([lat, lng], { icon: dotIcon, zIndexOffset: 9999 })
      .addTo(map)
      .bindPopup(
        '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:0.75rem;font-weight:700;">you are here</div>'
      );

  }, function() {
    // user denied or geolocation unavailable — fail silently
  });
}


/* ============================================================
   MOBILE SHEET / TAB BAR
   ============================================================ */

var _mobileTab = 'map';

function mobileSwitchTab(tab) {
  _mobileTab = tab;

  // update tab button active states
  var tabs = ['map', 'filter', 'list'];
  for (var i = 0; i < tabs.length; i++) {
    var btn = document.querySelector('#tab-' + tabs[i]);
    if (btn) btn.classList.toggle('active', tabs[i] === tab);
  }
  // "add" tab has no active state — it opens a modal
  var addBtn = document.querySelector('#tab-add');
  if (addBtn) addBtn.classList.remove('active');

  var sheet = document.querySelector('#mobile-sheet');
  var content = document.querySelector('#mobile-sheet-content');

  if (tab === 'map') {
    // close the sheet, show the map
    if (sheet) sheet.classList.remove('open');
    return;
  }

  if (!sheet || !content) return;
  sheet.classList.add('open');

  if (tab === 'filter') {
    content.innerHTML =
      '<div>' +
        '<div class="panel-label">filter by value</div>' +
        '<div class="tag-pill-list" id="mobile-tag-filters"></div>' +
      '</div>' +
      '<div>' +
        '<div class="panel-label">filter by type</div>' +
        '<div class="cat-list" id="mobile-cat-filters"></div>' +
      '</div>';
    buildTagFilters(document.querySelector('#mobile-tag-filters'));
    buildMobileFilters();
  }

  if (tab === 'list') {
    content.innerHTML = '<div class="panel-label">index <span class="muted" id="mobile-count-label">0 places</span></div><div class="mobile-listings" id="mobile-listings"></div>';
    renderMobileListings();
  }
}

function buildMobileFilters() {
  var el = document.querySelector('#mobile-cat-filters');
  if (!el) return;
  el.innerHTML = '';

  for (var i = 0; i < CATEGORIES.length; i++) {
    var cat = CATEGORIES[i];
    var count = 0;
    for (var j = 0; j < allPlaces.length; j++) {
      var pj = allPlaces[j];
      if (pj.lat == null || pj.lng == null) continue;
      if (cat.id === 'all' || pj.category === cat.id) count++;
    }

    var btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat.id === activeCategory ? ' active' : '');
    btn.style.setProperty('--cat-color', cat.color);
    btn.innerHTML =
      '<span class="cat-swatch"></span>' +
      cat.label +
      '<span class="cat-count">' + count + '</span>';

    btn.onclick = (function(id) {
      return function() {
        activeCategory = id;
        buildFilters();
        buildMobileFilters();
        renderMarkers();
        renderListings();
      };
    }(cat.id));

    el.appendChild(btn);
  }
}

function renderMobileListings() {
  var el = document.querySelector('#mobile-listings');
  var countLabel = document.querySelector('#mobile-count-label');
  if (!el) return;

  var filtered = getFiltered();
  if (countLabel) countLabel.textContent = filtered.length + ' place' + (filtered.length === 1 ? '' : 's');

  el.innerHTML = '';
  for (var i = 0; i < filtered.length; i++) {
    var place = filtered[i];
    var num = i + 1;

    var addrHtml = place.address ? '<div class="listing-addr">' + place.address + '</div>' : '';
    var statusTag = place.status ? '<span class="listing-tag status">' + place.status + '</span>' : '';
    var linkTag = place.link ? '<a class="listing-tag listing-link" href="' + place.link + '" target="_blank" onclick="event.stopPropagation()">website</a>' : '';

    var card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML =
      '<div class="listing-num" style="--cat-color:' + catColor(place.category) + '">' + num + '</div>' +
      '<div class="listing-body">' +
        '<div class="listing-name">' + place.name + '</div>' +
        addrHtml +
        '<div class="listing-tags">' +
          '<span class="listing-tag" style="background:' + catColor(place.category) + ';color:#F7F4EC">' + catLabel(place.category) + '</span>' +
          statusTag + linkTag +
        '</div>' +
      '</div>';

    card.onclick = (function(idx, p) {
      return function() {
        // close sheet and fly map
        mobileSwitchTab('map');
        setTimeout(function() {
          map.setView([p.lat, p.lng], 17);
          if (allMarkers[idx]) allMarkers[idx].openPopup();
        }, 120);
      };
    }(i, place));

    el.appendChild(card);
  }
}


/* ============================================================
   BOOT
   ============================================================ */

initMap();
loadAll();
showUserLocation();