import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EngagementReport } from "@/models/EngagementReport";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function DELETE(
  req: Request,
  context: any // Use any temporarily to avoid App Router typing issues depending on Next.js version
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Report ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const deletedReport = await EngagementReport.findByIdAndDelete(id);

    if (!deletedReport) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedReport },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to delete engagement report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete engagement report" },
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
