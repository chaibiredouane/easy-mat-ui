import { Injectable } from '@angular/core';
import { delay, from, map, Observable, of } from 'rxjs';
import { ALGERIA_WILAYAS } from '../data/algeria-wilayas.data';
import worldCountries from '../data/world-countries.json';
import { City, Country } from '../models/geo.model';

type Entity = { id: number };
type WorldCities = Record<string, { n: string; p: number; c?: number }[]>;

/**
 * Mock backend. Every method returns an Observable (with a small delay), so the pages are written
 * exactly as they would be against a real REST service: replace this class with an `HttpClient`
 * service and nothing else changes.
 *
 * Countries are loaded at startup; the cities of a country are loaded the first time it is asked for
 * (the world city list is a separate chunk), then kept in memory so edits survive navigation.
 */
@Injectable({ providedIn: 'root' })
export class GeoService {
  private readonly countries: Country[] = worldCountries.map((c, i) => ({
    id: i + 1,
    code: c.iso2.toLowerCase(),
    isoCode: c.iso2,
    name: c.name,
    dialingCode: c.dialingCode,
    capital: c.capital
  }));
  private readonly cityStore = new Map<number, City[]>();
  private nextCityId = 1;

  // ---- countries ----------------------------------------------------------
  getCountries(): Observable<Country[]> {
    return this.reply(this.countries);
  }

  saveCountry(item: Country): Observable<Country> {
    return this.reply(this.upsert(this.countries, item));
  }

  deleteCountry(item: Country): Observable<void> {
    this.cityStore.delete(item.id);
    return this.reply(this.remove(this.countries, item));
  }

  // ---- cities -------------------------------------------------------------
  getCities(countryId: number): Observable<City[]> {
    return from(this.citiesOf(countryId)).pipe(
      map((cities) => structuredClone(cities)),
      delay(120)
    );
  }

  saveCity(item: City): Observable<City> {
    return from(this.citiesOf(item.countryId)).pipe(
      map((cities) => {
        if (!item.id) item.id = this.nextCityId++;
        return this.upsert(cities, item);
      }),
      delay(120)
    );
  }

  deleteCity(item: City): Observable<void> {
    return from(this.citiesOf(item.countryId)).pipe(
      map((cities) => this.remove(cities, item)),
      delay(120)
    );
  }

  private async citiesOf(countryId: number): Promise<City[]> {
    let cities = this.cityStore.get(countryId);
    if (!cities) {
      cities = await this.loadCities(countryId);
      this.cityStore.set(countryId, cities);
    }
    return cities;
  }

  private async loadCities(countryId: number): Promise<City[]> {
    const country = this.countries.find((c) => c.id === countryId);
    if (!country) return [];
    if (country.isoCode === 'DZ') {
      // Algeria: its 69 administrative divisions (wilayas) serve as the sample cities.
      return ALGERIA_WILAYAS.map((w) => ({
        id: this.nextCityId++,
        countryId,
        code: w.code,
        name: w.nameFr,
        nameAr: w.nameAr,
        population: w.population,
        isCapital: w.code === 16
      }));
    }
    const world = (await import('../data/world-cities.json')).default as WorldCities;
    return (world[country.isoCode] ?? []).map((c) => ({
      id: this.nextCityId++,
      countryId,
      name: c.n,
      population: c.p,
      isCapital: !!c.c
    }));
  }

  // ---- helpers ------------------------------------------------------------
  private upsert<T extends Entity>(list: T[], item: T): T {
    const index = list.findIndex((x) => x.id === item.id);
    if (index >= 0) {
      list[index] = { ...item };
    } else {
      item.id = Math.max(0, ...list.map((x) => x.id)) + 1;
      list.push({ ...item });
    }
    return item;
  }

  private remove<T extends Entity>(list: T[], item: T): void {
    const index = list.findIndex((x) => x.id === item.id);
    if (index >= 0) list.splice(index, 1);
  }

  private reply<T>(value: T): Observable<T> {
    return of(structuredClone(value)).pipe(delay(120));
  }
}
