import { link } from 'fs'
import NavItem from './NavItem'
import UserProfile from './UserProfile'


const navItems = [
  { icon: 'dashboard', label: 'Dashboard', link: "/dashboard/" },
  { icon: 'mail', label: 'Inbox', link: "/dashboard/inbox" },
  { icon: 'contacts', label: 'Contacts', link: "/dashboard/contacts" },
  { icon: 'campaign', label: 'Newsletters', link: "/dashboard/newsletters" },
  { icon: 'bar_chart', label: 'Analytics', link: "/dashboard/analytics" },
]

export default function Sidebar() {


  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800  dark:bg-background-dark flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white dark:text-black">
          <span className="material-symbols-outlined">rocket_launch</span>
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">Command Center</h1>
          <p className="text-[#4c739a] text-xs font-normal">AI-Powered Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}

            link={item.link} />
        ))}
      </nav>

      {/* User Profile */}
      <UserProfile />
    </aside>
  )
}