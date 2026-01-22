import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invite from "@/models/Invite";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch all invites
    const invites = await Invite.find({}).sort({ createdAt: -1 });
    const formattedInvites = [];

    // 2. Loop through invites to check for mismatches
    for (const inv of invites) {
      const user = await User.findOne({ email: inv.email });

      if (user) {
        // Normalize roles for comparison
        const inviteRole = inv.role.toLowerCase();
        const userRole = user.role.toLowerCase();

        if (inviteRole !== userRole) {
          // Update the User record to match the Invite record
          await User.findByIdAndUpdate(user._id, { role: inv.role });

          // Optional: You could also trigger a session refresh here if you had a socket system,
          // but for now, the user will see the update on their next login.
        }
      }

      // Add to the list regardless of whether it needed repair
      formattedInvites.push({
        id: inv._id.toString(),
        token: inv.token,
        email: inv.email,
        role: inv.role.charAt(0).toUpperCase() + inv.role.slice(1),
        status: inv.status,
        invitedOn: inv.createdAt,
      });
    }

    return NextResponse.json(formattedInvites);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
