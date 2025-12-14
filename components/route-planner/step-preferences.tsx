"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUserProfileStore } from "@/lib/user-profile-store"
import { Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useLanguageStore } from "@/lib/language-store"
import { translations } from "@/lib/translations"

interface StepPreferencesProps {
  onNext: () => void
  onBack: () => void
}

export function StepPreferences({ onNext, onBack }: StepPreferencesProps) {
  const { profile } = useUserProfileStore()
  const { language } = useLanguageStore()
  const t = translations[language] as any

  const hasProfile = profile.hasCompletedProfile

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="liquid-glass border-0 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-[#5ba3d0]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a52]">{t.travelPreferences}</h2>
            <p className="text-[#4a6b84] mt-1">{t.reviewYourPreferencesForPersonalizedRecommendations}</p>
          </div>
        </div>

        {!hasProfile ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">{t.profileNotCompleted}</h3>
                <p className="text-yellow-800 text-sm mb-3">{t.completeYourUserProfileToGetPersonalizedRouteRecommendations}</p>
                <Link href="/user-center">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">{t.completeProfile}</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-semibold text-[#1a3a52] mb-3">{t.yourPreferences}</h3>
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-[#4a6b84]">{t.nationality}:</span>
                  <span className="font-medium text-[#1a3a52]">{profile.nationality || t.notSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6b84]">{t.travelPace}:</span>
                  <span className="font-medium text-[#1a3a52] capitalize">{profile.travelPace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6b84]">{t.budgetLevel}:</span>
                  <span className="font-medium text-[#1a3a52] capitalize">{profile.budgetLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6b84]">{t.interests}:</span>
                  <span className="font-medium text-[#1a3a52]">{profile.interests.length > 0 ? profile.interests.join(", ") : t.noneSelected}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/user-center">
                <Button
                  variant="outline"
                  className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 bg-transparent"
                >
                  {t.updatePreferences}
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-8 bg-transparent"
          >
            {t.back}
          </Button>
          <Button size="lg" onClick={onNext} className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-8">
            {t.nextStep}
          </Button>
        </div>
      </Card>
    </div>
  )
}
