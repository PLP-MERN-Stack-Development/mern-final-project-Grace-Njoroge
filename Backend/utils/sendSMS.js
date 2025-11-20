import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: "Hello from MediReach! " + message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,  // recipient phone number (e.g. +2547XXXXXXXX)
    });
    console.log(`✅ SMS sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
  }
};
