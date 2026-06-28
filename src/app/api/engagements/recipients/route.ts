import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ReportRecipient } from "@/models/ReportRecipient";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await dbConnect();
    const recipients = await ReportRecipient.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: recipients }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch recipients" }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400, headers: corsHeaders });
    }

    const recipient = new ReportRecipient({ email, name });
    await recipient.save();

    return NextResponse.json({ success: true, data: recipient }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error("Error saving recipient:", error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ success: false, error: "Failed to save recipient" }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
