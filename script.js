/*
  open:grounds — script.js
  a citizen map of shared resources in davis, ca
  by zahra baxi

  pulls data from three sources in parallel:
    1. openstreetmap (via the overpass API)
    2. falling fruit  (public foraging database)
    3. back4app       (our own community submissions)

  then geocodes any seed entries that only have an address,
  and progressively updates the map as results come in.
*/


/* ============================================================
   CONFIG
   ============================================================ */

// back4app credentials — swap these out for real values
var BACK4APP_APP_ID = 'YOUR_BACK4APP_APP_ID';
var BACK4APP_JS_KEY = 'YOUR_BACK4APP_JS_KEY';
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


/* ============================================================
   CATEGORY DEFINITIONS
   each entry maps a slug to a display label and a hex color.
   the color is used for markers, swatches, and tags.
   ============================================================ */

var CATEGORIES = [
  { id: 'all',      label: 'all',                 color: '#15130F' },
  { id: 'garden',   label: 'community garden',    color: '#2F4D22' },
  { id: 'fridge',   label: 'community fridge',    color: '#2F9BD6' },
  { id: 'coop',     label: 'food co-op',          color: '#FFC53D' },
  { id: 'pantry',   label: 'free pantry',         color: '#FF5722' },
  { id: 'seeds',    label: 'seed library',        color: '#8B5CF6' },
  { id: 'library',  label: 'little free library', color: '#FF3E86' },
  { id: 'tools',    label: 'tool / repair',       color: '#1F6B5C' },
  { id: 'thrift',   label: 'thrift & reuse',      color: '#9C6B30' },
  { id: 'foraging', label: 'foraging',            color: '#B0431E' },
  { id: 'bikes',    label: 'bike repair',         color: '#4F6BFF' },
  { id: 'mutual',   label: 'mutual aid',          color: '#C2185B' },
  { id: 'other',    label: 'other commons',       color: '#75695A' }
];


/* ============================================================
   SEED DATA
   hand-curated entries that are always shown, even if the
   external APIs are down. geocodeAddress is the string we
   send to nominatim; lat/lng are fallback coordinates used
   immediately while geocoding runs in the background.
   ============================================================ */

var SEED_DATA = [
  {
    id: 's1',
    name: '5th Street Community Garden',
    category: 'garden',
    lat: 38.5432, lng: -121.7298,
    address: '1825 5th St, Davis CA 95616',
    geocodeAddress: '1825 5th St, Davis, CA',
    link: 'https://cityofdavis.org/city-hall/parks-community-services/parks-open-space/community-gardens',
    description: 'city-run organic plots in East Davis. open year-round; new-plot waitlist through the city parks department.',
    source: 'opengrounds'
  },
  {
    id: 's2',
    name: 'Cannery Community Garden',
    category: 'garden',
    lat: 38.5600, lng: -121.7275,
    address: '1701 Harvest St, Davis CA 95616',
    geocodeAddress: '1701 Harvest St, Davis, CA',
    link: 'https://cityofdavis.org/city-hall/parks-community-services/parks-open-space/community-gardens',
    description: 'raised-bed plots in the Cannery neighborhood, open to residents and the public via the city garden program.',
    source: 'opengrounds'
  },
  {
    id: 's3',
    name: 'ASUCD Experimental College Garden',
    category: 'garden',
    lat: 38.5346, lng: -121.7620,
    address: 'UC Davis campus, near the Domes',
    geocodeAddress: 'Baggins End Domes, UC Davis, Davis, CA',
    link: 'https://asucd.ucdavis.edu',
    description: 'student-run organic farm near the Baggins End domes. open to students, staff, and the wider community.',
    source: 'opengrounds'
  },
  {
    id: 's4',
    name: 'Davis Food Co-op Freedge',
    category: 'fridge',
    lat: 38.5449, lng: -121.7399,
    address: '620 G St, Davis CA 95616',
    geocodeAddress: '620 G St, Davis, CA',
    link: 'https://davisfood.coop',
    description: 'community fridge on the west side of the co-op building. staff restock it daily with surplus produce, dairy, and bakery. take what you need, leave what you can.',
    source: 'opengrounds'
  },
  {
    id: 's5',
    name: 'Memorial Union Freedge',
    category: 'fridge',
    lat: 38.5407, lng: -121.7494,
    address: 'UC Davis Memorial Union, east side near the bookstore',
    geocodeAddress: 'Memorial Union, UC Davis, Davis, CA',
    link: 'https://basicneeds.ucdavis.edu',
    description: 'campus freedge for whole produce, canned goods, and sealed non-perishables, across from the ASUCD pantry.',
    source: 'opengrounds'
  },
  {
    id: 's6',
    name: 'Davis Food Co-op',
    category: 'coop',
    lat: 38.5449, lng: -121.7399,
    address: '620 G St, Davis CA 95616',
    geocodeAddress: '620 G St, Davis, CA',
    link: 'https://davisfood.coop',
    description: 'member-owned grocery co-op since 1972, open to everyone. organic produce, bulk bins, a full deli, and a community bulletin board. open daily 7am-10pm.',
    source: 'opengrounds'
  },
  {
    id: 's7',
    name: 'Davis Makerspace Repair Cafe',
    category: 'tools',
    lat: 38.5459, lng: -121.7338,
    address: '315 E 14th St (Yolo County Library, Davis Branch)',
    geocodeAddress: '315 E 14th St, Davis, CA',
    link: 'https://www.yolocounty.org/general-government/library',
    description: 'monthly repair cafe. bring in clothing, electronics, and household items for free fixes. hosted by the library and friends of the davis public library.',
    source: 'opengrounds'
  },
  {
    id: 's8',
    name: 'Community Mercantile',
    category: 'thrift',
    lat: 38.5464, lng: -121.7162,
    address: '622 Cantrill Dr, Davis CA 95618',
    geocodeAddress: '622 Cantrill Dr, Davis, CA',
    link: 'https://communitymercantile.org',
    description: 'nonprofit reuse store and tool lending library. housewares, furniture, tools, fabric, and more, diverted from the landfill. open thu-sun.',
    source: 'opengrounds'
  },
  {
    id: 's9',
    name: 'Yolo County SPCA Thrift Store',
    category: 'thrift',
    lat: 38.5426, lng: -121.7458,
    address: '920 3rd St Ste F, Davis CA 95616',
    geocodeAddress: '920 3rd St, Davis, CA',
    link: 'https://www.yolospca.org',
    description: 'donation-based thrift store benefiting the spca. clothing, books, housewares, and the occasional great find.',
    source: 'opengrounds'
  },
  {
    id: 's10',
    name: 'Aggie Reuse Store',
    category: 'thrift',
    lat: 38.5407, lng: -121.7494,
    address: 'UC Davis Memorial Union #154, 1 Shields Ave',
    geocodeAddress: 'Memorial Union, UC Davis, Davis, CA',
    link: 'https://sustainability.ucdavis.edu/action/waste/reuse-store',
    description: 'student-run reuse store now operating as zero-cost mutual aid. clothes, school supplies, and small appliances, free for students and the community.',
    source: 'opengrounds'
  },
  {
    id: 's11',
    name: 'Stevenson Bridge Library in a Box',
    category: 'library',
    lat: 38.5185, lng: -121.8042,
    address: 'Stevenson Bridge Rd, Yolo/Solano county line',
    geocodeAddress: 'Stevenson Bridge Rd, Davis, CA',
    link: null,
    description: 'free 24/7 community library on the historic graffiti bridge over Putah Creek.',
    source: 'opengrounds',
    status: 'bridge closed for repairs through oct 2026'
  },
  {
    id: 's12',
    name: 'Davis Bike Garage',
    category: 'bikes',
    lat: 38.5590, lng: -121.7425,
    address: '606 Pena Dr #300, Davis CA 95618',
    geocodeAddress: '606 Pena Dr, Davis, CA',
    link: 'https://www.thebikecampaign.org/bike-garage',
    description: 'free community bike repair shop run by The Bike Campaign. drop in with your bike, volunteer mechanics on site. check thebikecampaign.org for current hours.',
    source: 'opengrounds'
  },
  {
    id: 's13',
    name: 'Davis Bike Collective',
    category: 'bikes',
    lat: 38.5441, lng: -121.7430,
    address: '1221 1/2 4th St, Davis CA 95616',
    geocodeAddress: '1221 4th St, Davis, CA',
    link: 'https://davisbikecollective.org',
    description: 'volunteer-run nonprofit bike shop. pay-what-you-can repairs, free parts library, and DIY stands. open drop-in hours most evenings and weekends.',
    source: 'opengrounds'
  },
  {
    id: 's14',
    name: 'ASUCD Bike Barn',
    category: 'bikes',
    lat: 38.5416, lng: -121.7496,
    address: '1 Shields Ave (Silo area), UC Davis',
    geocodeAddress: 'Bike Barn, UC Davis, Davis, CA',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'full-service campus bike shop with low-cost repairs and a self-service stand with tools. staffed by students, open to students, faculty, and the public.',
    source: 'opengrounds'
  },
  {
    id: 's15',
    name: 'Mary L. Stephens Davis Branch Library',
    category: 'library',
    lat: 38.5459, lng: -121.7338,
    address: '315 E 14th St, Davis CA 95616',
    geocodeAddress: '315 E 14th St, Davis, CA',
    link: 'https://www.yolocounty.org/general-government/library/locations/davis-branch-library',
    description: 'full public library with books, DVDs, CDs, and more. free with a library card. open to everyone.',
    source: 'opengrounds'
  },
  {
    id: 's16',
    name: 'Free Supply Closet @ J Street Co-op',
    category: 'mutual',
    lat: 38.5441, lng: -121.7399,
    address: 'Corner of 3rd and J Streets, Davis CA 95616',
    geocodeAddress: 'J Street Cooperative, 3rd and J St, Davis, CA',
    link: 'https://www.instagram.com/j_street_cooperative/',
    description: 'free supply closet inside the J Street Cooperative. kitchen supplies, living supplies, clothes, blankets, sleeping bags, and more. not for food — for food donations, visit the Freedge at the Quaker Friends Meeting House (4th and L St).',
    source: 'opengrounds'
  },
  {
    id: 's17',
    name: 'Quaker Friends Meeting House Freedge',
    category: 'fridge',
    lat: 38.5430, lng: -121.7370,
    address: 'Corner of 4th and L Streets, Davis CA 95616',
    geocodeAddress: 'Davis Friends Meeting, 4th and L St, Davis, CA',
    link: null,
    description: 'community fridge (freedge) at the Davis Friends Meeting House. accepts food donations. drop off produce, canned goods, and other non-perishables.',
    source: 'opengrounds'
  },
  {
    id: 's18',
    name: 'Mutual Aid in Davis (MAD)',
    category: 'mutual',
    lat: 38.5449, lng: -121.7400,
    address: 'Davis, CA (delivery-based — no fixed location)',
    geocodeAddress: null,
    link: 'https://www.norcalresist.org/mad-davis.html',
    description: 'volunteer delivery network redistributing furniture, clothes, living supplies, and kitchen supplies from donors to neighbors in need. fill out the intake form on their site to request items. run by NorCal Resist.',
    source: 'opengrounds'
  }
];


/* ============================================================
   APP STATE
   module-level variables shared across functions
   ============================================================ */

var map            = null;   // the leaflet map instance
var allMarkers     = [];     // leaflet marker objects currently on the map
var activeCategory = 'all'; // which category filter is selected
var allPlaces      = SEED_DATA.slice(); // working array — seed + API results

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
    'width:26px;height:26px;border-radius:50%;' +
    'background:' + color + ';' +
    'border:2px solid #15130F;' +
    'display:flex;align-items:center;justify-content:center;' +
    'font-family:\'Space Grotesk\',sans-serif;font-weight:700;' +
    'font-size:12px;color:#F7F4EC;' +
    'box-shadow:2px 2px 0 rgba(21,19,15,0.35);line-height:1' +
  '">' + num + '</div>';

  return L.divIcon({
    className:   '',
    html:        html,
    iconSize:    [26, 26],
    iconAnchor:  [13, 13],
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

    // count how many visible places belong to this category
    var count = 0;
    if (cat.id === 'all') {
      count = allPlaces.length;
    } else {
      for (var j = 0; j < allPlaces.length; j++) {
        if (allPlaces[j].category === cat.id) count++;
      }
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
   FILTERING
   returns the subset of places that match the active category
   ============================================================ */

function getFiltered() {
  if (activeCategory === 'all') {
    return allPlaces;
  }

  var result = [];
  for (var i = 0; i < allPlaces.length; i++) {
    if (allPlaces[i].category === activeCategory) {
      result.push(allPlaces[i]);
    }
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
    if (place.source === 'osm')         sourceLabel = 'openstreetmap';
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

    var popupContent =
      '<div class="popup-inner">' +
        '<div class="popup-cat" style="--cat-color:' + catColor(place.category) + '">' + catLabel(place.category) + '</div>' +
        '<div class="popup-name">' + num + '. ' + place.name + '</div>' +
        addrHtml +
        descHtml +
        statusHtml +
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
   DATA FETCHING — OPENSTREETMAP (overpass API)
   queries for fridges, food banks, little free libraries,
   public gardens, and allotments within the davis bbox
   ============================================================ */

async function fetchOSM() {
  var bbox  = DAVIS_BBOX;
  var query = [
    '[out:json][timeout:20];',
    '(',
    '  node["amenity"="community_fridge"](' + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east + ');',
    '  node["amenity"="food_bank"]('        + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east + ');',
    '  node["amenity"="public_bookcase"]('  + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east + ');',
    '  node["leisure"="garden"]["access"="public"](' + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east + ');',
    '  node["landuse"="allotments"]('       + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east + ');',
    '  way["landuse"="allotments"]('        + bbox.south + ',' + bbox.west + ',' + bbox.north + ',' + bbox.east + ');',
    ');',
    'out center;'
  ].join('\n');

  try {
    var res  = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query)
    });
    var data = await res.json();
    var results = [];

    var elements = data.elements || [];
    for (var i = 0; i < elements.length; i++) {
      var el  = elements[i];
      var lat = el.lat !== undefined ? el.lat : (el.center ? el.center.lat : null);
      var lng = el.lon !== undefined ? el.lon : (el.center ? el.center.lon : null);

      if (!lat || !lng) continue;

      var tags     = el.tags || {};
      var category = 'other';

      if (tags.amenity === 'community_fridge')  category = 'fridge';
      else if (tags.amenity === 'food_bank')    category = 'pantry';
      else if (tags.amenity === 'public_bookcase') category = 'library';
      else if (tags.leisure === 'garden' || tags.landuse === 'allotments') category = 'garden';

      var name = tags.name || tags['name:en'] || category;

      var address = '';
      if (tags['addr:street']) {
        address = ((tags['addr:housenumber'] || '') + ' ' + tags['addr:street'] + ', Davis CA').trim();
      }

      results.push({
        id:          'osm-' + el.id,
        name:        name,
        category:    category,
        lat:         lat,
        lng:         lng,
        address:     address,
        description: tags.description || tags.opening_hours || '',
        source:      'osm'
      });
    }

    return results;

  } catch(e) {
    console.log('OSM fetch failed:', e);
    return [];
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
    var p   = places[i];
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

var GEO_CACHE_PREFIX = 'og_geo_v1:';

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

// runs through seed entries sequentially, with a 1.1s delay between
// cache misses to respect nominatim's rate limit
async function geocodeSeedData(places) {
  for (var i = 0; i < places.length; i++) {
    var p = places[i];
    if (!p.geocodeAddress) continue;

    // only sleep if this address isn't already cached
    var cached = geoCache(p.geocodeAddress);
    if (!cached) {
      await new Promise(function(resolve) { setTimeout(resolve, 1100); });
    }

    var result = await geocodeOne(p.geocodeAddress);
    if (result) {
      p.lat = result.lat;
      p.lng = result.lng;
    }

    // re-render after each result so the map updates progressively
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

  // track how many of the three fetches have finished
  var done = 0;
  function tick() {
    done++;
    // steps: 28% → 46% → 64% as each finishes
    setLoading(10 + done * 18);
  }

  // fire all three fetches at once but let each one tick the progress counter
  var osmPromise = fetchOSM().then(function(r)         { tick(); return r; });
  var ffPromise  = fetchFallingFruit().then(function(r) { tick(); return r; });
  var b4aPromise = fetchBack4App().then(function(r)     { tick(); return r; });

  var osmData = await osmPromise;
  var ffData  = await ffPromise;
  var b4aData = await b4aPromise;

  setLoading(72);

  // merge: seed data first (so our entries take precedence in dedup),
  // then back4app approved submissions, then OSM, then falling fruit
  allPlaces = dedup(SEED_DATA.concat(b4aData).concat(osmData).concat(ffData));

  buildFilters();
  renderMarkers();
  renderListings();
  setLoading(88);

  // geocode seed addresses in the background — map is already usable
  geocodeSeedData(SEED_DATA).then(function() {
    setLoading(100);
  });
}


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
   BOOT
   ============================================================ */

initMap();
loadAll();
