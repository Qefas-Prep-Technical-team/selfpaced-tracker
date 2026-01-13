// types/channel.ts
export interface Channel {
  _id: string;
  name: string;
  type:'digital' | 'offline' | 'team'
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
  dateCreated: string; // Virtual field from mongoose
}

export type ChannelType = Channel['type'];
export type ChannelStatus = Channel['status'];