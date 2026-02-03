import Activity from "@/models/Activity";
import dbConnect from "./mongodb";

// lib/activityLogger.ts
export async function logDeletion(
  label: string,
  itemName: string,
  adminEmail: string, // Change this from adminName to adminEmail
  channel: string = "System",
) {
  try {
    await dbConnect();
    await Activity.create({
      event: `${label} Deleted`,
      user: itemName, // The thing that was deleted
      adminEmail: adminEmail, // Store the email specifically
      channelName: channel,
      status: "deleted",
    });
  } catch (error) {
    console.error("Logging Error:", error);
  }
}
