import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, inquiry: inquiries });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { parentName, childClass, whatsapp } = body;

    if (!parentName || !childClass || !whatsapp) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const inquiry = await Inquiry.create({ parentName, childClass, whatsapp });
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
