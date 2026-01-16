/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Inquiry from "@/models/Inquiry"
import { Channel } from "@/models/Channel"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
// 1. Updated GET
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
    const { id } = await params; // Await the params
    await dbConnect()

    const inquiry = await Inquiry.findById(id)

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { success: true, inquiry },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("GET Inquiry Error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}

// 2. Updated PATCH
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
    const { id } = await params; // Await the params
    await dbConnect()
    const body = await req.json()

    const { parentName, childClass, whatsapp, channelId, channelName, status } = body

    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    if (parentName) {
      inquiry.parentName = parentName.trim()
      inquiry.parentNameNormalized = parentName.trim().toLowerCase()
    }
    if (whatsapp) inquiry.whatsapp = whatsapp.trim()
    if (childClass) inquiry.childClass = childClass
    if (status) inquiry.status = status

    if (channelId && channelId !== inquiry.channelId.toString()) {
      await Channel.findByIdAndUpdate(inquiry.channelId, { $inc: { leads: -1 } })
      await Channel.findByIdAndUpdate(channelId, { $inc: { leads: 1 } })
      inquiry.channelId = channelId
      inquiry.channelName = channelName
    }

    await inquiry.save()
    return NextResponse.json({ success: true, inquiry }, { headers: corsHeaders })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Duplicate" }, { status: 409, headers: corsHeaders })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}

// 3. Updated DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
    const { id } = await params; // Await the params
    await dbConnect()

    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404, headers: corsHeaders })
    }

    await Channel.findByIdAndUpdate(inquiry.channelId, { $inc: { leads: -1 } })
    await Inquiry.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: "Deleted" }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}