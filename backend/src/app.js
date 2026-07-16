const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running..."
  });
});

// Database Test Route
app.get("/api/test-db", async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();

    res.json({
      success: true,
      message: "Database connected successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = app;