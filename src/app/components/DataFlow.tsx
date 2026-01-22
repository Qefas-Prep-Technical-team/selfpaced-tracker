// components/marketing/DataFlow.tsx
import { 
  MousePointer, UserCheck, Cpu, 
  BarChart 
} from 'lucide-react'

const flowSteps = [
  {
    icon: MousePointer,
    title: 'Clicks',
    description: 'User interaction capture'
  },
  {
    icon: UserCheck,
    title: 'Lead Capture',
    description: 'Data entry verification'
  },
  {
    icon: Cpu,
    title: 'Processing',
    description: 'Algorithmic analysis'
  },
  {
    icon: BarChart,
    title: 'Dashboard',
    description: 'Visual reporting & insights'
  }
]

export function DataFlow() {
  return (
    <section className="py-20">
      <h2 className="text-text-primary dark:text-white text-3xl font-bold mb-12 text-center">
        Transparent Data Flow
      </h2>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        {/* Line background */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />

        {flowSteps.map((step, index) => (
          <div
            key={step.title}
            className={`
              z-10 bg-background-light dark:bg-background-dark
              ${index === 0 ? 'pr-8' : index === flowSteps.length - 1 ? 'pl-8' : 'px-8'}
              flex flex-col items-center text-center
            `}
          >
            <div className="size-14 rounded-full bg-white dark:bg-white/5 border-2 border-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
              <step.icon className="text-primary" size={24} />
            </div>
            <p className="text-text-primary dark:text-white font-bold">
              {step.title}
            </p>
            <p className="text-sm text-text-secondary dark:text-white/60">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}