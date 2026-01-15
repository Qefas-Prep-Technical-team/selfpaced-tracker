import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UpdateInquiryPayload {
  id: string
  data: {
    parentName?: string
    childClass?: string
    whatsapp?: string
    channelId?: string
    channelName?: string
    status?: "new" | "contacted" | "followup"
  }
}

export function useInquiryMutations() {
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      // Refresh table
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
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
    editInquiry,
    deleteInquiry,
  }
}
