"use client"

import { Menu, Globe } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TopBarProps {
  onMenuClick: () => void
  currentLanguage: string
  onLanguageChange: (lang: string) => void
}

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "ru", name: "Русский" },
]

export function TopBar({ onMenuClick, currentLanguage, onLanguageChange }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 md:h-16 bg-[#bddaea] border-b border-white/30">
      <div className="flex items-center justify-between h-full px-3 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="hover:bg-white/20 text-[#1a3a52] h-8 w-8 md:h-10 md:w-10"
        >
          <Menu className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Open menu</span>
        </Button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2025-10-23_220304_745-QolodIL7DkjWqmjjXIUkdsxlG6Y2yX.jpg"
            alt="Starstrip"
            width={32}
            height={32}
            className="rounded-full md:w-10 md:h-10"
          />
          <span className="text-lg md:text-xl font-bold text-[#1a3a52] hidden sm:inline">Starstrip</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-white/20 text-[#1a3a52] h-8 w-8 md:h-10 md:w-10">
              <Globe className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Change language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="liquid-glass text-sm md:text-base">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={currentLanguage === lang.code ? "bg-primary/10" : ""}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
