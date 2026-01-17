import { useQuery } from "@tanstack/react-query";

export function useInquiryStats() {
  return useQuery({
    queryKey: ["inquiry-stats"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}
