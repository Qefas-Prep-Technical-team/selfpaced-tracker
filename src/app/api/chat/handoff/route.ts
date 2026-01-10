import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  await dbConnect();
  const { phoneNumber, newStatus } = await req.json();

  const updated = await Conversation.findOneAndUpdate(
    { phoneNumber },
    { status: newStatus },
    { new: true }
  );

  return NextResponse.json(updated);
}
