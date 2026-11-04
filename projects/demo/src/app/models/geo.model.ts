export interface Country {
  id: number;
  /** Lower-case ISO 3166-1 alpha-2 code: it is also the flag-icons class suffix (`fi fi-dz`). */
  code: string;
  isoCode: string;
  name: string;
  dialingCode: string;
  capital: string;
}

export interface City {
  id: number;
  countryId: number;
  name: string;
  /** Raw population. It is never modified: the display value is derived by the page configuration. */
  population: number | null;
  isCapital: boolean;
  /** Only available for Algeria (administrative code and Arabic name). */
  code?: number | null;
  nameAr?: string;
}

/** A city row as shown in a table: the raw record plus values derived for display. */
export interface CityRow extends City {
  flag: string;
  populationFormatted: string;
}
