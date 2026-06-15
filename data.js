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
  { id: 'commun',    label: 'community meals',    color: '#8B5CF6' },
  { id: 'entertain', label: 'entertainment',      color: '#D4460F' },
  { id: 'coop',     label: 'food co-op',          color: '#FFC53D' },
  { id: 'pantry',   label: 'free pantry',         color: '#FF5722' },
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
    lat: 38.548928, lng: -121.729173,
    geocodeAddress: null,
    address: '1825 5th St, Davis CA 95616',
    link: 'https://cityofdavis.org/city-hall/parks-community-services/parks-open-space/community-gardens',
    description: 'city-run organic plots in East Davis. open year-round; new-plot waitlist through the city parks department.',
    source: 'public'
  },
  {
    id: 's2',
    name: 'Cannery Community Garden',
    category: 'garden',
    lat: 38.566203, lng: -121.741893,
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
    name: 'Mary L. Stephens Davis Branch Library',
    category: 'lolib',
    lat: 38.556916, lng: -121.747134,
    geocodeAddress: null,
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
    id: 's5',
    name: 'Davis Food Co-op Freedge',
    category: 'fridge',
    lat: 38.549561, lng: -121.740080,
    address: '620 G St, Davis CA 95616',
    link: 'https://davisfood.coop',
    description: 'community fridge on the west side of the co-op building. staff restock it daily with surplus produce, dairy, and bakery. take what you need, leave what you can.',
    source: 'public'
  },
  {
    id: 's6',
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
    id: 's7',
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
    lat: 38.549301, lng: -121.740791,
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
    name: 'Dero FixIt - Hawthorn Hall',
    category: 'bikes',
    lat: 38.537315, lng: -121.758166,
    geocodeAddress: null,
    address: '664 Tercero Hall Dr, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },

  {
    id: 's16',
    name: 'Dero FixIt - Scrub Oak Hall',
    category: 'bikes',
    lat: 38.536771, lng: -121.756677,
    geocodeAddress: null,
    address: 'Tercero Hall Cir, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
  {
    id: 's17',
    name: 'Dero FixIt - Redwood Hall',
    category: 'bikes',
    lat: 38.535968, lng: -121.755575,
    geocodeAddress: null,
    address: '363 Bioletti Way, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
  {
    id: 's18',
    name: 'Dero FixIt - Scrubs Cafe',
    category: 'bikes',
    lat: 38.533244, lng: -121.763174,
    geocodeAddress: null,
    address: '570 Health Sciences Mall, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
  {
    id: 's19',
    name: 'Dero FixIt - UC Davis',
    category: 'bikes',
    lat: 38.540293, lng: -121.758683,
    geocodeAddress: null,
    address: '631 Kleiber Hall Dr, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
    {
    id: 's20',
    name: 'Dero FixIt - UC Davis',
    category: 'bikes',
    lat: 38.541687, lng: -121.760999,
    geocodeAddress: null,
    address: '164 Orchard Park Dr, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },

    {
    id: 's21',
    name: 'Dero FixIt - Sunrise Park',
    category: 'bikes',
    lat: 38.541929, lng: -121.769681,
    geocodeAddress: null,
    address: '1590 Tilia St, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
   {
    id: 's22',
    name: 'Dero FixIt - UC Davis Activities and Recreation Center',
    category: 'bikes',
    lat: 38.543102, lng: -121.758926,
    geocodeAddress: null,
    address: '760 Orchard Rd, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
  {
    id: 's23',
    name: 'Dero FixIt - Castillian North',
    category: 'bikes',
    lat: 38.549512, lng: -121.767007,
    geocodeAddress: null,
    address: '1440 Wake Forest Dr, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
  {
    id: 's24',
    name: 'Dero FixIt - Mary L. Stephens Davis Library',
    category: 'bikes',
    lat: 38.557216, lng: -121.746952,
    geocodeAddress: null,
    address: '315 E 14th St, Davis, CA 95616',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },
  {
    id: 's25',
    name: 'Dero FixIt - The Cannery',
    category: 'bikes',
    lat: 38.566171, lng: -121.742076,
    geocodeAddress: null,
    address: '2000 Cannery Loop, Davis, CA 95616,',
    link: 'https://bikebarn.ucdavis.edu',
    description: 'public bike repair station. includes all the tools necessary to perform basic bike repairs and maintenance, from changing a flat to adjusting brakes and derailleurs.',
    source: 'dero'
  },


  {
    id: 's26',
    name: 'Free Supply Closet @ J Street Co-op',
    category: 'mutual',
    lat: 38.545397, lng: -121.735776,
    geocodeAddress: '234 J St, Davis, CA',
    address: 'Corner of 3rd and J Streets, Davis CA 95616',
    link: 'https://www.instagram.com/j_street_cooperative/',
    description: 'free supply closet inside the J Street Cooperative. kitchen supplies, living supplies, clothes, blankets, sleeping bags, and more. not for food.',
    source: 'public'
  },

  {
    id: 's27',
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
    id: 's28',
    name: 'East Davis Freedge',
    category: 'fridge',
    lat: 38.55979, lng: -121.7259293,
    address: '2013 Whittier Dr, Davis CA 95618',
    geocodeAddress: '2013 Whittier Dr, Davis, CA',
    link: null,
    description: 'neighborhood freedge in East Davis. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's29',
    name: 'Neighborhood Kitchen Freedge',
    category: 'fridge',
    lat: 38.568911, lng: -121.7498,
    address: '257 Grande Ave, Davis, CA 95616',
    geocodeAddress: '275 Grande Ave, Davis, CA',
    link: null,
    description: 'community freedge along Grande Ave. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's30',
    name: 'Eureka Freedge',
    category: 'fridge',
    lat: 38.554131, lng: -121.750091,
    address: '1221 Eureka Ave, Davis CA 95616',
    geocodeAddress: '1221 Eureka Ave, Davis, CA',
    link: null,
    description: 'neighborhood freedge on Eureka Ave. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's31',
    name: 'Turtlehouse Freedge',
    category: 'fridge',
    lat: 38.542451, lng: -121.746072,
    address: '217 2nd St, Davis CA 95616',
    geocodeAddress: '217 2nd St, Davis, CA',
    link: null,
    description: 'community freedge in downtown Davis. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's32',
    name: 'UC Davis Silo Freedge',
    category: 'fridge',
    lat: 38.538756, lng: -121.753033,
    address: '420 Hutchison Dr, Davis CA 95616',
    geocodeAddress: '420 Hutchison Dr, Davis, CA',
    link: null,
    description: 'campus freedge near the Silo. take what you need, leave what you can.',
    source: 'community'
  },
  {
    id: 's33',
    name: 'Bowley Plant Science Teaching Center Freedge',
    category: 'fridge',
    lat: 38.539142, lng: -121.763935,
    address: '1200 Extension Center Cir, Davis CA 95616',
    geocodeAddress: '1200 Extension Center Cir, Davis, CA',
    link: null,
    description: 'no donations — only the Student Farm stocks this freedge, but anyone can take food from it. usually well stocked with produce through the week.',
    source: 'community',
    status: 'open weekdays 8am-5pm'
  },

  // -------- thrift & reuse --------
  {
    id: 's34',
    name: 'Bohème',
    category: 'thrift',
    lat: 38.544472, lng: -121.743234,
    address: '409 3rd St, Davis CA 95616',
    geocodeAddress: '409 3rd St, Davis, CA',
    link: 'https://www.bohemethreads.com/',
    description: 'vintage and secondhand clothing boutique in downtown Davis.',
    source: 'public'
  },
  {
    id: 's35',
    name: 'Goodwill',
    category: 'thrift',
    lat: 38.553322, lng: 121.730549,
    address: '1640 E 8th St, Davis CA 95616',
    geocodeAddress: '1640 E 8th St, Davis, CA',
    link: null,
    description: 'donation-based thrift store with clothing, housewares, books, and more.',
    source: 'public'
  },

  // -------- edible campus harvest sites --------
  {
    id: 's36',
    name: 'Salad Bowl Garden (Edible Campus)',
    category: 'foraging',
    lat: 38.54298, lng: -121.751483,
    address: 'Plant and Environmental Sciences Building, UC Davis',
    geocodeAddress: '387 N Quad, Davis, CA',
    link: 'https://ediblecampus.ucdavis.edu/gardens/sbg',
    description: 'student-run edible landscape outside the Plant and Environmental Sciences building, growing since 2008. pick your own salad greens and veggies — open to anyone on campus.',
    source: 'public'
  },
  {
    id: 's37',
    name: 'Biological Orchard and Gardens (BOG), Mann Laboratory',
    category: 'foraging',
    lat: 38.541491, lng: -121.75564,
    address: 'Mann Laboratory, UC Davis',
    geocodeAddress: '549 Kleiber Hall Dr, Davis, CA',
    link: 'https://ediblecampus.ucdavis.edu/gardens/bog',
    description: 'permaculture demonstration garden in the heart of campus, including an orchard of heirloom California fruit trees. visitors are free to sample the harvest once established.',
    source: 'public'
  },

  // -------- little free libraries --------
  {
    id: 's38',
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
    id: 's39',
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
    id: 's40',
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
    id: 's41',
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
    id: 's42',
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
    id: 's43',
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
    id: 's44',
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
    id: 's45',
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
    id: 's46',
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
    id: 's47',
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
    id: 's48',
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
    id: 's49',
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
    id: 's50',
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
    id: 's51',
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
    id: 's52',
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
    id: 's53',
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
    id: 's54',
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
    id: 's55',
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
    id: 's56',
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
    id: 's57',
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
    id: 's58',
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
    id: 's59',
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
    id: 's60',
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
    id: 's61',
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
    id: 's62',
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
    id: 's63',
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
    id: 's64',
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
    id: 's65',
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
    id: 's66',
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
    id: 's67',
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
    id: 's68',
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
    id: 's69',
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
    id: 's70',
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
    id: 's71',
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
    id: 's72',
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
    id: 's73',
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
    id: 's74',
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
    id: 's75',
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
    id: 's76',
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
    id: 's77',
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
    id: 's78',
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
    id: 's79',
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
    id: 's80',
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
    id: 's81',
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
    id: 's82',
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
    id: 's83',
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
    id: 's84',
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
    id: 's85',
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
    id: 's86',
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
    id: 's87',
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
    id: 's88',
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
    id: 's89',
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
    id: 's90',
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
    id: 's91',
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
    id: 's92',
    name: 'UC Davis Arboretum & Public Garden',
    category: 'garden',
    lat: 38.5342, lng: -121.7560,
    address: '448 La Rue Rd, UC Davis, Davis CA 95616',
    geocodeAddress: 'UC Davis Arboretum La Rue Road Davis CA',
    link: 'https://arboretum.ucdavis.edu',
    description: '100-acre public garden free and open daily, dawn to dusk. includes the Ruth Risdon Storer Garden, Redwood Grove, native plant collections, and seasonal educational programs. no admission.',
    source: 'public'
  },

  {
    id: 's93',
    name: 'Davis Community Meals & Housing (Paul\'s Place)',
    category: 'commun',
    lat: 38.5556, lng: -121.7383,
    address: '1111 H St, Davis CA 95616',
    geocodeAddress: '1111 H St Davis CA',
    link: 'https://www.daviscommunitymeals.org',
    description: 'free hot meals served daily to anyone in need. Paul\'s Place provides meals, emergency shelter referrals, and community support. no questions asked.',
    source: 'public'
  },
  {
    id: 's94',
    name: 'St. Martin\'s Episcopal Church Community Meals',
    category: 'commun',
    lat: 38.5568, lng: -121.7700,
    address: '640 Hawthorn Ln, Davis CA 95616',
    geocodeAddress: '640 Hawthorn Lane Davis CA',
    link: null,
    description: 'community meal program open to all. check with the church for current schedule and available services.',
    source: 'community'
  },




  //  -------- pantries --------

  {
    id: 's95',
    name: 'ASUCD Pantry',
    category: 'pantry',
    lat: 38.5422208, lng: -121.7491641,
    address: 'Memorial Union, 1 Shields Ave, Davis, CA 95616',
    geocodeAddress: 'Memorial Union, 1 Shields Ave, Davis, CA',
    link: 'https://thepantry.ucdavis.edu/',
    description: 'a community pantry located in Memorial Union.',
    source: 'public'
  },

  // -------- parks --------

  {
    id: 's96',
    name: 'Central Park',
    category: 'parks',
    lat: 38.546069010516284, lng: -121.745031624665,
    address: '5th St & B St, 401 C St, Davis, CA 95616',
    geocodeAddress: null,
    link: 'https://www.cityofdavis.org/city-hall/parks-and-community-services/parks-and-open-space',
    description: 'the heart of downtown Davis. open lawn, mature trees, a bandshell, and the Saturday Farmers Market. frequent free community events year-round. always open, never a fee.',
    source: 'public'
  },
  {
    id: 's97',
    name: 'Community Park',
    category: 'parks',
    lat: 38.55888423376993, lng: -121.74638635675947,
    address: '203 E 14th St, Davis CA 95616',
    geocodeAddress: null,
    link: 'https://www.cityofdavis.org/city-hall/parks-and-community-services/parks-and-open-space',
    description: 'large north Davis park with open fields, Rainbow City playground, picnic areas, and the Davis Art Center next door. free and open daily.',
    source: 'public'
  },
  {
    id: 's98',
    name: 'Slide Hill Park',
    category: 'parks',
    lat: 38.56044579738162, lng: -121.71648678246144,
    address: '2850 Temple Dr, Davis, CA 95618',
    geocodeAddress: null,
    link: 'https://www.cityofdavis.org/city-hall/parks-and-community-services/parks-and-open-space',
    description: 'east Davis park with the famous cement slide, basketball, tennis, and softball. pool is open in summer for a small fee. the park itself is always free.',
    source: 'public'
  },
  {
    id: 's99',
    name: 'Sycamore Park',
    category: 'parks',
    lat: 38.55560273956896, lng: -121.76609100135528,
    address: '1313 Sycamore Ln, Davis, CA 95616',
    geocodeAddress: null,
    link: 'https://www.cityofdavis.org/city-hall/parks-and-community-services/parks-and-open-space',
    description: 'west Davis neighborhood park with open lawn, playground, and greenbelt path access. free and open daily.',
    source: 'public'
  },
  {
    id: 's100',
    name: 'Northstar Park',
    category: 'parks',
    lat: 38.57119628529738, lng: -121.75112419290593,
    address: '3434 Anderson Rd, Davis, CA 95616',
    geocodeAddress: null,
    link: 'https://www.cityofdavis.org/city-hall/parks-and-community-services/parks-and-open-space',
    description: 'north Davis neighborhood park with open space, playground, and greenbelt connections. free and open daily.',
    source: 'public'
  },

  // -------- nature commons --------

  // {
  //   id: 's101',
  //   name: 'Putah Creek — Hopkins Rd Trailhead',
  //   category: 'parks',
  //   lat: 38.5218, lng: -121.7811,
  //   address: 'Hopkins Rd at Putah Creek, Davis CA',
  //   geocodeAddress: null,
  //   link: 'https://arboretum.ucdavis.edu/putah-creek',
  //   description: 'main trailhead for the Putah Creek Riparian Reserve. fire ring picnic area, direct creek access (popular swimming hole in summer), porta potties on site. miles of shaded creek-side trail. free, open sunrise to sunset.',
  //   source: 'public'
  // },
  {
    id: 's102',
    name: 'Putah Creek — Old Davis Rd Trailhead',
    category: 'parks',
    lat: 38.5196, lng: -121.7577,
    address: 'Old Davis Rd at Putah Creek, Davis CA',
    geocodeAddress: null,
    link: 'https://arboretum.ucdavis.edu/putah-creek',
    description: 'east access point to the Putah Creek trail system. ADA-accessible path, educational signage, lots of shade. connects to the full levee and riparian trail loop. free.',
    source: 'public'
  },

  // -------- food & growing --------

  {
    id: 's103',
    name: 'UC Davis Student Farm Farmstand',
    category: 'garden',
    lat: 38.53930894554264, lng: -121.76539349992072,
    address: '1200 Extension Center Dr, Davis CA 95616',
    geocodeAddress: null,
    link: 'https://asi.ucdavis.edu/programs/sf/farm-marketplace',
    description: 'student-run farmstand on Extension Center Drive selling organic produce and sustainably grown flowers. open every Monday noon–3pm during the academic year. look for white pop-up tents. open to the whole community.',
    source: 'public'
  },
  {
    id: 's104',
    name: 'Davis Farmers Market',
    category: 'garden',
    lat: 38.54470829935328, lng: -121.74415041068424,
    address: 'Central Park, 4th St & C St, Davis CA 95616',
    geocodeAddress: null,
    link: 'https://www.davisfarmersmarket.org',
    description: 'year-round outdoor market in Central Park. Saturdays 8am–1pm year-round; Wednesdays 3–6pm spring through fall. local produce, live music, prepared food, and craft vendors. free to attend.',
    source: 'public'
  },

  // -------- community media --------

  {
    id: 's105',
    name: 'Davis Media Access (DCTV)',
    category: 'entertain',
    lat: 38.54901092239584, lng: -121.73139951539181,
    address: '1623 5th St Suite A, Davis CA 95616',
    geocodeAddress: null,
    link: 'https://davismedia.org',
    description: 'nonprofit community media center open to all Davis residents. home to DCTV public access TV (channel 15 on cable). offers free media training, equipment access, and production workshops. tune in: Comcast ch. 15 / stream at dctv.davismedia.org.',
    source: 'public'
  },
  {
    id: 's106',
    name: 'KDRT 95.7 FM — Low Power Community Radio',
    category: 'entertain',
    lat: 38.54894070087835, lng: -121.73145067648079,
    address: '1623 5th St Suite A, Davis CA 95616',
    geocodeAddress: null,
    link: 'https://kdrt.org',
    description: 'Davis\'s own low-power community radio station, run by Davis Media Access. volunteer DJs, local music, news, and talk. tune in at 95.7 FM or stream live at kdrt.org.',
    source: 'public'
  },
  {
    id: 's107',
    name: 'KDVS 90.3 FM — UC Davis Free Form Radio',
    category: 'entertain',
    lat: 38.542617, lng: -121.750264,
    address: '14 Lower Freeborn Hall, UC Davis, Davis CA 95616',
    geocodeAddress: null,
    link: 'https://kdvs.org',
    description: 'UC Davis student-run free-form radio station broadcasting since 1964. open to community volunteers and DJs. tune in at 90.3 FM or stream live at kdvs.org. one of the longest-running college radio stations in the US.',
    source: 'public'
  },

  // -------- mutual aid --------

  {
    id: 's108',
    name: 'Buy Nothing Davis',
    category: 'mutual',
    lat: null, lng: null,
    address: 'Davis, CA (neighborhood groups — no fixed location)',
    geocodeAddress: null,
    link: 'https://www.facebook.com/groups/buynothingdavis/',
    description: 'hyperlocal gift economy operating through neighborhood Facebook groups. give and receive household goods, food, skills, and time — completely free, no trading. find your neighborhood group at buynothingproject.org.',
    source: 'community'
  }
];