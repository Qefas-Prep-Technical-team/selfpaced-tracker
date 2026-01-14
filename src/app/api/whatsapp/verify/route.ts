/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Define headers clearly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Change this to your specific domain in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle Preflight (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    // Check if body is empty to avoid "Unexpected end of JSON"
    const body = await req.text();
    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    const { phoneNumber } = JSON.parse(body);

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Attempt Lookup v2 with fallback
    try {
      const lookup = await client.lookups.v2
        .phoneNumbers(phoneNumber)
        .fetch({ fields: "line_type_intelligence" }); // Use line_type instead of 'whatsapp' for better compatibility

      const isMobile = (lookup as any).lineTypeIntelligence?.type === "mobile";

      return NextResponse.json({
        success: true,
        isValid: lookup.valid,
        isWhatsAppLikely: isMobile, // If it's mobile, it's highly likely to have WhatsApp
        format: lookup.phoneNumber,
        details: (lookup as any).lineTypeIntelligence || "No extra data"
      },{ status: 200, headers: corsHeaders  });

    } catch (twilioErr: any) {
      // If the advanced fields fail, just return the basic validation
      const basicLookup = await client.lookups.v2.phoneNumbers(phoneNumber).fetch();
      return NextResponse.json({
        success: true,
        isValid: basicLookup.valid,
        isWhatsAppLikely: "Unknown (Package not enabled)",
        format: basicLookup.phoneNumber
      },{ status: 200, headers: corsHeaders  });
    }

  } catch (error: any) {
    console.error("General Error:", error.message);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500,headers: corsHeaders  });
  }
}