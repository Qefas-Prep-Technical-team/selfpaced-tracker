import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

// Helper to format Nigerian phone numbers to Termii format: 2348030000000
function formatPhoneNumber(num: string): string {
  let clean = num.replace(/\D/g, "");
  if (clean.startsWith("0") && clean.length === 11) {
    clean = "234" + clean.slice(1);
  }
  if (clean.startsWith("234") && clean.length === 13) {
    return clean;
  }
  if (!clean.startsWith("234") && clean.length === 10) {
    clean = "234" + clean;
  }
  return clean;
}

export async function GET() {
  try {
    await dbConnect();
    const campaigns = await Campaign.find({}).sort({ sentAt: -1 }).lean();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("GET Campaigns Error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, channel, message, recipients, sandbox, sender_id } = await req.json();

    if (!channel || !message || !recipients || !recipients.length) {
      return NextResponse.json(
        { error: "Missing required fields: channel, message, or recipients" },
        { status: 400 }
      );
    }

    const formattedRecipients = recipients.map((r: string) => formatPhoneNumber(r)).filter((r: string) => r.length > 0);

    if (!formattedRecipients.length) {
      return NextResponse.json(
        { error: "No valid recipient numbers provided" },
        { status: 400 }
      );
    }

    // Detect if special characters are present to calculate units correctly
    const specialCharRegex = /[;\/\^\\\{\}\[\]~\|€'”]/;
    const hasSpecialChar = specialCharRegex.test(message);
    const limitPerPage = hasSpecialChar ? 70 : 160;
    const smsUnits = Math.ceil(message.length / limitPerPage);
    const costUnits = smsUnits * formattedRecipients.length;

    await dbConnect();

    // If sandbox mode is enabled, simulate the broadcast
    if (sandbox) {
      const simulatedCampaign = await Campaign.create({
        title: title || `Sandbox Broadcast - ${channel.toUpperCase()}`,
        channel,
        message,
        recipientsCount: formattedRecipients.length,
        recipients: formattedRecipients,
        status: "sent",
        costUnits,
        termiiResponse: {
          code: "ok",
          balance: 9999.99,
          message: "Simulated successfully sent via Sandbox Mode",
          user: "Sandbox User"
        }
      });

      return NextResponse.json({
        success: true,
        campaign: simulatedCampaign,
        message: "Sandbox broadcast simulated successfully."
      });
    }

    // Termii API credentials
    const apiKey = process.env.TERMII_API_KEY || "Your API Key";
    const senderId = sender_id || process.env.TERMII_SENDER_ID || "Qefas";
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    // 1. Single recipient message
    if (formattedRecipients.length === 1) {
      const payload = {
        api_key: apiKey,
        to: formattedRecipients[0],
        from: senderId,
        sms: message,
        type: channel === "voice" ? "Voice" : "plain",
        channel: channel // dnd, generic, whatsapp, voice
      };

      const response = await fetch(`${baseUrl}/api/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      const campaign = await Campaign.create({
        title: title || `Broadcast - ${channel.toUpperCase()}`,
        channel,
        message,
        recipientsCount: 1,
        recipients: formattedRecipients,
        status: resData?.code === "ok" ? "sent" : "failed",
        costUnits,
        termiiResponse: resData
      });

      return NextResponse.json({
        success: resData?.code === "ok",
        campaign,
        response: resData
      });
    } else {
      // 2. Bulk/Multiple recipients message
      const payload = {
        api_key: apiKey,
        to: formattedRecipients,
        from: senderId,
        sms: message,
        type: "plain",
        channel: channel === "whatsapp" ? "whatsapp" : (channel === "dnd" ? "dnd" : "generic")
      };

      const endpoint = channel === "whatsapp" 
        ? `${baseUrl}/api/sms/send` // whatsapp conversational sends via standard endpoint
        : `${baseUrl}/api/sms/send/bulk`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      const campaign = await Campaign.create({
        title: title || `Bulk Broadcast - ${channel.toUpperCase()}`,
        channel,
        message,
        recipientsCount: formattedRecipients.length,
        recipients: formattedRecipients,
        status: resData?.code === "ok" ? "sent" : "failed",
        costUnits,
        termiiResponse: resData
      });

      return NextResponse.json({
        success: resData?.code === "ok",
        campaign,
        response: resData
      });
    }
  } catch (error: any) {
    console.error("POST Send Campaign Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
