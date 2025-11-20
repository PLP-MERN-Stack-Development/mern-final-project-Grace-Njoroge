import express from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js"; // <--- import protect middleware

const router = express.Router();

// Protect the POST route for creating appointments
router.route("/").get(protect, getAppointments).post(protect, createAppointment);

// Optionally, protect update/delete if needed
router.route("/:id")
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

export default router;