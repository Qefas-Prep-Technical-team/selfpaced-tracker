import StatCard from './StatCard'
import QuickActions from './QuickActions'
import ActivityFeed from './ActivityFeed'

const stats = [
  {
    title: 'Newsletter Subscribers',
    value: '12,480',
    change: '+12.5%',
    trend: 'up',
    icon: 'groups',
    label: 'vs last month',
  },
  {
    title: 'Contact Sign-ups',
    value: '1,245',
    change: '-2.1%',
    trend: 'down',
    icon: 'person_add',
    label: 'vs last month',
  },
  {
    title: 'Active WhatsApp Chats',
    value: '42',
    change: '-5.3%',
    trend: 'down',
    icon: 'forum',
    label: 'live now',
  },
  {
    title: 'AI Success Rate',
    value: '94.2%',
    change: '+4.8%',
    trend: 'up',
    icon: 'psychology',
    label: 'automation efficiency',
  },
]

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity Feed */}
      <ActivityFeed />
    </div>
  )
}