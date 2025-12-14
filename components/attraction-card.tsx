"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, DollarSign, Leaf } from "lucide-react";
import type { Attraction } from "@/lib/route-planner-store";
import { useFavoritesStore } from "@/lib/favorites-store";
import { cn, getAttractionName } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface AttractionCardProps {
  attraction: Attraction;
  onViewDetails?: (attraction: Attraction) => void;
}

export function AttractionCard({
  attraction,
  onViewDetails,
}: AttractionCardProps) {
  const { addAttraction, removeAttraction, isAttractionFavorited } =
    useFavoritesStore();
  const isFavorited = isAttractionFavorited(attraction.id);
  const auth = useAuthStore();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const toggleFavorite = () => {
    if (isFavorited) {
      removeAttraction(attraction.id);
    } else {
      if (!auth.user && !auth.guestId) {
        setAuthPromptOpen(true);
        return;
      }
      addAttraction(attraction);
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

  const fallbackByType = (type: string): string => {
    switch (type) {
      case "Natural Scenery":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/West%20Lake%20Pavilion%20and%20Water%20Lilies%2C%20Hangzhou%20120529%201.jpg";
      case "Urban Exploration":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Shanghai%20Skyline%20from%20the%20Bund.jpg";
      case "Historical Site":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Terracotta%20Army%20Pit%201%20front%20rank%20detail.JPG";
      case "Cultural Experience":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Jinli%20Street%20-%20Chengdu%2C%20China%20-%20DSC05396.jpg";
      case "Wildlife":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Chengdu%20Research%20Base%20of%20Giant%20Panda%20Breeding%2C%20201907%2C%2005.jpg";
      case "Entertainment":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/18-03-13%20ShanghaiDisney%20030.jpg";
      default:
        return "/placeholder.jpg";
    }
  };

  const resolveAttractionImage = (): string => {
    const src = attraction.image || "";
    if (!src || src === "/placeholder.jpg" || src === "/placeholder.svg") {
      return fallbackByType(attraction.type);
    }
    return src;
  };

  return (
    <>
      <Card className="liquid-glass border-0 overflow-hidden hover:shadow-xl transition-all group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={resolveAttractionImage()}
            alt={getAttractionName(attraction.id, attraction.name, language)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              const fb = fallbackByType(attraction.type);
              if (img.src.endsWith(fb)) return;
              img.src = fb;
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFavorite}
            className={cn(
              "absolute top-2 right-2 rounded-full backdrop-blur-sm",
              isFavorited
                ? "bg-red-500/90 hover:bg-red-600/90 text-white"
                : "bg-white/80 hover:bg-white/90 text-[#4a6b84]"
            )}
          >
            <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
          </Button>
          <Badge className="absolute bottom-2 left-2 bg-[#5ba3d0] text-white">
            {getTypeLabel(attraction.type)}
          </Badge>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-bold text-[#1a3a52] mb-2 line-clamp-1">
            {getAttractionName(attraction.id, attraction.name, language)}
          </h3>

          <div className="flex items-center gap-2 text-[#4a6b84] mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{getCityLabel(attraction.city)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-[#5ba3d0]" />
              <span className="text-xs text-[#4a6b84]">
                {attraction.duration}h
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-[#5ba3d0]" />
              <span className="text-xs text-[#4a6b84]">¥{attraction.cost}</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-[#5ba3d0]" />
              <span className="text-xs text-[#4a6b84]">
                {attraction.carbonFootprint}kg
              </span>
            </div>
          </div>

          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(attraction)}
              className="w-full bg-[#5ba3d0] hover:bg-[#4a92bf] text-white"
            >
              {t.viewDetails}
            </Button>
          )}
        </div>
      </Card>
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
                window.location.href = "/login?redirect=/attractions";
              }}
            >
              {t.goToSignIn}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                auth.ensureGuest();
                setAuthPromptOpen(false);
                addAttraction(attraction);
              }}
            >
              {t.useGuestId}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
