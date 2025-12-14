"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { AttractionCard } from "@/components/attraction-card";
import { AttractionDetailModal } from "@/components/attraction-detail-modal";
import { attractionsData } from "@/lib/attractions-data";
import { REGIONS, getRegionForCity, getRegionLabel } from "@/lib/regions";
import type { Attraction } from "@/lib/route-planner-store";
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
import { getAttractionName } from "@/lib/utils";

export default function AttractionsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);

  const cities = [
    "all",
    ...Array.from(new Set(attractionsData.map((a) => a.city))),
  ];
  const types = [
    "all",
    ...Array.from(new Set(attractionsData.map((a) => a.type))),
  ];

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
          attractionsData
            .filter((a) => getRegionForCity(a.city) === region)
            .map((a) => a.city)
        )
      ).sort();
      acc[region] = citiesInRegion;
      return acc;
    }, {} as Record<(typeof REGIONS)[number], string[]>);

  const filteredAttractions = attractionsData.filter((attraction) => {
    const matchesCity =
      selectedCity === "all" || attraction.city === selectedCity;
    const region = getRegionForCity(attraction.city);
    const matchesRegion =
      selectedRegion === "all" || region === (selectedRegion as any);
    const matchesType =
      selectedType === "all" || attraction.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      getAttractionName(attraction.id, attraction.name, language)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getCityLabel(attraction.city)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCity && matchesRegion && matchesType && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] mb-3">
            {t.discoverAttractions}
          </h1>
          <p className="text-lg text-[#4a6b84]">{t.exploreChinaDestinations}</p>
        </div>

        {/* Filters */}
        <div className="liquid-glass rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a6b84]" />
              <Input
                placeholder={t.searchAttractions}
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
            {t.foundAttractions.replace(
              "{count}",
              String(filteredAttractions.length)
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onViewDetails={setSelectedAttraction}
            />
          ))}
        </div>

        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#4a6b84] text-lg">{t.noAttractionsFound}</p>
          </div>
        )}
      </div>

      <AttractionDetailModal
        attraction={selectedAttraction}
        isOpen={!!selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </MainLayout>
  );
}
