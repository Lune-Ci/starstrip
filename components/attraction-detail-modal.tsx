"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Attraction } from "@/lib/route-planner-store";
import {
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  Heart,
  ExternalLink,
} from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface AttractionDetailModalProps {
  attraction: Attraction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttractionDetailModal({
  attraction,
  isOpen,
  onClose,
}: AttractionDetailModalProps) {
  const { addAttraction, removeAttraction, isAttractionFavorited } =
    useFavoritesStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  if (!attraction) return null;

  const isFavorited = isAttractionFavorited(attraction.id);

  const toggleFavorite = () => {
    if (isFavorited) {
      removeAttraction(attraction.id);
    } else {
      addAttraction(attraction);
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
    const src = attraction?.image || "";
    if (!src || src === "/placeholder.jpg" || src === "/placeholder.svg") {
      return fallbackByType(attraction!.type);
    }
    return src;
  };

  const mapUrl = `https://www.openstreetmap.org/?mlat=${attraction.coordinates.lat}&mlon=${attraction.coordinates.lng}#map=15/${attraction.coordinates.lat}/${attraction.coordinates.lng}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="liquid-glass max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1a3a52]">
            {attraction.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src={resolveAttractionImage()}
              alt={attraction.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                const fb = fallbackByType(attraction.type);
                if (img.src.endsWith(fb)) return;
                img.src = fb;
              }}
            />
            <Badge className="absolute top-3 left-3 bg-[#5ba3d0] text-white">
              {attraction.type}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-[#4a6b84]">
            <MapPin className="h-5 w-5 text-[#5ba3d0]" />
            <span className="font-medium">{attraction.city}, China</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-[#5ba3d0]" />
                <span className="text-sm text-[#4a6b84]">
                  {t.durationLabel}
                </span>
              </div>
              <p className="text-xl font-bold text-[#1a3a52]">
                {attraction.duration} {t.hours}
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-5 w-5 text-[#5ba3d0]" />
                <span className="text-sm text-[#4a6b84]">{t.costLabel}</span>
              </div>
              <p className="text-xl font-bold text-[#1a3a52]">
                ¥{attraction.cost}
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="h-5 w-5 text-[#5ba3d0]" />
                <span className="text-sm text-[#4a6b84]">{t.carbonLabel}</span>
              </div>
              <p className="text-xl font-bold text-[#1a3a52]">
                {attraction.carbonFootprint}
                {t.kg} {t.co2}
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white/60 rounded-lg p-4">
            <h3 className="font-semibold text-[#1a3a52] mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#5ba3d0]" />
              {t.locationMap}
            </h3>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  attraction.coordinates.lng - 0.01
                },${attraction.coordinates.lat - 0.01},${
                  attraction.coordinates.lng + 0.01
                },${attraction.coordinates.lat + 0.01}&layer=mapnik&marker=${
                  attraction.coordinates.lat
                },${attraction.coordinates.lng}`}
                style={{ border: 0 }}
              />
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#5ba3d0] hover:underline mt-2 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              {t.viewLargerMap}
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={toggleFavorite}
              variant="outline"
              className={cn(
                "flex-1",
                isFavorited
                  ? "border-red-500 text-red-500 hover:bg-red-50"
                  : "border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10"
              )}
            >
              <Heart
                className={cn("mr-2 h-5 w-5", isFavorited && "fill-current")}
              />
              {isFavorited ? t.removeFromFavorites : t.addToFavorites}
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-[#5ba3d0] hover:bg-[#4a92bf] text-white"
            >
              {t.close}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
