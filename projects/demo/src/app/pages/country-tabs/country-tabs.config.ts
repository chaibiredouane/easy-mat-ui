import { CityRow } from '../../models/geo.model';
import { cityTable } from '../cities/cities.config';

// A tab is just a table configuration with a tabTitle and a tabIcon (see cityTable in pages/cities).
// Two views of the same country: all its cities (editable), and its ten largest (read-only).

export interface CityTabsCtx {
  all: CityRow[];
  /** Toolbar titles, already translated. */
  allTitle: string;
  topTitle: string;
}

export function cityTabs({ all, allTitle, topTitle }: CityTabsCtx) {
  const top = [...all].sort((a, b) => (b.population ?? 0) - (a.population ?? 0)).slice(0, 10);
  return [
    cityTable({ data: all, title: allTitle, compact: true, tab: { title: 'TABS.ALL', icon: 'location_city' } }),
    cityTable({ data: top, title: topTitle, compact: true, readonly: true, tab: { title: 'TABS.TOP', icon: 'trending_up' } })
  ];
}
