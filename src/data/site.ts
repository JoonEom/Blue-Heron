/* ============================================================
   Blue Heron — business information
   ------------------------------------------------------------
   EDIT THIS FILE to change hours, phone, address, or links.
   Everything on the site reads from here: the header, the
   footer, the "Open now" badge, and the structured data that
   Google reads to show your hours in search results.
   ============================================================ */

export const site = {
  name: 'Blue Heron',
  legalName: 'Blue Heron Sandwiches & Coffee House',
  tagline: 'Sandwiches & Coffee House',
  shortDescription:
    'A neighborhood sandwich and coffee house in Magnolia, Seattle. Handmade sandwiches, fresh soup, and good coffee since 2005.',
  founded: 2005,
  owner: 'Grace Kim',
  neighborhood: 'Magnolia',
  /** Canonical host. Vercel redirects the apex here. */
  url: 'https://www.blueheronmagnolia.com',

  phone: {
    /** E.164 format — used for the tel: link. */
    href: '+12062852171',
    /** Human-readable — used for display. */
    display: '(206) 285-2171',
  },

  address: {
    street: '4001 Gilman Ave W #27',
    city: 'Seattle',
    region: 'WA',
    postalCode: '98199',
    country: 'US',
  },

  /** Approximate — used for structured data only. */
  geo: {
    latitude: 47.6489,
    longitude: -122.3862,
  },

  /**
   * Hours. `null` means closed that day.
   * Times are 24-hour "HH:MM" so the "Open now" badge can compare
   * them numerically. Change these and the badge, the footer, the
   * hours table, and the Google structured data all update together.
   */
  hours: {
    monday: { open: '07:00', close: '15:00' },
    tuesday: { open: '07:00', close: '15:00' },
    wednesday: { open: '07:00', close: '15:00' },
    thursday: { open: '07:00', close: '15:00' },
    friday: { open: '07:00', close: '15:00' },
    saturday: null,
    sunday: null,
  } as Record<string, { open: string; close: string } | null>,

  /** IANA timezone — the "Open now" badge uses the shop's local time,
   *  not the visitor's, so someone checking from out of state sees
   *  the truth. */
  timezone: 'America/Los_Angeles',

  features: {
    driveThru: true,
    catering: true,
    dineIn: true,
    takeout: true,
    /** Shown on the homepage. Set to null if this stops being true. */
    parking: 'Free lot right outside',
  },

  /**
   * TEMPORARY NOTICE — holiday closures, early closes, a broken oven.
   * Shows a banner at the top of every page while `active` is true.
   * Flip it back to false when it no longer applies.
   *
   * This exists because the shop already does this with a hand-written sign
   * taped to the counter; the website should be able to say it too.
   */
  notice: {
    active: false,
    text: 'Closed July 4–7 for the holiday. Back Monday at 7 AM.',
  },

  links: {
    /**
     * Google Maps directions, built from the address using Google's
     * documented Maps URL API. Deliberately NOT a place-ID or a copied
     * search URL — those carry session tracking and go stale. This form
     * opens Apple Maps on iPhone and Google Maps on Android.
     */
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=4001+Gilman+Ave+W+%2327%2C+Seattle%2C+WA+98199',
    yelp: 'https://www.yelp.com/biz/blue-heron-seattle',
    /** Local news feature — KOMO / Seattle Refined, on the Bada Bing. */
    pressArticle:
      'https://komonews.com/seattle-refined/the-bada-bing-sandwich-at-this-interbay-spot-will-make-your-mind-go-bada-boom',
    pressOutlet: 'Seattle Refined',
  },

  /** Rough price band for structured data: $ / $$ / $$$ / $$$$ */
  priceRange: '$$',

  /** The person who built the site. Shown in the footer credit. */
  credit: {
    name: 'Minjoon Eom',
    role: 'CS student at the University of Washington',
    portfolio: 'https://minjooneom.us',
    github: 'https://github.com/JoonEom',
  },
} as const;

/* ------------------------------------------------------------
   Derived helpers — no need to edit below this line.
   ------------------------------------------------------------ */

export const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayName = (typeof DAY_ORDER)[number];

/** "07:00" -> "7 AM"; "15:00" -> "3 PM"; "11:30" -> "11:30 AM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0
    ? `${hour12} ${period}`
    : `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Full single-line address, e.g. for the footer. */
export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

/**
 * Collapses consecutive days with identical hours into ranges:
 * "Mon–Fri 7 AM – 3 PM", "Sat–Sun Closed".
 * Keeps the footer compact without hand-maintaining the string.
 */
export function summarizeHours(): { days: string; time: string }[] {
  const abbrev: Record<DayName, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  const groups: { days: DayName[]; time: string }[] = [];

  for (const day of DAY_ORDER) {
    const h = site.hours[day];
    const time = h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed';
    const last = groups.at(-1);
    if (last && last.time === time) last.days.push(day);
    else groups.push({ days: [day], time });
  }

  return groups.map(({ days, time }) => ({
    days:
      days.length === 1
        ? abbrev[days[0]]
        : `${abbrev[days[0]]}–${abbrev[days.at(-1)!]}`,
    time,
  }));
}

/**
 * Opening hours in schema.org format, e.g. "Mo-Fr 07:00-15:00".
 * Closed days are simply omitted, which is what Google expects.
 */
export function schemaOpeningHours(): string[] {
  const schemaAbbrev: Record<DayName, string> = {
    monday: 'Mo',
    tuesday: 'Tu',
    wednesday: 'We',
    thursday: 'Th',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'Su',
  };

  const groups: { days: DayName[]; open: string; close: string }[] = [];

  for (const day of DAY_ORDER) {
    const h = site.hours[day];
    if (!h) continue;
    const last = groups.at(-1);
    const contiguous =
      last && DAY_ORDER.indexOf(day) === DAY_ORDER.indexOf(last.days.at(-1)!) + 1;
    if (last && contiguous && last.open === h.open && last.close === h.close) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], open: h.open, close: h.close });
    }
  }

  return groups.map(({ days, open, close }) => {
    const range =
      days.length === 1
        ? schemaAbbrev[days[0]]
        : `${schemaAbbrev[days[0]]}-${schemaAbbrev[days.at(-1)!]}`;
    return `${range} ${open}-${close}`;
  });
}
