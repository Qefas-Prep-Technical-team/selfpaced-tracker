// utils/channel-icons.ts

import type { ElementType } from 'react'
import {
  Globe,
  MapPin,
  Users,
} from 'lucide-react'

/**
 * Must match backend enum exactly
 */
export type ChannelType = 'digital' | 'offline' | 'team'

/**
 * Type metadata
 */
export const CHANNEL_TYPE_META: Record<
  ChannelType,
  {
    label: string
    icon: ElementType
    color: string
  }
> = {
  digital: {
    label: 'Digital',
    icon: Globe,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  offline: {
    label: 'Offline',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
  team: {
    label: 'Team-based',
    icon: Users,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
}

/**
 * Used in "Type" column
 */
export const getTypeIcon = (type: ChannelType): ElementType => {
  return CHANNEL_TYPE_META[type]?.icon ?? Globe
}

export const getTypeLabel = (type: ChannelType): string => {
  return CHANNEL_TYPE_META[type]?.label ?? 'Unknown'
}

export const getTypeColorClasses = (type: ChannelType): string => {
  return (
    CHANNEL_TYPE_META[type]?.color ??
    'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
  )
}

/**
 * Used in "Channel Name" column
 * Keeps API flexible while remaining safe
 */
export const getChannelIcon = (channel: {
  type: ChannelType
}): { Icon: ElementType; color: string } => {
  const meta = CHANNEL_TYPE_META[channel.type]

  return {
    Icon: meta?.icon ?? Globe,
    color:
      meta?.color ??
      'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
  }
}
