import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { startReminderJob } from "./utils/reminderJob.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("MediReach API is running...");
});

// ✅ Start scheduled tasks (for reminders)
startReminderJob();

// ✅ Error handlers (last middlewares)
app.use(notFound);
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
