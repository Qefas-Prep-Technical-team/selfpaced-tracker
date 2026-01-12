// types/index.ts
export interface Channel {
  _id: string;
  name: string;
  type: 'email' | 'radio' | 'instagram' | 'whatsapp' | 'website'; // Updated to match your new types
  status: 'active' | 'paused' | 'archived';
  description?: string;
  sourceCategory?: string;
  trackingId?: string;
  imageUrl?: string;
  iconName?: string;
  iconColor?: string;
  leads: number;
  messages: number;
  createdAt: Date;
  dateCreated: string;
}