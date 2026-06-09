/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { Channel } from "@/models/Channel";
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

// Define headers clearly
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change this to your specific domain in production
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle Preflight (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// app/api/inquiries/route.ts
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    let { parentName, childClass, whatsapp, channelId, channelName } = body;

    // Resolve channelName from channelId if it is not provided
    if (channelId && !channelName) {
      const channel = await Channel.findById(channelId);
      if (channel) {
        channelName = channel.name;
      }
    }

    // 1. Basic validation
    if (!parentName || !whatsapp || !channelId || !channelName || !childClass) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders },
      );
    }

    // 2. Strict Validation
    if (parentName.length > 50) {
      return NextResponse.json(
        { error: "Invalid Name" },
        { status: 400, headers: corsHeaders },
      );
    }
    // app/api/inquiries/route.ts

    // ... existing code ...

    const normalizedWhatsapp = whatsapp.trim();
    const normalizedName = parentName.trim().toLowerCase();

    // CHECK 1: WhatsApp Uniqueness
    const existingPhone = await Inquiry.findOne({
      whatsapp: normalizedWhatsapp,
    });
    if (existingPhone) {
      return NextResponse.json(
        { error: "This WhatsApp number is already registered" },
        { status: 409, headers: corsHeaders },
      );
    }

    // CHECK 2: Name Uniqueness (Add this part)
    const existingName = await Inquiry.findOne({
      parentNameNormalized: normalizedName,
    });
    if (existingName) {
      return NextResponse.json(
        { error: "A parent with this name is already registered" },
        { status: 409, headers: corsHeaders },
      );
    }

    // ... continue to create inquiry ...

    // 3. Create the inquiry
    const inquiry = await Inquiry.create({
      parentName: parentName.trim(),
      parentNameNormalized: normalizedName,
      childClass,
      whatsapp: whatsapp.trim(),
      channelId,
      channelName,
    });

    // 4. Increment channel leads
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { leads: 1 },
    });

    // 5. Send Welcome SMS immediately after signup
    const parent = parentName.trim();
    const selectedClass = childClass.trim();

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
    const regBaseUrl = process.env.COURSE_REGISTRATION_BASE_URL || "https://qefas.com/";
    const regLink = courseSegment ? `${regBaseUrl}${courseSegment}` : regBaseUrl;

    const contactWhatsapp = process.env.CONTACT_WHATSAPP_NUMBER || "2348165246864";

    const welcomeSms = `Hello ${parent}, welcome to Qefas! We see your interest in the ${selectedClass} selfpaced course. If you do not receive a call/message from us shortly, please register using ${regLink} or chat/call us on WhatsApp via https://wa.me/${contactWhatsapp}`;

    // Format recipient phone number
    const formattedRecipient = formatPhoneNumber(whatsapp);
    
    // Termii variables
    const apiKey = process.env.TERMII_API_KEY;
    const senderId = process.env.TERMII_SENDER_ID || "Qefas";
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

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
        const resData = await response.json();
        
        if (resData?.code === "ok") {
          inquiry.status = "contacted";
          inquiry.contactHistory.push({
            contactedAt: new Date(),
            contactMethod: "sms",
            message: welcomeSms
          });
          await inquiry.save();
        }

        // Log welcome SMS as a Campaign in our DB history for full tracking visibility
        await Campaign.create({
          title: `Welcome SMS - ${parent}`,
          channel: "generic",
          message: welcomeSms,
          recipientsCount: 1,
          recipients: [formattedRecipient],
          status: resData?.code === "ok" ? "sent" : "failed",
          costUnits: 1,
          termiiResponse: resData
        });
      } catch (smsError) {
        console.error("Failed to send welcome SMS via Termii:", smsError);
      }
    }

    return NextResponse.json(
      { success: true, inquiry },
      { status: 201, headers: corsHeaders },
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This parent name is already registered" },
        { status: 409, headers: corsHeaders },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    const search = searchParams.get("search") || "";
    const childClass = searchParams.get("childClass") || "";
    const channelName = searchParams.get("channelName") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const skip = (page - 1) * limit;

    // 1. Build the Search Filter
    let query: any = {};

    // Base filters
    if (search) {
      query.$or = [
        { parentName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { channelName: { $regex: search, $options: "i" } },
      ];
    }

    if (childClass) {
      query.childClass = childClass;
    }

    if (channelName) {
      query.channelName = channelName;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // 2. Execute Query and Count in parallel
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: inquiries,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("GET Inquiries Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
