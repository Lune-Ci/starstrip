"use client";

import { MainLayout } from "@/components/main-layout";
import { useFavoritesStore } from "@/lib/favorites-store";
import { AttractionCard } from "@/components/attraction-card";
import { AttractionDetailModal } from "@/components/attraction-detail-modal";
import type { Attraction } from "@/lib/route-planner-store";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Heart, UtensilsCrossed } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export default function FavoritesPage() {
  const fav = useFavoritesStore();
  const { attractions, restaurants } = fav.getActiveFavorites();
  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] mb-3">
            {t.myFavorites}
          </h1>
          <p className="text-lg text-[#4a6b84]">
            {t.yourSavedAttractionsAndRestaurants}
          </p>
        </div>

        <Tabs defaultValue="attractions" className="w-full">
          <TabsList className="liquid-glass mb-6">
            <TabsTrigger
              value="attractions"
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              {t.attractions} ({attractions.length})
            </TabsTrigger>
            <TabsTrigger
              value="restaurants"
              className="flex items-center gap-2"
            >
              <UtensilsCrossed className="h-4 w-4" />
              {t.restaurants} ({restaurants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attractions">
            {attractions.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {attractions.map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onViewDetails={setSelectedAttraction}
                  />
                ))}
              </div>
            ) : (
              <Card className="liquid-glass border-0 p-12 text-center">
                <Heart className="h-12 w-12 text-[#4a6b84] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a3a52] mb-2">
                  {t.noFavoriteAttractionsYet}
                </h3>
                <p className="text-[#4a6b84]">
                  {t.startExploringAndSaveYourFavoritePlaces}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="restaurants">
            {restaurants.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="liquid-glass border-0 p-6"
                  >
                    <h3 className="text-xl font-bold text-[#1a3a52] mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-[#4a6b84] mb-2">
                      {getCityLabel(restaurant.city)}
                    </p>
                    <p className="text-sm text-[#4a6b84] mb-4 capitalize">
                      {(() => {
                        switch (restaurant.type) {
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
                            return restaurant.type;
                        }
                      })()}
                    </p>
                    <p className="text-sm text-[#4a6b84] mb-2">
                      {getCuisineLabel(restaurant.cuisine)}
                    </p>
                    <p className="text-lg font-semibold text-[#5ba3d0]">
                      ¥{restaurant.cost}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="liquid-glass border-0 p-12 text-center">
                <UtensilsCrossed className="h-12 w-12 text-[#4a6b84] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a3a52] mb-2">
                  {t.noFavoriteRestaurantsYet}
                </h3>
                <p className="text-[#4a6b84]">
                  {t.discoverAndSaveRestaurantsYouWantToTry}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AttractionDetailModal
        attraction={selectedAttraction}
        isOpen={!!selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </MainLayout>
  );
}
