// components/marketing/MetricsPreview.tsx
import { TrendingUp, TrendingDown, Star } from 'lucide-react'

const metrics = [
  {
    label: 'Conversion Rate',
    value: '24.8%',
    change: '+12.4%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'text-green-500'
  },
  {
    label: 'Active Users',
    value: '12,409',
    change: '+4.1%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'text-green-500'
  },
  {
    label: 'Ad Spend (ROI)',
    value: '4.2x',
    change: 'Target Reached',
    changeType: 'neutral' as const,
    icon: Star,
    color: 'text-primary'
  },
  {
    label: 'Avg. CPC',
    value: '$0.42',
    change: '-0.05%',
    changeType: 'negative' as const,
    icon: TrendingDown,
    color: 'text-red-500'
  }
]

export function MetricsPreview() {
  return (
    <section className="py-16">
      <h2 className="text-text-primary dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-8">
        Live Performance Metrics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-white/5 p-6 rounded-xl border border-border-medium dark:border-white/10 shadow-sm"
          >
            <p className="text-text-secondary dark:text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
              {metric.label}
            </p>
            <h3 className="text-text-primary dark:text-white text-3xl font-black">
              {metric.value}
            </h3>
            <div className={`flex items-center gap-1 mt-2 text-sm ${metric.color}`}>
              <metric.icon className="text-sm" size={16} />
              <span>{metric.change}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}