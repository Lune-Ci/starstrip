// Server-side utility to dynamically generate Apple OAuth clientSecret (JWT)
import jwt from "jsonwebtoken"

function normalizeKey(key: string): string {
  // Support env with escaped newlines
  return key.replace(/\\n/g, "\n")
}

export async function getAppleClientSecret(): Promise<string> {
  const teamId = process.env.APPLE_TEAM_ID
  const keyId = process.env.APPLE_KEY_ID
  const clientId = process.env.APPLE_CLIENT_ID
  const privateKey = process.env.APPLE_PRIVATE_KEY

  if (!teamId || !keyId || !clientId || !privateKey) {
    throw new Error("Missing Apple OAuth env: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_CLIENT_ID, APPLE_PRIVATE_KEY")
  }

  const pkcs8 = normalizeKey(privateKey)
  const token = jwt.sign({}, pkcs8, {
    algorithm: "ES256",
    keyid: keyId,
    audience: "https://appleid.apple.com",
    issuer: teamId,
    subject: clientId,
    expiresIn: "180d",
  })

  return token
}