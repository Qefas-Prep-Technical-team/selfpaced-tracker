import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
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

// GET handler to fetch all "new" inquiries
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const newInquiries = await Inquiry.find({ status: "new" })
      .select("_id parentName childClass whatsapp")
      .lean();

    return NextResponse.json({
      success: true,
      count: newInquiries.length,
      inquiries: newInquiries
    });
  } catch (error: any) {
    console.error("GET New Inquiries Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler to process welcome SMS (all or single)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    let inquiryId: string | null = null;
    try {
      const body = await req.json();
      inquiryId = body?.inquiryId || null;
    } catch (e) {
      // Body may be empty, which is fine
    }

    let inquiriesToProcess = [];

    if (inquiryId) {
      // Find the specific inquiry
      const inquiry = await Inquiry.findOne({ _id: inquiryId, status: "new" });
      if (!inquiry) {
        return NextResponse.json(
          { error: "Inquiry not found or already processed." },
          { status: 404 }
        );
      }
      inquiriesToProcess = [inquiry];
    } else {
      // Find all inquiries labeled as "new"
      inquiriesToProcess = await Inquiry.find({ status: "new" });
    }

    if (!inquiriesToProcess || inquiriesToProcess.length === 0) {
      return NextResponse.json({
        success: true,
        processedCount: 0,
        message: "No new inquiries found to process."
      });
    }

    const apiKey = process.env.TERMII_API_KEY;
    const senderId = process.env.TERMII_SENDER_ID || "Qefas";
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";
    const regBaseUrl = process.env.COURSE_REGISTRATION_BASE_URL || "https://qefas.com/";
    const contactWhatsapp = process.env.CONTACT_WHATSAPP_NUMBER || "2347065250817";

    let successCount = 0;
    let failureCount = 0;

    for (const inquiry of inquiriesToProcess) {
      const parent = inquiry.parentName.trim();
      const selectedClass = inquiry.childClass.trim();
      const whatsappNum = inquiry.whatsapp.trim();

      // Normalize childClass string to match the env course keys
      const normClass = selectedClass.toLowerCase().replace(/[^a-z0-9]/g, "");
      let courseKey = "";
      if (normClass.includes("jss1")) courseKey = "JSS1";
      else if (normClass.includes("jss2")) courseKey = "JSS2";
      else if (normClass.includes("jss3")) courseKey = "JSS3";
      else if (normClass.includes("sss1")) courseKey = "SSS1";
      else if (normClass.includes("sss2")) courseKey = "SSS2";
      else if (normClass.includes("sss3")) courseKey = "SSS3";

      const courseSegment = courseKey 
          ? (process.env[`COURSE_MAP_${courseKey}`] || "") 
          : "";
      const regLink = courseSegment ? `${regBaseUrl}${courseSegment}` : regBaseUrl;

      // Updated to state: "selfpaced course" instead of "class"
      const welcomeSms = `Hello ${parent}, welcome to Qefas! We see your interest in the ${selectedClass} selfpaced course. If you do not receive a call/message from us shortly, please register using ${regLink} or chat/call us on WhatsApp via https://wa.me/${contactWhatsapp}`;

      const formattedRecipient = formatPhoneNumber(whatsappNum);

      let smsSent = false;
      let termiiRes = null;

      if (apiKey && formattedRecipient) {
        const payload = {
          api_key: apiKey,
          to: formattedRecipient,
          from: senderId,
          sms: welcomeSms,
          type: "plain",
          channel: "generic"
        };

        try {
          const response = await fetch(`${baseUrl}/api/sms/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          termiiRes = await response.json();
          smsSent = termiiRes?.code === "ok";
        } catch (smsError) {
          console.error(`Failed to send SMS to ${formattedRecipient}:`, smsError);
          termiiRes = { error: smsError instanceof Error ? smsError.message : String(smsError) };
        }
      } else {
        // If API key is missing, treat as simulated success in development
        smsSent = true;
        termiiRes = { mock: true, message: "Sandbox Mode (No API key)" };
      }

      if (smsSent) {
        successCount++;
        // Update inquiry status to contacted and push into contact history
        inquiry.status = "contacted";
        inquiry.contactHistory.push({
          contactedAt: new Date(),
          contactMethod: "sms",
          message: welcomeSms
        });
        await inquiry.save();

        // Create campaign record
        await Campaign.create({
          title: `Welcome SMS (Bulk) - ${parent}`,
          channel: "generic",
          message: welcomeSms,
          recipientsCount: 1,
          recipients: [formattedRecipient],
          status: "sent",
          costUnits: 1,
          termiiResponse: termiiRes
        });
      } else {
        failureCount++;
        // Create campaign record for audit trail
        await Campaign.create({
          title: `Welcome SMS (Bulk Failed) - ${parent}`,
          channel: "generic",
          message: welcomeSms,
          recipientsCount: 1,
          recipients: [formattedRecipient],
          status: "failed",
          costUnits: 1,
          termiiResponse: termiiRes
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: inquiriesToProcess.length,
      successCount,
      failureCount,
      message: `Processed ${inquiriesToProcess.length} inquiries: ${successCount} sent successfully, ${failureCount} failed.`
    });

  } catch (error: any) {
    console.error("Bulk Welcome API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
