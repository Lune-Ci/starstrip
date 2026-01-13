import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CURRENCIES,
  CurrencyCode,
  DEFAULT_CURRENCY_MAP,
  Currency,
} from "./currency-data";

interface CurrencyState {
  targetCurrency: CurrencyCode;
  currencies: Record<CurrencyCode, Currency>;
  isWidgetOpen: boolean;
  setTargetCurrency: (code: CurrencyCode) => void;
  toggleWidget: () => void;
  setWidgetOpen: (open: boolean) => void;
  autoSetCurrencyByLanguage: (lang: string) => void;
  fetchRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      targetCurrency: "USD", // Default fallback
      currencies: CURRENCIES,
      isWidgetOpen: false,
      setTargetCurrency: (code) => set({ targetCurrency: code }),
      toggleWidget: () =>
        set((state) => ({ isWidgetOpen: !state.isWidgetOpen })),
      setWidgetOpen: (open) => set({ isWidgetOpen: open }),
      autoSetCurrencyByLanguage: (lang) => {
        const mapped = DEFAULT_CURRENCY_MAP[lang];
        if (mapped) {
          set({ targetCurrency: mapped });
        }
      },
      fetchRates: async () => {
        try {
          // Using a free API for demo purposes. Base is CNY.
          const res = await fetch(
            "https://api.exchangerate-api.com/v4/latest/CNY"
          );
          const data = await res.json();
          if (data && data.rates) {
            set((state) => {
              const newCurrencies = { ...state.currencies };
              (Object.keys(newCurrencies) as CurrencyCode[]).forEach((code) => {
                if (data.rates[code]) {
                  newCurrencies[code] = {
                    ...newCurrencies[code],
                    rate: data.rates[code],
                  };
                }
              });
              return { currencies: newCurrencies };
            });
          }
        } catch (e) {
          console.error("Failed to fetch rates", e);
        }
      },
    }),
    {
      name: "currency-storage",
      partialize: (state) => ({
        targetCurrency: state.targetCurrency,
        // We don't persist currencies to ensure we always get fresh or default-static first,
        // then fetch new ones. Or we could persist, but for now let's not to avoid stale data issues.
      }),
    }
  )
);
