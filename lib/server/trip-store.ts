import fs from "fs"
import path from "path"

export type TripRecord = {
  id: string
  name: string
  startDate: string
  endDate: string
  carbonFootprint: number
  breakdown: {
    flights: number
    trains: number
    accommodation: number
    activities: number
  }
}

const dataDir = path.join(process.cwd(), "data")
const tripsFile = path.join(dataDir, "trips.json")

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(tripsFile)) fs.writeFileSync(tripsFile, JSON.stringify([], null, 2))
}

export function readTrips(): TripRecord[] {
  ensure()
  const raw = fs.readFileSync(tripsFile, "utf8")
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function writeTrips(trips: TripRecord[]) {
  ensure()
  fs.writeFileSync(tripsFile, JSON.stringify(trips, null, 2))
}

