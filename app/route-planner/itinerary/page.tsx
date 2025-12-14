"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoutePlannerStore } from "@/lib/route-planner-store";
import { useESGStore } from "@/lib/esg-store";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  Leaf,
  Plus,
  Save,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { generateRoute, calculateRouteTotals } from "@/lib/route-generator";
import type { ItineraryDay } from "@/lib/route-planner-store";
import { useAuthStore } from "@/lib/auth-store";
import { getAttractionName, getMealName } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

function ensureDate(date: Date | string | null): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  return new Date(date);
}

interface SavedRoute {
  id: string;
  name: string;
  startLocation: string;
  dateRange: { from: string; to: string };
  selectedScheme: string;
  itinerary: ItineraryDay[];
  totalCost: number;
  totalCarbon: number;
  savedAt: string;
}

export default function ItineraryPage() {
  const router = useRouter();
  const { state, updateState } = useRoutePlannerStore();
  const { addTrip } = useESGStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const auth = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const getCityLabel = (city: string): string => {
    switch (city) {
      case "Beijing":
        return t.cityBeijing;
      case "Shanghai":
        return t.cityShanghai;
      case "Xi'an":
        return t.cityXian;
      case "Guilin":
        return t.cityGuilin;
      case "Chengdu":
        return t.cityChengdu;
      case "Hangzhou":
        return t.cityHangzhou;
      case "Suzhou":
        return t.citySuzhou;
      case "Nanjing":
        return t.cityNanjing;
      case "Wuzhen":
        return t.cityWuzhen;
      case "Guangzhou":
        return t.cityGuangzhou;
      case "Hong Kong":
        return t.cityHongKong;
      case "Macau":
        return t.cityMacau;
      default:
        return city;
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "Historical Site":
        return t.typeHistoricalSite;
      case "Urban Exploration":
        return t.typeUrbanExploration;
      case "Natural Scenery":
        return t.typeNaturalScenery;
      case "Cultural Experience":
        return t.typeCulturalExperience;
      case "Entertainment":
        return t.typeEntertainment;
      case "Wildlife":
        return t.typeWildlife;
      case "Fine Dining":
        return t.typeFineDining;
      case "Local Restaurant":
        return t.typeLocalRestaurant;
      case "Street Food":
        return t.typeStreetFood;
      case "Tea House":
        return t.typeTeaHouse;
      default:
        return type;
    }
  };

  const getCuisineLabel = (cuisine: string): string => {
    switch (cuisine) {
      case "Beijing Cuisine":
        return t.cuisineBeijing;
      case "Shanghai Cuisine":
        return t.cuisineShanghai;
      case "Shaanxi Cuisine":
        return t.cuisineShaanxi;
      case "Guangxi Cuisine":
        return t.cuisineGuangxi;
      case "Sichuan Cuisine":
        return t.cuisineSichuan;
      case "Zhejiang Cuisine":
        return t.cuisineZhejiang;
      case "Jiangsu Cuisine":
        return t.cuisineJiangsu;
      case "Cantonese Cuisine":
        return t.cuisineCantonese;
      case "Macanese Cuisine":
        return t.cuisineMacanese;
      default:
        return cuisine;
    }
  };

  const fallbackImageByType = (type: string): string => {
    switch (type) {
      case "Natural Scenery":
        return "/west-lake-hangzhou.jpg";
      case "Urban Exploration":
        return "/shanghai-skyline.jpg";
      case "Historical Site":
        return "/terracotta-warriors.jpg";
      case "Cultural Experience":
        return "/jinli-ancient-street.jpg";
      case "Wildlife":
        return "/chengdu-panda-base.jpg";
      case "Entertainment":
        return "/shanghai-disneyland.jpg";
      default:
        return "/placeholder.jpg";
    }
  };

  const fallbackMealImageByType = (type: string): string => {
    switch (type) {
      case "Fine Dining":
        return "/food-peking-duck.jpg";
      case "Local Restaurant":
        return "/food-xiaolongbao.jpg";
      case "Tea House":
        return "/food-biluochun-tea.jpg";
      case "Street Food":
        return "/food-zhajiangmian.jpg";
      default:
        return "/placeholder.jpg";
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saved-routes");
      if (saved) {
        setSavedRoutes(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    const fromDate = ensureDate(state.dateRange.from);
    const toDate = ensureDate(state.dateRange.to);

    if (
      fromDate &&
      toDate &&
      state.selectedScheme &&
      state.startLocation &&
      !isGenerating
    ) {
      setIsGenerating(true);

      const generatedItinerary = generateRoute(
        state.startLocation,
        { from: fromDate, to: toDate },
        state.selectedScheme
      );

      const { totalCost, totalCarbon } = calculateRouteTotals(
        generatedItinerary,
        state.selectedScheme
      );

      updateState({
        itinerary: generatedItinerary,
        totalCost,
        totalCarbon,
      });

      setIsGenerating(false);
    }
  }, [
    state.dateRange.from,
    state.dateRange.to,
    state.selectedScheme,
    state.startLocation,
  ]);

  const fromDate = ensureDate(state.dateRange.from);
  const toDate = ensureDate(state.dateRange.to);

  if (!fromDate || !toDate || !state.startLocation) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="liquid-glass border-0 p-8 md:p-12 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-4">
              {t.noItineraryPlanned}
            </h2>
            <Button
              onClick={() => router.push("/route-planner")}
              className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white"
            >
              {t.startPlanning}
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const calculateBreakdown = () => {
    // Calculate actual breakdown from itinerary
    const activitiesCarbon = state.itinerary.reduce(
      (sum, day) =>
        sum +
        day.attractions.reduce((s, a) => s + a.carbonFootprint, 0) +
        day.meals.reduce((s, m) => s + m.carbonFootprint, 0),
      0
    );

    const numDays = state.itinerary.length;
    const scheme = state.selectedScheme;

    // Calculate transport emissions based on scheme and days
    let transportCarbon = 0;
    if (scheme === "time") {
      transportCarbon = numDays * 80; // High-speed flights
    } else if (scheme === "experience") {
      transportCarbon = numDays * 50; // Mix of flights and trains
    } else if (scheme === "value") {
      transportCarbon = numDays * 25; // Mostly trains
    } else if (scheme === "lowCarbon") {
      transportCarbon = numDays * 12; // Trains and buses
    } else {
      transportCarbon = numDays * 30; // Default
    }

    // Accommodation emissions
    const accommodationCarbon = numDays * 25; // Moderate accommodation

    // Split transport into flights and trains based on scheme
    let flights = 0;
    let trains = 0;
    if (scheme === "time") {
      flights = transportCarbon * 0.8;
      trains = transportCarbon * 0.2;
    } else if (scheme === "lowCarbon") {
      flights = transportCarbon * 0.1;
      trains = transportCarbon * 0.9;
    } else {
      flights = transportCarbon * 0.4;
      trains = transportCarbon * 0.6;
    }

    return {
      flights: Math.round(flights),
      trains: Math.round(trains),
      accommodation: Math.round(accommodationCarbon),
      activities: Math.round(activitiesCarbon),
    };
  };

  const proceedSaveRoute = () => {
    const route: SavedRoute = {
      id: Date.now().toString(),
      name: `Route to ${state.startLocation}`,
      startLocation: state.startLocation,
      dateRange: {
        from: fromDate ? format(fromDate, "yyyy-MM-dd") : "",
        to: toDate ? format(toDate, "yyyy-MM-dd") : "",
      },
      selectedScheme: state.selectedScheme || "",
      itinerary: state.itinerary,
      totalCost: state.totalCost,
      totalCarbon: state.totalCarbon,
      savedAt: new Date().toISOString(),
    };
    const updated = [...savedRoutes, route];
    setSavedRoutes(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("saved-routes", JSON.stringify(updated));
    }
    alert("Route saved successfully!");
  };

  const ensureAuthOrGuest = () => {
    const user = auth.user;
    const guest = auth.guestId;
    if (user || guest) return true;
    setAuthPromptOpen(true);
    return false;
  };

  const handleSaveTrip = async () => {
    if (!ensureAuthOrGuest()) return;
    if (fromDate && toDate) {
      const breakdown = calculateBreakdown();
      const trip = {
        id: Date.now().toString(),
        name: `Trip to ${state.startLocation}`,
        startDate: format(fromDate, "yyyy-MM-dd"),
        endDate: format(toDate, "yyyy-MM-dd"),
        carbonFootprint: state.totalCarbon,
        breakdown,
      };
      addTrip(trip);
      try {
        await fetch("/api/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trip),
        });
      } catch {}
      router.push("/esg-data");
    }
  };

  if (isGenerating) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Card className="liquid-glass border-0 p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#5ba3d0] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-[#4a6b84]">{t.generatingItinerary}</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3a52] mb-2 md:mb-3">
            {t.yourItinerary}
          </h1>
          <p className="text-base md:text-lg text-[#4a6b84]">
            {getCityLabel(state.startLocation)} • {format(fromDate, "MMM d")} -{" "}
            {format(toDate, "MMM d, yyyy")}
          </p>
        </div>

        <Card className="liquid-glass border-0 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <Badge className="bg-[#5ba3d0] text-white mb-2 capitalize text-xs md:text-sm">
                {state.selectedScheme?.replace(/([A-Z])/g, " $1").trim()}{" "}
                {t.route}
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-2">
                {t.tripSummary}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
                  <span className="text-xs md:text-sm text-[#4a6b84]">
                    {t.days}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[#1a3a52]">
                  {state.itinerary.length}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
                  <span className="text-xs md:text-sm text-[#4a6b84]">
                    {t.budget}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[#1a3a52]">
                  ¥{Math.round(state.totalCost)}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <Leaf className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
                  <span className="text-xs md:text-sm text-[#4a6b84]">
                    {t.carbon}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[#1a3a52]">
                  {Math.round(state.totalCarbon)} {t.kg}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {state.itinerary.map((day, dayIndex) => (
            <Card key={day.date} className="liquid-glass border-0 p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5ba3d0] text-white flex items-center justify-center font-bold text-sm md:text-base">
                  {dayIndex + 1}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1a3a52]">
                    {format(new Date(day.date), "EEEE, MMMM d")}
                  </h3>
                  <p className="text-xs md:text-sm text-[#4a6b84]">
                    {day.attractions.length > 0 && (
                      <span className="font-semibold">
                        {getCityLabel(day.attractions[0].city)}
                      </span>
                    )}
                    {day.attractions.length > 0 && " • "}
                    {day.attractions.length} attraction
                    {day.attractions.length !== 1 ? "s" : ""} •{" "}
                    {day.meals.length} meal{day.meals.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {day.attractions.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  {day.attractions.map((attraction) => (
                    <div
                      key={attraction.id}
                      className="bg-white/60 rounded-lg p-3 md:p-4 flex items-start gap-3 md:gap-4"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={
                            !attraction.image ||
                            attraction.image === "/placeholder.jpg" ||
                            attraction.image === "/placeholder.svg"
                              ? fallbackImageByType(attraction.type)
                              : attraction.image
                          }
                          alt={getAttractionName(
                            attraction.id,
                            attraction.name,
                            language
                          )}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            const fb = fallbackImageByType(attraction.type);
                            if (img.src.endsWith(fb)) return;
                            img.src = fb;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-[#1a3a52] text-sm md:text-base truncate">
                            {getAttractionName(
                              attraction.id,
                              attraction.name,
                              language
                            )}
                          </h4>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {getTypeLabel(attraction.type)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-[#4a6b84]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 md:h-4 md:w-4" />
                            {attraction.duration}h
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 md:h-4 md:w-4" />¥
                            {attraction.cost}
                          </span>
                          <span className="flex items-center gap-1">
                            <Leaf className="h-3 w-3 md:h-4 md:w-4" />
                            {attraction.carbonFootprint}kg
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {day.meals.length > 0 && (
                    <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/40">
                      <h5 className="text-sm font-semibold text-[#1a3a52] mb-2">
                        {t.recommendedCuisine}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {day.meals.map((meal, mealIdx) => (
                          <div
                            key={`${day.date}-${meal.id}-${mealIdx}`}
                            className="bg-white/40 rounded-lg p-2 md:p-3"
                          >
                            {meal.image && (
                              <div className="w-full h-20 md:h-24 rounded-lg overflow-hidden mb-2">
                                <img
                                  src={
                                    !meal.image ||
                                    meal.image === "/placeholder.jpg" ||
                                    meal.image === "/placeholder.svg"
                                      ? fallbackMealImageByType(meal.type)
                                      : meal.image
                                  }
                                  alt={getMealName(
                                    meal.id,
                                    meal.name,
                                    language
                                  )}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const img =
                                      e.currentTarget as HTMLImageElement;
                                    const fb = fallbackMealImageByType(
                                      meal.type
                                    );
                                    if (img.src.endsWith(fb)) return;
                                    img.src = fb;
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h6 className="font-medium text-[#1a3a52] text-xs md:text-sm">
                                {getMealName(meal.id, meal.name, language)}
                              </h6>
                              <Badge
                                variant="secondary"
                                className="text-[10px] md:text-xs shrink-0"
                              >
                                {mealIdx === 0 ? t.lunch : t.dinner}
                              </Badge>
                            </div>
                            <p className="text-[10px] md:text-xs text-[#4a6b84] mb-1">
                              {getCuisineLabel(meal.cuisine)}
                            </p>
                            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-[#4a6b84]">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />¥{meal.cost}
                              </span>
                              <span className="flex items-center gap-1">
                                <Leaf className="h-3 w-3" />
                                {meal.carbonFootprint}kg
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 bg-white/40 rounded-lg">
                  <p className="text-[#4a6b84] mb-3 text-sm md:text-base">
                    {t.noAttractionsPlanned}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#5ba3d0] text-[#5ba3d0] bg-transparent text-xs md:text-sm"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    {t.addAttraction}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/route-planner")}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
          >
            {t.editPlan}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/")}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
          >
            {t.backToHome}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/route-planner?reset=1")}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
          >
            {t.generateNewTrip}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              if (!ensureAuthOrGuest()) return;
              proceedSaveRoute();
            }}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
          >
            <Save className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {t.saveRoute}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              window.print();
            }}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
          >
            <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {t.generatePDF}
          </Button>
          <Button
            size="lg"
            onClick={handleSaveTrip}
            className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
          >
            <Leaf className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {t.saveTripViewESG}
          </Button>
        </div>
      </div>
      {/* Auth prompt modal */}
      <Dialog open={authPromptOpen} onOpenChange={setAuthPromptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.signInOrUseGuestIDToContinue}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#4a6b84] mb-3">{t.chooseOptionBelow}</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white"
              onClick={() => {
                setAuthPromptOpen(false);
                router.push("/login?redirect=/route-planner/itinerary");
              }}
            >
              {t.goToSignIn}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                auth.ensureGuest();
                setAuthPromptOpen(false);
                proceedSaveRoute();
              }}
            >
              {t.useGuestId}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
