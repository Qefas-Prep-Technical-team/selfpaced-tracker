// components/analytics/HeatmapTeaser.tsx
import { ExternalLink, Flame } from 'lucide-react'
import { Button } from '../../inquiries/components/ui/Button'


export function HeatmapTeaser() {
  return (
    <div className="bg-primary rounded-xl p-6 text-white shadow-lg overflow-hidden relative group cursor-pointer">
      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2">Live Heatmap</h3>
        <p className="text-white/80 text-xs mb-4">
          See where users are clicking in real-time on your landing page.
        </p>
        <Button
          variant="secondary"
          className="bg-white text-primary hover:bg-white/90"
          icon={ExternalLink}
          size="sm"
        >
          Open Visualizer
        </Button>
      </div>

      {/* Background Icon */}
      <div className="absolute top-0 right-0 w-32 h-full opacity-20 pointer-events-none translate-x-4">
        <Flame size={120} className="text-white" />
      </div>
    </div>
  )
}