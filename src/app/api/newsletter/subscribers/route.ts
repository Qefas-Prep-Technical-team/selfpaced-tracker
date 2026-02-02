import { NextResponse } from "next/server";
// Ensure you have a db connection utility
import Newsletter from "@/models/Newsletter"; // Path to the schema you shared
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all subscribers from the collection
    const subscribers = await Newsletter.find({}).lean();

    // Map the data to a clean format for the frontend
    const formattedSubscribers = subscribers.map((s: any) => ({
      email: s.email,
      status: s.status,
      subscribedAt: s.subscribedAt,
    }));

    return NextResponse.json(formattedSubscribers);
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );
  }
}
