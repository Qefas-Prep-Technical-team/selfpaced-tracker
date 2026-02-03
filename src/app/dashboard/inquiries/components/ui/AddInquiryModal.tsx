/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useForm } from 'react-hook-form'
import { User, Phone, GraduationCap, Radio } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from '../ui/Button'
import { Form, FormInput, FormSelect } from '@/app/dashboard/channel/components/sidedrawer/Form'
import { toast } from 'react-toastify'
import { useQueryClient, useQuery } from '@tanstack/react-query'

interface InquiryFormData {
  parentName: string
  whatsapp: string
  childClass: string
  channelId: string 
}

export function AddInquiryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient()

  // 1. Fetch channels to get the real _id and name
  const { data: channelsData } = useQuery({
    queryKey: ['channels-list'],
    queryFn: async () => {
      const res = await fetch('/api/channels?limit=100')
      return res.json()
    }
  })

  // Prepare options: value is the _id, label is the name
  const channelOptions = channelsData?.data?.map((ch: any) => ({
    value: ch._id, 
    label: ch.name
  })) || []

  const form = useForm<InquiryFormData>()

  const onSubmit = async (data: InquiryFormData) => {
    // 2. Map the ID back to the Name to satisfy your backend requirements
    const selectedChannel = channelsData?.data?.find((c: any) => c._id === data.channelId)

    const finalPayload = {
      parentName: data.parentName,
      childClass: data.childClass,
      whatsapp: data.whatsapp,
      channelId: data.channelId,
      channelName: selectedChannel?.name || ""
    }
 

  

    const toastId = toast.loading("Registering inquiry...")
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error || "Submission failed")

      toast.update(toastId, { render: "Inquiry saved!", type: "success", isLoading: false, autoClose: 2000 })
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
      form.reset()
      onClose()
    } catch (error: any) {
      toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 3000 })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Inquiry"
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>Save Inquiry</Button>
        </div>
      }
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Parent Name"
            placeholder="Ola Olasunkanmi5"
            icon={<User size={18} />}
            {...form.register('parentName', { required: 'Required' })}
            error={form.formState.errors.parentName?.message}
          />

          <FormInput
            label="WhatsApp Number"
            placeholder="8012305848"
            icon={<Phone size={18} />}
            {...form.register('whatsapp', { required: 'Required' })}
            error={form.formState.errors.whatsapp?.message}
          />

          <FormInput
            label="Child's Class"
            placeholder="jss2"
            icon={<GraduationCap size={18} />}
            {...form.register('childClass', { required: 'Required' })}
          />

          <FormSelect
            label="Source Channel"
            options={channelOptions}
            {...form.register('channelId', { required: 'Select a channel' })}
            error={form.formState.errors.channelId?.message}
          />
        </div>
      </Form>
    </Modal>
  )
}