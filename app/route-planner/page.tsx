"use client";

import { useEffect, Suspense } from "react";
import { MainLayout } from "@/components/main-layout";
import { useRoutePlannerStore } from "@/lib/route-planner-store";
import { ProgressSteps } from "@/components/route-planner/progress-steps";
import { StepLocation } from "@/components/route-planner/step-location";
import { StepDates } from "@/components/route-planner/step-dates";
import { StepPreferences } from "@/components/route-planner/step-preferences";
import { StepScheme } from "@/components/route-planner/step-scheme";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

function RoutePlannerInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { state, setStep, updateState, resetPlanner } = useRoutePlannerStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const steps = [t.locationStep, t.datesStep, t.preferencesStep, t.routeScheme];

  useEffect(() => {
    if (params.get("reset") === "1") {
      resetPlanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleGenerateRoute = () => {
    console.log("[v0] Generating route with settings:", {
      startLocation: state.startLocation,
      dateRange: state.dateRange,
      selectedScheme: state.selectedScheme,
    });

    updateState({ itinerary: [], totalCost: 0, totalCarbon: 0 });

    router.push("/route-planner/itinerary");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ProgressSteps currentStep={state.currentStep} steps={steps} />

        <div className="mt-8">
          {state.currentStep === 0 && (
            <StepLocation
              startLocation={state.startLocation}
              onLocationChange={(location) => {
                console.log("[v0] Location selected:", location);
                updateState({ startLocation: location });
              }}
              onNext={() => setStep(1)}
            />
          )}

          {state.currentStep === 1 && (
            <StepDates
              dateRange={state.dateRange}
              onDateRangeChange={(range) => {
                console.log("[v0] Date range selected:", range);
                updateState({ dateRange: range });
              }}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}

          {state.currentStep === 2 && (
            <StepPreferences
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {state.currentStep === 3 && (
            <StepScheme
              selectedScheme={state.selectedScheme}
              onSchemeSelect={(scheme) => {
                console.log("[v0] Scheme selected:", scheme);
                updateState({ selectedScheme: scheme });
              }}
              onNext={handleGenerateRoute}
              onBack={() => setStep(2)}
              startLocation={state.startLocation}
              dateRange={state.dateRange}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function RoutePlannerPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="container mx-auto px-4 py-8">Loading...</div>
        </MainLayout>
      }
    >
      <RoutePlannerInner />
    </Suspense>
  );
}
