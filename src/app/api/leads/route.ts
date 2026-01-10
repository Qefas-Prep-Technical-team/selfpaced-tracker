import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const leads = await Conversation.find({}).sort({ lastMessageAt: -1 });
  return NextResponse.json(leads);
}
