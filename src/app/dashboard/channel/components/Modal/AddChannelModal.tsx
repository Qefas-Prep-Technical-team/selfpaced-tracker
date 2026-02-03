/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useForm } from 'react-hook-form'
import { Info, BarChart3, SendIcon as Sensors, Copy } from 'lucide-react'
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
  sourceCategory: 'paid-social' | 'organic-search' | 'direct' | 'referral' | 'marketing'
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
  initialData?: any
}

export function AddChannelModal({ isOpen, onClose, initialData }: AddChannelModalProps) {
  const QueryClient = useQueryClient();
  const isEditMode = !!initialData;

  const form = useForm<ChannelFormData>({
    values: initialData ? {
      name: initialData.name,
      type: initialData.type,
      description: initialData.description || '',
      sourceCategory: initialData.sourceCategory || 'paid-social',
      isActive: initialData.status === 'active', 
      profileImage: null
    } : {
      name: '',
      type: 'digital',
      description: '',
      sourceCategory: 'paid-social',
      isActive: true,
      profileImage: null
    }
  });

  const channelId = initialData?.trackingId || `CH-${Math.floor(Math.random() * 90000) + 10000}-X`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(channelId);
    toast.info("ID copied to clipboard");
  };

  const handleCreateChannel = async (data: ChannelFormData) => {
    const toastId = toast.loading("Creating channel...");
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('description', data.description || '');
      formData.append('sourceCategory', data.sourceCategory);
      formData.append('isActive', String(data.isActive));
      formData.append('trackingId', channelId);

      if (data.profileImage instanceof File) {
        formData.append('profileImage', data.profileImage);
      }

      const response = await fetch(API_ENDPOINTS.CHANNELS, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create channel');
      }

      toast.update(toastId, { render: "Channel created successfully!", type: "success", isLoading: false, autoClose: 3000 });
      QueryClient.invalidateQueries({ queryKey: ['channels'] });
      form.reset();
      onClose();
    } catch (error: any) {
      toast.update(toastId, { render: error.message || 'Error creating channel', type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleSubmit = async (data: ChannelFormData) => {
    if (isEditMode) {
      const toastId = toast.loading("Updating channel...");
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('type', data.type);
        formData.append('description', data.description || '');
        formData.append('sourceCategory', data.sourceCategory);
        formData.append('isActive', String(data.isActive));
        
        if (data.profileImage instanceof File) {
            formData.append('profileImage', data.profileImage);
        }

        const res = await fetch(`${API_ENDPOINTS.CHANNELS}?id=${initialData._id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!res.ok) throw new Error("Update failed");

        toast.update(toastId, { render: "Channel updated!", type: "success", isLoading: false, autoClose: 2000 });
        QueryClient.invalidateQueries({ queryKey: ['channels'] });
        onClose();
      } catch (error: any) {
        toast.update(toastId, { render: error.message || "Error updating", type: "error", isLoading: false, autoClose: 2000 });
      }
    } else {
      await handleCreateChannel(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Channel" : "Add New Channel"}
      subtitle={isEditMode ? `Modify settings for ${initialData.name}` : "Configure a new data acquisition source for your campaign"}
      size="2xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="h-11 px-6 cursor-pointer" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 px-8 shadow-lg shadow-primary/20 cursor-pointer"
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isEditMode ? "Save Changes" : "Add Channel"}
          </Button>
        </div>
      }
    >
      <Form form={form} onSubmit={handleSubmit} className="space-y-8">
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
              <label className="text-slate-900 dark:text-white text-sm font-medium">
                Tracking Identifier
              </label>
              <div className="flex w-full group">
                <input
                  readOnly
                  value={channelId}
                  className="flex-1 rounded-l-lg border border-slate-300 dark:border-[#324d67] bg-slate-50 dark:bg-[#111a22] h-11 px-4 text-sm font-mono text-slate-500 dark:text-[#92adc9]"
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

        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-[#233648]/40 border border-slate-200 dark:border-[#233648] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sensors size={20} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white text-sm font-semibold">Active Status</span>
              <span className="text-slate-500 dark:text-[#92adc9] text-[11px]">Allow incoming data streams</span>
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