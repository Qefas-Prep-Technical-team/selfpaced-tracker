// app/dashboard/channels/ChannelList.tsx
'use client'

import { API_ENDPOINTS } from '@/lib/api-config'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    // In v5, mutationFn is part of the object
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/channels?id=${id}`, { 
        method: 'DELETE' 
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete channel');
      }

      return res.json();
    },
    onSuccess: () => {
      // ✅ Invalidate 'channels' to refresh the list
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
}