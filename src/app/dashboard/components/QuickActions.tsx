const actions = [
  {
    label: 'Create Newsletter',
    icon: 'add',
    primary: true,
  },
  {
    label: 'Open Inbox',
    icon: 'inbox',
    primary: false,
  },
  {
    label: 'Import Contacts',
    icon: 'person_add',
    primary: false,
  },
]

export default function QuickActions() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold px-1">Quick Actions</h3>

      <div className="flex flex-wrap gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`flex items-center gap-2 px-6 h-12 rounded-xl font-bold transition-all ${action.primary
              ? 'bg-primary hover:bg-primary/90 text-white dark:text-black shadow-md shadow-primary/20'
              : ' dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
          >
            <span className="material-symbols-outlined">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}