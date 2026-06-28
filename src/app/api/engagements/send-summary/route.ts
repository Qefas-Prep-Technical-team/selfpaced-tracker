import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EngagementReport } from "@/models/EngagementReport";
import { ReportRecipient } from "@/models/ReportRecipient";
import OpenAI from "openai";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function generateAndSendSummary(startDate?: Date, endDate?: Date) {
  await dbConnect();

  // 1. Fetch active recipients
  const recipients = await ReportRecipient.find({ isActive: true });
  if (recipients.length === 0) {
    return { success: false, error: "No active recipients found to send to." };
  }
  const emailList = recipients.map((r) => r.email);

  // 2. Build Query & Fetch reports
  const query: any = { nameChannel: { $ne: 'Unknown' } };
  
  let timeFrameText = "All Time";
  if (startDate && endDate) {
    query.date = { 
      $gte: new Date(startDate), 
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) 
    };
    timeFrameText = `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else if (startDate) {
    query.date = { $gte: new Date(startDate) };
    timeFrameText = `From ${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else if (endDate) {
    query.date = { $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) };
    timeFrameText = `Up to ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  const reports = await EngagementReport.find(query).sort({ date: -1 });

  if (reports.length === 0) {
    return { success: false, error: `No reports found for the selected timeframe (${timeFrameText}).` };
  }

  // 3. Calculate summary metrics & Marketer Breakdown
  const totalLeads = reports.reduce((acc, curr) => acc + (curr.hotLeads || 0), 0);
  const totalConverted = reports.reduce((acc, curr) => acc + (curr.convertedStudents || 0), 0);
  const totalFlyers = reports.reduce((acc, curr) => acc + (curr.flyersDistributed || 0), 0);

  const marketerStats: Record<string, { leads: number; converted: number }> = {};
  reports.forEach(r => {
    let channel = r.nameChannel || 'Unknown';
    channel = channel.trim().toLowerCase().replace(/\s+/g, ' ');
    if (channel.includes("abdukai olaide") || channel.includes("olaide abdulai") || channel.includes("abdulai olaidw") || channel.includes("bello olaide abdulai") || channel === "abdulai olaide") {
      channel = "Abdulai Olaide";
    } else if (channel.includes("adelola olanso") || channel.includes("olanso adeola") || channel === "olanso adelola") {
      channel = "Olanso Adelola";
    } else {
      channel = channel.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    if (!marketerStats[channel]) {
      marketerStats[channel] = { leads: 0, converted: 0 };
    }
    marketerStats[channel].leads += (r.hotLeads || 0);
    marketerStats[channel].converted += (r.convertedStudents || 0);
  });

  const marketerBreakdownHtml = Object.entries(marketerStats)
    .sort((a, b) => b[1].leads - a[1].leads)
    .map(([name, stats]) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">${name}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">${stats.leads}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; color: #10b981; font-weight: bold;">${stats.converted}</td>
      </tr>
    `).join('');

  const allActivityData = reports.map(r => ({
    date: r.date ? new Date(r.date).toISOString().split('T')[0] : 'N/A',
    channel: r.nameChannel,
    location: r.location,
    leads: r.hotLeads || 0,
    converted: r.convertedStudents || 0,
    flyers: r.flyersDistributed || 0,
    objections: r.objections || [],
    supportNeeded: r.supportNeeded || [],
    challenges: r.challenges || "",
    suggestions: r.suggestions || "",
  }));

  let aiSummary = "";
  try {
    const prompt = `You are a professional data analyst and marketing strategist for QEFAS Preparatory School, located in Lagos, Nigeria. 
    QEFAS provides affordable, high-quality education using technology, experienced instructors, and a robust digital learning platform. Our current primary goal is to sell our "Self-Paced Video Classes" to students who want flexible, high-quality learning across Nigeria.

    Review the following database of field engagement reports (Timeframe: ${timeFrameText}) and provide an encouraging, insightful summary for the management team. 

    Your summary MUST include:
    1. A brief overview of the overall performance (Total leads: ${totalLeads}, Total converted: ${totalConverted}) during this specific timeframe.
    2. Specific shout-outs to the names of the Channels (our field agents/locations) and exactly what they have achieved based on the data. Ensure you mention who brought in the most hot leads.
    3. Actionable strategic suggestions tailored to selling our self-paced video classes in the NIGERIAN MARKET. You must suggest highly effective, localized marketing strategies currently working in Nigeria (e.g., WhatsApp marketing, local community outreach, overcoming data/internet cost objections, leveraging parent networks) directly addressing the specific challenges or objections reported by the agents in the field.

    Complete Activity Data (JSON format): 
    ${JSON.stringify(allActivityData)}
    
    Format the response beautifully as valid HTML (using <h3>, <p>, <ul>, <li>, <strong>) without markdown code blocks. Ensure it is highly professional and ready to be inserted directly into an email body. Do not include \`\`\`html tags. Do NOT include a sign-off or "Best regards" at the end, as it will be added automatically.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    aiSummary = response.choices[0]?.message?.content || "No summary generated.";
    aiSummary = aiSummary.replace(/\`\`\`html/g, '').replace(/\`\`\`/g, '');
  } catch (aiError) {
    console.error("AI Generation Error:", aiError);
    aiSummary = "<p>AI Summary generation failed, but here is your data overview.</p>";
  }

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #4f46e5; margin-bottom: 5px;">Engagement AI Summary</h2>
      <p style="margin-top: 0; color: #64748b; font-size: 14px; font-weight: bold;">Timeframe: ${timeFrameText}</p>
      
      <p>Hello Team,</p>
      <p>Here is the latest overview of our engagement and field marketing activities for the selected period:</p>
      
      <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 25px 0;">
        <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">AI Strategic Insights</h2>
        <div style="line-height: 1.6; color: #334155; font-size: 15px;">
          ${aiSummary}
          
          <p style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 15px;">
            Best Regards,<br/>
            <strong>Qefas AI</strong><br/>
            Professional Data Analyst and Marketing Strategist<br/>
            QEFAS Preparatory School
          </p>
        </div>
      </div>

      <h3>Marketer Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background-color: #e2e8f0; text-align: left;">
          <th style="padding: 10px; border: 1px solid #cbd5e1;">Marketer / Channel</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1;">Hot Leads</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1;">Converted</th>
        </tr>
        ${marketerBreakdownHtml}
      </table>

      <h3>Quick Metrics (${timeFrameText})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background-color: #e2e8f0; text-align: left;">
          <th style="padding: 10px; border: 1px solid #cbd5e1;">Metric</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1;">Value</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">Total Hot Leads</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;"><strong>${totalLeads}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">Total Converted</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;"><strong style="color: #10b981;">${totalConverted}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">Flyers Distributed</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${totalFlyers}</td>
        </tr>
      </table>
      
      <p style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        This is an automated report from the Qefas AI Tracker.
      </p>
    </div>
  `;

  const sendPromises = emailList.map(email => 
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Qefas Marketing <reports@qefashub.com>',
      to: email,
      subject: '🚀 Engagement AI Summary',
      html: emailHtml,
    })
  );

  const results = await Promise.all(sendPromises);
  const failures = results.filter(res => res.error);
  if (failures.length > 0) {
    const firstError = failures[0].error?.message || "Failed to send email.";
    return { success: false, error: `Resend Error: ${firstError}.` };
  }

  return { success: true, data: results };
}

export async function POST(req: Request) {
  try {
    let startDate, endDate;
    try {
      const body = await req.json();
      if (body.startDate) startDate = new Date(body.startDate);
      if (body.endDate) endDate = new Date(body.endDate);
    } catch(e) {}

    const result = await generateAndSendSummary(startDate, endDate);
    if (!result.success) {
      return NextResponse.json(result, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ success: true, message: "Emails sent successfully!" }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Failed to send summary:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to send summary" }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(req: Request) {
  try {
    // Basic Cron Authentication
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // Weekly cron: calculate past 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const result = await generateAndSendSummary(startDate, endDate);
    if (!result.success) {
      return NextResponse.json(result, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ success: true, message: "Weekly Cron: Emails sent successfully!" }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Failed to run weekly cron:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to run cron" }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
