/**
 * Administrative divisions of Algeria: the 69 wilayas of the current organisation
 * (58 historical wilayas, including the 10 created in 2019, plus 11 created in 2025).
 *
 * This file is demo data. It is NOT part of the easy-mat-ui npm package.
 *
 * Sources (accessed 2026-11-03):
 *  - Wikipedia (EN) "Provinces of Algeria": codes, Arabic names, list of new wilayas. CC BY-SA 4.0.
 *  - Wikipedia (FR) "Liste des wilayas d'Algerie": French names and population. CC BY-SA 4.0.
 *  - Wikipedia (EN) "ISO 3166-2:DZ": cross-check of codes 1-58. CC BY-SA 4.0.
 *
 * Population: RGPH 2008 census as compiled on Wikipedia and re-aggregated to the current boundaries.
 * The compilation is approximate (the 68 values sum to 35,120,112 against an official national total of
 * 34,080,030) and Ksar Chellala (64) has no published value, so it is `null`. Nothing was estimated here.
 * Codes 59-69 follow Wikipedia and are not confirmed against the Journal Officiel.
 *
 * Licence of this file: CC BY-SA 4.0 (see DATA-LICENSE.md), unlike the MIT-licensed library.
 */

export interface WilayaRecord {
  code: number;
  nameFr: string;
  nameAr: string;
  seatFr: string;
  /** RGPH 2008 population (approximate compilation), `null` when no value is published. */
  population: number | null;
  createdIn: 'historical' | '2019' | '2025';
}

export const ALGERIA_WILAYAS: readonly WilayaRecord[] = [
  {
    "code": 1,
    "nameFr": "Adrar",
    "nameAr": "أدرار",
    "seatFr": "Adrar",
    "population": 399714,
    "createdIn": "historical"
  },
  {
    "code": 2,
    "nameFr": "Chlef",
    "nameAr": "الشلف",
    "seatFr": "Chlef",
    "population": 1002088,
    "createdIn": "historical"
  },
  {
    "code": 3,
    "nameFr": "Laghouat",
    "nameAr": "الأغواط",
    "seatFr": "Laghouat",
    "population": 273402,
    "createdIn": "historical"
  },
  {
    "code": 4,
    "nameFr": "Oum El Bouaghi",
    "nameAr": "أم البواقي",
    "seatFr": "Oum El Bouaghi",
    "population": 621612,
    "createdIn": "historical"
  },
  {
    "code": 5,
    "nameFr": "Batna",
    "nameAr": "باتنة",
    "seatFr": "Batna",
    "population": 938075,
    "createdIn": "historical"
  },
  {
    "code": 6,
    "nameFr": "Béjaïa",
    "nameAr": "بجاية",
    "seatFr": "Béjaïa",
    "population": 912577,
    "createdIn": "historical"
  },
  {
    "code": 7,
    "nameFr": "Biskra",
    "nameAr": "بسكرة",
    "seatFr": "Biskra",
    "population": 678246,
    "createdIn": "historical"
  },
  {
    "code": 8,
    "nameFr": "Béchar",
    "nameAr": "بشار",
    "seatFr": "Béchar",
    "population": 270061,
    "createdIn": "historical"
  },
  {
    "code": 9,
    "nameFr": "Blida",
    "nameAr": "البليدة",
    "seatFr": "Blida",
    "population": 1002937,
    "createdIn": "historical"
  },
  {
    "code": 10,
    "nameFr": "Bouira",
    "nameAr": "البويرة",
    "seatFr": "Bouira",
    "population": 695583,
    "createdIn": "historical"
  },
  {
    "code": 11,
    "nameFr": "Tamanrasset",
    "nameAr": "تمنراست",
    "seatFr": "Tamanrasset",
    "population": 176637,
    "createdIn": "historical"
  },
  {
    "code": 12,
    "nameFr": "Tébessa",
    "nameAr": "تبسة",
    "seatFr": "Tébessa",
    "population": 550262,
    "createdIn": "historical"
  },
  {
    "code": 13,
    "nameFr": "Tlemcen",
    "nameAr": "تلمسان",
    "seatFr": "Tlemcen",
    "population": 918521,
    "createdIn": "historical"
  },
  {
    "code": 14,
    "nameFr": "Tiaret",
    "nameAr": "تيارت",
    "seatFr": "Tiaret",
    "population": 846823,
    "createdIn": "historical"
  },
  {
    "code": 15,
    "nameFr": "Tizi Ouzou",
    "nameAr": "تيزي وزو",
    "seatFr": "Tizi Ouzou",
    "population": 1127608,
    "createdIn": "historical"
  },
  {
    "code": 16,
    "nameFr": "Alger",
    "nameAr": "الجزائر",
    "seatFr": "Alger",
    "population": 2988145,
    "createdIn": "historical"
  },
  {
    "code": 17,
    "nameFr": "Djelfa",
    "nameAr": "الجلفة",
    "seatFr": "Djelfa",
    "population": 621077,
    "createdIn": "historical"
  },
  {
    "code": 18,
    "nameFr": "Jijel",
    "nameAr": "جيجل",
    "seatFr": "Jijel",
    "population": 636948,
    "createdIn": "historical"
  },
  {
    "code": 19,
    "nameFr": "Sétif",
    "nameAr": "سطيف",
    "seatFr": "Sétif",
    "population": 1489979,
    "createdIn": "historical"
  },
  {
    "code": 20,
    "nameFr": "Saïda",
    "nameAr": "سعيدة",
    "seatFr": "Saïda",
    "population": 330641,
    "createdIn": "historical"
  },
  {
    "code": 21,
    "nameFr": "Skikda",
    "nameAr": "سكيكدة",
    "seatFr": "Skikda",
    "population": 898680,
    "createdIn": "historical"
  },
  {
    "code": 22,
    "nameFr": "Sidi Bel Abbès",
    "nameAr": "سيدي بلعباس",
    "seatFr": "Sidi Bel Abbès",
    "population": 604744,
    "createdIn": "historical"
  },
  {
    "code": 23,
    "nameFr": "Annaba",
    "nameAr": "عنابة",
    "seatFr": "Annaba",
    "population": 609499,
    "createdIn": "historical"
  },
  {
    "code": 24,
    "nameFr": "Guelma",
    "nameAr": "قالمة",
    "seatFr": "Guelma",
    "population": 482430,
    "createdIn": "historical"
  },
  {
    "code": 25,
    "nameFr": "Constantine",
    "nameAr": "قسنطينة",
    "seatFr": "Constantine",
    "population": 938475,
    "createdIn": "historical"
  },
  {
    "code": 26,
    "nameFr": "Médéa",
    "nameAr": "المدية",
    "seatFr": "Médéa",
    "population": 563012,
    "createdIn": "historical"
  },
  {
    "code": 27,
    "nameFr": "Mostaganem",
    "nameAr": "مستغانم",
    "seatFr": "Mostaganem",
    "population": 737118,
    "createdIn": "historical"
  },
  {
    "code": 28,
    "nameFr": "M'Sila",
    "nameAr": "المسيلة",
    "seatFr": "M'Sila",
    "population": 574462,
    "createdIn": "historical"
  },
  {
    "code": 29,
    "nameFr": "Mascara",
    "nameAr": "معسكر",
    "seatFr": "Mascara",
    "population": 784073,
    "createdIn": "historical"
  },
  {
    "code": 30,
    "nameFr": "Ouargla",
    "nameAr": "ورقلة",
    "seatFr": "Ouargla",
    "population": 558558,
    "createdIn": "historical"
  },
  {
    "code": 31,
    "nameFr": "Oran",
    "nameAr": "وهران",
    "seatFr": "Oran",
    "population": 1584607,
    "createdIn": "historical"
  },
  {
    "code": 32,
    "nameFr": "El Bayadh",
    "nameAr": "البيض",
    "seatFr": "El Bayadh",
    "population": 185347,
    "createdIn": "historical"
  },
  {
    "code": 33,
    "nameFr": "Illizi",
    "nameAr": "اليزي",
    "seatFr": "Illizi",
    "population": 52333,
    "createdIn": "historical"
  },
  {
    "code": 34,
    "nameFr": "Bordj Bou Arreridj",
    "nameAr": "برج بوعريريج",
    "seatFr": "Bordj Bou Arreridj",
    "population": 628475,
    "createdIn": "historical"
  },
  {
    "code": 35,
    "nameFr": "Boumerdès",
    "nameAr": "بومرداس",
    "seatFr": "Boumerdès",
    "population": 802083,
    "createdIn": "historical"
  },
  {
    "code": 36,
    "nameFr": "El Tarf",
    "nameAr": "الطارف",
    "seatFr": "El Tarf",
    "population": 408414,
    "createdIn": "historical"
  },
  {
    "code": 37,
    "nameFr": "Tindouf",
    "nameAr": "تندوف",
    "seatFr": "Tindouf",
    "population": 49149,
    "createdIn": "historical"
  },
  {
    "code": 38,
    "nameFr": "Tissemsilt",
    "nameAr": "تسمسيلت",
    "seatFr": "Tissemsilt",
    "population": 294476,
    "createdIn": "historical"
  },
  {
    "code": 39,
    "nameFr": "El Oued",
    "nameAr": "الوادي",
    "seatFr": "El Oued",
    "population": 647548,
    "createdIn": "historical"
  },
  {
    "code": 40,
    "nameFr": "Khenchela",
    "nameAr": "خنشلة",
    "seatFr": "Khenchela",
    "population": 386683,
    "createdIn": "historical"
  },
  {
    "code": 41,
    "nameFr": "Souk Ahras",
    "nameAr": "سوق أهراس",
    "seatFr": "Souk Ahras",
    "population": 438127,
    "createdIn": "historical"
  },
  {
    "code": 42,
    "nameFr": "Tipaza",
    "nameAr": "تيبازة",
    "seatFr": "Tipaza",
    "population": 591010,
    "createdIn": "historical"
  },
  {
    "code": 43,
    "nameFr": "Mila",
    "nameAr": "ميلة",
    "seatFr": "Mila",
    "population": 766886,
    "createdIn": "historical"
  },
  {
    "code": 44,
    "nameFr": "Aïn Defla",
    "nameAr": "عين الدفلى",
    "seatFr": "Aïn Defla",
    "population": 766013,
    "createdIn": "historical"
  },
  {
    "code": 45,
    "nameFr": "Naâma",
    "nameAr": "النعامة",
    "seatFr": "Naâma",
    "population": 192891,
    "createdIn": "historical"
  },
  {
    "code": 46,
    "nameFr": "Aïn Témouchent",
    "nameAr": "عين تموشنت",
    "seatFr": "Aïn Témouchent",
    "population": 371239,
    "createdIn": "historical"
  },
  {
    "code": 47,
    "nameFr": "Ghardaïa",
    "nameAr": "غرداية",
    "seatFr": "Ghardaïa",
    "population": 363598,
    "createdIn": "historical"
  },
  {
    "code": 48,
    "nameFr": "Relizane",
    "nameAr": "غليزان",
    "seatFr": "Relizane",
    "population": 726180,
    "createdIn": "historical"
  },
  {
    "code": 49,
    "nameFr": "Timimoun",
    "nameAr": "تيميمون",
    "seatFr": "Timimoun",
    "population": 122019,
    "createdIn": "2019"
  },
  {
    "code": 50,
    "nameFr": "Bordj Badji Mokhtar",
    "nameAr": "برج باجي مختار",
    "seatFr": "Bordj Badji Mokhtar",
    "population": 16437,
    "createdIn": "2019"
  },
  {
    "code": 51,
    "nameFr": "Ouled Djellal",
    "nameAr": "أولاد جلال",
    "seatFr": "Ouled Djellal",
    "population": 174219,
    "createdIn": "2019"
  },
  {
    "code": 52,
    "nameFr": "Béni Abbès",
    "nameAr": "بني عباس",
    "seatFr": "Béni Abbès",
    "population": 50163,
    "createdIn": "2019"
  },
  {
    "code": 53,
    "nameFr": "In Salah",
    "nameAr": "عين صالح",
    "seatFr": "In Salah",
    "population": 50392,
    "createdIn": "2019"
  },
  {
    "code": 54,
    "nameFr": "In Guezzam",
    "nameAr": "عين قزّام",
    "seatFr": "In Guezzam",
    "population": 11202,
    "createdIn": "2019"
  },
  {
    "code": 55,
    "nameFr": "Touggourt",
    "nameAr": "تقرت",
    "seatFr": "Touggourt",
    "population": 247221,
    "createdIn": "2019"
  },
  {
    "code": 56,
    "nameFr": "Djanet",
    "nameAr": "جانت",
    "seatFr": "Djanet",
    "population": 17618,
    "createdIn": "2019"
  },
  {
    "code": 57,
    "nameFr": "El M'Ghair",
    "nameAr": "المغير",
    "seatFr": "El M'Ghair",
    "population": 162267,
    "createdIn": "2019"
  },
  {
    "code": 58,
    "nameFr": "El Meniaa",
    "nameAr": "المنيعة",
    "seatFr": "El Meniaa",
    "population": 57276,
    "createdIn": "2019"
  },
  {
    "code": 59,
    "nameFr": "Aflou",
    "nameAr": "آفلو",
    "seatFr": "Aflou",
    "population": 182938,
    "createdIn": "2025"
  },
  {
    "code": 60,
    "nameFr": "Barika",
    "nameAr": "بريكة",
    "seatFr": "Barika",
    "population": 181716,
    "createdIn": "2025"
  },
  {
    "code": 61,
    "nameFr": "El Kantara",
    "nameAr": "القنطرة",
    "seatFr": "El Kantara",
    "population": 43110,
    "createdIn": "2025"
  },
  {
    "code": 62,
    "nameFr": "Bir El Ater",
    "nameAr": "بئر العاتر",
    "seatFr": "Bir El Ater",
    "population": 98441,
    "createdIn": "2025"
  },
  {
    "code": 63,
    "nameFr": "El Aricha",
    "nameAr": "العريشة",
    "seatFr": "El Aricha",
    "population": 30614,
    "createdIn": "2025"
  },
  {
    "code": 64,
    "nameFr": "Ksar Chellala",
    "nameAr": "قصر الشلالة",
    "seatFr": "Ksar Chellala",
    "population": null,
    "createdIn": "2025"
  },
  {
    "code": 65,
    "nameFr": "Aïn Oussera",
    "nameAr": "عين وسارة",
    "seatFr": "Aïn Oussera",
    "population": 251038,
    "createdIn": "2025"
  },
  {
    "code": 66,
    "nameFr": "Messaad",
    "nameAr": "مسعد",
    "seatFr": "Messaad",
    "population": 220069,
    "createdIn": "2025"
  },
  {
    "code": 67,
    "nameFr": "Ksar El Boukhari",
    "nameAr": "قصر البخاري",
    "seatFr": "Ksar El Boukhari",
    "population": 256920,
    "createdIn": "2025"
  },
  {
    "code": 68,
    "nameFr": "Bou Saâda",
    "nameAr": "بوسعادة",
    "seatFr": "Bou Saâda",
    "population": 416129,
    "createdIn": "2025"
  },
  {
    "code": 69,
    "nameFr": "El Abiodh Sidi Cheikh",
    "nameAr": "الأبيض سيدي الشيخ",
    "seatFr": "El Abiodh Sidi Cheikh",
    "population": 43277,
    "createdIn": "2025"
  }
];

export const ALGERIA_POPULATION_NOTE = 'RGPH 2008 census, compiled on Wikipedia (CC BY-SA 4.0), approximate.';
