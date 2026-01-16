import { useQuery } from '@tanstack/react-query'

const fetchStats = async () => {
  const res = await fetch('/api/dashboard/stats')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}


export default function useDashboardStats() {
    return useQuery({
  queryKey: ['dashboardStats'],
  queryFn: fetchStats,
  refetchInterval: 30000, // Optional: Auto-refresh every 30 seconds
})
}