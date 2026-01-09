/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

// Type definitions
interface InquiryData {
  parentName: string;
  childClass: string;
  whatsapp: string;
  email?: string;
  source?: string;
  campaign?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// Configure allowed origins
const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://selfpaced-tracker.vercel.app',
  // Add your production domains here
];

// Helper to check if origin is allowed
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Allow requests without origin (like curl)
  if (ALLOWED_ORIGINS.includes('*')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

// Add CORS headers to response
function withCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  const allowedOrigin = isOriginAllowed(origin) ? origin || '*' : ALLOWED_ORIGINS[0];
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours cache for preflight
  
  return response;
}

// Create standardized response
function createResponse(
  data: any,
  status: number = 200,
  origin: string | null = null
): NextResponse {
  const response = NextResponse.json(data, { status });
  return withCorsHeaders(response, origin);
}

// Validate inquiry data
function validateInquiryData(data: Partial<InquiryData>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Parent name validation
  if (!data.parentName?.trim()) {
    errors.push({ field: 'parentName', message: 'Parent name is required' });
  } else if (data.parentName.trim().length < 2) {
    errors.push({ field: 'parentName', message: 'Parent name must be at least 2 characters' });
  } else if (data.parentName.trim().length > 100) {
    errors.push({ field: 'parentName', message: 'Parent name cannot exceed 100 characters' });
  }

  // Child class validation
  const validClasses = ['jss1', 'jss2', 'jss3', 'sss1', 'sss2', 'sss3'];
  if (!data.childClass) {
    errors.push({ field: 'childClass', message: 'Child class is required' });
  } else if (!validClasses.includes(data.childClass)) {
    errors.push({ field: 'childClass', message: 'Invalid class selection' });
  }

  // WhatsApp validation
  if (!data.whatsapp?.trim()) {
    errors.push({ field: 'whatsapp', message: 'WhatsApp number is required' });
  } else {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.whatsapp.trim())) {
      errors.push({ field: 'whatsapp', message: 'Phone number must be 10 digits' });
    }
  }

  // Email validation (optional)
  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }
  }

  return errors;
}

// Generate WhatsApp URL
function generateWhatsAppUrl(data: InquiryData): string {
  const classDisplayNames: Record<string, string> = {
    'jss1': 'JSS 1', 'jss2': 'JSS 2', 'jss3': 'JSS 3',
    'sss1': 'SSS 1', 'sss2': 'SSS 2', 'sss3': 'SSS 3'
  };

  const className = classDisplayNames[data.childClass] || data.childClass;
  const message = `Hello! I'm ${data.parentName}. I'm interested in learning more about your services for my child in ${className}. Please contact me at +234${data.whatsapp}.`;
  
  // You can customize the WhatsApp number here
  const whatsappNumber = '2348000000000'; // Replace with your school's WhatsApp number
  
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ==================== API ENDPOINTS ====================

// Preflight handler
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (!isOriginAllowed(origin)) {
    return createResponse(
      { success: false, error: 'CORS policy: Origin not allowed' },
      403,
      origin
    );
  }

  const response = new NextResponse(null, { status: 204 });
  return withCorsHeaders(response, origin);
}

// GET inquiries with pagination and filtering
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (!isOriginAllowed(origin)) {
    return createResponse(
      { success: false, error: 'CORS policy: Origin not allowed' },
      403,
      origin
    );
  }

  try {
    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;
    
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || '-createdAt';

    // Build filter
    const filter: any = {};
    
    if (status) filter.status = status;
    if (source) filter.source = source;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { parentName: { $regex: search, $options: 'i' } },
        { whatsapp: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Inquiry.countDocuments(filter)
    ]);

    // Get statistics
    const stats = {
      total,
      new: await Inquiry.countDocuments({ ...filter, status: 'new' }),
      contacted: await Inquiry.countDocuments({ ...filter, status: 'contacted' }),
      enrolled: await Inquiry.countDocuments({ ...filter, status: 'enrolled' })
    };

    return createResponse(
      {
        success: true,
        data: inquiries,
        meta: {
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          },
          stats
        }
      },
      200,
      origin
    );

  } catch (error: any) {
    console.error('GET Error:', error);
    return createResponse(
      {
        success: false,
        error: 'Failed to fetch inquiries',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      500,
      origin
    );
  }
}

// POST a new inquiry
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (!isOriginAllowed(origin)) {
    return createResponse(
      { success: false, error: 'CORS policy: Origin not allowed' },
      403,
      origin
    );
  }

  try {
    await dbConnect();

    const data: InquiryData = await request.json();
    const { parentName, childClass, whatsapp, email, source = 'popup', campaign } = data;

    // Validate input
    const validationErrors = validateInquiryData(data);
    if (validationErrors.length > 0) {
      return createResponse(
        {
          success: false,
          error: 'Validation failed',
          errors: validationErrors
        },
        400,
        origin
      );
    }

    // Clean data
    const cleanData = {
      parentName: parentName.trim(),
      childClass,
      whatsapp: whatsapp.trim(),
      email: email?.trim(),
      source,
      campaign,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'new' as const
    };

    // Rate limiting: Check for recent submissions from same phone
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmission = await Inquiry.findOne({
      whatsapp: cleanData.whatsapp,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (recentSubmission) {
      const hoursAgo = Math.round(
        (Date.now() - recentSubmission.createdAt.getTime()) / (60 * 60 * 1000)
      );
      
      return createResponse(
        {
          success: false,
          error: 'Duplicate submission',
          message: `An inquiry was already submitted ${hoursAgo} hours ago. Please wait 24 hours.`,
          lastSubmission: recentSubmission.createdAt
        },
        429, // Too Many Requests
        origin
      );
    }

    // Create new inquiry
    const inquiry = await Inquiry.create(cleanData);

    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(data);

    // In production, you might want to:
    // 1. Send welcome email
    // 2. Send notification to admin
    // 3. Add to CRM
    // 4. Trigger follow-up sequence

    return createResponse(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        data: inquiry,
        whatsappUrl,
        nextSteps: [
          'You will be redirected to WhatsApp to send your message',
          'Our admissions team will contact you within 24 hours',
          'Check your email for more information'
        ]
      },
      201,
      origin
    );

  } catch (error: any) {
    console.error('POST Error:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return createResponse(
        {
          success: false,
          error: 'Duplicate entry',
          message: 'This phone number is already registered'
        },
        409,
        origin
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      return createResponse(
        {
          success: false,
          error: 'Validation failed',
          errors
        },
        400,
        origin
      );
    }

    return createResponse(
      {
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      500,
      origin
    );
  }
}

// PATCH to update inquiry status (optional)
export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (!isOriginAllowed(origin)) {
    return createResponse(
      { success: false, error: 'CORS policy: Origin not allowed' },
      403,
      origin
    );
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return createResponse(
        { success: false, error: 'Inquiry ID is required' },
        400,
        origin
      );
    }

    const updateData = await request.json();
    
    // Validate allowed updates
    const allowedUpdates = ['status', 'notes', 'priority', 'nextFollowUp'];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return createResponse(
        { success: false, error: 'Invalid updates' },
        400,
        origin
      );
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return createResponse(
        { success: false, error: 'Inquiry not found' },
        404,
        origin
      );
    }

    return createResponse(
      {
        success: true,
        message: 'Inquiry updated successfully',
        data: inquiry
      },
      200,
      origin
    );

  } catch (error: any) {
    console.error('PATCH Error:', error);
    return createResponse(
      {
        success: false,
        error: 'Failed to update inquiry'
      },
      500,
      origin
    );
  }
}