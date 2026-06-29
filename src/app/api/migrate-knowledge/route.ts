import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Knowledge from "@/models/Knowledge";
import HubKnowledge from "@/models/HubKnowledge";

export async function GET() {
  try {
    await dbConnect();

    // 1. Find all documents in the Knowledge collection with category "Qefas Hub"
    const hubDocs = await Knowledge.find({ category: "Qefas Hub" }).lean();

    if (hubDocs.length === 0) {
      return NextResponse.json({ message: "No Qefas Hub data found in the old Knowledge collection." });
    }

    // 2. Remove the _id so MongoDB generates new ones for HubKnowledge (or keep them, but safer to remove)
    const newDocs = hubDocs.map((doc: any) => {
      const { _id, __v, ...rest } = doc;
      return rest;
    });

    // 3. Insert them into the new HubKnowledge collection
    await HubKnowledge.insertMany(newDocs);

    // 4. Delete the migrated documents from the old Knowledge collection
    await Knowledge.deleteMany({ category: "Qefas Hub" });

    return NextResponse.json({ 
      message: "Successfully migrated data!", 
      count: newDocs.length 
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
