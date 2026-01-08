import { Role } from "@prisma/client";
import { ROLES } from "./constants";

export function canAccessAdmin(role: Role | undefined): boolean {
  return role === ROLES.ADMIN;
}

export function canAccessReader(role: Role | undefined): boolean {
  return role === ROLES.READER || role === ROLES.ADMIN;
}
