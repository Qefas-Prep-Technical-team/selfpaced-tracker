// components/analytics/BotHumanPieChart.tsx

interface Distribution {
  type: 'bot' | 'human'
  count: number
  percentage: number
  color: string
  bgColor: string
  borderColor: string
}

const distributionData: Distribution[] = [
  {
    type: 'bot',
    count: 1248,
    percentage: 68,
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/10'
  },
  {
    type: 'human',
    count: 582,
    percentage: 32,
    color: 'text-text-secondary dark:text-slate-400',
    bgColor: 'bg-border-light/10 dark:bg-slate-800/20',
    borderColor: 'border-border-light/20 dark:border-slate-700'
  }
]

export function BotHumanPieChart() {
  const botData = distributionData.find(d => d.type === 'bot')!

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-border-light dark:border-slate-700 p-6 shadow-sm flex flex-col">
      <h3 className="text-text-primary dark:text-white font-bold text-lg mb-6">
        Bot vs. Human Handling
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Pie Chart */}
        <div className="relative size-40">
          <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
            <circle 
              cx="18" 
              cy="18" 
              fill="none" 
              r="15.915" 
              stroke="#cfdde7" 
              strokeDasharray="100" 
              strokeWidth="4"
            />
            <circle 
              cx="18" 
              cy="18" 
              fill="none" 
              r="15.915" 
              stroke="#2b9dee" 
              strokeDasharray={`${botData.percentage} ${100 - botData.percentage}`}
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-text-primary dark:text-white">
              {botData.percentage}%
            </span>
            <span className="text-[10px] text-text-secondary font-bold uppercase">
              Automated
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
          {distributionData.map((item) => (
            <div 
              key={item.type}
              className={`flex flex-col items-center p-3 rounded-lg border ${item.bgColor} ${item.borderColor}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`size-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                <span className="text-xs font-bold text-text-primary dark:text-white capitalize">
                  {item.type}
                </span>
              </div>
              <span className={`text-sm font-black ${item.color}`}>
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}