import { CityRow } from '../../models/geo.model';
import { cityTable } from '../cities/cities.config';

// A tab is just a table configuration with a tabTitle and a tabIcon (see cityTable in pages/cities).
// Two views of the same country: all its cities (editable), and its ten largest (read-only).

export interface CityTabsCtx {
  all: CityRow[];
  countryName: string;
}

export function cityTabs({ all, countryName }: CityTabsCtx) {
  const top = [...all].sort((a, b) => (b.population ?? 0) - (a.population ?? 0)).slice(0, 10);
  return [
    cityTable({ data: all, title: `Cities of ${countryName}`, compact: true, tab: { title: 'TABS.ALL', icon: 'location_city' } }),
    cityTable({ data: top, title: `Largest cities of ${countryName}`, compact: true, readonly: true, tab: { title: 'TABS.TOP', icon: 'trending_up' } })
  ];
}
