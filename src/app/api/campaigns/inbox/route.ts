import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("message_id");

    if (!apiKey) {
      // Sandbox / Demo mock history list matching Termii's API format
      const sandboxInbox = [
        {
          receiver: "2348030001111",
          message: "Welcome to Qefas Hub! Let's start learning.",
          amount: 1.0,
          reroute: 0,
          status: "Delivered",
          sms_type: "generic",
          send_by: "api",
          message_id: "3017545719517588296261695",
          created_at: "2026-06-09 14:05:53"
        },
        {
          receiver: "2348030002222",
          message: "Your verification code is 445892",
          amount: 1.0,
          reroute: 0,
          status: "Delivered",
          sms_type: "dnd",
          send_by: "api",
          message_id: "3017545716011763238246705",
          created_at: "2026-06-09 14:00:03"
        },
        {
          receiver: "2348030003333",
          message: "Hi! Verify your WhatsApp number.",
          amount: 2.0,
          reroute: 0,
          status: "Failed",
          sms_type: "whatsapp",
          send_by: "api",
          message_id: "3017545711235443752697757",
          created_at: "2026-06-09 13:52:04"
        }
      ];

      if (messageId) {
        const filtered = sandboxInbox.filter(m => m.message_id === messageId);
        return NextResponse.json(filtered);
      }

      return NextResponse.json(sandboxInbox);
    }

    let url = `${baseUrl}/api/sms/inbox?api_key=${apiKey}`;
    if (messageId) {
      url += `&message_id=${messageId}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Termii Inbox returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Termii Inbox Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch Termii Inbox History" },
      { status: 500 }
    );
  }
}
