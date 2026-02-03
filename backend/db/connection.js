const { Pool } = require("pg");

// Direct database connection - bypassing environment variable issues
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "CoWorking",
  user: "postgres",
  password: "Rahul@0851", // Try without quotes
});

console.log("Database connection configured with:");
console.log("Host: localhost");
console.log("Port: 5432");
console.log("Database: CoWorking");
console.log("User: postgres");
console.log("Password: ***SET***");

// Test connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
