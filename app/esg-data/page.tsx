"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card } from "@/components/ui/card";
import { useESGStore } from "@/lib/esg-store";
import {
  getCarbonReductionTips,
  getEmissionComparison,
} from "@/lib/carbon-calculator";
import {
  Leaf,
  Plane,
  TreePine,
  TrendingDown,
  Lightbulb,
  Train,
  Building,
  Bus,
  Package,
  Recycle,
  Utensils,
  Clock,
  Calendar,
  Mountain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Train,
  Building,
  Bus,
  Package,
  Recycle,
  Utensils,
  Plane,
  Clock,
  Calendar,
  Mountain,
};

export default function ESGDataPage() {
  const { trips, getTotalCarbon, getYearlyCarbon } = useESGStore();
  const currentYear = new Date().getFullYear();
  const yearlyCarbon = getYearlyCarbon(currentYear);
  const totalCarbon = getTotalCarbon();
  const [isTripHistoryOpen, setIsTripHistoryOpen] = useState(false);

  // Calculate breakdown by category
  const breakdown = trips.reduce(
    (acc, trip) => ({
      flights: acc.flights + trip.breakdown.flights,
      trains: acc.trains + trip.breakdown.trains,
      accommodation: acc.accommodation + trip.breakdown.accommodation,
      activities: acc.activities + trip.breakdown.activities,
    }),
    { flights: 0, trains: 0, accommodation: 0, activities: 0 }
  );

  const pieData = [
    { name: "Flights", value: breakdown.flights, color: "#e74c3c" },
    { name: "Trains", value: breakdown.trains, color: "#5ba3d0" },
    { name: "Accommodation", value: breakdown.accommodation, color: "#f39c12" },
    { name: "Activities", value: breakdown.activities, color: "#27ae60" },
  ].filter((item) => item.value > 0);

  // Monthly data for the current year
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthTrips = trips.filter((trip) => {
      const date = new Date(trip.startDate);
      return date.getFullYear() === currentYear && date.getMonth() === i;
    });
    const carbon = monthTrips.reduce(
      (sum, trip) => sum + trip.carbonFootprint,
      0
    );
    return {
      month: new Date(2025, i).toLocaleString("en", { month: "short" }),
      carbon: Math.round(carbon),
    };
  });

  const comparison = getEmissionComparison(yearlyCarbon);
  const tips = getCarbonReductionTips(yearlyCarbon);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3a52] mb-2 md:mb-3">
            ESG Carbon Dashboard
          </h1>
          <p className="text-base md:text-lg text-[#4a6b84]">
            Track your travel carbon footprint and discover ways to reduce it
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/route-planner?reset=1")}
              className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10"
            >
              Generate New Trip
            </Button>
          </div>
        </div>

        {trips.length === 0 ? (
          <Card className="liquid-glass border-0 p-8 md:p-12 text-center">
            <Leaf className="h-12 w-12 md:h-16 md:w-16 text-[#5ba3d0] mx-auto mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-[#1a3a52] mb-2">
              Start Your Journey
            </h3>
            <p className="text-sm md:text-base text-[#4a6b84] mb-4">
              Plan your first trip to start tracking your carbon footprint
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="border-[#5ba3d0] text-[#5ba3d0] hover:bg-[#5ba3d0]/10"
              >
                Back to Home
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = "/route-planner?reset=1")
                }
                className="bg-[#5ba3d0] hover:bg-[#4a92bf] text-white"
              >
                Start Planning
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <Card className="liquid-glass border-0 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5ba3d0]/20 flex items-center justify-center">
                    <Leaf className="h-4 w-4 md:h-5 md:w-5 text-[#5ba3d0]" />
                  </div>
                  <h3 className="font-semibold text-[#4a6b84] text-xs md:text-base">
                    {currentYear} Total
                  </h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#1a3a52]">
                  {Math.round(yearlyCarbon)} kg
                </p>
                <p className="text-xs md:text-sm text-[#4a6b84] mt-1">
                  CO₂ emissions
                </p>
              </Card>

              <Card className="liquid-glass border-0 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TreePine className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-[#4a6b84] text-xs md:text-base">
                    Trees
                  </h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#1a3a52]">
                  {comparison.trees}
                </p>
                <p className="text-xs md:text-sm text-[#4a6b84] mt-1">
                  to offset
                </p>
              </Card>

              <Card className="liquid-glass border-0 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Plane className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-[#4a6b84] text-xs md:text-base">
                    Flights
                  </h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#1a3a52]">
                  {comparison.flights}
                </p>
                <p className="text-xs md:text-sm text-[#4a6b84] mt-1">
                  equivalent
                </p>
              </Card>

              <Card className="liquid-glass border-0 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-[#4a6b84] text-xs md:text-base">
                    Trips
                  </h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#1a3a52]">
                  {trips.length}
                </p>
                <p className="text-xs md:text-sm text-[#4a6b84] mt-1">
                  recorded
                </p>
              </Card>
            </div>

            {/* Monthly Carbon Trend */}
            <Card className="liquid-glass border-0 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#1a3a52] mb-4 md:mb-6">
                Monthly Carbon Emissions ({currentYear})
              </h2>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="md:hidden"
              >
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#bddaea" />
                  <XAxis
                    dataKey="month"
                    stroke="#4a6b84"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis stroke="#4a6b84" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #bddaea",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="carbon" fill="#5ba3d0" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer
                width="100%"
                height={300}
                className="hidden md:block"
              >
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#bddaea" />
                  <XAxis dataKey="month" stroke="#4a6b84" />
                  <YAxis
                    stroke="#4a6b84"
                    label={{
                      value: "kg CO₂",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #bddaea",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="carbon" fill="#5ba3d0" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Emissions Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="liquid-glass border-0 p-6">
                <h2 className="text-2xl font-bold text-[#1a3a52] mb-6">
                  Emissions by Category
                </h2>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #bddaea",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-[#4a6b84] text-center py-12">
                    No data available
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-[#4a6b84] mb-1">Flights</p>
                    <p className="text-xl font-bold text-[#1a3a52]">
                      {Math.round(breakdown.flights)} kg
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-[#4a6b84] mb-1">Trains</p>
                    <p className="text-xl font-bold text-[#1a3a52]">
                      {Math.round(breakdown.trains)} kg
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-[#4a6b84] mb-1">Accommodation</p>
                    <p className="text-xl font-bold text-[#1a3a52]">
                      {Math.round(breakdown.accommodation)} kg
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-[#4a6b84] mb-1">Activities</p>
                    <p className="text-xl font-bold text-[#1a3a52]">
                      {Math.round(breakdown.activities)} kg
                    </p>
                  </div>
                </div>
              </Card>

              {/* Carbon Reduction Tips */}
              <Card className="liquid-glass border-0 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a3a52]">
                    Reduction Tips
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tips.slice(0, 8).map((tip, index) => {
                    const IconComponent = iconMap[tip.icon] || Lightbulb;
                    return (
                      <div
                        key={index}
                        className="bg-white/60 rounded-lg p-3 flex flex-col items-center text-center gap-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="font-semibold text-sm text-[#1a3a52]">
                          {tip.title}
                        </div>
                        <p className="text-xs text-[#4a6b84]">
                          {tip.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Trip History */}
            <Card className="liquid-glass border-0 p-6">
              <Collapsible
                open={isTripHistoryOpen}
                onOpenChange={setIsTripHistoryOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent mb-4"
                  >
                    <h2 className="text-2xl font-bold text-[#1a3a52]">
                      Trip History
                    </h2>
                    {isTripHistoryOpen ? (
                      <ChevronUp className="h-5 w-5 text-[#4a6b84]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#4a6b84]" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3">
                    {trips
                      .sort(
                        (a, b) =>
                          new Date(b.startDate).getTime() -
                          new Date(a.startDate).getTime()
                      )
                      .map((trip) => (
                        <div
                          key={trip.id}
                          className="bg-white/60 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-semibold text-[#1a3a52] mb-1">
                              {trip.name}
                            </h3>
                            <p className="text-sm text-[#4a6b84]">
                              {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#1a3a52]">
                              {Math.round(trip.carbonFootprint)} kg
                            </p>
                            <p className="text-xs text-[#4a6b84]">CO₂</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
