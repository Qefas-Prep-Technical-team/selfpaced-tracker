import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invite from "@/models/Invite";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) return NextResponse.json({ error: "No token provided" }, { status: 400 });

    const invite = await Invite.findOne({ token, status: "pending" });

    if (!invite) return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });

    // Check if it's expired manually (in case TTL index hasn't run yet)
    if (new Date() > invite.expiresAt) {
        return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
    }

    return NextResponse.json({ email: invite.email, role: invite.role });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}