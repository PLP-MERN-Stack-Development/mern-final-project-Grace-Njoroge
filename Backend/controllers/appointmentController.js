import Appointment from "../models/appointmentModel.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc Get all appointments
// @route GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch only appointments for this patient
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("patient doctor", "name email");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get appointment by ID
// @route GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("patient doctor", "name email");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new appointment
// @route POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    // Require authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "You must be logged in to create an appointment" });
    }

    const { doctor, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      patient: req.user.id, // use ObjectId of logged-in user
      doctor,
      date,
      time,
      reason,
    });

    if (req.user?.email) {
      await sendEmail(
        req.user.email,
        "Appointment Confirmation - MediReach",
        `Your appointment with ${doctor} is booked for ${date} at ${time}.`
      );
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update appointment
// @route PUT /api/appointments/:id
export const updateAppointment = async (req, res) => {
  try {
    const { date, time, reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;

    const updated = await appointment.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete appointment
// @route DELETE /api/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    await appointment.deleteOne();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
