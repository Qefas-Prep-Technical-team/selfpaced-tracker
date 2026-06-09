import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    if (!apiKey) {
      // Fallback for Sandbox Mode
      return NextResponse.json({
        content: [
          { country: "Nigeria", status: "active", createdAt: "2026-01-01", sender_id: "Qefas" },
          { country: "Nigeria", status: "active", createdAt: "2026-02-15", sender_id: "QefasAlert" },
          { country: "Nigeria", status: "pending", createdAt: "2026-06-08", sender_id: "QefasOTP", company: "Qefas Hub", usecase: "Your OTP is 1234" }
        ]
      });
    }

    const response = await fetch(`${baseUrl}/api/sender-id?api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Termii returned status code ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Sender ID Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch Sender IDs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";
    const { sender_id, company, use_case } = await req.json();

    if (!sender_id || !company || !use_case) {
      return NextResponse.json(
        { error: "Missing required fields: sender_id, company, or use_case" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      // Sandbox success simulation
      return NextResponse.json({
        code: "ok",
        message: "Sandbox Request: Sender ID requested successfully. Simulated approval soon."
      });
    }

    const response = await fetch(`${baseUrl}/api/sender-id/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        sender_id,
        company,
        use_case
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("POST Request Sender ID Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to request Sender ID" },
      { status: 500 }
    );
  }
}
