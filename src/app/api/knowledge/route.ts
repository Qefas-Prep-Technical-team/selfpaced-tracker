/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Knowledge from "@/models/Knowledge";
import dbConnect from "@/lib/mongodb";

// 1. GET: List all facts or filter by category
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};
    const data = await Knowledge.find(query).sort({ category: 1 });
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// 2. POST: Add new training data (Supports Single and Bulk)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if the body is an array (Bulk Upload)
    if (Array.isArray(body)) {
      // insertMany is highly optimized for large datasets
      const newFacts = await Knowledge.insertMany(body);
      return NextResponse.json(newFacts, { status: 201 });
    }

    // Otherwise, handle as a single object
    const newFact = await Knowledge.create(body);
    return NextResponse.json(newFact, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create fact" }, { status: 400 });
  }
}

// 3. PUT: Update an existing fact
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const updatedFact = await Knowledge.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFact) return NextResponse.json({ error: "Fact not found" }, { status: 404 });

    return NextResponse.json(updatedFact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

// 4. DELETE: Remove a fact
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await Knowledge.findByIdAndDelete(id);
    return NextResponse.json({ message: "Fact deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}