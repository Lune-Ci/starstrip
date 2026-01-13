export type CurrencyCode = "CNY" | "USD" | "EUR" | "JPY" | "GBP" | "RUB" | "AED" | "KRW" | "HKD";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // 1 CNY = ? Target Currency
}

// Rates updated around Jan 2026 (Projected/Steady State)
// 1 CNY = X Target
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  CNY: {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    rate: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 0.138,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.128,
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    rate: 21.5,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rate: 0.11,
  },
  RUB: {
    code: "RUB",
    symbol: "₽",
    name: "Russian Ruble",
    rate: 12.8,
  },
  AED: {
    code: "AED",
    symbol: "dh",
    name: "UAE Dirham",
    rate: 0.51,
  },
  KRW: {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    rate: 190.0,
  },
  HKD: {
    code: "HKD",
    symbol: "HK$",
    name: "Hong Kong Dollar",
    rate: 1.08,
  },
};

export const DEFAULT_CURRENCY_MAP: Record<string, CurrencyCode> = {
  en: "USD",
  zh: "CNY",
  es: "EUR",
  fr: "EUR",
  ru: "RUB",
  ar: "AED",
  ja: "JPY",
  ko: "KRW",
};
