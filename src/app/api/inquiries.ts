// pages/api/inquiries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Inquiry, { IInquiry } from '@/models/Inquiry';

interface ResponseData {
  success: boolean;
  inquiry?: IInquiry | IInquiry[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await dbConnect();

  if (req.method === 'POST') {
    const { parentName, childClass, whatsapp } = req.body as {
      parentName: string;
      childClass: string;
      whatsapp: string;
    };

    if (!parentName || !childClass || !whatsapp) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    try {
      // check if parent name or whatsapp already exists
      const existing = await Inquiry.findOne({
        $or: [{ parentName }, { whatsapp }],
      });

      if (existing) {
        const conflicts: string[] = [];
        if (existing.parentName === parentName) conflicts.push('parentName');
        if (existing.whatsapp === whatsapp) conflicts.push('whatsapp');
        return res
          .status(409)
          .json({ success: false, error: `${conflicts.join(' and ')} already exists` });
      }

      const inquiry = await Inquiry.create({ parentName, childClass, whatsapp });
      return res.status(201).json({ success: true, inquiry });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, inquiry: inquiries });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
