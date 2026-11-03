# Data sources

Access date: 2026-11-03

## Sources
- GeoNames dumps, https://download.geonames.org/export/dump/ : countryInfo.txt, cities15000.zip (cities with population >= 15000), cities500.zip (checked for capitals missing from cities15000; none were needed).
- UN member states list, https://www.un.org/en/about-us/member-states (193 members, read 2026-11-03), used to validate the country selection; ISO2 codes cross-checked against GeoNames countryInfo (all 195 found).

## Licence and attribution
GeoNames data is licensed under Creative Commons Attribution 4.0 (CC BY 4.0). Attribution: "Contains data from GeoNames, https://www.geonames.org/, licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)."

## Country selection rule
193 UN member states + 2 UN observer states (Holy See / Vatican City, VA; Palestine, PS) = 194 countries. No territories added. Cities of each country are those whose GeoNames country code equals its ISO2 (PS cities exactly as assigned by GeoNames; IL-coded cities are in no country).

## Files
- world-countries.json: iso2, name, capital (GeoNames countryInfo), dialingCode ("+" + GeoNames Phone field, source text kept). Sorted by name, Algeria first.
- world-cities.json: per ISO2, all cities of cities15000 (n = name, p = population, c = 1 when feature code PPLC), sorted by population descending.

## Renames (GeoNames name -> shown name)
- CG: "Republic of the Congo" -> "Congo"
- CD: "Democratic Republic of the Congo" -> "DR Congo"
- NL: "The Netherlands" -> "Netherlands"
- TL: "Timor Leste" -> "Timor-Leste"
- VA: "Vatican" -> "Vatican City"
- PS: "Palestinian Territory" -> "Palestine"
All other names are the GeoNames names.

## GeoNames entries excluded (not in the 195 set)
AI Anguilla; AQ Antarctica; AS American Samoa; AW Aruba; AX Aland Islands; BL Saint Barthelemy; BM Bermuda; BQ Bonaire, Saint Eustatius and Saba; BV Bouvet Island; CC Cocos Islands; CK Cook Islands; CW Curacao; CX Christmas Island; EH Western Sahara; FK Falkland Islands; FO Faroe Islands; GF French Guiana; GG Guernsey; GI Gibraltar; GL Greenland; GP Guadeloupe; GS South Georgia and the South Sandwich Islands; GU Guam; HK Hong Kong; HM Heard Island and McDonald Islands; IM Isle of Man; IO British Indian Ocean Territory; JE Jersey; XK Kosovo; KY Cayman Islands; MF Saint Martin; MO Macao; MP Northern Mariana Islands; MQ Martinique; MS Montserrat; NC New Caledonia; NF Norfolk Island; NU Niue; PF French Polynesia; PM Saint Pierre and Miquelon; PN Pitcairn; PR Puerto Rico; RE Reunion; SH Saint Helena; SJ Svalbard and Jan Mayen; SX Sint Maarten; TC Turks and Caicos Islands; TF French Southern Territories; TK Tokelau; TW Taiwan; UM United States Minor Outlying Islands; VG British Virgin Islands; VI U.S. Virgin Islands; WF Wallis and Futuna; YT Mayotte; CS Serbia and Montenegro; AN Netherlands Antilles

## Notes
- Populations are GeoNames values of varying years, not a census.
- Capital names come verbatim from GeoNames countryInfo and may be dated (for example Kazakhstan: "Nur-Sultan"; Palestine: "East Jerusalem").
- Dialing codes with several or extended codes are kept as in the source (11 entries, e.g. "+1-809 and 1-829").
