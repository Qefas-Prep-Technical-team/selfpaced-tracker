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
      <h3 className="text-lg font-bold px-1 italic">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`flex items-center justify-center sm:justify-start gap-2 px-6 h-12 rounded-xl font-black uppercase tracking-wider text-[11px] transition-all w-full sm:w-auto active:scale-95 ${action.primary
              ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/30'
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