/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/mongodb";
import { Channel } from "@/models/Channel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logDeletion } from "@/lib/activityLogger";

// --- HELPERS ---
const getPublicIdFromUrl = (url: string) => {
  const match = url.match(/\/([^\/]+)\.(jpg|png|gif|webp)$/);
  return match ? `channels/${match[1]}` : null;
};

// --- POST: CREATE ---
export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const file = formData.get("profileImage") as File | null;

    const isExisting = await Channel.findOne({ name });
    if (isExisting) {
      return NextResponse.json({ error: "Channel already exists" }, { status: 409 });
    }

    let imageUrl = "";
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "channels" }, (error, result) => {
          if (error) reject(error); else resolve(result);
        }).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newChannel = await Channel.create({
      name,
      type,
      description: formData.get("description") || "",
      sourceCategory: formData.get("sourceCategory") || "",
      trackingId: formData.get("trackingId") || "",
      isActive: formData.get("isActive") === "true",
      status: formData.get("isActive") === "true" ? "active" : "paused",
      imageUrl,
    });

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PUT: UPDATE ---
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const formData = await req.formData();
    const existingChannel = await Channel.findById(id);
    if (!existingChannel) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = existingChannel.imageUrl;
    const file = formData.get("profileImage") as File | null;

    // If a new image is uploaded, swap them in Cloudinary
    if (file && file.size > 0) {
      // 1. Delete old image
      if (existingChannel.imageUrl) {
        const oldPublicId = getPublicIdFromUrl(existingChannel.imageUrl);
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
      }

      // 2. Upload new image
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "channels" }, (error, result) => {
          if (error) reject(error); else resolve(result);
        }).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updatedData = {
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description"),
      sourceCategory: formData.get("sourceCategory"),
      status: formData.get("isActive") === "true" ? "active" : "paused",
      imageUrl,
    };

    const updatedChannel = await Channel.findByIdAndUpdate(id, updatedData, { new: true });
    return NextResponse.json(updatedChannel, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- GET: LIST ---
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "100"), 1); // Increased for management
    const skip = (page - 1) * limit;

    const [channels, total] = await Promise.all([
      Channel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Channel.countDocuments(),
    ]);

    return NextResponse.json({ data: channels, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// --- DELETE: REMOVE ---
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const channel = await Channel.findById(id);
    if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Activity Log
    await logDeletion("Channel", channel.name, session.user?.email || "Admin", "Settings");

    // Cloudinary Cleanup
    if (channel.imageUrl) {
      const publicId = getPublicIdFromUrl(channel.imageUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await Channel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}