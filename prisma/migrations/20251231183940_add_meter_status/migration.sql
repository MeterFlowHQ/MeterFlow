-- CreateEnum
CREATE TYPE "MeterStatus" AS ENUM ('ENABLED', 'DISABLED', 'NOT_WORKING');

-- AlterTable
ALTER TABLE "Meter" ADD COLUMN     "status" "MeterStatus" NOT NULL DEFAULT 'ENABLED';
