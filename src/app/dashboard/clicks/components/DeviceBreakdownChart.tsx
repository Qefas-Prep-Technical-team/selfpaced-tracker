// components/analytics/DeviceBreakdownChart.tsx

interface DeviceData {
  name: string
  percentage: number
  color: string
  barColor: string
}

const deviceData: DeviceData[] = [
  {
    name: 'Desktop',
    percentage: 65.2,
    color: 'bg-primary',
    barColor: 'bg-primary'
  },
  {
    name: 'Mobile',
    percentage: 29.8,
    color: 'bg-primary/40 dark:bg-primary/60',
    barColor: 'bg-primary/40 dark:bg-primary/60'
  },
  {
    name: 'Tablet',
    percentage: 5.0,
    color: 'bg-gray-200 dark:bg-white/20',
    barColor: 'bg-gray-200 dark:bg-white/20'
  }
]

export function DeviceBreakdownChart() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-text-primary dark:text-white text-xl font-bold">
          Device Breakdown
        </h2>
        <span className="text-gray-400">⋮</span>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl border border-surface-dark dark:border-white/10 p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Chart Visualization */}
          <div className="flex items-end justify-around gap-4 h-40 pt-4">
            {deviceData.map((device) => (
              <div key={device.name} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className={`w-full rounded-t-lg transition-all ${device.barColor}`}
                  style={{ height: `${device.percentage}%` }}
                />
                <span className="text-[10px] font-bold text-text-secondary dark:text-gray-400">
                  {device.name}
                </span>
              </div>
            ))}
          </div>

          {/* Legend & Percentages */}
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {deviceData.map((device) => (
              <div key={device.name} className="flex justify-between py-3">
                <div className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${device.color}`} />
                  <span className="text-sm font-medium text-text-primary dark:text-white">
                    {device.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-text-primary dark:text-white">
                  {device.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}