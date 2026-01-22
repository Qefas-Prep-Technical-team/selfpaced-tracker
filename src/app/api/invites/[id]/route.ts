/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invite from "@/models/Invite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Ensure Next.js 15 compat
) {
  const { id } = await params;
  try {
    const { role } = await req.json();
    await dbConnect();

    // 1. Update the Invite record
    const updatedInvite = await Invite.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );

    if (!updatedInvite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // 2. CRITICAL STEP: Update the actual User account
    // We find the user by the email stored in the invite
    await User.findOneAndUpdate(
      { email: updatedInvite.email },
      { role: role }, // Ensure this matches your DB casing (e.g., 'admin' or 'ADMIN')
      { new: true },
    );

    return NextResponse.json(updatedInvite);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    // 1. Check Authentication
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role?.toLowerCase();

    // Re-enabling Admin check (using lowercase for safety)
    if (!session || userRole !== "admin") {
      return NextResponse.json({ error: "Admins only" }, { status: 403 });
    }

    // 2. Find the invite first to get the email
    const inviteToDelete = await Invite.findById(id);

    if (!inviteToDelete) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const emailToDelete = inviteToDelete.email;

    // 3. Delete the User associated with this email
    const deletedUser = await User.findOneAndDelete({ email: emailToDelete });

    // 4. Delete the Invite itself
    await Invite.findByIdAndDelete(id);

    return NextResponse.json({
      message: deletedUser
        ? "Invite and User account deleted"
        : "Invite deleted (no associated User found)",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
