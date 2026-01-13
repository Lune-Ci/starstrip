"use client";

import { useCurrencyStore } from "@/lib/currency-store";
import { CURRENCIES } from "@/lib/currency-data";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PriceDisplayProps {
  amount: number;
  className?: string;
  sourceCurrency?: "CNY"; // Future proofing, currently always CNY
  variant?: "default" | "stack" | "inline-sm" | "tooltip";
  showApprox?: boolean;
}

export function PriceDisplay({
  amount,
  className,
  sourceCurrency = "CNY",
  variant = "default",
  showApprox = true,
}: PriceDisplayProps) {
  const { targetCurrency, currencies } = useCurrencyStore();
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const t = translations[language] as any;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR fallback to just showing CNY to avoid hydration mismatch
    return (
      <span className={cn("font-bold", className)}>
        {CURRENCIES.CNY.symbol}
        {amount}
      </span>
    );
  }

  // If target is same as source, just show source
  if (targetCurrency === sourceCurrency) {
    return (
      <span className={cn("font-bold", className)}>
        {currencies.CNY.symbol}
        {amount}
      </span>
    );
  }

  const targetRate = currencies[targetCurrency].rate;
  const targetSymbol = currencies[targetCurrency].symbol;

  // Calculate converted amount
  // For currencies with high values (JPY, KRW), rounding to 0 decimals looks better
  // For others (USD, EUR), maybe 1 or 2 decimals? Let's stick to 0 for travel estimates usually,
  // or 2 if < 100? Let's use standard Intl.NumberFormat if possible, or simple logic.
  // Simple logic:
  const convertedValue = amount * targetRate;

  let formattedConverted = "";
  if (targetCurrency === "JPY" || targetCurrency === "KRW") {
    formattedConverted = Math.round(convertedValue).toLocaleString();
  } else {
    // For USD, EUR, etc. show 2 decimals if small, 0 if large?
    // Let's standardise on 0 decimals for clarity in "estimates" unless it's very small (<10)
    formattedConverted =
      convertedValue < 10
        ? convertedValue.toFixed(2)
        : Math.round(convertedValue).toLocaleString();
  }

  const approxLabel = t.approx || "≈";

  if (variant === "stack") {
    return (
      <div className={cn("flex flex-col items-start leading-tight", className)}>
        <span className="font-bold text-inherit">
          {CURRENCIES.CNY.symbol}
          {amount}
        </span>
        {showApprox && (
          <span className="text-[0.75em] opacity-70 font-normal">
            {approxLabel} {targetSymbol}
            {formattedConverted}
          </span>
        )}
      </div>
    );
  }

  if (variant === "inline-sm") {
    return (
      <span
        className={cn("inline-flex items-baseline gap-1 flex-wrap", className)}
      >
        <span className="font-bold">
          {CURRENCIES.CNY.symbol}
          {amount}
        </span>
        {showApprox && (
          <span className="text-[0.85em] opacity-70 whitespace-nowrap">
            ({approxLabel} {targetSymbol}
            {formattedConverted})
          </span>
        )}
      </span>
    );
  }

  if (variant === "tooltip") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className={cn(
              "font-bold cursor-pointer border-b border-dotted border-current/50 outline-none",
              className
            )}
          >
            {CURRENCIES.CNY.symbol}
            {amount}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 text-sm bg-white/95 backdrop-blur-sm border-white/40 shadow-xl">
          <p className="font-medium text-[#1a3a52]">
            {approxLabel} {targetSymbol}
            {formattedConverted}
          </p>
        </PopoverContent>
      </Popover>
    );
  }

  // Default: inline
  return (
    <span
      className={cn("inline-flex items-baseline gap-1.5 flex-wrap", className)}
    >
      <span className="font-bold">
        {currencies.CNY.symbol}
        {amount}
      </span>
      {showApprox && (
        <span className="text-[0.85em] text-muted-foreground font-normal whitespace-nowrap">
          {approxLabel} {targetSymbol}
          {formattedConverted}
        </span>
      )}
    </span>
  );
}
