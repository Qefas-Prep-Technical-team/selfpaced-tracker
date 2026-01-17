import { cn } from '@/lib/utils'
import { Upload, X as CloseIcon } from 'lucide-react' // or use your Material icons

// Image Upload Field
interface FormImageUploadProps {
  label?: string
  error?: string
  value?: File | string | null
  onChange: (file: File | null) => void
  className?: string
}

export function FormImageUpload({ label, error, value, onChange, className }: FormImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  // Create a preview URL if the value is a File object or a string (URL)
  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-slate-900 dark:text-white text-sm font-medium">
          {label}
        </label>
      )}
      
      <div className={cn(
        "relative group border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center min-h-[160px] overflow-hidden",
        error ? "border-red-500" : "border-slate-300 dark:border-[#324d67] hover:border-primary",
        !previewUrl ? "bg-slate-50 dark:bg-[#111a22]" : "bg-transparent"
      )}>
        {previewUrl ? (
          <div className="relative w-full h-full min-h-[160px]">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange(null)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <CloseIcon size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6">
            <Upload className="text-slate-400 mb-2" size={32} />
            <span className="text-sm text-slate-500 dark:text-[#92adc9]">
              Click to upload image
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </label>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}