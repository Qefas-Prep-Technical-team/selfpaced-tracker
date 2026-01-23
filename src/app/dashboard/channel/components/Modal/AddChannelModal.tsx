// components/channels/AddChannelModal.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Info, BarChart3,SendIcon as Sensors, Copy } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from '../ui/Button'
import { ControlledField, Form, FormInput, FormSelect, FormTextarea, FormToggle } from '../sidedrawer/Form'
import { FormImageUpload } from '../sidedrawer/FormImageUpload'
import { API_ENDPOINTS } from '@/lib/api-config'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { ChannelType } from '@/utils/channel-icons'


interface ChannelFormData {
  name: string
  type: ChannelType
  description: string
  sourceCategory: 'paid-social' | 'organic-search' | 'direct' | 'referral'|'marketing'
  isActive: boolean
  profileImage: File | null
}

const CHANNEL_TYPES = [
  { value: 'digital', label: 'Digital' },
  { value: 'offline', label: 'Offline' },
  { value: 'team', label: 'Team-based' },
]

const SOURCE_CATEGORIES = [
  { value: 'paid-social', label: 'Paid Social' },
  { value: 'organic-search', label: 'Organic Search' },
  { value: 'direct', label: 'Direct Traffic' },
  { value: 'referral', label: 'Referral' },
  { value: 'marketing', label: 'Marketing' },
]

interface AddChannelModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddChannelModal({ isOpen, onClose }: AddChannelModalProps) {
  const QueryClient = useQueryClient();
  const [channelId] = useState(() => `CH-${Math.floor(Math.random() * 90000) + 10000}-X`)

  const form = useForm<ChannelFormData>({
    defaultValues: {
      name: '',
      type: 'digital',
      description: '',
      sourceCategory: 'paid-social',
      isActive: true
    }
  })

  const handleCopyId = () => {
    navigator.clipboard.writeText(channelId)
  }

const handleCreateChannel = async (data: ChannelFormData) => {
  console.log('Form Data:', data);
  // 1. Show a "loading" toast while the upload happens
  const toastId = toast.loading("Uploading channel data...");
  try {
    // 1. Create FormData (required for file uploads)
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', data.name);
    formData.append('type', data.type);
    formData.append('description', data.description || '');
    formData.append('sourceCategory', data.sourceCategory || '');
    formData.append('isActive', String(data.isActive));
    formData.append('trackingId', channelId); // Use the channelId from your state

    // 2. Append the Image File
    if (data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    }

    // 3. Send to your Next.js API
    const response = await fetch(API_ENDPOINTS.CHANNELS, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create channel');
    }
    // 2. Update the toast to "success"
    toast.update(toastId, { 
      render: "Channel created successfully!", 
      type: "success", 
      isLoading: false, 
      autoClose: 3000 
    });

    const result = await response.json();
    QueryClient.invalidateQueries({ queryKey: ['channels'] })
     form.reset();
  onClose();
    console.log('Success:', result);
    
    // You can trigger a toast notification here
  } catch (error) {
    // 3. Update the toast to "error"
    toast.update(toastId, { 
      render: error instanceof Error ? error.message : 'Error creating channel',
      type: "error", 
      isLoading: false, 
      autoClose: 3000 
    });
    console.error( error);
    // alert('Error saving channel. Please try again.');
  }
};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Channel"
      subtitle="Configure a new data acquisition source for your campaign"
      size="2xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="h-11 px-6 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 px-8 shadow-lg shadow-primary/20 cursor-pointer"
            onClick={form.handleSubmit(handleCreateChannel)}
          >
            Add Channel
          </Button>
        </div>
      }
    >
      <Form form={form} onSubmit={handleCreateChannel} className="space-y-8">
        {/* Channel Information Section */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#233648] pb-2">
            <Info size={20} className="text-primary" />
            <h3 className="text-slate-900 dark:text-white font-semibold uppercase tracking-widest text-xs">
              Channel Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="Channel Name"
              placeholder="e.g., Google Ads Q3"
              {...form.register('name', { required: 'Channel name is required' })}
              error={form.formState.errors.name?.message}
            />

            <FormSelect
              label="Type"
              options={CHANNEL_TYPES}
              {...form.register('type', { required: 'Type is required' })}
              error={form.formState.errors.type?.message}
            />
          </div>
          

          <FormTextarea
            label="Description"
            placeholder="Provide a brief purpose of this acquisition channel..."
            rows={4}
            {...form.register('description')}
          />
          <ControlledField
  control={form.control}
  name="profileImage"
  label="Channel Logo"
  render={({ field, fieldState }) => (
    <FormImageUpload
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  )}
/>
        </section>

        {/* Category & Attribution Section */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#233648] pb-2">
            <BarChart3 size={20} className="text-primary" />
            <h3 className="text-slate-900 dark:text-white font-semibold uppercase tracking-widest text-xs">
              Category & Attribution
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormSelect
              label="Source Category"
              options={SOURCE_CATEGORIES}
              {...form.register('sourceCategory')}
            />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-900 dark:text-white text-sm font-medium">
                  Tracking Identifier
                </label>
              </div>
              <div className="flex w-full group">
                <input
                  readOnly
                  value={channelId}
                  className="flex-1 rounded-l-lg border border-slate-300 dark:border-[#324d67] bg-slate-50 dark:bg-[#111a22] h-11 px-4 text-sm font-mono text-slate-500 dark:text-[#92adc9] focus:ring-0 focus:border-slate-300 dark:focus:border-[#324d67]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-l-none border-l-0"
                  onClick={handleCopyId}
                >
                  <Copy size={20} />
                </Button>
              </div>
              <p className="text-slate-500 dark:text-[#4f7396] text-[11px] italic">
                Unique ID used for auto-tagging attribution links.
              </p>
            </div>
          </div>
        </section>

        {/* Active Status Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-[#233648]/40 border border-slate-200 dark:border-[#233648] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sensors size={20} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white text-sm font-semibold">
                Active Status
              </span>
              <span className="text-slate-500 dark:text-[#92adc9] text-[11px]">
                Allow incoming data streams immediately
              </span>
            </div>
          </div>
          <FormToggle
            label=""
            checked={form.watch('isActive')}
            onChange={(checked) => form.setValue('isActive', checked)}
          />
        </div>
      </Form>
    </Modal>
  )
}