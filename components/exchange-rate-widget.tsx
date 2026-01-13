"use client";

import { useState, useEffect } from "react";
import { useCurrencyStore } from "@/lib/currency-store";
import { CURRENCIES, CurrencyCode } from "@/lib/currency-data";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Calculator } from "lucide-react";

export function ExchangeRateWidget() {
  const { targetCurrency, setTargetCurrency, currencies } = useCurrencyStore();
  const { language } = useLanguageStore();
  const t = translations[language] as any;
  const [amount, setAmount] = useState<string>("100");
  const [isCnyBase, setIsCnyBase] = useState(true); // true: Input CNY -> Output Target; false: Input Target -> Output CNY

  // Ensure we have a valid target currency, fallback to USD if missing
  const activeTargetCode = currencies[targetCurrency] ? targetCurrency : "USD";
  const activeTarget = currencies[activeTargetCode];

  // Calculate result
  const numericAmount = parseFloat(amount) || 0;
  let result = 0;

  if (isCnyBase) {
    // CNY -> Target
    result = numericAmount * activeTarget.rate;
  } else {
    // Target -> CNY
    // Rate is 1 CNY = X Target => 1 Target = 1/X CNY
    result = numericAmount * (1 / activeTarget.rate);
  }

  // Format result
  const formattedResult =
    activeTargetCode === "JPY" ||
    activeTargetCode === "KRW" ||
    (isCnyBase === false && result > 100)
      ? Math.round(result).toLocaleString()
      : result.toFixed(2);

  return (
    <div className="p-4 border-t border-white/20 mt-4">
      <div className="flex items-center gap-2 mb-3 text-[#1a3a52] font-semibold">
        <Calculator className="h-4 w-4" />
        <span>{t.exchangeRateCalculator}</span>
      </div>

      <Card className="p-3 bg-white/50 border-0 shadow-sm space-y-3">
        {/* Currency Selector */}
        <div className="space-y-1">
          <Label className="text-xs text-[#4a6b84]">{t.targetCurrency}</Label>
          <Select
            value={activeTargetCode}
            onValueChange={(val) => setTargetCurrency(val as CurrencyCode)}
          >
            <SelectTrigger className="h-8 text-sm bg-white/80 border-0 w-full [&>span]:truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-w-[200px] md:max-w-none">
              {Object.values(CURRENCIES).map((c) => {
                if (c.code === "CNY") return null;
                return (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Calculator Inputs */}
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-[#4a6b84]">
              {isCnyBase ? "CNY" : activeTargetCode}
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-8 text-sm bg-white/80 border-0"
            />
          </div>
          <button
            onClick={() => setIsCnyBase(!isCnyBase)}
            className="mt-4 p-1.5 rounded-full hover:bg-black/5 text-[#5ba3d0] transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-[#4a6b84]">
              {isCnyBase ? activeTargetCode : "CNY"}
            </Label>
            <div className="h-8 flex items-center px-3 bg-white/40 rounded-md text-sm font-semibold text-[#1a3a52]">
              {isCnyBase ? activeTarget.symbol : CURRENCIES.CNY.symbol}
              {formattedResult}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-[#4a6b84]/70 text-center">
          {t.rateSource}
        </p>
      </Card>
    </div>
  );
}
