"use client"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Route, Leaf } from "lucide-react"
import Link from "next/link"
import { useLanguageStore } from "@/lib/language-store"
import { translations } from "@/lib/translations"

export default function HomePage() {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-20 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 lg:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1a3a52] mb-4 md:mb-6 text-balance">
            {t.welcome}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#4a6b84] mb-6 md:mb-8 max-w-3xl mx-auto text-pretty">
            {t.discoverChina}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/route-planner" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg w-full"
              >
                {t.getStarted}
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/attractions" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg bg-transparent w-full"
              >
                {t.exploreAttractions}
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
          <div className="liquid-glass rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center mb-3 md:mb-4">
              <MapPin className="h-5 w-5 md:h-6 md:w-6 text-[#5ba3d0]" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-2 md:mb-3">{t.discoverAttractionsTitle}</h3>
            <p className="text-sm md:text-base text-[#4a6b84] leading-relaxed">{t.discoverAttractionsDesc}</p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center mb-3 md:mb-4">
              <Route className="h-5 w-5 md:h-6 md:w-6 text-[#5ba3d0]" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-2 md:mb-3">{t.smartRoutePlanningTitle}</h3>
            <p className="text-sm md:text-base text-[#4a6b84] leading-relaxed">{t.smartRoutePlanningDesc}</p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center mb-3 md:mb-4">
              <Leaf className="h-5 w-5 md:h-6 md:w-6 text-[#5ba3d0]" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-2 md:mb-3">{t.sustainableTravelTitle}</h3>
            <p className="text-sm md:text-base text-[#4a6b84] leading-relaxed">{t.sustainableTravelDesc}</p>
          </div>
        </section>

        <section className="liquid-glass rounded-2xl p-6 md:p-8 lg:p-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a3a52] mb-6 md:mb-8 text-center">
            {t.popularDestinations}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Beijing", image: "/beijing-great-wall.jpg" },
              { name: "Shanghai", image: "/shanghai-skyline.jpg" },
              { name: "Xi'an", image: "/terracotta-warriors.jpg" },
              { name: "Guilin", image: "/guilin-li-river.jpg" },
            ].map((city) => (
              <Link key={city.name} href="/attractions">
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-2 md:mb-3 aspect-[4/3]">
                    <img
                      src={city.image || "/placeholder.svg"}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement
                        if (img.src.endsWith("/placeholder.svg")) return
                        img.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <h3 className="text-base md:text-xl font-semibold text-[#1a3a52] text-center">{city.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
