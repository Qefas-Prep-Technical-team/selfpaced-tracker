// utils/channel-icons.ts
import { 
  Camera, Radio as RadioIcon, Globe, User, 
  TrendingUp, MessageSquare, Mail, Video,
  Instagram, Facebook, Twitter, Linkedin,
  Youtube, Webhook, Phone, MapPin
} from 'lucide-react';
import { ChannelType } from '@/types/channel';

// Map channel types to Lucide icons
export const getTypeIcon = (type: ChannelType) => {
  switch (type) {
    case 'digital': return Globe;
    case 'person': return User;
    case 'offline': return RadioIcon;
    default: return Globe;
  }
};

// Map channel types to display labels
export const getTypeLabel = (type: ChannelType): string => {
  switch (type) {
    case 'digital': return 'Digital';
    case 'person': return 'Person';
    case 'offline': return 'Offline';
  }
};

// Map channel types to Tailwind color classes
export const getTypeColorClasses = (type: ChannelType): string => {
  switch (type) {
    case 'digital': 
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    case 'person': 
      return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
    case 'offline': 
      return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    default: 
      return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
  }
};

// If you want to store specific icons based on channel name or sourceCategory
export const getChannelIcon = (channel: {
  name?: string;
  type: ChannelType;
  sourceCategory?: string;
}): { Icon: React.ElementType; color: string } => {
  const name = channel.name?.toLowerCase() || '';
  const category = channel.sourceCategory?.toLowerCase() || '';
  
  // Check for specific platforms in name
  if (name.includes('instagram') || category.includes('instagram')) {
    return { Icon: Instagram, color: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30' };
  }
  if (name.includes('facebook') || category.includes('facebook')) {
    return { Icon: Facebook, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' };
  }
  if (name.includes('youtube') || category.includes('youtube')) {
    return { Icon: Youtube, color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' };
  }
  if (name.includes('twitter') || category.includes('twitter')) {
    return { Icon: Twitter, color: 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30' };
  }
  if (name.includes('linkedin') || category.includes('linkedin')) {
    return { Icon: Linkedin, color: 'text-blue-700 dark:text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
  }
  if (name.includes('email') || category.includes('email')) {
    return { Icon: Mail, color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30' };
  }
  if (name.includes('sms') || name.includes('text') || category.includes('sms')) {
    return { Icon: MessageSquare, color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' };
  }
  if (name.includes('whatsapp') || category.includes('whatsapp')) {
    return { Icon: Phone, color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' };
  }
  if (name.includes('retargeting') || category.includes('retargeting')) {
    return { Icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30' };
  }
  if (name.includes('camera') || category.includes('camera')) {
    return { Icon: Camera, color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30' };
  }
  
  // Fallback to type-based icon
  const Icon = getTypeIcon(channel.type);
  const color = getTypeColorClasses(channel.type);
  
  return { Icon, color };
};