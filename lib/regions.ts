export type Region =
  | "东"
  | "南"
  | "西"
  | "北"
  | "中"
  | "东南"
  | "西南"
  | "东北"
  | "西北"
  | "大湾区";

import type { Language } from "./translations";

const cityToRegion: Record<string, Region> = {
  Beijing: "北",
  "Xi'an": "西北",
  Shanghai: "东",
  Suzhou: "东",
  Hangzhou: "东南",
  Nanjing: "东",
  Wuzhen: "东南",
  Guangzhou: "大湾区",
  Shenzhen: "大湾区",
  Hong: "大湾区",
  "Hong Kong": "大湾区",
  Macau: "大湾区",
  Guilin: "南",
  Chengdu: "西南",
};

export function getRegionForCity(city: string): Region {
  return cityToRegion[city] ?? "中";
}

export const REGIONS: Region[] = [
  "东",
  "南",
  "西",
  "北",
  "中",
  "东南",
  "西南",
  "东北",
  "西北",
  "大湾区",
];

export const REGION_LABELS: Record<Region, Record<Language, string>> = {
  东: {
    en: "East",
    zh: "东部",
    es: "Este",
    fr: "Est",
    ar: "الشرق",
    ru: "Восток",
  },
  南: {
    en: "South",
    zh: "南部",
    es: "Sur",
    fr: "Sud",
    ar: "الجنوب",
    ru: "Юг",
  },
  西: {
    en: "West",
    zh: "西部",
    es: "Oeste",
    fr: "Ouest",
    ar: "الغرب",
    ru: "Запад",
  },
  北: {
    en: "North",
    zh: "北部",
    es: "Norte",
    fr: "Nord",
    ar: "الشمال",
    ru: "Север",
  },
  中: {
    en: "Central",
    zh: "中部",
    es: "Centro",
    fr: "Centre",
    ar: "الوسط",
    ru: "Центральный",
  },
  东南: {
    en: "Southeast",
    zh: "东南",
    es: "Sureste",
    fr: "Sud-Est",
    ar: "الجنوب الشرقي",
    ru: "Юго-Восток",
  },
  西南: {
    en: "Southwest",
    zh: "西南",
    es: "Suroeste",
    fr: "Sud-Ouest",
    ar: "الجنوب الغربي",
    ru: "Юго-Запад",
  },
  东北: {
    en: "Northeast",
    zh: "东北",
    es: "Noreste",
    fr: "Nord-Est",
    ar: "الشمال الشرقي",
    ru: "Северо-Восток",
  },
  西北: {
    en: "Northwest",
    zh: "西北",
    es: "Noroeste",
    fr: "Nord-Ouest",
    ar: "الشمال الغربي",
    ru: "Северо-Запад",
  },
  大湾区: {
    en: "Greater Bay Area",
    zh: "大湾区",
    es: "Gran Área de la Bahía",
    fr: "Grande Baie",
    ar: "منطقة الخليج الكبرى",
    ru: "Большой залив",
  },
};

export function getRegionLabel(region: Region, language: Language): string {
  const labels = REGION_LABELS[region];
  return labels?.[language] ?? region;
}
