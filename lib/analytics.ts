import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export type DateRange = "today" | "week" | "month" | "custom";

interface AnalyticsFilters {
  dateRange?: DateRange;
  startDate?: Date;
  endDate?: Date;
  meterId?: string;
  userId?: string;
}

interface ReadingByDay {
  date: Date;
  count: number;
}

interface ReadingByMeter {
  meterId: string;
  meterCode?: string;
  location?: string;
  count: number;
  avgReading?: Prisma.Decimal | null;
  totalReading?: Prisma.Decimal | null;
}

interface ReaderPerformance {
  userId: string;
  userName?: string;
  userEmail?: string;
  readingsCount: number;
}

interface AnalyticsResult {
  totalReadings: number;
  dateRange: { from: Date; to: Date };
  readingsByDay: ReadingByDay[];
  readingsByMeter: ReadingByMeter[];
  readerPerformance: ReaderPerformance[];
}

export async function getReadingsAnalytics(filters: AnalyticsFilters = {}): Promise<AnalyticsResult> {
  const { dateRange = "month", startDate, endDate, meterId, userId } = filters;

  // Calculate date boundaries
  const now = new Date();
  let from: Date;
  let to: Date;

  if (dateRange === "custom" && startDate && endDate) {
    from = startOfDay(startDate);
    to = endOfDay(endDate);
  } else if (dateRange === "today") {
    from = startOfDay(now);
    to = endOfDay(now);
  } else if (dateRange === "week") {
    from = startOfWeek(now);
    to = endOfWeek(now);
  } else {
    from = startOfMonth(now);
    to = endOfMonth(now);
  }

  const where: Prisma.MeterReadingWhereInput = {
    recordedAt: {
      gte: from,
      lte: to,
    },
    ...(meterId && { meterId }),
    ...(userId && { userId }),
  };

  // Total readings count
  const totalReadings = await prisma.meterReading.count({ where });

  // Readings by day
  const readingsByDayRaw = await prisma.meterReading.groupBy({
    by: ["recordedAt"],
    where,
    _count: true,
    orderBy: { recordedAt: "asc" },
  });

  // Readings by meter
  const readingsByMeterRaw = await prisma.meterReading.groupBy({
    by: ["meterId"],
    where,
    _count: true,
    _avg: { readingValue: true },
    _sum: { readingValue: true },
  });

  const metersWithDetails: ReadingByMeter[] = await Promise.all(
    readingsByMeterRaw.map(async (r) => {
      const meter = await prisma.meter.findUnique({
        where: { id: r.meterId },
        select: { meterCode: true, location: true },
      });
      return {
        meterId: r.meterId,
        meterCode: meter?.meterCode,
        location: meter?.location,
        count: r._count,
        avgReading: r._avg.readingValue,
        totalReading: r._sum.readingValue,
      };
    })
  );

  // Readings by user (reader performance)
  const readingsByUserRaw = await prisma.meterReading.groupBy({
    by: ["userId"],
    where,
    _count: true,
  });

  const usersWithDetails: ReaderPerformance[] = await Promise.all(
    readingsByUserRaw.map(async (r) => {
      const user = await prisma.user.findUnique({
        where: { id: r.userId },
        select: { name: true, email: true },
      });
      return {
        userId: r.userId,
        userName: user?.name ?? undefined,
        userEmail: user?.email ?? undefined,
        readingsCount: r._count,
      };
    })
  );

  return {
    totalReadings,
    dateRange: { from, to },
    readingsByDay: readingsByDayRaw.map((r): ReadingByDay => ({
      date: r.recordedAt,
      count: r._count,
    })),
    readingsByMeter: metersWithDetails,
    readerPerformance: usersWithDetails,
  };
}

interface ReadingWithDelta {
  id: string;
  value: number;
  recordedAt: Date;
  recordedBy: string | null;
  delta: number;
  dailyAverage: number;
}

interface MeterAnalyticsResult {
  meter: Prisma.MeterGetPayload<{
    include: {
      assignedUser: {
        select: { id: true; name: true; email: true };
      };
    };
  }>;
  readings: ReadingWithDelta[];
  stats: {
    totalReadings: number;
    totalConsumption: number;
    avgDailyConsumption: number;
    latestReading?: Prisma.Decimal;
  };
}

export async function getMeterAnalytics(meterId: string): Promise<MeterAnalyticsResult | null> {
  const session = await auth();
  
  const meter = await prisma.meter.findUnique({
    where: { id: meterId },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!meter) return null;

  // If user is not admin and meter is not enabled, deny access
  if (session?.user?.role !== "ADMIN" && meter.status !== "ENABLED") {
    return null;
  }

  // If user is a reader, they can only access their assigned meters
  if (session?.user?.role === "READER" && meter.assignedUserId !== session.user.id) {
    return null;
  }

  const readings = await prisma.meterReading.findMany({
    where: { meterId },
    orderBy: { recordedAt: "asc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  // Calculate deltas and stats
  const readingsWithDelta: ReadingWithDelta[] = readings.map((reading, idx) => {
    const prevReading = idx > 0 ? readings[idx - 1] : null;
    const delta = prevReading
      ? Number(reading.readingValue) - Number(prevReading.readingValue)
      : 0;
    const daysDiff = prevReading
      ? (reading.recordedAt.getTime() - prevReading.recordedAt.getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    const dailyAvg = daysDiff > 0 ? delta / daysDiff : 0;

    return {
      id: reading.id,
      value: Number(reading.readingValue),
      recordedAt: reading.recordedAt,
      recordedBy: reading.user.name,
      delta,
      dailyAverage: dailyAvg,
    };
  });

  const totalConsumption = readingsWithDelta.reduce((sum, r) => sum + r.delta, 0);
  const avgDailyConsumption =
    readingsWithDelta.length > 1
      ? totalConsumption / readingsWithDelta.filter((r) => r.delta > 0).length
      : 0;

  return {
    meter,
    readings: readingsWithDelta,
    stats: {
      totalReadings: readings.length,
      totalConsumption,
      avgDailyConsumption,
      latestReading: readings[readings.length - 1]?.readingValue,
    },
  };
}
