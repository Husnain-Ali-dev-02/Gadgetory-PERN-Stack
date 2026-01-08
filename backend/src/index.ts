import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();
const PORT = ENV.PORT ?? 8000;

console.log("🔥 ENV CHECK:", {
  DATABASE_URL: !!ENV.DATABASE_URL,
  CLERK_SECRET_KEY: !!ENV.CLERK_SECRET_KEY,
  NODE_ENV: ENV.NODE_ENV,
  FRONTEND_URL: ENV.FRONTEND_URL,
});

// Trust proxy if behind load balancer
app.set("trust proxy", 1);

// CORS for frontend
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

// Clerk middleware
app.use(clerkMiddleware());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists (async-safe)
const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadsDir, { recursive: true })
  .then(() => console.log("Uploads folder ready"))
  .catch((err) => console.warn("Uploads folder creation failed:", err));

// Serve uploads
app.use("/uploads", express.static(uploadsDir));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message:
      "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const frontendDist = path.join(__dirname, "../frontend/dist");

  // Serve static files
  app.use(express.static(frontendDist));

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
});
