# Licence of the demo data

`algeria-wilayas.data.ts` contains facts about the administrative divisions of Algeria compiled from
Wikipedia (EN and FR editions) and is licensed under
[Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

- Attribution: Wikipedia contributors, "Provinces of Algeria", "Liste des wilayas d'Algerie" and
  "ISO 3166-2:DZ", https://www.wikipedia.org (accessed 2026-11-03).
- Changes: restructured into a TypeScript module; no value was added, estimated or modified.
- The rest of the repository is MIT-licensed. This data is used only by the demo application in
  `projects/demo` and is not included in the published npm package.

## World countries and cities

`world-countries.json` and `world-cities.json` come from GeoNames (https://www.geonames.org/), licensed under
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).

> Contains data from GeoNames, https://www.geonames.org/, licensed under CC BY 4.0.

Selection, renames and the excluded entries are described in `WORLD-DATA-SOURCES.md`. Populations are GeoNames
values of varying years, not a census. These files are used only by the demo application and are not part of the
published npm package.
