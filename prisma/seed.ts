import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { config as loadEnv } from "dotenv";
import { ROLES } from "../lib/constants";

// Load environment variables
loadEnv();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminEmail = "admin@meterflow.com";
  const adminPassword = "admin123"; // Change this to a secure password

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: adminEmail,
      passwordHash,
      role: ROLES.ADMIN,
    },
  });

  console.log("✓ Admin user created successfully!");
  console.log(`  Email: ${admin.email}`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`  Role: ${admin.role}`);
  console.log("\n⚠️  Please change the admin password after first login!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
