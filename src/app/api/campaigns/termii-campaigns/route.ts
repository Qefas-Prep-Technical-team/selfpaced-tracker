import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaign_id");

    // Mock campaigns data if no API key is present
    const sandboxCampaigns = {
      content: [
        {
          campaign_id: "C714360330258",
          run_at: "07-08-2025 13:00",
          status: "DELIVERED",
          created_at: 1754568051635,
          phone_book: "Students Group A",
          camp_type: "regular",
          total_recipients: 12
        },
        {
          campaign_id: "C883996058770",
          run_at: "07-08-2025 12:59",
          status: "FAILED",
          created_at: 1754567988893,
          phone_book: "Parents Registry",
          camp_type: "regular",
          total_recipients: 12
        },
        {
          campaign_id: "C745756456563",
          run_at: "01-08-2025 16:39",
          status: "DELIVERED",
          created_at: 1754062786066,
          phone_book: "Greatness",
          camp_type: "regular",
          total_recipients: 3
        }
      ],
      totalPages: 1,
      totalElements: 3
    };

    if (!apiKey) {
      if (campaignId) {
        // Return details for a single campaign
        const found = sandboxCampaigns.content.find(c => c.campaign_id === campaignId);
        if (found) {
          return NextResponse.json({
            id: "sandbox-camp-id",
            applicationId: 33217,
            uuid: "4950076e-dd66-4792-ba65-78c80f250bac",
            createdAt: found.run_at,
            updatedAt: found.run_at,
            campaignId: found.campaign_id,
            phonebookId: "sandbox-phonebook",
            phonebookName: found.phone_book,
            sender: "Termii",
            message: "Welcome to Termii. This is a sandbox simulated campaign.",
            countryCode: "234",
            smsType: "plain",
            campaignType: found.camp_type,
            status: found.status,
            cost: found.total_recipients * 1.5,
            totalRecipient: found.total_recipients,
            totalDelivered: found.status === "DELIVERED" ? found.total_recipients : 0,
            totalFailed: found.status === "FAILED" ? found.total_recipients : 0,
            sent: found.total_recipients,
            runAt: found.run_at,
            isLinkTrackingEnabled: true,
            rerun: false,
            sendBy: "api",
            personalized: false
          });
        }
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }
      return NextResponse.json(sandboxCampaigns);
    }

    if (campaignId) {
      // Fetch details of a single campaign
      const response = await fetch(`${baseUrl}/api/sms/campaigns/${campaignId}?api_key=${apiKey}`);
      if (!response.ok) throw new Error(`Termii API returned status ${response.status}`);
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fetch list of all campaigns
    const response = await fetch(`${baseUrl}/api/sms/campaigns?api_key=${apiKey}`);
    if (!response.ok) throw new Error(`Termii API returned status ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("GET Termii Campaigns error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sender_id,
      message,
      channel,
      phonebook_id,
      campaign_type = "regular",
      schedule_sms_status = "regular",
      schedule_time,
      enable_link_tracking = false,
      message_type = "Plain",
      country_code = "234"
    } = body;

    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    await dbConnect();

    if (!apiKey) {
      // Sandbox Simulator response
      const campaignId = `C${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      
      // Save campaign to local MongoDB tracker database
      const localCamp = await Campaign.create({
        title: `Phonebook Campaign - ${phonebook_id}`,
        channel,
        message,
        recipientsCount: 15, // simulated phonebook contacts count
        status: schedule_sms_status === "scheduled" ? "pending" : "sent",
        costUnits: 15,
        termiiResponse: {
          message: schedule_sms_status === "scheduled" ? "Your campaign has been scheduled" : "Your campaign has been sent",
          campaignId,
          status: "success"
        }
      });

      return NextResponse.json({
        message: schedule_sms_status === "scheduled" ? "Your campaign has been scheduled" : "Your campaign has been sent",
        campaignId,
        status: "success",
        localCampaign: localCamp
      }, { status: 201 });
    }

    // Send payload to Termii API
    const payload = {
      api_key: apiKey,
      country_code,
      sender_id,
      message,
      channel,
      message_type,
      phonebook_id,
      delimiter: ",",
      remove_duplicate: "yes",
      enable_link_tracking,
      campaign_type,
      schedule_sms_status,
      ...(schedule_sms_status === "scheduled" && { schedule_time })
    };

    const response = await fetch(`${baseUrl}/api/sms/campaigns/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Termii responded with HTTP status ${response.status}`);
    }

    // Track it in our MongoDB local database for analytics cross-referencing
    await Campaign.create({
      title: `Phonebook Campaign - ${phonebook_id}`,
      channel,
      message,
      recipientsCount: data.total_recipients || 0,
      status: schedule_sms_status === "scheduled" ? "pending" : "sent",
      costUnits: data.cost || 0,
      termiiResponse: data
    });

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("POST Termii Campaign send error:", error);
    return NextResponse.json({ error: error.message || "Failed to dispatch campaign" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaign_id");

    if (!campaignId) {
      return NextResponse.json({ error: "campaign_id query parameter is required" }, { status: 400 });
    }

    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    if (!apiKey) {
      // Sandbox Simulator retry success
      return NextResponse.json({
        message: "Your failed campaign has been retried",
        status: "success"
      });
    }

    const response = await fetch(`${baseUrl}/api/sms/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Termii responded with HTTP status ${response.status}`);
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("PATCH Termii Campaign retry error:", error);
    return NextResponse.json({ error: error.message || "Failed to retry campaign" }, { status: 500 });
  }
}
