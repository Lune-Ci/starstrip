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

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile))
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}

function readUsers(): StoredUser[] {
  ensureDataFile();
  const raw = fs.readFileSync(usersFile, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  ensureDataFile();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
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
