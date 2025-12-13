import type { Attraction, RouteScheme, ItineraryDay, Meal } from "./route-planner-store"
import { attractionsData, mealsData } from "./attractions-data"
import { eachDayOfInterval, format } from "date-fns"

function ensureDate(date: Date | string): Date {
  if (date instanceof Date) return date
  return new Date(date)
}

export function generateRoute(
  startLocation: string,
  dateRange: { from: Date | string; to: Date | string },
  scheme: RouteScheme,
): ItineraryDay[] {
  const fromDate = ensureDate(dateRange.from)
  const toDate = ensureDate(dateRange.to)

  const days = eachDayOfInterval({ start: fromDate, end: toDate })
  const totalDays = days.length

  const cityClusters = {
    Beijing: ["Beijing"],
    Shanghai: ["Shanghai", "Suzhou", "Hangzhou"],
    "Xi'an": ["Xi'an"],
    Chengdu: ["Chengdu"],
    Guilin: ["Guilin"],
    Suzhou: ["Suzhou", "Hangzhou", "Shanghai"],
    Hangzhou: ["Hangzhou", "Suzhou", "Shanghai"],
    Nanjing: ["Nanjing", "Suzhou", "Hangzhou"],
    Wuzhen: ["Wuzhen", "Hangzhou", "Suzhou"],
    Guangzhou: ["Guangzhou", "Hong Kong", "Macau"],
    "Hong Kong": ["Hong Kong", "Macau", "Guangzhou"],
    Macau: ["Macau", "Hong Kong", "Guangzhou"],
  }

  let citySchedule: string[] = []

  if (totalDays <= 2) {
    citySchedule = Array(totalDays).fill(startLocation)
  } else if (totalDays <= 4) {
    const daysInStart = Math.ceil(totalDays / 2)
    const nearbyCity = cityClusters[startLocation as keyof typeof cityClusters]?.[1] || startLocation
    citySchedule = [...Array(daysInStart).fill(startLocation), ...Array(totalDays - daysInStart).fill(nearbyCity)]
  } else {
    const cluster = cityClusters[startLocation as keyof typeof cityClusters] || [startLocation]

    if (cluster.length === 1) {
      citySchedule = Array(totalDays).fill(cluster[0])
    } else {
      const daysPerCity = Math.floor(totalDays / cluster.length)
      const extraDays = totalDays % cluster.length

      citySchedule = []
      cluster.forEach((city, index) => {
        const daysInThisCity = daysPerCity + (index < extraDays ? 1 : 0)
        citySchedule.push(...Array(daysInThisCity).fill(city))
      })
    }
  }

  console.log("[v0] City schedule for", totalDays, "days:", citySchedule)

  const itinerary: ItineraryDay[] = []
  const globalUsedAttractionIds = new Set<string>()
  const globalUsedMealIds = new Set<string>()

  days.forEach((day, dayIdx) => {
    const currentCity = citySchedule[dayIdx]

    const cityAttractions = attractionsData.filter((a) => a.city === currentCity)

    if (cityAttractions.length === 0) {
      console.log("[v0] Warning: No attractions found for", currentCity)
      itinerary.push({
        date: format(day, "yyyy-MM-dd"),
        attractions: [],
        meals: [],
      })
      return
    }

    const sortedAttractions = sortAttractionsByScheme(cityAttractions, scheme)
    const availableAttractions = sortedAttractions.filter((a) => !globalUsedAttractionIds.has(a.id))

    const dailyAttractions: Attraction[] = []
    let totalHours = 0
    const maxHours = 8

    for (const attraction of availableAttractions) {
      if (totalHours + attraction.duration <= maxHours && dailyAttractions.length < 3) {
        dailyAttractions.push(attraction)
        globalUsedAttractionIds.add(attraction.id)
        totalHours += attraction.duration
      }
      if (dailyAttractions.length >= 3) break
    }

    if (dailyAttractions.length === 0) {
      console.log("[v0] Warning: All new attractions in", currentCity, "used. Using fallback rotation.")
      const fallbackIndex = dayIdx % sortedAttractions.length
      dailyAttractions.push(sortedAttractions[fallbackIndex])
    }

    const cityMeals = mealsData.filter((m) => m.city === currentCity)
    const availableMeals = cityMeals.filter((m) => !globalUsedMealIds.has(m.id))

    const dailyMeals: Meal[] = []

    if (availableMeals.length >= 2) {
      const shuffledMeals = [...availableMeals].sort(() => Math.random() - 0.5)
      const lunch = shuffledMeals[0]
      const dinner = shuffledMeals[1]
      dailyMeals.push(lunch, dinner)
      globalUsedMealIds.add(lunch.id)
      globalUsedMealIds.add(dinner.id)
    } else if (availableMeals.length === 1) {
      dailyMeals.push(availableMeals[0])
      globalUsedMealIds.add(availableMeals[0].id)
    } else if (cityMeals.length > 0) {
      console.log("[v0] Warning: All new meals in", currentCity, "used. Using fallback rotation.")
      const mealIndex1 = (dayIdx * 2) % cityMeals.length
      const mealIndex2 = (dayIdx * 2 + 1) % cityMeals.length
      dailyMeals.push(cityMeals[mealIndex1])
      if (mealIndex1 !== mealIndex2) {
        dailyMeals.push(cityMeals[mealIndex2])
      }
    }

    itinerary.push({
      date: format(day, "yyyy-MM-dd"),
      attractions: dailyAttractions,
      meals: dailyMeals,
    })

    console.log("[v0] Day", dayIdx + 1, "in", currentCity, ":", dailyAttractions.length, "attractions")
  })

  console.log("[v0] Total unique attractions used:", globalUsedAttractionIds.size)
  console.log("[v0] Total unique meals used:", globalUsedMealIds.size)

  return itinerary
}

function sortAttractionsByScheme(attractions: Attraction[], scheme: RouteScheme): Attraction[] {
  const sorted = [...attractions]

  switch (scheme) {
    case "time":
      return sorted.sort((a, b) => a.duration - b.duration)

    case "experience":
      return sorted.sort((a, b) => {
        const scoreA = a.cost + a.duration * 20
        const scoreB = b.cost + b.duration * 20
        return scoreB - scoreA
      })

    case "value":
      return sorted.sort((a, b) => {
        const valueA = a.duration / (a.cost || 1)
        const valueB = b.duration / (b.cost || 1)
        return valueB - valueA
      })

    case "lowCarbon":
      return sorted.sort((a, b) => a.carbonFootprint - b.carbonFootprint)

    default:
      return sorted
  }
}

export function calculateRouteTotals(itinerary: ItineraryDay[], scheme: RouteScheme) {
  const totalCost = itinerary.reduce(
    (sum, day) => sum + day.attractions.reduce((s, a) => s + a.cost, 0) + day.meals.reduce((s, m) => s + m.cost, 0),
    0,
  )

  const baseCarbonFromAttractions = itinerary.reduce(
    (sum, day) => sum + day.attractions.reduce((s, a) => s + a.carbonFootprint, 0),
    0,
  )

  const baseCarbonFromMeals = itinerary.reduce(
    (sum, day) => sum + day.meals.reduce((s, m) => s + m.carbonFootprint, 0),
    0,
  )

  const baseCarbon = baseCarbonFromAttractions + baseCarbonFromMeals
  let totalCarbon = baseCarbon

  const numDays = itinerary.length

  switch (scheme) {
    case "time":
      totalCarbon = baseCarbon * 1.8 + numDays * 80
      break

    case "experience":
      totalCarbon = baseCarbon * 1.5 + numDays * 50
      break

    case "value":
      totalCarbon = baseCarbon * 1.2 + numDays * 25
      break

    case "lowCarbon":
      totalCarbon = baseCarbon * 0.8 + numDays * 12
      break

    default:
      totalCarbon = baseCarbon * 1.3 + numDays * 30
  }

  return { totalCost, totalCarbon: Math.round(totalCarbon) }
}
