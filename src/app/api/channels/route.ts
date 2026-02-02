/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/mongodb";
import { Channel } from "@/models/Channel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logDeletion } from "@/lib/activityLogger";

export async function POST(req: Request) {
  try {
    await dbConnect();
    // 1. Read as FormData directly (don't read as text first)
    const formData = await req.formData();
    // 2. Extract data
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const file = formData.get("profileImage") as File | null;

    const isExisting = await Channel.findOne({ name });
    if (isExisting) {
      return NextResponse.json(
        { error: "Channel with this name already exists" },
        { status: 409 },
      );
    }
    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 },
      );
    }
    let imageUrl = "";

    // 3. Handle Cloudinary Upload
    if (file && file.size > 0) {
      // Verify file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only images are allowed." },
          { status: 400 },
        );
      }

      // Convert File to buffer for Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "channels",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        uploadStream.end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    // 4. Save to DB
    const newChannel = await Channel.create({
      name,
      type,
      description: (formData.get("description") as string) || "",
      sourceCategory: (formData.get("sourceCategory") as string) || "",
      trackingId: (formData.get("trackingId") as string) || "",
      isActive: formData.get("isActive") === "true",
      imageUrl,
    });
    return NextResponse.json(newChannel, { status: 201 });
  } catch (error: any) {
    console.error("Detailed Backend Error:", error);

    // Provide more specific error messages
    if (error.message.includes("FormData")) {
      return NextResponse.json(
        {
          error:
            "Invalid form data. Please ensure you are sending multipart/form-data.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1️⃣ Read pagination params
    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "5", 10), 1);

    const skip = (page - 1) * limit;

    // 2️⃣ Query database
    const [channels, total] = await Promise.all([
      Channel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Channel.countDocuments(),
    ]);

    // 3️⃣ Return paginated response
    return NextResponse.json(
      {
        data: channels,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET Channels Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 },
    );
  }
}

// DELETE /api/channels?id=CHANNEL_ID
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate the Admin & Extract Email
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Capture the email specifically for the log
    const adminEmail = session.user?.email || "unknown@admin.com";

    // 2. Get ID from SearchParams
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Channel ID is required" },
        { status: 400 },
      );
    }

    // 3. Find Channel for data extraction
    const channel = await Channel.findById(id);
    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // 4. LOG THE DELETION (Passing adminEmail instead of Name)
    // Label: "Channel", Item: channel.name, Admin Identifier: adminEmail
    await logDeletion("Channel", channel.name, adminEmail, "Platform Settings");

    // 5. Cleanup Cloudinary Image
    if (channel.imageUrl) {
      const publicIdMatch = channel.imageUrl.match(
        /\/([^\/]+)\.(jpg|png|gif|webp)$/,
      );
      const public_id = publicIdMatch ? `channels/${publicIdMatch[1]}` : null;

      if (public_id) {
        await cloudinary.uploader.destroy(public_id, {
          resource_type: "image",
        });
      }
    }

    // 6. Delete from Database
    await Channel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Channel deleted and activity logged" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DELETE Channel Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
