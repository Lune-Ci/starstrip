"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { useLanguageStore } from "@/lib/language-store"
import { translations } from "@/lib/translations"

interface StepLocationProps {
  startLocation: string
  onLocationChange: (location: string) => void
  onNext: () => void
}

const cities = ["Beijing", "Shanghai", "Xi'an", "Guilin", "Chengdu", "Hangzhou", "Suzhou", "Nanjing"]

export function StepLocation({ startLocation, onLocationChange, onNext }: StepLocationProps) {
  const { language } = useLanguageStore()
  const t = translations[language]
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="liquid-glass border-0 p-6 md:p-12">
        <div className="flex items-center gap-3 md:gap-4 mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center">
            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-[#5ba3d0]" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-[#1a3a52]">{t.whereAreYouStartingFrom}</h2>
            <p className="text-sm md:text-base text-[#4a6b84] mt-1">{t.selectYourStartingCityInChina}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="location" className="text-base md:text-lg text-[#1a3a52]">
            {t.startingLocation}
          </Label>
          <Select value={startLocation} onValueChange={onLocationChange}>
            <SelectTrigger id="location" className="w-full h-12 md:h-14 bg-white/60 text-base md:text-lg">
              <SelectValue placeholder={t.selectACity} />
            </SelectTrigger>
            <SelectContent className="liquid-glass">
              {cities.map((city) => (
                <SelectItem key={city} value={city} className="text-base md:text-lg">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mt-6 md:mt-8">
          <Button
            size="lg"
            onClick={onNext}
            disabled={!startLocation}
            className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-6 md:px-8"
          >
            {t.nextStep}
          </Button>
        </div>
      </Card>
    </div>
  )
}
