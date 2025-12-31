import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { auth } from "@/auth";

export type DateRange = "today" | "week" | "month" | "custom";

interface AnalyticsFilters {
  dateRange?: DateRange;
  startDate?: Date;
  endDate?: Date;
  meterId?: string;
  userId?: string;
}

export async function getReadingsAnalytics(filters: AnalyticsFilters = {}) {
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

  const where = {
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
  const readingsByDay = await prisma.meterReading.groupBy({
    by: ["recordedAt"],
    where,
    _count: true,
    orderBy: { recordedAt: "asc" },
  });

  // Readings by meter
  const readingsByMeter = await prisma.meterReading.groupBy({
    by: ["meterId"],
    where,
    _count: true,
    _avg: { readingValue: true },
    _sum: { readingValue: true },
  });

  const metersWithDetails = await Promise.all(
    readingsByMeter.map(async (r) => {
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
  const readingsByUser = await prisma.meterReading.groupBy({
    by: ["userId"],
    where,
    _count: true,
  });

  const usersWithDetails = await Promise.all(
    readingsByUser.map(async (r) => {
      const user = await prisma.user.findUnique({
        where: { id: r.userId },
        select: { name: true, email: true },
      });
      return {
        userId: r.userId,
        userName: user?.name,
        userEmail: user?.email,
        readingsCount: r._count,
      };
    })
  );

  return {
    totalReadings,
    dateRange: { from, to },
    readingsByDay: readingsByDay.map((r) => ({
      date: r.recordedAt,
      count: r._count,
    })),
    readingsByMeter: metersWithDetails,
    readerPerformance: usersWithDetails,
  };
}

export async function getMeterAnalytics(meterId: string) {
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
  const readingsWithDelta = readings.map((reading, idx) => {
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
