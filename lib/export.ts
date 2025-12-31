import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

interface ExportFilters {
  startDate?: Date;
  endDate?: Date;
  meterId?: string;
  userId?: string;
}

export async function generateReadingsExport(filters: ExportFilters = {}) {
  const { startDate, endDate, meterId, userId } = filters;

  const where = {
    ...(startDate && endDate && {
      recordedAt: {
        gte: startDate,
        lte: endDate,
      },
    }),
    ...(meterId && { meterId }),
    ...(userId && { userId }),
  };

  const readings = await prisma.meterReading.findMany({
    where,
    orderBy: { recordedAt: "desc" },
    include: {
      meter: {
        select: { meterCode: true, location: true },
      },
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Meter Readings");

  // Define columns
  worksheet.columns = [
    { header: "Reading ID", key: "id", width: 36 },
    { header: "Meter Code", key: "meterCode", width: 15 },
    { header: "Location", key: "location", width: 30 },
    { header: "Reading Value", key: "value", width: 15 },
    { header: "Recorded At", key: "recordedAt", width: 20 },
    { header: "Recorded By", key: "recordedBy", width: 25 },
    { header: "Reader Email", key: "readerEmail", width: 30 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF059669" }, // emerald-600
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  // Add data rows
  readings.forEach((reading) => {
    worksheet.addRow({
      id: reading.id,
      meterCode: reading.meter.meterCode,
      location: reading.meter.location,
      value: Number(reading.readingValue),
      recordedAt: reading.recordedAt.toISOString(),
      recordedBy: reading.user.name,
      readerEmail: reading.user.email,
    });
  });

  // Format number columns
  worksheet.getColumn("value").numFmt = "#,##0.00";

  // Auto-filter
  worksheet.autoFilter = {
    from: "A1",
    to: "G1",
  };

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export async function generateMeterExport(meterId: string) {
  const meter = await prisma.meter.findUnique({
    where: { id: meterId },
    include: {
      assignedUser: {
        select: { name: true, email: true },
      },
      readings: {
        orderBy: { recordedAt: "asc" },
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!meter) throw new Error("Meter not found");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(meter.meterCode);

  // Meter info section
  worksheet.mergeCells("A1:B1");
  worksheet.getCell("A1").value = "Meter Information";
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  worksheet.getCell("A2").value = "Meter Code:";
  worksheet.getCell("B2").value = meter.meterCode;
  worksheet.getCell("A3").value = "Location:";
  worksheet.getCell("B3").value = meter.location;
  worksheet.getCell("A4").value = "Assigned To:";
  worksheet.getCell("B4").value = meter.assignedUser?.name || "Unassigned";

  // Readings table
  worksheet.getCell("A6").value = "Readings History";
  worksheet.getCell("A6").font = { bold: true, size: 12 };

  worksheet.getCell("A7").value = "Date";
  worksheet.getCell("B7").value = "Reading Value";
  worksheet.getCell("C7").value = "Delta";
  worksheet.getCell("D7").value = "Recorded By";

  worksheet.getRow(7).font = { bold: true };
  worksheet.getRow(7).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD1FAE5" }, // emerald-100
  };

  let rowIndex = 8;
  let prevValue = 0;

  meter.readings.forEach((reading) => {
    const value = Number(reading.readingValue);
    const delta = prevValue > 0 ? value - prevValue : 0;

    worksheet.getCell(`A${rowIndex}`).value = reading.recordedAt;
    worksheet.getCell(`B${rowIndex}`).value = value;
    worksheet.getCell(`C${rowIndex}`).value = delta;
    worksheet.getCell(`D${rowIndex}`).value = reading.user.name;

    prevValue = value;
    rowIndex++;
  });

  worksheet.getColumn("A").width = 20;
  worksheet.getColumn("B").width = 15;
  worksheet.getColumn("C").width = 15;
  worksheet.getColumn("D").width = 25;

  worksheet.getColumn("B").numFmt = "#,##0.00";
  worksheet.getColumn("C").numFmt = "#,##0.00";

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
