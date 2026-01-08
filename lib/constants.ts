/**
 * Application-wide constants
 * These should match the Prisma schema enums
 */

export const ROLES = {
  ADMIN: "ADMIN",
  READER: "READER",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const METER_STATUS = {
  ENABLED: "ENABLED",
  DISABLED: "DISABLED",
  NOT_WORKING: "NOT_WORKING",
} as const;

export type MeterStatus = typeof METER_STATUS[keyof typeof METER_STATUS];

export const READING_TYPE = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
} as const;

export type ReadingType = typeof READING_TYPE[keyof typeof READING_TYPE];
