// components/analytics/InquiryFunnel.tsx

interface FunnelStep {
  label: string
  value: number
  percentage: number
  color: string
}

const funnelSteps: FunnelStep[] = [
  { label: 'New Inquiries', value: 842, percentage: 100, color: 'bg-primary' },
  { label: 'Contacted', value: 560, percentage: 66, color: 'bg-primary/80' },
  { label: 'Qualified', value: 240, percentage: 28, color: 'bg-primary/60' },
  { label: 'Follow-up', value: 112, percentage: 13, color: 'bg-primary/40' },
]

export function InquiryFunnel() {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-border-light dark:border-slate-700 p-6 shadow-sm flex flex-col">
      <h3 className="text-text-primary dark:text-white font-bold text-lg mb-6">
        Inquiry Funnel
      </h3>
      <div className="flex-1 flex flex-col gap-3">
        {funnelSteps.map((step) => (
          <div key={step.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-text-primary dark:text-white">{step.label}</span>
              <span className="text-text-secondary">{step.value}</span>
            </div>
            <div className="w-full bg-[#e7eef3] dark:bg-slate-800 h-8 rounded overflow-hidden">
              <div 
                className={`${step.color} h-full flex items-center px-3 text-[10px] text-white font-bold`}
                style={{ width: `${step.percentage}%` }}
              >
                {step.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}