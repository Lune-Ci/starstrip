"use client";

import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useUserProfileStore,
  type TravelPace,
  type BudgetLevel,
} from "@/lib/user-profile-store";
import { useState, useEffect } from "react";
import { Check, UserIcon, Plane, Wallet, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
];

const interestOptions = [
  "Historical Sites",
  "Natural Scenery",
  "Urban Exploration",
  "Food & Cuisine",
  "Shopping",
  "Adventure",
  "Art & Museums",
  "Photography",
  "Local Culture",
  "Nightlife",
];

interface SavedRoute {
  id: string;
  name: string;
  startLocation: string;
  dateRange: { from: string; to: string };
  selectedScheme: string;
  itinerary: any[];
  totalCost: number;
  totalCarbon: number;
  savedAt: string;
}

export default function UserCenterPage() {
  const { profile, updateProfile } = useUserProfileStore();
  const [saved, setSaved] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const handleSave = () => {
    updateProfile({ hasCompletedProfile: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("saved-routes");
    if (saved) {
      setSavedRoutes(JSON.parse(saved));
    }
  }, []);

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests;
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    updateProfile({ interests: newInterests });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3a52] mb-2 md:mb-3">
            {t.userCenter}
          </h1>
          <p className="text-base md:text-lg text-[#4a6b84]">
            {t.setPreferences}
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Upgrade to Account Section */}
          <Card className="liquid-glass border-0 p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-1 md:mb-2">
                  {t.upgradeToFullAccount}
                </h2>
                <p className="text-sm md:text-base text-[#4a6b84] mb-3 md:mb-4">
                  {t.upgradeDesc}
                </p>
                <Button
                  className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white"
                  onClick={() => {
                    window.location.href =
                      "/login?upgrade=1&redirect=/user-center";
                  }}
                >
                  {t.upgradeNow}
                </Button>
              </div>
            </div>
          </Card>
          {/* Nationality Section */}
          <Card className="liquid-glass border-0 p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-1 md:mb-2">
                  {t.nationality}
                </h2>
                <p className="text-sm md:text-base text-[#4a6b84] mb-3 md:mb-4">
                  {t.selectCountry}
                </p>
                <Select
                  value={profile.nationality}
                  onValueChange={(value) =>
                    updateProfile({ nationality: value })
                  }
                >
                  <SelectTrigger className="w-full md:w-80 bg-white/60 text-sm md:text-base">
                    <SelectValue placeholder={t.selectYourCountry} />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass">
                    {countries.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.code}
                        className="text-sm md:text-base"
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Travel Pace Section */}
          <Card className="liquid-glass border-0 p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center shrink-0">
                <Plane className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-1 md:mb-2">
                  {t.travelPace}
                </h2>
                <p className="text-sm md:text-base text-[#4a6b84] mb-3 md:mb-4">
                  {t.howFastTravel}
                </p>
                <RadioGroup
                  value={profile.travelPace}
                  onValueChange={(value) =>
                    updateProfile({ travelPace: value as TravelPace })
                  }
                  className="space-y-2 md:space-y-3"
                >
                  <div className="flex items-center space-x-2 md:space-x-3 bg-white/40 rounded-lg p-3 md:p-4">
                    <RadioGroupItem
                      value="relaxed"
                      id="relaxed"
                      className="shrink-0"
                    />
                    <Label htmlFor="relaxed" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#1a3a52] text-sm md:text-base">
                        {t.relaxed}
                      </div>
                      <div className="text-xs md:text-sm text-[#4a6b84]">
                        {t.relaxedDesc}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 bg-white/40 rounded-lg p-3 md:p-4">
                    <RadioGroupItem
                      value="moderate"
                      id="moderate"
                      className="shrink-0"
                    />
                    <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#1a3a52] text-sm md:text-base">
                        {t.moderate}
                      </div>
                      <div className="text-xs md:text-sm text-[#4a6b84]">
                        {t.moderateDesc}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 bg-white/40 rounded-lg p-3 md:p-4">
                    <RadioGroupItem
                      value="fast"
                      id="fast"
                      className="shrink-0"
                    />
                    <Label htmlFor="fast" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#1a3a52] text-sm md:text-base">
                        {t.fast}
                      </div>
                      <div className="text-xs md:text-sm text-[#4a6b84]">
                        {t.fastDesc}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>

          {/* Budget Level Section */}
          <Card className="liquid-glass border-0 p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center shrink-0">
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-1 md:mb-2">
                  {t.budgetLevel}
                </h2>
                <p className="text-sm md:text-base text-[#4a6b84] mb-3 md:mb-4">
                  {t.preferredSpendingRange}
                </p>
                <RadioGroup
                  value={profile.budgetLevel}
                  onValueChange={(value) =>
                    updateProfile({ budgetLevel: value as BudgetLevel })
                  }
                  className="space-y-2 md:space-y-3"
                >
                  <div className="flex items-center space-x-2 md:space-x-3 bg-white/40 rounded-lg p-3 md:p-4">
                    <RadioGroupItem
                      value="budget"
                      id="budget"
                      className="shrink-0"
                    />
                    <Label htmlFor="budget" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#1a3a52] text-sm md:text-base">
                        {t.budget}
                      </div>
                      <div className="text-xs md:text-sm text-[#4a6b84]">
                        {t.budgetRange}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 bg-white/40 rounded-lg p-3 md:p-4">
                    <RadioGroupItem
                      value="moderate"
                      id="moderate-budget"
                      className="shrink-0"
                    />
                    <Label
                      htmlFor="moderate-budget"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-semibold text-[#1a3a52] text-sm md:text-base">
                        {t.moderate}
                      </div>
                      <div className="text-xs md:text-sm text-[#4a6b84]">
                        {t.moderateRange}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 bg-white/40 rounded-lg p-3 md:p-4">
                    <RadioGroupItem
                      value="luxury"
                      id="luxury"
                      className="shrink-0"
                    />
                    <Label htmlFor="luxury" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#1a3a52] text-sm md:text-base">
                        {t.luxury}
                      </div>
                      <div className="text-xs md:text-sm text-[#4a6b84]">
                        {t.luxuryRange}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>

          {/* Interests Section */}
          <Card className="liquid-glass border-0 p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center shrink-0">
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-1 md:mb-2">
                  {t.interests}
                </h2>
                <p className="text-sm md:text-base text-[#4a6b84] mb-3 md:mb-4">
                  {t.selectAllInterests}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={
                        profile.interests.includes(interest)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-all ${
                        profile.interests.includes(interest)
                          ? "bg-[#5ba3d0] text-white hover:bg-[#4a92bf]"
                          : "border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10"
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                      {profile.interests.includes(interest) && (
                        <Check className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-2 md:pt-4">
            <Button
              size="lg"
              onClick={handleSave}
              className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-8 md:px-12 py-5 md:py-6 text-base md:text-lg w-full sm:w-auto"
            >
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {t.savedSuccessfully}
                </>
              ) : (
                t.saveProfile
              )}
            </Button>
          </div>

          {/* Historical Routes */}
          <Card className="liquid-glass border-0 p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center shrink-0">
                <Plane className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-1 md:mb-2">
                  {t.historicalRoutes}
                </h2>
                <p className="text-sm md:text-base text-[#4a6b84] mb-3 md:mb-4">
                  {t.viewAllRoutes}
                </p>
                {!isClient ? (
                  <div className="text-center py-8 bg-white/40 rounded-lg">
                    <p className="text-[#4a6b84]">Loading...</p>
                  </div>
                ) : savedRoutes.length > 0 ? (
                  <div className="space-y-3">
                    {savedRoutes
                      .sort(
                        (a, b) =>
                          new Date(b.savedAt).getTime() -
                          new Date(a.savedAt).getTime()
                      )
                      .map((route) => (
                        <div
                          key={route.id}
                          className="bg-white/60 rounded-lg p-4 flex items-center justify-between hover:bg-white/80 transition-colors cursor-pointer"
                          onClick={() => {
                            // Load route into planner
                            if (confirm("Load this route into the planner?")) {
                              window.location.href = "/route-planner";
                            }
                          }}
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1a3a52] mb-1">
                              {route.name}
                            </h3>
                            <p className="text-sm text-[#4a6b84]">
                              {route.startLocation} • {route.dateRange.from} -{" "}
                              {route.dateRange.to}
                            </p>
                            <p className="text-xs text-[#4a6b84] mt-1">
                              {route.itinerary.length} days • ¥
                              {Math.round(route.totalCost)} •{" "}
                              {Math.round(route.totalCarbon)} kg CO₂
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#4a6b84]">
                              {new Date(route.savedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/40 rounded-lg">
                    <p className="text-[#4a6b84] mb-3">{t.noRoutesYet}</p>
                    <p className="text-sm text-[#4a6b84]">
                      {t.generateFirstRoute}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
