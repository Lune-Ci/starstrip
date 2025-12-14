"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Star } from "lucide-react";
import { format } from "date-fns";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import {
  getPublicHolidays,
  isHoliday,
  getHolidayInfo,
  type PublicHoliday,
  nationalityToCountryCode,
} from "@/lib/holiday-api";
import { useUserProfileStore } from "@/lib/user-profile-store";

interface StepDatesProps {
  dateRange: { from: Date | string | null; to: Date | string | null };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDates({
  dateRange,
  onDateRangeChange,
  onNext,
  onBack,
}: StepDatesProps) {
  const { profile } = useUserProfileStore();
  const { language } = useLanguageStore();
  const t = translations[language] as any;
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      if (profile.nationality) {
        const countryCode = nationalityToCountryCode[profile.nationality];
        if (countryCode) {
          const currentYear = new Date().getFullYear();
          const nextYear = currentYear + 1;

          const [currentYearHolidays, nextYearHolidays] = await Promise.all([
            getPublicHolidays(countryCode, currentYear),
            getPublicHolidays(countryCode, nextYear),
          ]);

          setHolidays([...currentYearHolidays, ...nextYearHolidays]);
        }
      }
    };

    fetchHolidays();
  }, [profile.nationality]);

  const DayContent = (props: any) => {
    const isHolidayDate = isHoliday(props.date, holidays);
    const holidayInfo = getHolidayInfo(props.date, holidays);

    return (
      <div
        className="relative w-full h-full flex items-center justify-center"
        onMouseEnter={() => setHoveredDate(props.date)}
        onMouseLeave={() => setHoveredDate(null)}
      >
        {props.date.getDate()}
        {isHolidayDate && (
          <Star className="absolute top-0 right-0 h-3 w-3 text-yellow-500 fill-yellow-500" />
        )}
      </div>
    );
  };

  const hoveredHoliday = hoveredDate
    ? getHolidayInfo(hoveredDate, holidays)
    : null;

  const ensureDate = (date: Date | string | null): Date | null => {
    if (!date) return null;
    return date instanceof Date ? date : new Date(date);
  };

  const fromDate = ensureDate(dateRange.from);
  const toDate = ensureDate(dateRange.to);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="liquid-glass border-0 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 text-[#5ba3d0]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a52]">
              {t.whenAreYouTraveling}
            </h2>
            <p className="text-[#4a6b84] mt-1">{t.selectYourTravelDates}</p>
          </div>
        </div>

        {profile.nationality && holidays.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-blue-900">
                {t.publicHolidaysHighlighted}
              </span>
            </div>
            <p className="text-sm text-blue-800">{t.holidayStarHint}</p>
          </div>
        )}

        <div className="space-y-4">
          {fromDate && toDate && (
            <div className="bg-white/60 rounded-lg p-4 mb-4">
              <p className="text-[#4a6b84] text-sm mb-1">{t.selectedDates}</p>
              <p className="text-[#1a3a52] font-semibold text-lg">
                {format(fromDate, "PPP")} - {format(toDate, "PPP")}
              </p>
              <p className="text-[#4a6b84] text-sm mt-1">
                {t.duration}:{" "}
                {Math.ceil(
                  (toDate.getTime() - fromDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                {t.days}
              </p>
            </div>
          )}

          {hoveredHoliday && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
              <p className="font-semibold text-yellow-900 text-sm">
                {hoveredHoliday.localName}
              </p>
              <p className="text-xs text-yellow-800">{hoveredHoliday.name}</p>
            </div>
          )}

          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={
                fromDate && toDate ? { from: fromDate, to: toDate } : undefined
              }
              onSelect={(range) => {
                if (range) {
                  onDateRangeChange({
                    from: range.from || null,
                    to: range.to || null,
                  });
                }
              }}
              numberOfMonths={2}
              className="rounded-lg bg-white/40 p-4"
              disabled={(date) => date < new Date()}
              components={{ DayContent } as unknown as any}
              modifiers={{
                holiday: (date) => isHoliday(date, holidays),
              }}
              modifiersClassNames={{
                holiday: "bg-yellow-100 hover:bg-yellow-200",
              }}
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10 px-8 bg-transparent"
          >
            {t.back}
          </Button>
          <Button
            size="lg"
            onClick={onNext}
            disabled={!fromDate || !toDate}
            className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white px-8"
          >
            {t.nextStep}
          </Button>
        </div>
      </Card>
    </div>
  );
}
