import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EngagementReport } from "@/models/EngagementReport";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await dbConnect();
    const reports = await EngagementReport.find({
      nameChannel: { $ne: 'Unknown' }
    }).sort({ date: -1 });
    return NextResponse.json(
      { success: true, data: reports },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to fetch engagement reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch engagement reports" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const report = new EngagementReport(body);
    await report.save();

    return NextResponse.json(
      { success: true, data: report },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to save engagement report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save engagement report" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
