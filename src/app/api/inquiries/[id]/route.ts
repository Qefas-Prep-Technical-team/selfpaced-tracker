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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const inquiry = await Inquiry.findById(params.id)

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


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const body = await req.json()

    const { parentName, childClass, whatsapp, channelId, channelName, status } = body

    const inquiry = await Inquiry.findById(params.id)
    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    // Normalize
    if (parentName) {
      inquiry.parentName = parentName.trim()
      inquiry.parentNameNormalized = parentName.trim().toLowerCase()
    }

    if (whatsapp) inquiry.whatsapp = whatsapp.trim()
    if (childClass) inquiry.childClass = childClass
    if (status) inquiry.status = status

    // Handle channel change
    if (channelId && channelId !== inquiry.channelId.toString()) {
      await Channel.findByIdAndUpdate(inquiry.channelId, { $inc: { leads: -1 } })
      await Channel.findByIdAndUpdate(channelId, { $inc: { leads: 1 } })

      inquiry.channelId = channelId
      inquiry.channelName = channelName
    }

    await inquiry.save()

    return NextResponse.json(
      { success: true, inquiry },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate field detected" },
        { status: 409, headers: corsHeaders }
      )
    }

    console.error("PATCH Inquiry Error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    console.log("DELETE Inquiry ID:", params.id)
  try {
    await dbConnect()

    const inquiry = await Inquiry.findById(params.id)

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    // Reduce channel lead count
    await Channel.findByIdAndUpdate(inquiry.channelId, {
      $inc: { leads: -1 },
    })

    await Inquiry.findByIdAndDelete(params.id)

    return NextResponse.json(
      { success: true, message: "Inquiry deleted" },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("DELETE Inquiry Error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}
