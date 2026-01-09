/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

// Allowed origins for CORS
const ALLOWED_ORIGINS = ['http://127.0.0.1:5500', 'https://selfpaced-tracker.vercel.app'];

function createCorsResponse(body: any, status = 200, origin = '*') {
  const res = NextResponse.json(body, { status });
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

// Preflight handler
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  if (!ALLOWED_ORIGINS.includes(origin)) return NextResponse.json({}, { status: 403 });
  return createCorsResponse({}, 204, origin);
}

// GET inquiries
export async function GET(req: NextRequest) {
  await dbConnect();
  const origin = req.headers.get('origin') || '*';
  if (!ALLOWED_ORIGINS.includes(origin)) return createCorsResponse({ success: false, error: 'Forbidden' }, 403, origin);

  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return createCorsResponse({ success: true, inquiry: inquiries }, 200, origin);
  } catch (error) {
    console.error(error);
    return createCorsResponse({ success: false, error: 'Server error' }, 500, origin);
  }
}

// POST a new inquiry
export async function POST(req: NextRequest) {
  await dbConnect();
  const origin = req.headers.get('origin') || '*';
  if (!ALLOWED_ORIGINS.includes(origin)) return createCorsResponse({ success: false, error: 'Forbidden' }, 403, origin);

  try {
    const body = await req.json() as { parentName: string; childClass: string; whatsapp: string };
    const { parentName, childClass, whatsapp } = body;

    if (!parentName || !childClass || !whatsapp) {
      return createCorsResponse({ success: false, error: 'All fields are required' }, 400, origin);
    }

    // Check if parentName or whatsapp already exists
    const existing = await Inquiry.findOne({
      $or: [{ parentName }, { whatsapp }],
    });

    if (existing) {
      const conflicts: string[] = [];
      if (existing.parentName === parentName) conflicts.push('parentName');
      if (existing.whatsapp === whatsapp) conflicts.push('whatsapp');
      return createCorsResponse({ success: false, error: `${conflicts.join(' and ')} already exists` }, 409, origin);
    }

    // Create new inquiry
    const inquiry = await Inquiry.create({ parentName, childClass, whatsapp });
    return createCorsResponse({ success: true, inquiry }, 201, origin);
  } catch (error) {
    console.error(error);
    return createCorsResponse({ success: false, error: 'Server error' }, 500, origin);
  }
}
