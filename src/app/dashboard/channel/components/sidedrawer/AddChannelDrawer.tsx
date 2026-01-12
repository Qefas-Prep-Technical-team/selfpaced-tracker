// components/channels/AddChannelDrawer.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Info, BarChart3, HelpCircle, Copy } from 'lucide-react'
import { SideDrawer } from './SideDrawer'
import { Button } from '../ui/Button'
import { Form, FormInput, FormSelect, FormTextarea, FormToggle } from './Form'


interface ChannelFormData {
  name: string
  type: 'digital' | 'offline' | 'team'
  description: string
  sourceCategory: 'paid-social' | 'organic-search' | 'direct' | 'referral'
  isActive: boolean
}

const CHANNEL_TYPES = [
  { value: 'digital', label: 'Digital' },
  { value: 'offline', label: 'Offline' },
  { value: 'team', label: 'Team-based' }
]

const SOURCE_CATEGORIES = [
  { value: 'paid-social', label: 'Paid Social' },
  { value: 'organic-search', label: 'Organic Search' },
  { value: 'direct', label: 'Direct Traffic' },
  { value: 'referral', label: 'Referral' }
]

interface AddChannelDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ChannelFormData) => void
}

export function AddChannelDrawer({ isOpen, onClose, onSave }: AddChannelDrawerProps) {
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

  const handleSubmit = (data: ChannelFormData) => {
    onSave(data)
    form.reset()
    onClose()
  }

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Channel"
      subtitle="Configure a new data acquisition source"
      size="md"
      footer={
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-[2] h-12 shadow-lg shadow-primary/20"
            onClick={form.handleSubmit(handleSubmit)}
          >
            Save Channel
          </Button>
        </div>
      }
    >
      <Form form={form} onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Channel Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Info size={16} className="text-primary" />
              <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider">
                Channel Details
              </h3>
            </div>

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

            <FormTextarea
              label="Description"
              placeholder="Purpose of this channel..."
              rows={4}
              {...form.register('description')}
            />
          </section>

          {/* Attribution & Tracking Section */}
          <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-[#233648]">
            <div className="flex items-center gap-2 pb-2">
              <BarChart3 size={16} className="text-primary" />
              <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider">
                Attribution & Tracking
              </h3>
            </div>

            <FormSelect
              label="Source Category"
              options={SOURCE_CATEGORIES}
              {...form.register('sourceCategory')}
            />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-900 dark:text-white text-sm font-medium">
                  Channel ID
                </label>
                <HelpCircle size={16} className="text-primary cursor-help" />
              </div>
              <div className="flex w-full">
                <input
                  readOnly
                  value={channelId}
                  className="flex-1 rounded-l-lg border border-slate-300 dark:border-[#324d67] bg-slate-50 dark:bg-[#111a22] h-12 px-4 text-base font-mono text-slate-500 dark:text-[#92adc9]"
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
            </div>
          </section>

          {/* Status Toggle */}
          <section className="pt-4 border-t border-slate-200 dark:border-[#233648]">
            <FormToggle
              label="Active Status"
              description="Enable data acquisition immediately"
              checked={form.watch('isActive')}
              onChange={(checked) => form.setValue('isActive', checked)}
            />
          </section>
        </div>
      </Form>
    </SideDrawer>
  )
}