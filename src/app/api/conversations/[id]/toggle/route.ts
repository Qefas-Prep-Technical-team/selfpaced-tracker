import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
     const { id } = await params; // Await the params
    const { status } = await req.json(); // Expecting 'bot' or 'human'
    await dbConnect();

    await Conversation.findByIdAndUpdate(id, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle mode" }, { status: 500 });
  }
}