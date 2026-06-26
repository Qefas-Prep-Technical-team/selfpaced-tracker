import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Location } from "@/models/Location";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: "Location name is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if it already exists
    let location = await Location.findOne({ name: name.trim() });
    
    if (!location) {
      location = new Location({ name: name.trim() });
      await location.save();
    }

    return NextResponse.json(
      { success: true, data: location },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to add location:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add location" },
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
