// components/subscriptions/SubscriptionFlow.tsx
import {BookOpen as Assignment,Settings2 as SettingsSuggest, CheckCircle,Radio as BroadcastOnPersonal } from 'lucide-react'

interface Step {
  id: number
  icon: React.ElementType
  label: string
  description: string
  isActive: boolean
  isCompleted?: boolean
}

export function SubscriptionFlow() {
  const steps: Step[] = [
    {
      id: 1,
      icon: Assignment,
      label: 'Sign-up Form',
      description: 'Email submitted',
      isActive: false,
      isCompleted: true
    },
    {
      id: 2,
      icon: SettingsSuggest,
      label: 'Backend Processing',
      description: 'Verification & enrichment',
      isActive: false,
      isCompleted: true
    },
    {
      id: 3,
      icon: CheckCircle,
      label: 'Active Subscriber',
      description: 'Added to DB',
      isActive: true,
      isCompleted: true
    },
    {
      id: 4,
      icon: BroadcastOnPersonal,
      label: 'Broadcast Ready',
      description: 'Marketing eligible',
      isActive: false,
      isCompleted: false
    }
  ]

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-surface-light dark:border-white/10 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#734c9a] mb-6">
        Subscription Flow
      </h3>
      <div className="flex items-center w-full">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute top-5 left-1/2 w-full h-[2px] -z-0
                ${step.isCompleted ? 'bg-primary/20' : 'bg-gray-200 dark:bg-white/10'}
              `} />
            )}
            
            {/* Step circle */}
            <div className={`
              size-10 rounded-full flex items-center justify-center z-10
              ${step.isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : step.isCompleted
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-400'
              }
            `}>
              <step.icon size={20} />
            </div>
            
            {/* Step labels */}
            <p className={`
              mt-2 text-xs font-semibold
              ${step.isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}
            `}>
              {step.label}
            </p>
            <p className="text-[10px] text-gray-500">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}