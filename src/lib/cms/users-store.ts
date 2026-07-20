import fs from "fs";
import path from "path";
import { hashPassword } from "@/lib/cms/password";
import type { CmsSectionId, CmsUser } from "@/lib/cms/permissions";

const ROOT = process.cwd();
const USERS_PATH = path.join(ROOT, "content", "cms", "users.json");

function ensureDir() {
  fs.mkdirSync(path.dirname(USERS_PATH), { recursive: true });
}

function seedAdmin(): CmsUser[] {
  const now = new Date().toISOString();
  const password =
    process.env.CMS_ADMIN_PASSWORD?.trim() || "AdminMolina2026";
  return [
    {
      id: "admin-1",
      username: "admin",
      displayName: "Administrador",
      email: "admin@munimolina.gob.pe",
      role: "admin",
      sections: [],
      passwordHash: hashPassword(password),
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function readUsers(): CmsUser[] {
  ensureDir();
  if (!fs.existsSync(USERS_PATH)) {
    const seeded = seedAdmin();
    fs.writeFileSync(USERS_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
  try {
    const raw = fs.readFileSync(USERS_PATH, "utf8");
    const parsed = JSON.parse(raw) as CmsUser[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = seedAdmin();
      fs.writeFileSync(USERS_PATH, JSON.stringify(seeded, null, 2), "utf8");
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = seedAdmin();
    fs.writeFileSync(USERS_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

export function writeUsers(users: CmsUser[]) {
  ensureDir();
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), "utf8");
}

export function findUserByUsername(username: string): CmsUser | undefined {
  return readUsers().find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

export function publicUser(user: CmsUser) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export function upsertUser(input: {
  id?: string;
  username: string;
  displayName: string;
  email: string;
  role: "admin" | "editor";
  sections: CmsSectionId[];
  password?: string;
  active?: boolean;
}): CmsUser {
  const users = readUsers();
  const now = new Date().toISOString();
  const existing = input.id
    ? users.find((u) => u.id === input.id)
    : users.find(
        (u) => u.username.toLowerCase() === input.username.toLowerCase(),
      );

  if (existing) {
    existing.displayName = input.displayName;
    existing.email = input.email;
    existing.role = input.role;
    existing.sections = input.role === "admin" ? [] : input.sections;
    existing.active = input.active ?? existing.active;
    existing.updatedAt = now;
    if (input.password?.trim()) {
      existing.passwordHash = hashPassword(input.password.trim());
    }
    writeUsers(users);
    return existing;
  }

  if (!input.password?.trim()) {
    throw new Error("La contraseña es obligatoria para usuarios nuevos");
  }

  const created: CmsUser = {
    id: `user-${Date.now()}`,
    username: input.username.trim().toLowerCase(),
    displayName: input.displayName.trim(),
    email: input.email.trim(),
    role: input.role,
    sections: input.role === "admin" ? [] : input.sections,
    passwordHash: hashPassword(input.password.trim()),
    active: input.active ?? true,
    createdAt: now,
    updatedAt: now,
  };
  users.push(created);
  writeUsers(users);
  return created;
}

export function deleteUser(id: string) {
  const users = readUsers();
  if (users.length <= 1) {
    throw new Error("Debe existir al menos un usuario");
  }
  const next = users.filter((user) => user.id !== id);
  if (next.length === users.length) {
    throw new Error("Usuario no encontrado");
  }
  if (!next.some((user) => user.role === "admin" && user.active)) {
    throw new Error("Debe quedar al menos un administrador activo");
  }
  writeUsers(next);
}
