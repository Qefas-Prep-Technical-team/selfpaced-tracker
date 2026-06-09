import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
){
  try {
    const { id } = await params; // Await the params
    await dbConnect();
    const conversation = await Conversation.findById(id).lean();
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();
    const conversation = await Conversation.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}