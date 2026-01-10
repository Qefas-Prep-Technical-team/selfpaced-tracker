interface Activity {
  event: string
  user: string
  channel: { icon: string; name: string; color?: string }
  time: string
  status: 'success' | 'needs_action' | 'info'
}

const activities: Activity[] = [
  {
    event: 'New Subscription',
    user: 'Sarah Jenkins',
    channel: { icon: 'alternate_email', name: 'Email' },
    time: '2 mins ago',
    status: 'success',
  },
  {
    event: 'AI Chat Handoff',
    user: 'Michael Chen',
    channel: { icon: 'chat', name: 'WhatsApp', color: 'text-green-500' },
    time: '15 mins ago',
    status: 'needs_action',
  },
  {
    event: 'New Subscription',
    user: 'Elena Rodriguez',
    channel: { icon: 'alternate_email', name: 'Email' },
    time: '42 mins ago',
    status: 'success',
  },
  {
    event: 'Profile Updated',
    user: 'David Kim',
    channel: { icon: 'desktop_windows', name: 'Web Portal' },
    time: '1 hour ago',
    status: 'info',
  },
]

const statusColors = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  needs_action: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  info: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
}

const eventIcons = {
  'New Subscription': {
    icon: 'verified_user',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600',
  },
  'AI Chat Handoff': {
    icon: 'handshake',
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  'Profile Updated': {
    icon: 'person',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-500',
  },
}

export default function ActivityFeed() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Activity Feed</h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View All History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[#4c739a] text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activities.map((activity, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center ${
                        eventIcons[activity.event as keyof typeof eventIcons].bg
                      } ${eventIcons[activity.event as keyof typeof eventIcons].text}`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {eventIcons[activity.event as keyof typeof eventIcons].icon}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{activity.event}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-sm">{activity.user}</td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-[#4c739a]">
                    <span
                      className={`material-symbols-outlined text-base ${
                        activity.channel.color || ''
                      }`}
                    >
                      {activity.channel.icon}
                    </span>
                    {activity.channel.name}
                  </div>
                </td>
                
                <td className="px-6 py-4 text-sm text-[#4c739a]">{activity.time}</td>
                
                <td className="px-6 py-4 text-right">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      statusColors[activity.status]
                    }`}
                  >
                    {activity.status === 'needs_action' ? 'Needs Action' : activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}