"use client";

import { X, Home, User, Route, MapPin, Heart, Leaf, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/translations";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  translations: Record<TranslationKey, string>;
}

const navItems = [
  { icon: Home, labelKey: "home", href: "/" },
  { icon: User, labelKey: "userCenter", href: "/user-center" },
  { icon: Route, labelKey: "routePlanner", href: "/route-planner" },
  { icon: MapPin, labelKey: "attractions", href: "/attractions" },
  { icon: UtensilsCrossed, labelKey: "cuisine", href: "/cuisine" },
  { icon: Heart, labelKey: "favorites", href: "/favorites" },
  { icon: Leaf, labelKey: "esgData", href: "/esg-data" },
];

export function SideNav({
  isOpen,
  onClose,
  currentPath,
  translations,
}: SideNavProps) {
  const t = translations;
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 sm:w-72 bg-[#bddaea] z-50 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/30">
            <span className="text-base md:text-lg font-semibold text-[#1a3a52]">
              {t.navigation}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/20 text-[#1a3a52] h-8 w-8 md:h-10 md:w-10"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">{t.closeMenu}</span>
            </Button>
          </div>

          <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <div
                    className={cn(
                      "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base",
                      isActive
                        ? "bg-white/40 text-[#1a3a52] font-medium"
                        : "text-[#4a6b84] hover:bg-white/20 hover:text-[#1a3a52]"
                    )}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                    <span className="truncate">
                      {t[item.labelKey as keyof typeof t]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
