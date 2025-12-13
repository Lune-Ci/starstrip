import { NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/server/user-store"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  if (process.env.ENABLE_ADMIN_API !== "true") {
    return NextResponse.json({ error: "Admin API disabled" }, { status: 403 })
  }
  try {
    const file = join(process.cwd(), "data", "users.json")
    const raw = readFileSync(file, "utf8")
    const users = JSON.parse(raw || "[]") as Array<{ id: string; email: string; createdAt: string }>
    const sanitized = users.map((u) => ({ id: u.id, email: u.email, createdAt: u.createdAt }))
    return NextResponse.json(sanitized)
  } catch {
    return NextResponse.json([])
  }
}

