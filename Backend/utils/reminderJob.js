import cron from "node-cron";
import Appointment from "../models/appointmentModel.js";
import { sendEmail } from "./sendEmail.js";
import { sendSMS } from "./sendSMS.js";

// Exported function that starts the cron job
export const startReminderJob = () => {
  // 🧪 Runs every minute for testing
  cron.schedule("* * * * *", async () => {
    console.log("🕒 Running 2-hour reminder job...");

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    try {
      const appointments = await Appointment.find().populate(
        "patient doctor",
        "name email phone"
      );

      for (const appt of appointments) {
        const appointmentDateTime = new Date(`${appt.date}T${appt.time}`);

        // Check if appointment is about 2 hours from now (±5 minutes)
        const diff = appointmentDateTime - now;
        const diffInMinutes = diff / (1000 * 60);

        if (diffInMinutes > 115 && diffInMinutes <= 125) {
          const message = `Reminder: You have an appointment with Dr. ${appt.doctor.name} on ${appt.date} at ${appt.time}.`;

          // Send email reminder
          if (appt.patient?.email) {
            await sendEmail(appt.patient.email, "Appointment Reminder", message);
          }

          // Send SMS reminder
          if (appt.patient?.phone) {
            await sendSMS(appt.patient.phone, message);
          }

          console.log(`✅ Reminder sent to ${appt.patient?.name || "Unknown"}`);
        }
      }

      console.log("✅ 2-hour reminder job completed.");
    } catch (error) {
      console.error("❌ Error running reminder job:", error.message);
    }
  });
};
