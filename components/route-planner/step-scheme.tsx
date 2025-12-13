"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RouteScheme } from "@/lib/route-planner-store";
import {
  Clock,
  Sparkles,
  DollarSign,
  Leaf,
  Check,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateRoute, calculateRouteTotals } from "@/lib/route-generator";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface StepSchemeProps {
  selectedScheme: RouteScheme | null;
  onSchemeSelect: (scheme: RouteScheme) => void;
  onNext: () => void;
  onBack: () => void;
  startLocation?: string;
  dateRange?: { from: Date | null; to: Date | null };
}

const schemes = [
  {
    id: "time" as RouteScheme,
    icon: Clock,
    title: "Time Priority",
    description: "Optimize for the shortest travel time between destinations",
    features: [
      "Fastest routes",
      "Minimal transit time",
      "High-speed transport",
    ],
  },
  {
    id: "experience" as RouteScheme,
    icon: Sparkles,
    title: "Experience Priority",
    description: "Maximize unique experiences and memorable moments",
    features: ["Top-rated attractions", "Cultural immersion", "Hidden gems"],
  },
  {
    id: "value" as RouteScheme,
    icon: DollarSign,
    title: "Value Priority",
    description: "Get the best value for your budget",
    features: [
      "Cost-effective options",
      "Budget accommodation",
      "Local transport",
    ],
  },
  {
    id: "lowCarbon" as RouteScheme,
    icon: Leaf,
    title: "Low Carbon",
    description: "Minimize your environmental impact",
    features: [
      "Eco-friendly transport",
      "Sustainable hotels",
      "Green activities",
    ],
  },
];

export function StepScheme({
  selectedScheme,
  onSchemeSelect,
  onNext,
  onBack,
  startLocation,
  dateRange,
}: StepSchemeProps) {
  const [hoveredScheme, setHoveredScheme] = useState<RouteScheme | null>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  // Calculate preview for each scheme if we have location and dates
  const schemePreviews = useMemo(() => {
    if (!startLocation || !dateRange?.from || !dateRange?.to) return null;

    const previews: Record<
      RouteScheme,
      {
        cost: number;
        carbon: number;
        days: number;
        sample: { day: string; attractions: string[]; meals: string[] }[];
      }
    > = {} as any;

    schemes.forEach((scheme) => {
      try {
        const itinerary = generateRoute(startLocation, dateRange, scheme.id);
        const { totalCost, totalCarbon } = calculateRouteTotals(
          itinerary,
          scheme.id
        );
        const sample = itinerary
          .slice(0, Math.min(2, itinerary.length))
          .map((day) => ({
            day: day.date,
            attractions: day.attractions.map((a) => a.name),
            meals: day.meals.map((m) => m.name),
          }));
        previews[scheme.id] = {
          cost: totalCost,
          carbon: totalCarbon,
          days: itinerary.length,
          sample,
        };
      } catch (error) {
        console.error("Error generating preview for", scheme.id, error);
        previews[scheme.id] = { cost: 0, carbon: 0, days: 0, sample: [] };
      }
    });

    return previews;
  }, [startLocation, dateRange]);

  const displayScheme = hoveredScheme || selectedScheme;

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-4">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a3a52] mb-2 md:mb-3">
          {t.chooseRouteScheme}
        </h2>
        <p className="text-base md:text-lg text-[#4a6b84]">
          {t.selectOptimizationStrategy}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {schemes.map((scheme) => {
          const Icon = scheme.icon;
          const isSelected = selectedScheme === scheme.id;
          const isHovered = hoveredScheme === scheme.id;
          const preview = schemePreviews?.[scheme.id];
          const displayTitle =
            scheme.id === "time"
              ? t.timePriority
              : scheme.id === "experience"
              ? t.experiencePriority
              : scheme.id === "value"
              ? t.valuePriority
              : t.lowCarbon;
          const displayDesc =
            scheme.id === "time"
              ? t.timePriorityDesc
              : scheme.id === "experience"
              ? t.experiencePriorityDesc
              : scheme.id === "value"
              ? t.valuePriorityDesc
              : t.lowCarbonDesc;
          const displayFeatures =
            scheme.id === "time"
              ? [t.fastestRoutes, t.minimalTransitTime, t.highSpeedTransport]
              : scheme.id === "experience"
              ? [t.topRatedAttractions, t.culturalImmersion, t.hiddenGems]
              : scheme.id === "value"
              ? [
                  t.costEffectiveOptions,
                  t.budgetAccommodation,
                  t.localTransport,
                ]
              : [
                  t.ecoFriendlyTransport,
                  t.sustainableHotels,
                  t.greenActivities,
                ];

          return (
            <Card
              key={scheme.id}
              className={cn(
                "liquid-glass border-0 p-4 md:p-6 cursor-pointer transition-all hover:shadow-xl",
                isSelected && "ring-2 md:ring-4 ring-[#5ba3d0] bg-white/95",
                isHovered && !isSelected && "ring-2 ring-[#5ba3d0]/50"
              )}
              onClick={() => onSchemeSelect(scheme.id)}
              onMouseEnter={() => setHoveredScheme(scheme.id)}
              onMouseLeave={() => setHoveredScheme(null)}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-[#5ba3d0] text-white"
                        : "bg-[#5ba3d0]/20 text-[#5ba3d0]"
                    )}
                  >
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-[#1a3a52] mb-1">
                      {displayTitle}
                    </h3>
                    <p className="text-[#4a6b84] text-xs md:text-sm leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#5ba3d0] flex items-center justify-center shrink-0 ml-2">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                )}
              </div>

              <ul className="space-y-1.5 md:space-y-2 mb-3">
                {displayFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-[#4a6b84] text-xs md:text-sm"
                  >
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#5ba3d0] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {preview && (
                <div className="mt-3 pt-3 border-t border-white/40 grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="h-3 w-3 text-[#5ba3d0]" />
                    </div>
                    <div className="font-semibold text-[#1a3a52]">
                      {preview.days}
                    </div>
                    <div className="text-[#4a6b84]">{t.days}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="h-3 w-3 text-[#5ba3d0]" />
                    </div>
                    <div className="font-semibold text-[#1a3a52]">
                      ¥{Math.round(preview.cost)}
                    </div>
                    <div className="text-[#4a6b84]">{t.cost}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Leaf className="h-3 w-3 text-[#5ba3d0]" />
                    </div>
                    <div className="font-semibold text-[#1a3a52]">
                      {Math.round(preview.carbon)}
                    </div>
                    <div className="text-[#4a6b84]">
                      {t.kg} {t.co2}
                    </div>
                  </div>
                </div>
              )}

              {preview?.sample?.length ? (
                <div className="mt-3 bg-white/40 rounded-lg p-3 text-xs">
                  {preview.sample.map((s, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="font-semibold text-[#1a3a52]">
                        Day {idx + 1} • {s.day}
                      </div>
                      <div className="text-[#4a6b84] truncate">
                        Attractions: {s.attractions.join(", ") || "N/A"}
                      </div>
                      <div className="text-[#4a6b84] truncate">
                        Meals: {s.meals.join(", ") || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={onBack}
          className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 bg-transparent w-full sm:w-auto text-sm md:text-base"
        >
          {t.back}
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!selectedScheme}
          className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-6 md:px-8 disabled:opacity-50 w-full sm:w-auto text-sm md:text-base"
        >
          {t.generateRoute}
        </Button>
      </div>
    </div>
  );
}
