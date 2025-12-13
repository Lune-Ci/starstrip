export interface CarbonBreakdown {
  flights: number
  trains: number
  accommodation: number
  activities: number
  total: number
}

export interface TransportEmission {
  type: "flight" | "train" | "bus" | "car"
  distance: number
  emission: number
}

export function calculateTransportEmissions(type: "flight" | "train" | "bus" | "car", distance: number): number {
  // Emissions in kg CO2 per km per passenger
  const emissionFactors = {
    flight: 0.255, // Short-haul flight
    train: 0.041, // High-speed rail
    bus: 0.089,
    car: 0.192,
  }

  return distance * emissionFactors[type]
}

export function calculateAccommodationEmissions(nights: number, type: string): number {
  // Emissions in kg CO2 per night
  const emissionFactors = {
    budget: 15,
    moderate: 25,
    luxury: 50,
  }

  return nights * (emissionFactors[type as keyof typeof emissionFactors] || 25)
}

export interface CarbonTip {
  icon: string // Icon name from lucide-react
  title: string
  description: string
}

export function getCarbonReductionTips(carbonFootprint: number): CarbonTip[] {
  const tips: CarbonTip[] = [
    {
      icon: "Train",
      title: "High-Speed Rail",
      description: "Use trains for short distances",
    },
    {
      icon: "Building",
      title: "Eco Hotels",
      description: "Choose sustainable accommodation",
    },
    {
      icon: "Bus",
      title: "Public Transport",
      description: "Prefer buses and trains",
    },
    {
      icon: "Package",
      title: "Pack Light",
      description: "Reduce luggage weight",
    },
    {
      icon: "Recycle",
      title: "Reusable Items",
      description: "Bring water bottle and bag",
    },
    {
      icon: "Utensils",
      title: "Local Food",
      description: "Support local restaurants",
    },
    {
      icon: "Plane",
      title: "Direct Flights",
      description: "Avoid connections",
    },
    {
      icon: "Clock",
      title: "Off-Peak Travel",
      description: "Visit during quieter times",
    },
  ]

  if (carbonFootprint > 500) {
    return [
      {
        icon: "Calendar",
        title: "Longer Trips",
        description: "Extend trip duration",
      },
      {
        icon: "Mountain",
        title: "Scenic Routes",
        description: "Choose train routes",
      },
      ...tips.slice(0, 6),
    ]
  }

  return tips
}

export function getEmissionComparison(carbonFootprint: number) {
  return {
    trees: Math.ceil(carbonFootprint / 21.77), // Trees needed to offset for one year
    cars: (carbonFootprint / 4600).toFixed(2), // Equivalent to driving a car for X days
    flights: (carbonFootprint / 90).toFixed(1), // Equivalent to X domestic flights
  }
}
