import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ReportRecipient } from "@/models/ReportRecipient";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function DELETE(req: Request, context: any) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400, headers: corsHeaders });
    }

    const deleted = await ReportRecipient.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Recipient not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, data: deleted }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error deleting recipient:", error);
    return NextResponse.json({ success: false, error: "Failed to delete recipient" }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
