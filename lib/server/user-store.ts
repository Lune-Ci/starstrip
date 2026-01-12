import fs from "fs";
import path from "path";
import crypto from "crypto";

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

// In-memory fallback for read-only environments (like Vercel)
let memoryUsers: StoredUser[] = [];

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");

function isReadOnlyError(err: any) {
  return err && (err.code === "EROFS" || err.code === "EACCES" || err.code === "ENOENT");
}

function ensureDataFile() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(usersFile))
      fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  } catch (err) {
    // If we can't write to disk, we just use memory
    console.warn("[WARN] File system is read-only. Using in-memory storage.");
  }
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(usersFile)) return memoryUsers;
    const raw = fs.readFileSync(usersFile, "utf8");
    try {
      const diskUsers = JSON.parse(raw);
      // Merge disk users with memory users (memory users take precedence for recent writes)
      // This is a simple strategy for MVP; in production, use a DB.
      const userMap = new Map<string, StoredUser>();
      diskUsers.forEach((u: StoredUser) => userMap.set(u.id, u));
      memoryUsers.forEach((u: StoredUser) => userMap.set(u.id, u));
      return Array.from(userMap.values());
    } catch {
      return memoryUsers;
    }
  } catch (err) {
    if (isReadOnlyError(err)) {
       return memoryUsers;
    }
    // Fallback to memoryUsers if file read fails for other reasons
    return memoryUsers;
  }
}

function writeUsers(users: StoredUser[]) {
  // Always update memory first
  memoryUsers = [...users];
  
  try {
    ensureDataFile();
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    if (isReadOnlyError(err)) {
      console.warn("[WARN] Could not write users to disk (Read-Only FS). User registered in memory only.");
      return;
    }
    console.error("[ERROR] Failed to write users file:", err);
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, password: string): StoredUser {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const id = `usr_${crypto.randomBytes(8).toString("hex")}`;
  const user: StoredUser = {
    id,
    email,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

export function verifyPassword(password: string, user: StoredUser): boolean {
  const hash = crypto.scryptSync(password, user.salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.passwordHash, "hex")
  );
}

export type { StoredUser };
