export type ContinentId = 'africa' | 'asia' | 'europe' | 'northAmerica' | 'southAmerica' | 'oceania';
export type ContinentFilter = ContinentId | 'all';

export interface Continent {
  id: ContinentFilter;
  /** Material icon: no continent has an icon of its own, so each one gets a symbol of its landscape. */
  icon: string;
  /** Colour of the button (white text on it reaches 4.5:1 or more). "All" has none: it takes the accent of the theme. */
  color?: string;
}

/** `all` first, then the continents in the order of the navigation. */
export const CONTINENTS: readonly Continent[] = [
  { id: 'all', icon: 'public' },
  { id: 'africa', icon: 'wb_sunny', color: '#b45309' },
  { id: 'asia', icon: 'temple_buddhist', color: '#be123c' },
  { id: 'europe', icon: 'castle', color: '#1d4ed8' },
  { id: 'northAmerica', icon: 'location_city', color: '#15803d' },
  { id: 'southAmerica', icon: 'forest', color: '#0f766e' },
  { id: 'oceania', icon: 'surfing', color: '#7e22ce' }
];

/**
 * ISO 3166-1 alpha-2 codes of each continent, following the UN geoscheme: Cyprus, Turkey, Armenia, Azerbaijan and
 * Georgia are in Asia, Russia is in Europe, and Central America and the Caribbean belong to North America.
 */
const MEMBERS: Record<ContinentId, string> = {
  africa:
    'DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW',
  asia:
    'AF AM AZ BH BD BT BN KH CN CY GE IN ID IR IQ IL JP JO KZ KW KG LA LB MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE HK MO',
  europe:
    'AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA',
  northAmerica: 'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US',
  southAmerica: 'AR BO BR CL CO EC GY PY PE SR UY VE',
  oceania: 'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU'
};

const CONTINENT_OF = new Map<string, ContinentId>(
  (Object.entries(MEMBERS) as [ContinentId, string][]).flatMap(([id, codes]) => codes.split(' ').map((code) => [code, id] as const))
);

/** Continent of a country, from its ISO code. A code the table does not know belongs to no continent. */
export function continentOf(isoCode: string): ContinentId | undefined {
  return CONTINENT_OF.get(isoCode.toUpperCase());
}

export function inContinent(isoCode: string, filter: ContinentFilter): boolean {
  return filter === 'all' || continentOf(isoCode) === filter;
}
