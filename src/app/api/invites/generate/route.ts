/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

import crypto from "crypto";
import Invite from "@/models/Invite";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, role, expiration } = await req.json();

    // 1. Calculate the expiration date
    const expiresAt = new Date();
    if (expiration === "24h") expiresAt.setHours(expiresAt.getHours() + 24);
    else if (expiration === "3d") expiresAt.setDate(expiresAt.getDate() + 3);
    else if (expiration === "7d") expiresAt.setDate(expiresAt.getDate() + 7);

    // 2. Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // 3. Create the invite record
    await Invite.create({
      email,
      role,
      token,
      expiresAt,
    });

    // 4. Construct the link
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${domain}/invite?token=${token}`;

    return NextResponse.json({ link: inviteLink }, { status: 201 });
  } catch (error: any) {
    console.error("Invite generation error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}