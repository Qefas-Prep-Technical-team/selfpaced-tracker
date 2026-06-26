import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EngagementReport } from "@/models/EngagementReport";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { records } = await req.json();

    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ success: false, error: "No records provided" }, { status: 400 });
    }

    if (records.length > 0) {
      // Ensure strict type checking and defaults based on schema logic
      const formattedRecords = records.map(record => ({
        nameChannel: record.nameChannel || 'Unknown',
        date: record.date ? new Date(record.date) : new Date(),
        location: record.location || 'Unknown',
        hotLeads: parseInt(record.hotLeads) || 0,
        convertedStudents: parseInt(record.convertedStudents) || 0,
        flyersDistributed: parseInt(record.flyersDistributed) || 0,
        giftsDistributed: parseInt(record.giftsDistributed) || 0,
        contactsUploaded: parseInt(record.contactsUploaded) || 0,
        dataCollected: record.dataCollected || '',
        challenges: record.challenges || '',
        suggestions: record.suggestions || '',
        objections: Array.isArray(record.objections) ? record.objections : [],
        supportNeeded: Array.isArray(record.supportNeeded) ? record.supportNeeded : [],
        comments: record.comments || 'Imported from Google Forms'
      }));

      await EngagementReport.insertMany(formattedRecords);
    }

    return NextResponse.json({ success: true, count: records.length }, { status: 200 });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
