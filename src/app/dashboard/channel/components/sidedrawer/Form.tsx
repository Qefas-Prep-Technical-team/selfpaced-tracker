/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/Form.tsx
'use client'

import {
  Control,
  Controller,
  FieldValues,
  FormProvider,
  Path,
  useForm,
  UseFormReturn,
  UseFormProps
} from 'react-hook-form'
import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

// Form Wrapper
interface FormProps<T extends FieldValues> {
  children: ReactNode
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  className?: string
}

export function Form<T extends FieldValues>({
  children,
  form,
  onSubmit,
  className
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  )
}

// Input Field
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-slate-900 dark:text-white text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92adc9]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border border-slate-300 dark:border-[#324d67] bg-white dark:bg-[#111a22] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base placeholder:text-slate-400 dark:placeholder:text-[#4f7396] text-slate-900 dark:text-white",
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

// Select Field
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-slate-900 dark:text-white text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full rounded-lg border border-slate-300 dark:border-[#324d67] bg-white dark:bg-[#111a22] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base appearance-none text-slate-900 dark:text-white",
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-[#92adc9]">
            ▼
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

// Textarea Field
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-slate-900 dark:text-white text-sm font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-slate-300 dark:border-[#324d67] bg-white dark:bg-[#111a22] focus:border-primary focus:ring-1 focus:ring-primary p-4 text-base placeholder:text-slate-400 dark:placeholder:text-[#4f7396] text-slate-900 dark:text-white resize-none",
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

// Toggle Switch
interface FormToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function FormToggle({ label, description, checked, onChange }: FormToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-[#233648]/30 rounded-xl">
      <div className="flex flex-col gap-0.5">
        <span className="text-slate-900 dark:text-white text-sm font-semibold">
          {label}
        </span>
        {description && (
          <span className="text-slate-500 dark:text-[#92adc9] text-xs">
            {description}
          </span>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-300 dark:bg-[#324d67] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  )
}

// Controlled Form Field
interface ControlledFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  render: (props: {
    field: {
      onChange: (value: any) => void
      onBlur: () => void
      value: any
      name: string
      ref: React.Ref<any>
    }
    fieldState: {
      error?: any
      isTouched: boolean
      isDirty: boolean
    }
  }) => React.ReactNode
}

export function ControlledField<T extends FieldValues>({
  control,
  name,
  label,
  render
}: ControlledFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={(field) => (
        <div className="flex flex-col gap-2">
          {label && (
            <label className="text-slate-900 dark:text-white text-sm font-medium">
              {label}
            </label>
          )}
          {render(field)}
        </div>
      )}
    />
  )
}