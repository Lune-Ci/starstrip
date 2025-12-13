import { NextResponse } from "next/server"
import { readTrips, writeTrips } from "@/lib/server/trip-store"

export async function GET() {
  try {
    const trips = readTrips()
    return NextResponse.json(trips)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }
    const trips = readTrips()
    trips.push(body as any)
    writeTrips(trips)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

