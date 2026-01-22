// components/marketing/ValueCards.tsx
import { 
  TrendingUp, Share, Shield, 
  LayoutDashboard 
} from 'lucide-react'

const valueCards = [
  {
    icon: TrendingUp,
    title: 'Real-time Tracking',
    description: 'Monitor every click as it happens with zero latency.'
  },
  {
    icon: Share,
    title: 'Automated Attribution',
    description: 'Intelligently assign value to every touchpoint in the journey.'
  },
  {
    icon: Shield,
    title: 'Fraud Detection',
    description: 'Automated bot blocking and click verification algorithms.'
  },
  {
    icon: LayoutDashboard,
    title: 'Custom Reports',
    description: 'Drag-and-drop report builder for your unique KPIs.'
  }
]

export function ValueCards() {
  return (
    <section className="py-12 border-t border-b border-border-light dark:border-white/5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-4 p-6 rounded-xl border border-border-medium dark:border-white/10 bg-white dark:bg-background-dark/50 hover:border-primary/50 transition-all group"
          >
            <card.icon className="text-primary text-3xl group-hover:scale-110 transition-transform" />
            <div>
              <h2 className="text-text-primary dark:text-white text-lg font-bold">
                {card.title}
              </h2>
              <p className="text-text-secondary dark:text-white/60 text-sm mt-1">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}