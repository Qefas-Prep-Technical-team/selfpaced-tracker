/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import crypto from "crypto";
import Invite from "@/models/Invite";
import { getServerSession } from "next-auth"; // Import this
import { authOptions } from "@/lib/auth";
 // Path to your authOptions

export async function POST(req: NextRequest) {
  try {
    // 1. Get current session
    const session = await getServerSession(authOptions);

    // 2. Security Check: Block if not admin
    const userRole = (session?.user as any)?.role?.toLowerCase();
    if (!session || userRole !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    await dbConnect();
    const { email, role, expiration } = await req.json();

    // 3. Calculate the expiration date
    const expiresAt = new Date();
    if (expiration === "24h") expiresAt.setHours(expiresAt.getHours() + 24);
    else if (expiration === "3d") expiresAt.setDate(expiresAt.getDate() + 3);
    else if (expiration === "7d") expiresAt.setDate(expiresAt.getDate() + 7);

    // 4. Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // 5. Create the invite record
    await Invite.create({
      email,
      role,
      token,
      expiresAt,
    });

    // 6. Construct the link
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${domain}/register?token=${token}`; // Usually invite link goes to register

    return NextResponse.json({ link: inviteLink }, { status: 201 });
  } catch (error: any) {
    console.error("Invite generation error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}