import { Role } from "@prisma/client";

export function canAccessAdmin(role: Role | undefined): boolean {
  return role === "ADMIN";
}

export function canAccessReader(role: Role | undefined): boolean {
  return role === "READER" || role === "ADMIN";
}
