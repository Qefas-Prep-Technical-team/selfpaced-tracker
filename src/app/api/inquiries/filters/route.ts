import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET() {
  try {
    await dbConnect();

    const [classes, channels] = await Promise.all([
      Inquiry.distinct("childClass"),
      Inquiry.distinct("channelName"),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        classes: classes.filter(Boolean).sort(),
        channels: channels.filter(Boolean).sort(),
      },
    });
  } catch (error) {
    console.error("GET Inquiry Filters Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
