/**
 * Temporary database setup script with configurable password
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Get password from command line argument or environment
const dbPassword = process.argv[2] || process.env.DB_PASSWORD || "postgres";

// Remove quotes if present
const cleanPassword = dbPassword.replace(/^["']|["']$/g, "");

console.log("Setting up database...");
console.log(`Using password: ${cleanPassword}`);

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "CoWorking",
  user: process.env.DB_USER || "postgres",
  password: cleanPassword,
});

async function setupDatabase() {
  try {
    console.log("Creating tables...");

    // Read and execute schema
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schemaSQL);
    console.log("✓ Tables created successfully");

    // Read and execute seed data
    const seedPath = path.join(__dirname, "seed.sql");
    const seedSQL = fs.readFileSync(seedPath, "utf8");

    console.log("Seeding initial data...");
    await pool.query(seedSQL);
    console.log("✓ Seed data inserted successfully");

    console.log("\n✅ Database setup completed!");
    console.log("\nTest credentials:");
    console.log("Admin: username=admin, password=admin123");
    console.log("Member: username=member1, password=member123");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
