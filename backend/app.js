import cors from "cors";
import express from "express";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);

export default app;
