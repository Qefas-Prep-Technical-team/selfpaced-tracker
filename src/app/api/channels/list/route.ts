import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Channel } from "@/models/Channel";


export async function GET() {
  try {
    await dbConnect();
    // Fetch only active channels, and only return the name and _id
    const channels = await Channel.find({ status: 'active' })
      .select('name _id')
      .lean();

    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load channels" }, { status: 500 });
  }
}