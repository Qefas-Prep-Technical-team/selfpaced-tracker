// app/dashboard/channels/ChannelList.tsx
'use client'

import { API_ENDPOINTS } from '@/lib/api-config'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

async function fetchChannels() {
  const res = await fetch(API_ENDPOINTS.CHANNELS)
  if (!res.ok) throw new Error('Failed to fetch channels')
  return res.json()
}

export function ChannelList() {
    const QueryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannels,
  })

  // ✅ Return the data
  return {
    data,
    isLoading,
    error,
    refetch: () => QueryClient.invalidateQueries({ queryKey: ['channels'] })
  }
}