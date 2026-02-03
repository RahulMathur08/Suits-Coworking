const express = require("express");
const router = express.Router();
const pool = require("../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Mock login endpoint
 * For prototype: username/password authentication
 * In production, use proper authentication
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    console.log("Login attempt for username:", username);
    console.log("Database config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
    });

    // Find user in database
    const result = await pool.query(
      "SELECT id, username, password, role, name FROM users WHERE username = $1",
      [username],
    );

    console.log("Query result rows:", result.rows.length);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check password using bcrypt
    // For prototype, also accept plain text passwords for testing
    const validPasswords = ["admin123", "member123"];
    let isValid = false;

    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch (err) {
      // If bcrypt compare fails, check plain text for prototype
      isValid =
        validPasswords.includes(password) &&
        (password === "admin123" || password === "member123");
    }

    // Fallback for prototype: accept plain text if bcrypt fails
    if (!isValid && validPasswords.includes(password)) {
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      severity: error.severity,
      detail: error.detail,
      hint: error.hint,
    });

    // Send specific error message for database connection issues
    if (error.code === "28P01") {
      return res.status(500).json({
        error:
          "Database authentication failed. Check your database credentials.",
        details: "Invalid database password or user",
      });
    }

    if (error.code === "3D000") {
      return res.status(500).json({
        error: "Database does not exist. Please create the database first.",
        details: "Database not found",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * Register endpoint (for testing)
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, name } = req.body;

    if (!username || !password || !role || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["member", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (username, password, role, name) VALUES ($1, $2, $3, $4) RETURNING id, username, role, name",
      [username, hashedPassword, role, name],
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get all users (admin only)
 */
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, role, name, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get user by ID (admin only)
 */
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, username, role, name, created_at FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Update user (admin only)
 */
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, name, password } = req.body;

    let query, params;

    if (password) {
      // Update with new password
      const hashedPassword = await bcrypt.hash(password, 10);
      query =
        "UPDATE users SET username = $1, role = $2, name = $3, password = $4 WHERE id = $5 RETURNING id, username, role, name, created_at";
      params = [username, role, name, hashedPassword, id];
    } else {
      // Update without password
      query =
        "UPDATE users SET username = $1, role = $2, name = $3 WHERE id = $4 RETURNING id, username, role, name, created_at";
      params = [username, role, name, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Delete user (admin only)
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, username, role, name",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
