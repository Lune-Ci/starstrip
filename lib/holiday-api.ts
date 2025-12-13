export interface PublicHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  counties: string[] | null
  launchYear: number | null
  types: string[]
}

export async function getPublicHolidays(countryCode: string, year: number): Promise<PublicHoliday[]> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)

    if (!response.ok) {
      console.error("Failed to fetch holidays:", response.statusText)
      return []
    }

    const holidays = await response.json()
    return holidays
  } catch (error) {
    console.error("Error fetching holidays:", error)
    return []
  }
}

export function isHoliday(date: Date, holidays: PublicHoliday[]): boolean {
  const dateStr = date.toISOString().split("T")[0]
  return holidays.some((holiday) => holiday.date === dateStr)
}

export function getHolidayInfo(date: Date, holidays: PublicHoliday[]): PublicHoliday | null {
  const dateStr = date.toISOString().split("T")[0]
  return holidays.find((holiday) => holiday.date === dateStr) || null
}

// Map user nationality codes to Nager.Date country codes
export const nationalityToCountryCode: Record<string, string> = {
  US: "US",
  GB: "GB",
  DE: "DE",
  FR: "FR",
  JP: "JP",
  KR: "KR",
  AU: "AU",
  CA: "CA",
  ES: "ES",
  IT: "IT",
}
