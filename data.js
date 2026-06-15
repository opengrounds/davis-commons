/*
  open:grounds — data.js
  all hand-curated place data for davis, ca.
  loaded before script.js in index.html.

  source values:
    'public'    — publicly known places (co-ops, city gardens, thrift stores, etc.)
    'community' — community-submitted or crowd-sourced (little free libraries, freedges)
    'fallingfruit' — falling fruit foraging database (assigned by script.js at fetch time)
*/


/* ============================================================
   CATEGORY DEFINITIONS
   each entry maps a slug to a display label and a hex color.
   the color is used for markers, swatches, and tags.
   ============================================================ */

var CATEGORIES = [
  { id: 'all',      label: 'all',                 color: '#15130F' },
  { id: 'garden',   label: 'community garden',    color: '#2F4D22' },
  { id: 'parks',    label: 'community parks',     color: '#4a932b' },
  { id: 'fridge',   label: 'community fridge',    color: '#2F9BD6' },
  { id: 'commun',    label: 'community meals',    color: '#a824b9' },
  { id: 'coop',     label: 'food co-op',          color: '#FFC53D' },
  { id: 'pantry',   label: 'free pantry',         color: '#FF5722' },
  { id: 'seeds',    label: 'seed library',        color: '#8B5CF6' },
  { id: 'lolib',    label: 'local library',       color: '#beb129' },
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
    lat: null, lng: null,
    geocodeAddress: '1825 5th Street, Davis, CA',
    address: '1825 5th St, Davis CA 95616',
    link: 'https://cityofdavis.org/city-hall/parks-community-services/parks-open-space/community-gardens',
    description: 'city-run organic plots in East Davis. open year-round; new-plot waitlist through the city parks department.',
    source: 'public'
  },
  {
    id: 's2',
    name: 'Cannery Community Garden',
    category: 'garden',
    lat: null, lng: null,
    address: '1701 Harvest St, Davis CA 95616',
    geocodeAddress: '1701 Harvest St, Davis, CA',
    link: 'https://cityofdavis.org/city-hall/parks-community-services/parks-open-space/community-gardens',
    description: 'raised-bed plots in the Cannery neighborhood, open to residents and the public via the city garden program.',
    source: 'public'
  },
  {
    id: 's3',
    name: 'ASUCD Experimental College Garden',
    category: 'garden',
    lat: 38.5346, lng: -121.7620,
    geocodeAddress: 'UC Davis Student Farm Domes, Davis, CA',
    address: 'UC Davis campus, near the Domes',
    link: 'https://asucd.ucdavis.edu',
    description: 'student-run organic farm near the Baggins End domes. open to students, staff, and the wider community.',
    source: 'public'
  },
  {
    id: 's4',
    name: 'Davis Food Co-op Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: '620 G St, Davis CA 95616',
    link: 'https://davisfood.coop',
    description: 'community fridge on the west side of the co-op building. staff restock it daily with surplus produce, dairy, and bakery. take what you need, leave what you can.',
    source: 'public'
  },
  {
    id: 's5',
    name: 'Memorial Union Freedge',
    category: 'fridge',
    lat: 38.5423, lng: -121.7489,
    geocodeAddress: null,
    address: 'UC Davis Memorial Union, east side near the bookstore',
    link: 'https://basicneeds.ucdavis.edu',
    description: 'campus freedge for whole produce, canned goods, and sealed non-perishables, across from the ASUCD pantry.',
    source: 'public'
  },
  {
    id: 's6',
    name: 'Davis Food Co-op',
    category: 'coop',
    lat: 38.5496, lng: -121.7398,
    geocodeAddress: '620 G Street, Davis, CA',
    address: '620 G St, Davis CA 95616',
    link: 'https://davisfood.coop',
    description: 'member-owned grocery co-op since 1972, open to everyone. organic produce, bulk bins, a full deli, and a community bulletin board. open daily 7am-10pm.',
    source: 'public'
  },
  {
    id: 's8',
    name: 'Community Mercantile',
    category: 'thrift',
    lat: 38.5493, lng: -121.7196,
    geocodeAddress: '622 Cantrill Drive, Davis, CA',
    address: '622 Cantrill Dr, Davis CA 95618',
    link: 'https://www.communitymercdavis.org/',
    description: 'nonprofit reuse store and tool lending library. housewares, furniture, tools, fabric, and more, diverted from the landfill. open thu-sun.',
    source: 'public',
    colocated: [
      {
        name: 'Community Mercantile',
        category: 'tools',
        description: 'tool lending library co-located with the reuse store. borrow tools for home, garden, bike repair, and more. open thu-sun during reuse store hours.',
        link: 'https://www.communitymercdavis.org/library-catalog/'
      }
    ]
  },
  {
    id: 's9',
    name: 'Easy Wind Gear',
    category: 'thrift',
    lat: null, lng: null,
    address: '617 G St, Davis, CA 95616',
    geocodeAddress: '617 G St, Davis, CA',
    link: 'https://easywindgear.com/',
    description: 'outdoor gear reuse store. affordable used camping, hiking, and climbing gear.',
    source: 'public'
  },
  {
    id: 's10',
    name: 'Yolo County SPCA Thrift Store',
    category: 'thrift',
    lat: 38.5449, lng: -121.7374,
    geocodeAddress: '920 3rd Street, Davis, CA',
    address: '920 3rd St Ste F, Davis CA 95616',
    link: 'https://www.yolospca.org',
    description: 'donation-based thrift store benefiting the spca. clothing, books, housewares, and the occasional great find.',
    source: 'public'
  },
  {
    id: 's11',
    name: 'Aggie Reuse Store',
    category: 'thrift',
    lat: 38.5423854, lng: -121.7490766,
    geocodeAddress: null,
    address: 'UC Davis Memorial Union #154, 1 Shields Ave',
    link: 'https://sustainability.ucdavis.edu/action/waste/reuse-store',
    description: 'student-run reuse store now operating as zero-cost mutual aid. clothes, school supplies, and small appliances, free for students and the community.',
    source: 'public'
  },
  {
    id: 's12',
    name: 'Davis Bike Garage',
    category: 'bikes',
    lat: 38.5506, lng: -121.7153,
    geocodeAddress: '606 Pena Drive, Davis, CA',
    address: '606 Pena Dr #300, Davis CA 95618',
    link: 'https://www.thebikecampaign.org/bike-garage',
    description: 'free community bike repair shop run by The Bike Campaign. drop in with your bike, volunteer mechanics on site. check thebikecampaign.org for current hours.',
    source: 'public'
  },
  {
    id: 's13',
    name: 'Davis Bike Collective',
    category: 'bikes',
    lat: 38.5473, lng: -121.7346,
    geocodeAddress: '1221 4th Street, Davis, CA',
    address: '1221 1/2 4th St, Davis CA 95616',
    link: 'https://davisbikecollective.org',
    description: 'volunteer-run nonprofit bike shop. pay-what-you-can repairs, free parts library, and DIY stands. open drop-in hours most evenings and weekends.',
    source: 'public'
  },
  {
    id: 's14',
    name: 'ASUCD Bike Barn',
    category: 'bikes',
    lat: 38.5386507, lng: -121.752257,
    geocodeAddress: null,
    address: '1 Shields Ave (Silo area), UC Davis',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'full-service campus bike shop with low-cost repairs and a self-service stand with tools. staffed by students, open to students, faculty, and the public.',
    source: 'public'
  },
  {
    id: 's15',
    name: 'Mary L. Stephens Davis Branch Library',
    category: 'lolib',
    lat: 38.5568, lng: -121.7471,
    geocodeAddress: '315 E 14th Street, Davis, CA',
    address: '315 E 14th St, Davis CA 95616',
    link: 'https://yolocountylibrary.org/locations/davis/',
    description: 'full public library with books, DVDs, CDs, and more. free with a library card. open to everyone.',
    source: 'public',
    colocated: [
      {
        name: 'Davis Makerspace & Clothing Repair Cafe',
        category: 'tools',
        description: 'community makerspace and repair cafe, co-hosted at the library. bring projects, clothing, electronics, or household items — tools available, staff and volunteers on hand to help. supervised children welcome; signed liability waiver required (available on site).',
        hours: 'mon & tue 6–8p · thu 9:30–11:30a',
        link: 'https://artsalliancedavis.org/event/davis-makerspace-clothing-repair-cafe-340/'
      }
    ]
  },
  {
    id: 's16',
    name: 'Free Supply Closet @ J Street Co-op',
    category: 'mutual',
    lat: null, lng: null,
    geocodeAddress: 'J Street Cooperative, 3rd Street and J Street, Davis, CA',
    address: 'Corner of 3rd and J Streets, Davis CA 95616',
    link: 'https://www.instagram.com/j_street_cooperative/',
    description: 'free supply closet inside the J Street Cooperative. kitchen supplies, living supplies, clothes, blankets, sleeping bags, and more. not for food — for food donations, visit the Freedge at the Quaker Friends Meeting House (4th and L St).',
    source: 'public'
  },

  {
    id: 's17',
    name: 'Mutual Aid in Davis (MAD)',
    category: 'mutual',
    lat: null, lng: null,
    geocodeAddress: null,
    address: 'Davis, CA (delivery-based — no fixed location)',
    link: 'https://www.norcalresist.org/mad-davis.html',
    description: 'volunteer delivery network redistributing furniture, clothes, living supplies, and kitchen supplies from donors to neighbors in need. fill out the intake form on their site to request items. run by NorCal Resist.',
    source: 'public'
  }
];


/* ============================================================
   ADDRESS-ONLY ENTRIES
   places that come in as an address only — no coordinates.
   lat/lng are left as null here; geocodeSeedData() resolves
   them via nominatim on load, caching results in localStorage.
   entries stay hidden on the map until geocoding resolves them.

   to add more places, copy the shape below: id, name, category,
   lat: null, lng: null, address (shown to users), geocodeAddress
   (the query sent to nominatim — keep it simple), description,
   link, source.
   ============================================================ */

var ADDRESS_DATA = [

  // -------- freedges --------
  {
    id: 's18',
    name: 'East Davis Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: '2013 Whittier Dr, Davis CA 95618',
    geocodeAddress: '2013 Whittier Dr, Davis, CA',
    link: null,
    description: 'neighborhood freedge in East Davis. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's19',
    name: 'Neighborhood Kitchen Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: 'Grande Ave, Davis CA 95616',
    geocodeAddress: 'Grande Ave, Davis, CA',
    link: null,
    description: 'community freedge along Grande Ave. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's20',
    name: 'Eureka Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: '1221 Eureka Ave, Davis CA 95616',
    geocodeAddress: '1221 Eureka Ave, Davis, CA',
    link: null,
    description: 'neighborhood freedge on Eureka Ave. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's21',
    name: 'Turtlehouse Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: '217 2nd St, Davis CA 95616',
    geocodeAddress: '217 2nd St, Davis, CA',
    link: null,
    description: 'community freedge in downtown Davis. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's22',
    name: 'UC Davis Silo Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: '420 Hutchison Dr, Davis CA 95616',
    geocodeAddress: '420 Hutchison Dr, Davis, CA',
    link: null,
    description: 'campus freedge near the Silo. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's23',
    name: 'Bowley Plant Science Teaching Center Freedge',
    category: 'fridge',
    lat: null, lng: null,
    address: '1200 Extension Center Cir, Davis CA 95616',
    geocodeAddress: '1200 Extension Center Cir, Davis, CA',
    link: null,
    description: 'no donations — only the Student Farm stocks this freedge, but anyone can take food from it. usually well stocked with produce through the week.',
    source: 'community',
    status: 'open weekdays 8am-5pm'
  },

  // -------- thrift & reuse --------
  {
    id: 's25',
    name: 'Bohème',
    category: 'thrift',
    lat: null, lng: null,
    address: '409 3rd St, Davis CA 95616',
    geocodeAddress: '409 3rd St, Davis, CA',
    link: 'https://www.bohemethreads.com/',
    description: 'vintage and secondhand clothing boutique in downtown Davis.',
    source: 'public'
  },
  {
    id: 's26',
    name: 'Goodwill',
    category: 'thrift',
    lat: null, lng: null,
    address: '1640 E 8th St, Davis CA 95616',
    geocodeAddress: '1640 E 8th St, Davis, CA',
    link: null,
    description: 'donation-based thrift store with clothing, housewares, books, and more.',
    source: 'public'
  },

  // -------- edible campus harvest sites --------
  {
    id: 's27',
    name: 'Salad Bowl Garden (Edible Campus)',
    category: 'foraging',
    lat: null, lng: null,
    address: 'Plant and Environmental Sciences Building, UC Davis',
    geocodeAddress: '387 N Quad, Davis, CA',
    link: 'https://ediblecampus.ucdavis.edu/gardens/sbg',
    description: 'student-run edible landscape outside the Plant and Environmental Sciences building, growing since 2008. pick your own salad greens and veggies — open to anyone on campus.',
    source: 'public'
  },
  {
    id: 's28',
    name: 'Biological Orchard and Gardens (BOG), Mann Laboratory',
    category: 'foraging',
    lat: null, lng: null,
    address: 'Mann Laboratory, UC Davis',
    geocodeAddress: '549 Kleiber Hall Dr, Davis, CA',
    link: 'https://ediblecampus.ucdavis.edu/gardens/bog',
    description: 'permaculture demonstration garden in the heart of campus, including an orchard of heirloom California fruit trees. visitors are free to sample the harvest once established.',
    source: 'public'
  },

  // -------- little free libraries --------
  {
    id: 's29',
    name: 'Little Free Library + Board Games',
    category: 'library',
    lat: null, lng: null,
    address: '2816 Loyola Dr, Davis CA 95618',
    geocodeAddress: '2816 Loyola Dr, Davis, CA',
    link: null,
    description: 'little free library that also has a board game lending shelf.',
    source: 'community'
  },
  {
    id: 's30',
    name: 'Little Free Library + Produce Basket',
    category: 'library',
    lat: null, lng: null,
    address: '1102 Petra Ct, Davis CA 95618',
    geocodeAddress: '1102 Petra Ct, Davis, CA',
    link: null,
    description: 'little free library paired with a produce-sharing basket — take a book, take some extra produce.',
    source: 'community'
  },
  {
    id: 's31',
    name: 'Little Free Library – Prado Ln',
    category: 'library',
    lat: null, lng: null,
    address: '2951 Prado Ln, Davis CA 95618',
    geocodeAddress: '2951 Prado Ln, Davis, CA',
    link: null,
    description: 'a little free library on Prado Ln. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's32',
    name: 'Little Free Library – Camphor Ln',
    category: 'library',
    lat: null, lng: null,
    address: '1367 Camphor Ln, Davis CA 95618',
    geocodeAddress: '1367 Camphor Ln, Davis, CA',
    link: null,
    description: 'a little free library on Camphor Ln. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's33',
    name: 'Little Free Library – Layton Dr',
    category: 'library',
    lat: null, lng: null,
    address: '2826 Layton Dr, Davis CA 95618',
    geocodeAddress: '2826 Layton Dr, Davis, CA',
    link: null,
    description: 'a little free library on Layton Dr. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's34',
    name: 'Little Free Library – Blackburn Dr',
    category: 'library',
    lat: null, lng: null,
    address: '2613 Blackburn Dr, Davis CA 95618',
    geocodeAddress: '2613 Blackburn Dr, Davis, CA',
    link: null,
    description: 'a little free library on Blackburn Dr. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's35',
    name: 'Little Free Library – Monarch Ln',
    category: 'library',
    lat: null, lng: null,
    address: '1803 Monarch Ln, Davis CA 95618',
    geocodeAddress: '1803 Monarch Ln, Davis, CA',
    link: null,
    description: 'a little free library on Monarch Ln. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's36',
    name: 'Little Free Library – Eligio Ln',
    category: 'library',
    lat: null, lng: null,
    address: '1430 Eligio Ln, Davis CA 95618',
    geocodeAddress: '1430 Eligio Ln, Davis, CA',
    link: null,
    description: 'a little free library on Eligio Ln. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's37',
    name: 'Little Free Library – Alegre Way',
    category: 'library',
    lat: null, lng: null,
    address: '3848 Alegre Way, Davis CA 95618',
    geocodeAddress: '3848 Alegre Way, Davis, CA',
    link: null,
    description: 'a little free library on Alegre Way. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's38',
    name: 'Little Free Library – Arroyo Ave',
    category: 'library',
    lat: null, lng: null,
    address: '4114 Arroyo Ave, Davis CA 95618',
    geocodeAddress: '4114 Arroyo Ave, Davis, CA',
    link: null,
    description: 'a little free library on Arroyo Ave. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's39',
    name: 'Little Free Library – Atlantis Park',
    category: 'library',
    lat: null, lng: null,
    address: '1406 Pastal Way, Davis CA 95618',
    geocodeAddress: '1406 Pastal Way, Davis, CA',
    link: null,
    description: 'a little free library on Pastal Way. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's40',
    name: 'Little Free Library – La Paz Dr',
    category: 'library',
    lat: null, lng: null,
    address: '815 La Paz Dr, Davis CA 95618',
    geocodeAddress: '815 La Paz Dr, Davis, CA',
    link: null,
    description: 'a little free library on La Paz Dr. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's41',
    name: 'Little Free Library – East Davis',
    category: 'library',
    lat: null, lng: null,
    address: '2222 E 8th St, Davis CA 95618',
    geocodeAddress: '2222 E 8th St, Davis, CA',
    link: null,
    description: 'a little free library on E 8th St. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Renoir Ave',
    category: 'library',
    lat: null, lng: null,
    address: '2005 Renoir Ave, Davis CA 95618',
    geocodeAddress: '2005 Renoir Ave, Davis, CA',
    link: null,
    description: 'a little free library on Renoir Ave. swap a book, take a book.',
    source: 'community'
  },



   {
    id: 's42',
    name: 'Little Free Library – Coolidge Court',
    category: 'library',
    lat: null, lng: null,
    address: '517 Coolidge Ct, Davis, CA',
    geocodeAddress: '517 Coolidge Ct, Davis, CA',
    link: null,
    description: 'a little free library on Coolidge Court. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – McNelson\'s Library',
    category: 'library',
    lat: null, lng: null,
    address: 'Chesapeake Bay and Secret Bay streets, Davis, CA',
    geocodeAddress: '3203 Chesapeake Bay St, Davis, CA',
    link: null,
    description: 'a little free library on Chesapeake Bay and Secret Bay streets. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Morro Bay',
    category: 'library',
    lat: null, lng: null,
    address: '3325 Morro Bay Ave, Davis, CA',
    geocodeAddress: '3325 Morro Bay Ave, Davis, CA',
    link: null,
    description: 'a little free library on Morro Bay Ave. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Popo And Lǎoye Library',
    category: 'library',
    lat: null, lng: null,
    address: '2334 Glacier Place, Davis, CA',
    geocodeAddress: '2334 Glacier Place, Davis, CA',
    link: null,
    description: 'a little free library on Glacier Place. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Purdue Dr',
    category: 'library',
    lat: null, lng: null,
    address: '1219 Purdue Dr, Davis, CA',
    geocodeAddress: '1219 Purdue Dr, Davis, CA',
    link: null,
    description: 'a little free library on Purdue Dr. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Charlotte\'s Mystery Library',
    category: 'library',
    lat: null, lng: null,
    address: '1251 Fordham Dr, Davis, CA',
    geocodeAddress: '1251 Fordham Dr, Davis, CA',
    link: null,
    description: 'a little free library on Fordham Dr. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Lemon Ln',
    category: 'library',
    lat: null, lng: null,
    address: '1520 Lemon Ln, Davis, CA',
    geocodeAddress: '1520 Lemon Ln, Davis, CA',
    link: null,
    description: 'a little free library on Lemon Ln. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Ben\'s Little Library',
    category: 'library',
    lat: null, lng: null,
    address: '2608 Quail St., Davis, CA',
    geocodeAddress: '2608 Quail St., Davis, CA',
    link: null,
    description: 'a little free library on Quail St at the crosswalk to the Greenbelt, near the Dominoes statue. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – The Little Bluebird Library',
    category: 'library',
    lat: null, lng: null,
    address: '616 Bluebird Place, Davis, CA',
    geocodeAddress: '616 Bluebird Place, Davis, CA',
    link: null,
    description: 'a little free library on Bluebird Place. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Kids Library',
    category: 'library',
    lat: null, lng: null,
    address: '240 Pintail Place, Davis, CA',
    geocodeAddress: '240 Pintail Place, Davis, CA',
    link: null,
    description: 'a little free kids library on Pintail Place. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Sandpiper Drive',
    category: 'library',
    lat: null, lng: null,
    address: '218 Sandpiper Drive, Davis, CA',
    geocodeAddress: '218 Sandpiper Drive, Davis, CA',
    link: null,
    description: 'a little free library on Sandpiper Drive. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Fiesta Ave',
    category: 'library',
    lat: null, lng: null,
    address: '404 Fiesta Ave, Davis, CA',
    geocodeAddress: '404 Fiesta Ave, Davis, CA',
    link: null,
    description: 'a little free library on Fiesta Ave. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Bueno Drive',
    category: 'library',
    lat: null, lng: null,
    address: '2504 Bueno Dr., Davis, CA',
    geocodeAddress: '2504 Bueno Dr., Davis, CA',
    link: null,
    description: 'a little free library on Bueno Drive. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Hawthorne Ln',
    category: 'library',
    lat: null, lng: null,
    address: '768 Hawthorne Ln, Davis, CA',
    geocodeAddress: '768 Hawthorne Ln, Davis, CA',
    link: null,
    description: 'a little free library on Hawthorne Ln. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Linden Ln',
    category: 'library',
    lat: null, lng: null,
    address: '830 Linden Ln, Davis, CA',
    geocodeAddress: '830 Linden Ln, Davis, CA',
    link: null,
    description: 'a little free library on Linden Ln. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Georgetown Place',
    category: 'library',
    lat: null, lng: null,
    address: '632 Georgetown Place, Davis, CA',
    geocodeAddress: '632 Georgetown Place, Davis, CA',
    link: null,
    description: 'a little free library on Georgetown Place. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Oeste Drive',
    category: 'library',
    lat: null, lng: null,
    address: '1000 Oeste Drive, Davis, CA',
    geocodeAddress: '1000 Oeste Drive, Davis, CA',
    link: null,
    description: 'a little free library on Oeste Drive. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Little Moon',
    category: 'library',
    lat: null, lng: null,
    address: '554 Rutgers Dr, Davis, CA',
    geocodeAddress: '554 Rutgers Dr, Davis, CA',
    link: null,
    description: 'a little free library on Rutgers Dr. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – The Brazil Family',
    category: 'library',
    lat: null, lng: null,
    address: '1418 Redwood Lane, Davis, CA',
    geocodeAddress: '1418 Redwood Lane, Davis, CA',
    link: null,
    description: 'a little free library on Redwood Lane. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Elmwood Drive',
    category: 'library',
    lat: null, lng: null,
    address: '760 Elmwood Drive, Davis, CA',
    geocodeAddress: '760 Elmwood Drive, Davis, CA',
    link: null,
    description: 'a little free library on Elmwood Drive. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – College Park',
    category: 'library',
    lat: null, lng: null,
    address: '28 College Park, Davis, CA',
    geocodeAddress: '28 College Park, Davis, CA',
    link: null,
    description: 'a little free library on College Park. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – Chloe\'s Yolo District Office',
    category: 'library',
    lat: null, lng: null,
    address: '600 A Street, Davis, CA',
    geocodeAddress: '600 A Street, Davis, CA',
    link: null,
    description: 'a little free library on A Street. swap a book, take a book.',
    source: 'community'
  },
   {
    id: 's42',
    name: 'Little Free Library – A Street',
    category: 'library',
    lat: null, lng: null,
    address: '854 A Street, Davis, CA',
    geocodeAddress: '854 A Street, Davis, CA',
    link: null,
    description: 'a little free library on A Street. swap a book, take a book.',
    source: 'community'
  },
    {
    id: 's42',
    name: 'Little Free Library – Cedar Place Children\'s Library',
    category: 'library',
    lat: null, lng: null,
    address: '1301 Cedar Place, Davis, CA',
    geocodeAddress: '1301 Cedar Place, Davis, CA',
    link: null,
    description: 'a little free library on Cedar Place. swap a book, take a book.',
    source: 'community'
  },
    {
    id: 's42',
    name: 'Little Free Library – Andyhaus',
    category: 'library',
    lat: null, lng: null,
    address: '1501 L Street, Davis, CA',
    geocodeAddress: '1501 L Street, Davis, CA',
    link: null,
    description: 'a little free library on L Street. swap a book, take a book.',
    source: 'community'
  },
     {
    id: 's42',
    name: 'Little Free Library – University Ave',
    category: 'library',
    lat: null, lng: null,
    address: '330 University Ave, Davis, CA',
    geocodeAddress: '330 University Ave, Davis, CA',
    link: null,
    description: 'a little free library on University Ave. swap a book, take a book.',
    source: 'community'
  },
     {
    id: 's42',
    name: 'Little Free Library – E Street',
    category: 'library',
    lat: null, lng: null,
    address: '522 E Street, Davis, CA',
    geocodeAddress: '522 E Street, Davis, CA',
    link: null,
    description: 'a little free library on E Street. swap a book, take a book.',
    source: 'community'
  },
     {
    id: 's42',
    name: 'Little Free Library – Little Lo',
    category: 'library',
    lat: null, lng: null,
    address: '721 K St, Davis, CA',
    geocodeAddress: '721 K St, Davis, CA',
    link: null,
    description: 'a little free library on K St. swap a book, take a book.',
    source: 'community'
  },
     {
    id: 's42',
    name: 'Little Free Library – True Connections',
    category: 'library',
    lat: null, lng: null,
    address: '405 L Street, Davis, CA',
    geocodeAddress: '405 L Street, Davis, CA',
    link: null,
    description: 'a little free library on L Street. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Davis Manor Neighborhood Free Library',
    category: 'library',
    lat: null, lng: null,
    address: '1418 Colgate Dr, Davis, CA',
    geocodeAddress: '1418 Colgate Dr, Davis, CA',
    link: null,
    description: 'a little free library on Colgate Dr. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Cypress Lane',
    category: 'library',
    lat: null, lng: null,
    address: '1009 Cypress Lane, Davis, CA',
    geocodeAddress: '1009 Cypress Lane, Davis, CA',
    link: null,
    description: 'a little free library on Cypress Lane. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Pole Line Road',
    category: 'library',
    lat: null, lng: null,
    address: '1309 Pole Line Road, Davis, CA',
    geocodeAddress: '1309 Pole Line Road, Davis, CA',
    link: null,
    description: 'a little free library on Pole Line Road. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Little Free Library Peace Garden',
    category: 'library',
    lat: null, lng: null,
    address: '2005 Renoir Ave, Davis, CA',
    geocodeAddress: '2005 Renoir Ave, Davis, CA',
    link: null,
    description: 'a little free library at Peace Garden. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Dogs, Cars, and other Great Things',
    category: 'library',
    lat: null, lng: null,
    address: '2125 Baywood Lane, Davis, CA',
    geocodeAddress: '2125 Baywood Lane, Davis, CA',
    link: null,
    description: 'a little free library on Baywood Lane. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Amanda\'s Library',
    category: 'library',
    lat: null, lng: null,
    address: '3504 Mono Place, Davis, CA',
    geocodeAddress: '3504 Mono Place, Davis, CA',
    link: null,
    description: 'a little free library on Mono Place. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Little Woodbridge Library',
    category: 'library',
    lat: null, lng: null,
    address: '4131 Hackberry Place, Davis, CA',
    geocodeAddress: '4131 Hackberry Place, Davis, CA',
    link: null,
    description: 'a little free library on the South Davis greenbelt. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Deodara Court',
    category: 'library',
    lat: null, lng: null,
    address: 'Deodara Court, Davis, CA',
    geocodeAddress: 'Deodara Court, Davis, CA',
    link: null,
    description: 'a little free library on Deodara Court. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – Almond Lane',
    category: 'library',
    lat: null, lng: null,
    address: '43351 Almond Lane, Davis, CA',
    geocodeAddress: '43351 Almond Lane, Davis, CA',
    link: null,
    description: 'a little free library on Almond Lane. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – La Mesa Ct',
    category: 'library',
    lat: null, lng: null,
    address: '2238 La Mesa Ct, Davis, CA',
    geocodeAddress: '2238 La Mesa Ct, Davis, CA',
    link: null,
    description: 'a little free library on La Mesa Ct. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'Little Free Library – El Pescador Ct',
    category: 'library',
    lat: null, lng: null,
    address: '1725 El Pescador Ct, Davis, CA',
    geocodeAddress: '1725 El Pescador Ct, Davis, CA',
    link: null,
    description: 'a little free library on El Pescador Ct. swap a book, take a book.',
    source: 'community'
  },



//    -------- gardens --------

{
    id: 's42',
    name: 'UC Davis Arboretum',
    category: 'garden',
    lat: 38.5347, lng: -121.7597,
    address: 'UC Davis Arboretum, Davis, CA',
    geocodeAddress: 'UC Davis Arboretum, Davis, CA',
    link: null,
    description: 'a little free library on El Pescador Ct. swap a book, take a book.',
    source: 'community'
  },

  {
    id: 's42',
    name: 'UC Davis Salad Bowl Garden',
    category: 'garden',
    lat: 38.5347, lng: -121.7597,
    address: 'UC Davis Arboretum, Davis, CA',
    geocodeAddress: 'UC Davis Arboretum, Davis, CA',
    link: null,
    description: 'a little free library on El Pescador Ct. swap a book, take a book.',
    source: 'community'
  },

  {
    id: 's42',
    name: 'UC Davis Biological Orchard & Gardens (BOG)',
    category: 'garden',
    lat: 38.5347, lng: -121.7597,
    address: 'UC Davis Arboretum, Davis, CA',
    geocodeAddress: 'UC Davis Arboretum, Davis, CA',
    link: null,
    description: 'a little free library on El Pescador Ct. swap a book, take a book.',
    source: 'community'
  },


  {
    id: 's42',
    name: 'Davis Community Meals & Housing (Paul\'s Place)',
    category: 'commun',
    lat: 38.5556, lng: -121.7383,
    address: 'UC Davis Arboretum, Davis, CA',
    geocodeAddress: 'UC Davis Arboretum, Davis, CA',
    link: null,
    description: 'a little free library on El Pescador Ct. swap a book, take a book.',
    source: 'community'
  },
  {
    id: 's42',
    name: 'St. Martin\'s Episcopal Church',
    category: 'commun',
    lat: 38.5568, lng: -121.7700,
    address: 'UC Davis Arboretum, Davis, CA',
    geocodeAddress: 'UC Davis Arboretum, Davis, CA',
    link: null,
    description: 'a little free library on El Pescador Ct. swap a book, take a book.',
    source: 'community'
  },




  //  -------- pantries --------

  {
    id: 's43',
    name: 'ASUCD Pantry',
    category: 'pantry',
    lat: 38.5422208, lng: -121.7491641,
    address: 'Memorial Union, 1 Shields Ave, Davis, CA 95616',
    geocodeAddress: 'Memorial Union, 1 Shields Ave, Davis, CA',
    link: 'https://thepantry.ucdavis.edu/',
    description: 'a community pantry located in Memorial Union.',
    source: 'public'
  }
];

