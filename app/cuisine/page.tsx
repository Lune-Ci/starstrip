"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { mealsData } from "@/lib/attractions-data";
import { REGIONS, getRegionForCity, getRegionLabel } from "@/lib/regions";
import type { Meal } from "@/lib/route-planner-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, DollarSign, Leaf } from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { useAuthStore } from "@/lib/auth-store";
import { cn, getMealName } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CuisinePage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { addRestaurant, removeRestaurant, isRestaurantFavorited } =
    useFavoritesStore();
  const auth = useAuthStore();

  const cities = ["all", ...Array.from(new Set(mealsData.map((m) => m.city)))];
  const cuisines = [
    "all",
    ...Array.from(new Set(mealsData.map((m) => m.cuisine))),
  ];
  const types = ["all", ...Array.from(new Set(mealsData.map((m) => m.type)))];

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

  const getTypeLabel = (type: string): string => {
    switch (type) {
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

  const citiesByRegion: Record<(typeof REGIONS)[number], string[]> =
    REGIONS.reduce((acc, region) => {
      const citiesInRegion = Array.from(
        new Set(
          mealsData
            .filter((m) => getRegionForCity(m.city) === region)
            .map((m) => m.city)
        )
      ).sort();
      acc[region] = citiesInRegion;
      return acc;
    }, {} as Record<(typeof REGIONS)[number], string[]>);

  const filteredMeals = mealsData.filter((meal) => {
    const matchesCity = selectedCity === "all" || meal.city === selectedCity;
    const region = getRegionForCity(meal.city);
    const matchesRegion =
      selectedRegion === "all" || region === (selectedRegion as any);
    const matchesCuisine =
      selectedCuisine === "all" || meal.cuisine === selectedCuisine;
    const matchesType = selectedType === "all" || meal.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      getMealName(meal.id, meal.name, language)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getCityLabel(meal.city)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getCuisineLabel(meal.cuisine)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return (
      matchesCity &&
      matchesRegion &&
      matchesCuisine &&
      matchesType &&
      matchesSearch
    );
  });

  const toggleFavorite = (meal: Meal) => {
    if (!auth.user && !auth.guestId) {
      // Show auth prompt
      return;
    }
    if (isRestaurantFavorited(meal.id)) {
      removeRestaurant(meal.id);
    } else {
      addRestaurant(meal);
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

  const resolveMealImage = (meal: Meal): string => {
    const src = meal.image || "";
    if (!src || src === "/placeholder.jpg" || src === "/placeholder.svg") {
      return fallbackMealImageByType(meal.type);
    }
    return src;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] mb-3">
            {t.discoverCuisine}
          </h1>
          <p className="text-lg text-[#4a6b84]">{t.exploreChinaCuisine}</p>
        </div>

        {/* Filters */}
        <div className="liquid-glass rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a6b84]" />
              <Input
                placeholder={t.searchCuisine}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60"
              />
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-white/60">
                <SelectValue placeholder={t.selectCity} />
              </SelectTrigger>
              <SelectContent className="liquid-glass">
                <SelectItem key="all" value="all">
                  {t.allCities}
                </SelectItem>
                <Accordion type="multiple" className="bg-transparent">
                  {REGIONS.map((r) => (
                    <AccordionItem key={r} value={r} className="border-0">
                      <AccordionTrigger className="px-2 py-2 text-sm font-medium text-[#1a3a52] hover:no-underline">
                        {getRegionLabel(r, language)}
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-2">
                        {(citiesByRegion[r] || []).map((city) => (
                          <SelectItem key={`${r}-${city}`} value={city}>
                            {getCityLabel(city)}
                          </SelectItem>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-white/60">
                <SelectValue placeholder={t.selectRegion} />
              </SelectTrigger>
              <SelectContent className="liquid-glass">
                <SelectItem key="all" value="all">
                  {t.allRegions}
                </SelectItem>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {getRegionLabel(r, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="bg-white/60">
                <SelectValue placeholder={t.selectCuisine} />
              </SelectTrigger>
              <SelectContent className="liquid-glass">
                <SelectItem key="all" value="all">
                  {t.allCuisines}
                </SelectItem>
                {cuisines
                  .filter((c) => c !== "all")
                  .map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {getCuisineLabel(cuisine)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white/60">
                <SelectValue placeholder={t.selectType} />
              </SelectTrigger>
              <SelectContent className="liquid-glass">
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? t.allTypes : getTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[#4a6b84]">
            {t.foundCuisine.replace("{count}", String(filteredMeals.length))}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredMeals.map((meal) => {
            const isFavorited = isRestaurantFavorited(meal.id);
            return (
              <Card
                key={meal.id}
                className="liquid-glass border-0 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={resolveMealImage(meal)}
                    alt={getMealName(meal.id, meal.name, language)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      const fb = fallbackMealImageByType(meal.type);
                      if (img.src.endsWith(fb)) return;
                      img.src = fb;
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFavorite(meal)}
                    className={cn(
                      "absolute top-2 right-2 rounded-full backdrop-blur-sm",
                      isFavorited
                        ? "bg-red-500/90 hover:bg-red-600/90 text-white"
                        : "bg-white/80 hover:bg-white/90 text-[#4a6b84]"
                    )}
                  >
                    <Heart
                      className={cn("h-5 w-5", isFavorited && "fill-current")}
                    />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-[#5ba3d0] text-white">
                    {getRegionLabel(getRegionForCity(meal.city), language)}
                  </Badge>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#1a3a52] mb-2 line-clamp-1">
                    {getMealName(meal.id, meal.name, language)}
                  </h3>

                  <div className="flex items-center gap-2 text-[#4a6b84] mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{getCityLabel(meal.city)}</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getCuisineLabel(meal.cuisine)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getTypeLabel(meal.type)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-[#5ba3d0]" />
                      <span className="text-sm font-semibold text-[#1a3a52]">
                        ¥{meal.cost}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-[#5ba3d0]" />
                      <span className="text-xs text-[#4a6b84]">
                        {meal.carbonFootprint}kg
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#4a6b84] text-lg">{t.noCuisineFound}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
