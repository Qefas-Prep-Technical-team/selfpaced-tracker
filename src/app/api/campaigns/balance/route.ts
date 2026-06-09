import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    // Dynamic prices from env variables, or default standard rates
    const prices = {
      dnd: process.env.TERMII_PRICE_DND || "12.00",
      generic: process.env.TERMII_PRICE_GENERIC || "4.00",
      whatsapp: process.env.TERMII_PRICE_WHATSAPP || "20.00",
      voice: process.env.TERMII_PRICE_VOICE || "25.00"
    };

    if (!apiKey) {
      return NextResponse.json({
        user: "Sandbox/Demo Mode",
        balance: 0.00,
        currency: "NGN",
        prices,
        warning: "TERMII_API_KEY environment variable is not configured."
      });
    }

    const response = await fetch(`${baseUrl}/api/get-balance?api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Termii returned HTTP status ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json({
      user: data?.user || "Termii User",
      balance: data?.balance ?? 0.00,
      currency: data?.currency || "NGN",
      prices
    });
  } catch (error: any) {
    console.error("GET Termii Balance Error:", error);
    return NextResponse.json({
      user: "Connection Offline",
      balance: 0.00,
      currency: "NGN",
      prices: {
        dnd: "12.00",
        generic: "4.00",
        whatsapp: "20.00",
        voice: "25.00"
      },
      error: error?.message || "Failed to retrieve balance from Termii"
    });
  }
}
