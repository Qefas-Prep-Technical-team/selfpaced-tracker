import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface Inquiry {
  _id: string
  id: string
  parentName: string
  childClass: string
  whatsapp: string
  channelId?: string
  channelName?: string
  status: "new" | "contacted" | "followup"
  createdAt: string
}

interface UpdateInquiryPayload {
  id: string
  data: Partial<Omit<Inquiry, 'id' | 'createdAt'>>
}

export function useInquiryMutations() {
  const queryClient = useQueryClient()

  // 🔍 VIEW (GET ALL)
  const useInquiries = () => {
    return useQuery<Inquiry[]>({
      queryKey: ["inquiries"],
      queryFn: async () => {
        const res = await fetch("/api/inquiries")
        if (!res.ok) throw new Error("Failed to fetch inquiries")
        return res.json()
      },
    })
  }

  // 🔍 VIEW SINGLE (GET ONE)
  const useInquiry = (id: string) => {
    return useQuery<{ inquiry: Inquiry }>({
      queryKey: ["inquiries", id],
      queryFn: async () => {
        const res = await fetch(`/api/inquiries/${id}`)
        if (!res.ok) throw new Error("Failed to fetch inquiry details")
        return res.json()
      },
      enabled: !!id, // Only run if ID exists
    })
  }

  // ✏️ EDIT
  const editInquiry = useMutation({
    mutationFn: async ({ id, data }: UpdateInquiryPayload) => {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update inquiry")
      }

      return res.json()
    },
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
      // Refresh the specific detail view if it exists
      queryClient.invalidateQueries({ queryKey: ["inquiries", variables.id] })
    },
  })

  // 🗑 DELETE
  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to delete inquiry")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    },
  })

  return {
    useInquiries,
    useInquiry,
    editInquiry,
    deleteInquiry,
  }
}