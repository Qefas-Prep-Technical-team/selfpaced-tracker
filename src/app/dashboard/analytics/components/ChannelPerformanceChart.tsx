// components/analytics/ChannelPerformanceChart.tsx

interface ChannelData {
  name: string
  leads: number
  messages: number
}

const channelData: ChannelData[] = [
  { name: 'Web Chat', leads: 85, messages: 60 },
  { name: 'WhatsApp', leads: 70, messages: 90 },
  { name: 'Messenger', leads: 45, messages: 35 },
  { name: 'Email', leads: 25, messages: 55 },
  { name: 'SMS', leads: 60, messages: 20 },
]

export function ChannelPerformanceChart() {
  const maxValue = Math.max(...channelData.flatMap(c => [c.leads, c.messages]))

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-border-light dark:border-slate-700 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-text-primary dark:text-white font-bold text-lg">
          Channel Performance
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-primary" />
            <span className="text-text-secondary dark:text-slate-400 font-medium">
              Leads
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-border-light dark:bg-slate-700" />
            <span className="text-text-secondary dark:text-slate-400 font-medium">
              Messages
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 h-64 justify-end">
        <div className="flex items-end gap-10 h-full">
          {channelData.map((channel) => (
            <div key={channel.name} className="flex-1 flex flex-col justify-end gap-1 group">
              <div className="flex gap-1.5 items-end justify-center h-full">
                {/* Leads Bar */}
                <div 
                  className="w-6 bg-primary rounded-t"
                  style={{ height: `${(channel.leads / maxValue) * 100}%` }}
                />
                {/* Messages Bar */}
                <div 
                  className="w-6 bg-border-light dark:bg-slate-700 rounded-t"
                  style={{ height: `${(channel.messages / maxValue) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-text-secondary dark:text-slate-400 mt-2 font-medium">
                {channel.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}