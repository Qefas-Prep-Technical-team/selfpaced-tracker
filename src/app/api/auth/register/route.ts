import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

import Invite from "@/models/Invite";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, token } = await req.json();

    // 1. Verify the invite exists and is still pending
    const invite = await Invite.findOne({ token, email, status: "pending" });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invite or email mismatch" },
        { status: 400 }
      );
    }

    // 2. Check if invite has expired
    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already registered" }, { status: 409 });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create User and Mark Invite as Accepted
    // (In production, use a MongoDB Session for Atomicity)
    await User.create({
      email,
      password: hashedPassword,
      role: invite.role, // Inherit role from the invite
      isVerified: true,
    });

    invite.status = "accepted";
    await invite.save();

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}